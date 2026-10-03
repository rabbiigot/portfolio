import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Controller, Get } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { ContactModule } from './contact/contact.module';
import { AiModule } from './ai/ai.module';
import { UptimeModule } from './uptime/uptime.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ActivityInterceptor } from './common/activity.interceptor';

@Controller()
class HealthController {
  @Get('health')
  health() {
    return { status: 'ok', uptime: process.uptime(), ts: new Date().toISOString() };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ProjectsModule,
    ContactModule,
    AiModule,
    UptimeModule,
    WorkspacesModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_INTERCEPTOR, useClass: ActivityInterceptor }],
})
export class AppModule {}
