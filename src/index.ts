interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * European Parliament Open Data MCP.
 *
 * Auth: none.
 * Docs: https://data.europarl.europa.eu/en/developer-corner/opendata-api
 */


const BASE = 'https://data.europarl.europa.eu/api/v2';
const UA = 'pipeworx-mcp-eu-parliament/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'meps',
    description: 'List MEPs (current term by default).',
    inputSchema: {
      type: 'object',
      properties: {
        country: { type: 'string', description: 'ISO 3166-1 alpha-3 (e.g. "DEU").' },
        group: { type: 'string', description: 'EP political group acronym (e.g. "EPP").' },
        term: { type: 'number', description: 'Parliamentary term number (e.g. 10 = 2024-2029).' },
        limit: { type: 'number' },
        offset: { type: 'number' },
      },
    },
  },
  {
    name: 'mep',
    description: 'Single MEP by id.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' } },
      required: ['id'],
    },
  },
  {
    name: 'plenary_documents',
    description: 'Plenary documents.',
    inputSchema: {
      type: 'object',
      properties: {
        term: { type: 'number' },
        type: { type: 'string', description: 'e.g. "REPORT", "MOTION_FOR_RESOLUTION"' },
        limit: { type: 'number' },
        offset: { type: 'number' },
      },
    },
  },
  {
    name: 'session_calendar',
    description: 'Session calendar.',
    inputSchema: {
      type: 'object',
      properties: {
        term: { type: 'number' },
        year: { type: 'number' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'meps': {
      const p = baseParams(args);
      if (args.country) p.set('country', String(args.country));
      if (args.group) p.set('group', String(args.group));
      if (args.term) p.set('parliamentary-term', String(args.term));
      return epGet(`/meps?${p}`);
    }
    case 'mep':
      return epGet(`/meps/${encodeURIComponent(reqStr(args, 'id', '"<id>"'))}`);
    case 'plenary_documents': {
      const p = baseParams(args);
      if (args.term) p.set('parliamentary-term', String(args.term));
      if (args.type) p.set('type', String(args.type));
      return epGet(`/plenary-documents?${p}`);
    }
    case 'session_calendar': {
      const p = baseParams(args);
      if (args.term) p.set('parliamentary-term', String(args.term));
      if (args.year) p.set('year', String(args.year));
      return epGet(`/meetings?${p}`);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function baseParams(args: Record<string, unknown>): URLSearchParams {
  return new URLSearchParams({
    format: 'application/ld+json',
    limit: String(Math.min(200, Math.max(1, (args.limit as number) ?? 25))),
    offset: String(Math.max(0, (args.offset as number) ?? 0)),
  });
}

async function epGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/ld+json', 'User-Agent': UA } });
  if (!res.ok) throw new Error(`EU Parliament: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
