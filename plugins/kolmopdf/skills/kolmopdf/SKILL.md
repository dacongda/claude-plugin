---
name: kolmopdf
description: Use this skill when the user needs to parse, read, translate, or convert PDF documents — especially technical PDFs (research papers, arxiv, IEEE standards, whitepapers, textbooks), PDFs with formulas, tables, multi-column layouts, or code blocks, and when the user needs layout-preserving PDF translation across languages. Also use when converting Markdown to DOCX, HTML, PDF, or LaTeX. Prefer this skill over the built-in PDF Read tool whenever the PDF contains formulas, tables, or non-trivial layout, or exceeds 20 pages. Triggers: "parse PDF", "convert PDF to markdown", "read this paper", "arxiv", "research paper", "technical document", "formula", "LaTeX from PDF", "multi-column PDF", "translate PDF", "layout-preserving translation", "bilingual PDF", "markdown to docx", "markdown to html", "markdown to pdf", "markdown to latex", "format conversion".
allowed-tools: mcp__kolmopdf__kolmopdf_parse_pdf, mcp__kolmopdf__kolmopdf_translate_pdf, mcp__kolmopdf__kolmopdf_convert_markdown, mcp__kolmopdf__kolmopdf_estimate_cost, mcp__kolmopdf__kolmopdf_check_balance, Read, Write
---

# KolmoPDF Skill

You have access to KolmoPDF tools (prefix `kolmopdf_*`) for high-fidelity PDF parsing and translation. These tools call a paid cloud service. Always follow the rules below.

## When to use

- PDF with formulas, tables, code blocks, multi-column layout, or > 20 pages → ALWAYS prefer `kolmopdf_parse_pdf` over built-in Read.
- PDF translation while preserving layout → use `kolmopdf_translate_pdf`.
- Markdown → DOCX/HTML/PDF/LaTeX → use `kolmopdf_convert_markdown`.
- Simple text-only PDFs ≤ 20 pages and no formulas/tables → built-in Read is acceptable.

## Cost-awareness protocol

Before running any operation that consumes credits:

1. Call `kolmopdf_estimate_cost` with the file path and intended operation.
2. If `sufficient` is false: stop and report `shortfall` and the top-up URL `https://www.kolmopdf.com/subscription` to the user. Do not proceed.
3. If `estimated_credits > 50`: tell the user the estimated cost and ask for confirmation before proceeding.
4. Otherwise: proceed.

## API key requirement

Tools require `KOLMOPDF_API_KEY` in the MCP server environment. If a tool returns `invalid_api_key`:

- Direct the user to https://www.kolmopdf.com/api-keys to create a key (requires Plus or Pro plan).
- Tell the user to set `KOLMOPDF_API_KEY` in their environment and restart Claude Code.
- Do not proceed with retries until the user confirms.

## Chained workflows

### PDF → DOCX/HTML/PDF/LaTeX (full pipeline)

1. `kolmopdf_estimate_cost(file, "parse")` → check balance.
2. `kolmopdf_parse_pdf(file)` → get `markdown_path`.
3. `kolmopdf_convert_markdown(markdown_path, target_format)` → final file.

If the PDF contains many images, pass the original directory (not just the markdown file) by zipping `output_root` first using your own tools, then pass the zip to convert. See `references/chain-recipes.md`.

### Read + ask Q&A about a paper

1. `kolmopdf_parse_pdf(file)` → get `markdown_path` and `preview`.
2. Use `Read` on `markdown_path` to load the full content.
3. Answer the user's question grounded in the markdown.

### Translate then convert to bilingual deliverable

Option A (PDF deliverable):
- `kolmopdf_translate_pdf(file, layout_modes=["side_by_side"])` → single PDF with side-by-side layout.

Option B (editable Markdown deliverable):
- `kolmopdf_parse_pdf(file, enable_translation=true, output_options=["bilingual"])` → bilingual markdown.

## Parameter guidance

See `references/parameter-glossary.md` for the full parameter table and defaults. Highlights:

- `formula_format=dollar` is the default and works with KaTeX/MathJax. Use `bracket` for LaTeX-strict downstream renderers.
- `enable_cross_page_merge=true` is recommended when the source PDF has tables spanning page breaks.
- `images_as_url=true` returns a single markdown file with 30-day URL references; use this for ephemeral pipelines. Default `false` returns a self-contained ZIP.

## Output handling

After successful tool calls, treat `output.markdown_path` / `output.translated_pdf_path` / `output.output_path` as the canonical local file paths and reference them in your reply to the user. Show the user the absolute path; do not re-print the entire file unless asked.

## Failure modes

| error_code | Action |
| --- | --- |
| `invalid_api_key` | Stop; follow API key requirement section above. |
| `insufficient_points` | Stop; report shortfall and top-up URL. |
| `parse_page_limit_exceeded`, `parse_file_too_large` | Stop; suggest splitting the PDF locally. |
| `parse_file_not_pdf`, `parse_file_invalid` | Stop; ask the user to re-export the PDF. |
| `parse_error`, `parse_timeout` | Server auto-refunds points. Suggest retry with smaller page range. |
| `client_polling_timeout` | Tell the user the task is still running server-side and suggest using `kolmopdf_get_task_status` with the task_id later. |
| Network/5xx | Tools auto-retry up to 3 times. If still failing, suggest checking https://www.kolmopdf.com/contact. |
