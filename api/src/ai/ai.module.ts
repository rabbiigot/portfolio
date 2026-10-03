import { Module } from '@nestjs/common';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { AiService } from './ai.service';

export class PlanDto {
  @IsString()
  @MinLength(2)
  @MaxLength(500)
  message!: string;
}

@Controller('ai')
class AiController {
  constructor(private readonly ai: AiService) {}

  /** GET /api/ai/tools — the orchestrator tool catalogue. */
  @Get('tools')
  tools() {
    return this.ai.getTools();
  }

  /**
   * POST /api/ai/plan — natural language → planned orchestrator tool calls.
   * Routes to SimpleFlow (dryRun) when configured, else the local planner.
   */
  @Post('plan')
  plan(@Body() dto: PlanDto) {
    return this.ai.plan(dto.message);
  }
}

@Module({
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
