import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UptimeService } from '../uptime/uptime.service';
import { CreateProjectDto, QueryProjectsDto, UpdateProjectDto } from './dto/project.dto';

/** API shape: tags come back as a real array; liveUp reflects a server-side
 *  reachability check on liveUrl (null when there's no live URL). */
type ProjectView = Omit<Prisma.ProjectGetPayload<object>, 'tags'> & {
  tags: string[];
  liveUp: boolean | null;
};

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uptime: UptimeService,
  ) {}

  private view = (p: Prisma.ProjectGetPayload<object>, liveUp: boolean | null): ProjectView => ({
    ...p,
    tags: this.parseTags(p.tags),
    liveUp,
  });

  private parseTags(raw: string): string[] {
    try {
      const v = JSON.parse(raw);
      return Array.isArray(v) ? v.map(String) : [];
    } catch {
      return raw ? raw.split(',').map((t) => t.trim()) : [];
    }
  }

  private slugify(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 60);
  }

  /** null when there's no live URL, else the cached reachability result. */
  private async liveUpOf(url?: string | null): Promise<boolean | null> {
    return url ? this.uptime.check(url) : null;
  }

  async findAll(query: QueryProjectsDto): Promise<ProjectView[]> {
    const rows = await this.prisma.project.findMany({
      where: { status: query.status ?? 'active' },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });

    const q = query.q?.toLowerCase().trim();
    const tag = query.tag?.toLowerCase().trim();

    // SQLite has no case-insensitive contains across JSON, so filtering is done
    // in-memory — the dataset is tiny (a handful of projects) and it keeps the
    // search behaviour identical on SQLite and Postgres.
    const filtered = rows.filter((r) => {
      const tags = this.parseTags(r.tags);
      const okQ =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.blurb.toLowerCase().includes(q) ||
        tags.some((t) => t.toLowerCase().includes(q));
      const okTag = !tag || tags.some((t) => t.toLowerCase() === tag);
      return okQ && okTag;
    });

    const upMap = await this.uptime.checkMany(filtered.map((r) => r.liveUrl));
    return filtered.map((r) =>
      this.view(r, r.liveUrl ? (upMap.get(r.liveUrl) ?? false) : null),
    );
  }

  async findOne(slug: string): Promise<ProjectView> {
    const p = await this.prisma.project.findUnique({ where: { slug } });
    if (!p) throw new NotFoundException(`Project "${slug}" not found`);
    return this.view(p, await this.liveUpOf(p.liveUrl));
  }

  async create(dto: CreateProjectDto): Promise<ProjectView> {
    let slug = this.slugify(dto.title);
    // Ensure uniqueness without a DB round-trip loop for the common case.
    if (await this.prisma.project.findUnique({ where: { slug } })) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }
    const created = await this.prisma.project.create({
      data: {
        slug,
        title: dto.title,
        kind: dto.kind,
        blurb: dto.blurb,
        description: dto.description,
        tags: JSON.stringify(dto.tags ?? []),
        liveUrl: dto.liveUrl,
        sourceUrl: dto.sourceUrl,
        featured: dto.featured ?? false,
        order: dto.order ?? 100,
      },
    });
    return this.view(created, await this.liveUpOf(created.liveUrl));
  }

  async update(slug: string, dto: UpdateProjectDto): Promise<ProjectView> {
    await this.findOne(slug); // 404 if missing
    const updated = await this.prisma.project.update({
      where: { slug },
      data: {
        ...dto,
        tags: dto.tags ? JSON.stringify(dto.tags) : undefined,
      },
    });
    return this.view(updated, await this.liveUpOf(updated.liveUrl));
  }

  async remove(slug: string): Promise<{ deleted: true; slug: string }> {
    await this.findOne(slug);
    await this.prisma.project.delete({ where: { slug } });
    return { deleted: true, slug };
  }
}
