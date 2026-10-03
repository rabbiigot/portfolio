/**
 * A curated subset of the SimpleFlow AI-orchestration tool catalogue. Used by
 * the fallback planner (when SimpleFlow isn't wired up) and returned by
 * GET /api/ai/tools so the Technical Demo can show what the orchestrator can do.
 */
export interface ToolDef {
  name: string;
  group: string;
  description: string;
}

export const TOOLS: ToolDef[] = [
  { name: 'workspace.create', group: 'Workspace', description: 'Create a new workspace/board.' },
  { name: 'workspace.createTask', group: 'Workspace', description: 'Add a task to a workspace.' },
  { name: 'workspace.moveTask', group: 'Workspace', description: 'Move a task to another status/column.' },
  { name: 'workspace.completeTask', group: 'Workspace', description: 'Mark a task complete.' },
  { name: 'workspace.listTasks', group: 'Workspace', description: 'List tasks in a workspace.' },
  { name: 'workspace.addMember', group: 'Workspace', description: 'Add a member to a workspace.' },
  { name: 'automation.create', group: 'Automation', description: 'Create a trigger→action automation.' },
  { name: 'automation.toggle', group: 'Automation', description: 'Enable/disable an automation.' },
  { name: 'social.createPost', group: 'Social', description: 'Publish a post to a network.' },
  { name: 'chat.sendMessage', group: 'Chat', description: 'Send a message to a channel.' },
  { name: 'chat.createChannel', group: 'Chat', description: 'Create a chat channel.' },
  { name: 'dashboard.getOverview', group: 'Analytics', description: 'Fetch the dashboard overview.' },
  { name: 'dashboard.getInsights', group: 'Analytics', description: 'Fetch AI insights for the team.' },
  { name: 'timeRecord.clockIn', group: 'Time', description: 'Clock a member in.' },
  { name: 'calendar.getTodayEvents', group: 'Calendar', description: "Get today's calendar events." },
  { name: 'github.listOpenPRs', group: 'Integrations', description: 'List open pull requests.' },
];
