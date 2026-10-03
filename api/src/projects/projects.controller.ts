import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, QueryProjectsDto, UpdateProjectDto } from './dto/project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  /** GET /api/projects?q=&tag=&status= — list with search + tag filter. */
  @Get()
  findAll(@Query() query: QueryProjectsDto) {
    return this.projects.findAll(query);
  }

  /** GET /api/projects/:slug — one project. */
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.projects.findOne(slug);
  }

  /** POST /api/projects — create (Technical Demo CRUD). */
  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projects.create(dto);
  }

  /** PATCH /api/projects/:slug — update. */
  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() dto: UpdateProjectDto) {
    return this.projects.update(slug, dto);
  }

  /** DELETE /api/projects/:slug — remove. */
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.projects.remove(slug);
  }
}
