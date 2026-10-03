// Tiny typed fetch client. In dev, Vite proxies /api → the NestJS backend.
// In prod, set VITE_API_URL to the API's public base (e.g. https://api.site.com).
const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${body || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  kind: string;
  blurb: string;
  description?: string | null;
  tags: string[];
  liveUrl?: string | null;
  sourceUrl?: string | null;
  featured: boolean;
  status: string;
  order: number;
  /** Server-side reachability of liveUrl. null = no live URL. */
  liveUp?: boolean | null;
}

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

export interface ToolDef {
  name: string;
  group: string;
  description: string;
}

export const api = {
  projects: (params?: { q?: string; tag?: string }) => {
    const qs = new URLSearchParams();
    if (params?.q) qs.set('q', params.q);
    if (params?.tag) qs.set('tag', params.tag);
    const s = qs.toString();
    return req<Project[]>(`/projects${s ? `?${s}` : ''}`);
  },
  project: (slug: string) => req<Project>(`/projects/${slug}`),
  createProject: (body: Partial<Project>) =>
    req<Project>('/projects', { method: 'POST', body: JSON.stringify(body) }),
  updateProject: (slug: string, body: Partial<Project>) =>
    req<Project>(`/projects/${slug}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteProject: (slug: string) =>
    req<{ deleted: true; slug: string }>(`/projects/${slug}`, { method: 'DELETE' }),

  aiTools: () => req<ToolDef[]>('/ai/tools'),
  aiPlan: (message: string) =>
    req<PlanResult>('/ai/plan', { method: 'POST', body: JSON.stringify({ message }) }),

  contact: (body: { name: string; email: string; message: string }) =>
    req<{ ok: true; id: number }>('/contact', { method: 'POST', body: JSON.stringify(body) }),

  /** Server-side reachability check for an external URL (for the Services page). */
  uptime: (url: string) => req<{ url: string; up: boolean }>(`/uptime?url=${encodeURIComponent(url)}`),

  // ── Technical Demo stepper: real workspaces/tasks in the database ──
  createWorkspace: (name: string) =>
    req<WorkspaceRow>('/workspaces', { method: 'POST', body: JSON.stringify({ name }) }),
  addTask: (workspaceId: number, title: string) =>
    req<TaskRow>(`/workspaces/${workspaceId}/tasks`, { method: 'POST', body: JSON.stringify({ title }) }),
  getWorkspace: (id: number) => req<WorkspaceRow & { tasks: TaskRow[] }>(`/workspaces/${id}`),
  deleteWorkspace: (id: number) =>
    req<{ deleted: true; id: number }>(`/workspaces/${id}`, { method: 'DELETE' }),
};

export interface WorkspaceRow {
  id: number;
  name: string;
  createdAt: string;
}
export interface TaskRow {
  id: number;
  workspaceId: number;
  title: string;
  status: string;
  createdAt: string;
}
