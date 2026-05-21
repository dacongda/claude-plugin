# @kolmopdf/mcp-server

MCP server for [KolmoPDF](https://www.kolmopdf.com) — high-fidelity PDF→Markdown parsing, layout-preserving PDF translation, and Markdown→DOCX/HTML/PDF/LaTeX conversion.

## Usage

```jsonc
{
  "mcpServers": {
    "kolmopdf": {
      "command": "npx",
      "args": ["-y", "@kolmopdf/mcp-server"],
      "env": { "KOLMOPDF_API_KEY": "sk-..." }
    }
  }
}
```

## Environment variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `KOLMOPDF_API_KEY` | yes | — | API key from https://www.kolmopdf.com/api-keys |
| `KOLMOPDF_BASE_URL` | no | `https://www.kolmopdf.com` | Override for enterprise/debug |
| `KOLMOPDF_OUTPUT_DIR` | no | `./kolmopdf-output` | Extraction root |
| `KOLMOPDF_POLL_INTERVAL_MS` | no | `2000` | Status poll interval |
| `KOLMOPDF_MAX_POLL_MINUTES` | no | `30` | Max client-side wait |
| `KOLMOPDF_HTTP_TIMEOUT_MS` | no | `60000` | Per-call HTTP timeout |
| `KOLMOPDF_UPLOAD_TIMEOUT_MS` | no | `600000` | Upload timeout |

## Tools

`kolmopdf_parse_pdf`, `kolmopdf_translate_pdf`, `kolmopdf_convert_markdown`, `kolmopdf_estimate_cost`, `kolmopdf_check_balance`, `kolmopdf_get_task_status`.

## License

MIT
