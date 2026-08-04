# @pipeworx/eu-parliament

European Parliament Open Data Portal MCP — MEPs, plenary sessions, documents, votes. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `meps(country?, group?, term?)` — list MEPs (current or by parliamentary term)
- `mep(id)` — single MEP profile
- `plenary_documents(term?, type?, limit?)` — plenary documents (reports, motions, …)
- `session_calendar(term?, year?)` — session calendar

## Data source

`https://data.europarl.europa.eu/api/v2/`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "eu-parliament": {
      "url": "https://gateway.pipeworx.io/eu-parliament/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Eu Parliament data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
