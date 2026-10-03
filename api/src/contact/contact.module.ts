import { Module } from '@nestjs/common';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateContactDto {
  @IsString() @MinLength(2) @MaxLength(80) name!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(5) @MaxLength(3000) message!: string;
}

@Controller('contact')
class ContactController {
  constructor(private readonly prisma: PrismaService) {}

  /** POST /api/contact — persist a message from the contact form. */
  @Post()
  async create(@Body() dto: CreateContactDto) {
    const row = await this.prisma.contactMessage.create({ data: dto });
    return { ok: true, id: row.id, receivedAt: row.createdAt };
  }

  /** GET /api/contact/count — public, non-sensitive proof of persistence. */
  @Get('count')
  async count() {
    return { total: await this.prisma.contactMessage.count() };
  }
}

@Module({ controllers: [ContactController] })
export class ContactModule {}
