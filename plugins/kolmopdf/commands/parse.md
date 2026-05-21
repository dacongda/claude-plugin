---
description: Parse a PDF to Markdown via KolmoPDF (handles formulas, tables, multi-column).
argument-hint: <file-path> [--translate] [--target-lang zh|en|ja|ko|fr|de|es|ru]
allowed-tools: mcp__kolmopdf__kolmopdf_parse_pdf, mcp__kolmopdf__kolmopdf_estimate_cost
---

Parse the PDF at the provided path using KolmoPDF. Steps:

1. Run `kolmopdf_estimate_cost` for operation `parse` (or `parse_translate` if `--translate` was passed) and report the cost. If `sufficient=false`, stop.
2. If `--translate` was passed, set `enable_translation=true` and use the `--target-lang` value (default `zh`) with `output_options=["bilingual"]`.
3. Call `kolmopdf_parse_pdf`.
4. Report `output.markdown_path` and `preview` to the user.

Arguments: $ARGUMENTS
