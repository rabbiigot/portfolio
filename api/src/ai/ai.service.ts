import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TOOLS, ToolDef } from './tools';

export interface PlannedAction {
  tool: string;
  input: Record<string, unknown>;
  reason?: string;
}

export interface PlanResult {
  source: 'simpleflow' | 'fallback';
  message: string;
  plannedActions: PlannedAction[];
  note?: string;
}

/**
 * Talks to the SimpleFlow AI orchestrator. When SIMPLEFLOW_URL is configured it
 * proxies to POST /ai-orchestration/chat with `dryRun: true` — the orchestrator
 * PLANS the real tool calls but never mutates anything, and the token stays on
 * the server. When it isn't configured (or the call fails) it falls back to a
 * local heuristic planner so the demo always responds.
 */
@Injectable()
export class AiService implements OnModuleInit {
  private readonly logger = new Logger(AiService.name);
  private token: string | null = null;

  constructor(private readonly prisma: PrismaService) {}

  private get baseUrl(): string | null {
    return process.env.SIMPLEFLOW_URL?.replace(/\/$/, '') || null;
  }

  async onModuleInit() {
    if (!this.baseUrl) {
      this.logger.log('SimpleFlow not configured — using built-in fallback planner.');
      return;
    }
    this.token = process.env.SIMPLEFLOW_TOKEN?.trim() || null;
    if (!this.token && process.env.SIMPLEFLOW_EMAIL && process.env.SIMPLEFLOW_PASSWORD) {
      await this.login();
    }
    this.logger.log(
      this.token
        ? `SimpleFlow orchestrator wired at ${this.baseUrl} (dryRun).`
        : `SimpleFlow URL set but no token — falling back to local planner.`,
    );
  }

  private async login(): Promise<void> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: process.env.SIMPLEFLOW_EMAIL,
          password: process.env.SIMPLEFLOW_PASSWORD,
        }),
      });
      if (!res.ok) throw new Error(`login ${res.status}`);
      const data = (await res.json()) as { token?: string; accessToken?: string };
      this.token = data.token ?? data.accessToken ?? null;
    } catch (err) {
      this.logger.warn(`SimpleFlow login failed (${String(err)}); using fallback planner.`);
    }
  }

  getTools(): ToolDef[] {
    return TOOLS;
  }

  async plan(message: string): Promise<PlanResult> {
    const result = (await this.planViaSimpleFlow(message)) ?? this.planLocally(message);

    // Persist the interaction (proves DB writes on the demo path).
    await this.prisma.demoRequest
      .create({
        data: {
          kind: 'ai.plan',
          input: message,
          output: JSON.stringify(result.plannedActions),
          source: result.source,
        },
      })
      .catch(() => undefined);

    return result;
  }

  private async planViaSimpleFlow(message: string): Promise<PlanResult | null> {
    if (!this.baseUrl || !this.token) return null;
    try {
      const res = await fetch(`${this.baseUrl}/ai-orchestration/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          message,
          dryRun: true,
          context: { userId: process.env.SIMPLEFLOW_USER_ID ?? '1' },
        }),
      });
      if (!res.ok) throw new Error(`chat ${res.status}`);
      const data = (await res.json()) as {
        message?: string;
        plannedActions?: Array<{ tool: string; input?: Record<string, unknown> }>;
      };
      return {
        source: 'simpleflow',
        message: data.message ?? 'Planned by SimpleFlow orchestrator.',
        plannedActions: (data.plannedActions ?? []).map((a) => ({
          tool: a.tool,
          input: a.input ?? {},
        })),
      };
    } catch (err) {
      this.logger.warn(`SimpleFlow plan failed (${String(err)}); using fallback.`);
      return null;
    }
  }

  /**
   * Heuristic planner: turns a natural-language request into a plausible set of
   * orchestrator tool calls. Deliberately transparent — good enough to make the
   * demo interactive when SimpleFlow isn't attached.
   */
  private planLocally(message: string): PlanResult {
    const text = message.toLowerCase();
    const actions: PlannedAction[] = [];

    const workspaceName =
        message.match(/workspace(?:\s+(?:called|named))?\s+["']?([\w \-]{2,40})["']?/i)?.[1]?.trim();

    if (/\b(create|make|new|set ?up)\b/.test(text) && /\bworkspace|board|project\b/.test(text)) {
      actions.push({
        tool: 'workspace.create',
        input: { name: workspaceName ?? 'New Workspace' },
        reason: 'Request asks to create a workspace/board.',
      });
    }

    // Tasks: "tasks: a, b, c" or "add task X"
    const taskList = message.match(/tasks?:\s*(.+)$/i)?.[1];
    if (taskList) {
      for (const t of taskList.split(/[,;]|\band\b/).map((s) => s.trim()).filter(Boolean)) {
        actions.push({
          tool: 'workspace.createTask',
          input: { workspaceName: workspaceName ?? 'New Workspace', title: t },
          reason: 'Task listed in the request.',
        });
      }
    } else if (/\b(add|create)\b.*\btask\b/.test(text)) {
      const title = message.match(/task\s+(?:called|named)?\s*["']?([\w \-]{2,60})["']?/i)?.[1];
      actions.push({
        tool: 'workspace.createTask',
        input: { workspaceName: workspaceName ?? 'New Workspace', title: title ?? 'New task' },
        reason: 'Request asks to add a task.',
      });
    }

    if (/\bautomation|automate|when .* then\b/.test(text)) {
      actions.push({
        tool: 'automation.create',
        input: { name: 'New automation' },
        reason: 'Request mentions automation.',
      });
    }
    if (/\bpost\b/.test(text) && /\bsocial|network|feed\b/.test(text)) {
      actions.push({ tool: 'social.createPost', input: {}, reason: 'Request mentions a social post.' });
    }
    if (/\bchannel\b/.test(text)) {
      actions.push({ tool: 'chat.createChannel', input: {}, reason: 'Request mentions a channel.' });
    }
    if (/\bmessage\b/.test(text) && /\bchannel|chat|send\b/.test(text)) {
      actions.push({ tool: 'chat.sendMessage', input: {}, reason: 'Request mentions sending a message.' });
    }
    if (/\bdashboard|overview|insight|report|analytics\b/.test(text)) {
      actions.push({ tool: 'dashboard.getOverview', input: {}, reason: 'Request asks about analytics.' });
    }

    if (actions.length === 0) {
      actions.push({
        tool: 'dashboard.getInsights',
        input: {},
        reason: "No specific action detected — defaulting to a read-only insights lookup.",
      });
    }

    return {
      source: 'fallback',
      message: `Planned ${actions.length} tool call${actions.length === 1 ? '' : 's'} (local planner).`,
      plannedActions: actions,
      note: 'SimpleFlow orchestrator not attached — this plan came from the portfolio API’s built-in heuristic planner. Wire SIMPLEFLOW_URL + a demo token to route through the real LLM planner (dryRun).',
    };
  }
}
