---
description: Convert Markdown to DOCX, HTML, PDF, or LaTeX (KolmoPDF).
argument-hint: <markdown-or-zip-path> [--format word|docx|html|pdf|latex|tex]
allowed-tools: mcp__kolmopdf__kolmopdf_convert_markdown, mcp__kolmopdf__kolmopdf_estimate_cost
---

Convert the provided Markdown file (or ZIP archive containing markdown + images) to the target format. Steps:

1. Parse arguments. Default `--format word`.
2. Call `kolmopdf_estimate_cost` for operation `convert` (always 1 credit). Stop if insufficient.
3. Call `kolmopdf_convert_markdown`.
4. Report `output.output_path` to the user.

Arguments: $ARGUMENTS
