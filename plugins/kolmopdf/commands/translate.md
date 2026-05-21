---
description: Translate a PDF while preserving its original layout (KolmoPDF).
argument-hint: <file-path> [--from <lang>] [--to <lang>] [--mode translated_only|side_by_side]
allowed-tools: mcp__kolmopdf__kolmopdf_translate_pdf, mcp__kolmopdf__kolmopdf_estimate_cost
---

Translate the PDF while preserving its layout. Steps:

1. Parse the file path and flags from $ARGUMENTS. Defaults: `--from en`, `--to zh`, `--mode translated_only`.
2. Call `kolmopdf_estimate_cost` for operation `translate`. Stop if insufficient.
3. Call `kolmopdf_translate_pdf` with the parsed arguments.
4. Report `output.translated_pdf_path` to the user.

Arguments: $ARGUMENTS
