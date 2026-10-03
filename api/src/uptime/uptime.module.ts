import { Module } from '@nestjs/common';
import { Controller, Get, Query } from '@nestjs/common';
import { UptimeService } from './uptime.service';

@Controller('uptime')
class UptimeController {
  constructor(private readonly uptime: UptimeService) {}

  /** GET /api/uptime?url=https://example.com → { url, up }. */
  @Get()
  async check(@Query('url') url?: string) {
    return { url: url ?? null, up: await this.uptime.check(url) };
  }
}

@Module({
  controllers: [UptimeController],
  providers: [UptimeService],
  exports: [UptimeService],
})
export class UptimeModule {}
