import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  title!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  kind!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(400)
  blurb!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  liveUrl?: string;

  @IsOptional()
  @IsString()
  sourceUrl?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateProjectDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) title?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) kind?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(400) blurb?: string;
  @IsOptional() @IsString() @MaxLength(4000) description?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @IsOptional() @IsString() liveUrl?: string;
  @IsOptional() @IsString() sourceUrl?: string;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsInt() order?: number;
  @IsOptional() @IsIn(['active', 'archived']) status?: string;
}

export class QueryProjectsDto {
  /** Full-text-ish search across title, blurb, tags. */
  @IsOptional() @IsString() q?: string;
  /** Filter by a single tag. */
  @IsOptional() @IsString() tag?: string;
  @IsOptional() @IsIn(['active', 'archived']) status?: string;
}
