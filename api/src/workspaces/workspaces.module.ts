import {
  Body,
  Controller,
  Delete,
  Get,
  Module,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';

class CreateWorkspaceDto {
  @IsString() @MinLength(2) @MaxLength(60) name!: string;
}
class CreateTaskDto {
  @IsString() @MinLength(1) @MaxLength(120) title!: string;
}

/**
 * The Technical Demo stepper drives these — real workspace/task rows in the
 * live database, created and read back so the demo genuinely renders DB data.
 */
@Controller('workspaces')
class WorkspacesController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  create(@Body() dto: CreateWorkspaceDto) {
    return this.prisma.workspace.create({ data: { name: dto.name } });
  }

  @Get()
  list() {
    return this.prisma.workspace.findMany({
      orderBy: { id: 'desc' },
      include: { _count: { select: { tasks: true } } },
    });
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    const w = await this.prisma.workspace.findUnique({
      where: { id },
      include: { tasks: { orderBy: { id: 'asc' } } },
    });
    if (!w) throw new NotFoundException(`Workspace ${id} not found`);
    return w;
  }

  @Post(':id/tasks')
  async addTask(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateTaskDto) {
    await this.get(id); // 404 if missing
    return this.prisma.task.create({ data: { workspaceId: id, title: dto.title } });
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.prisma.workspace.delete({ where: { id } }).catch(() => undefined);
    return { deleted: true, id };
  }
}

@Module({ controllers: [WorkspacesController] })
export class WorkspacesModule {}
