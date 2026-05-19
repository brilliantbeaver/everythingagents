# Brand typography

## Faces

| Use | Family | Weights | Source |
|---|---|---|---|
| Wordmark, body, headings | **Source Serif 4** | 400 (Regular), 500 (Medium), 600 (SemiBold) | Google Fonts (free, OFL) |
| UI chrome, labels, captions | **Inter** | 400, 500, 600, 700 | Google Fonts (free, OFL) |
| Code, monospaced labels | **JetBrains Mono** | 400, 500, 600 | Google Fonts (free, OFL) |

The wordmark uses Source Serif 4 at SemiBold (600), tracking `-0.01em`. When
Source Serif 4 isn't available (some PDF generators, older Office apps), fall
back to Georgia. The fallback chain in every brand SVG is:

```
font-family: "Source Serif 4", Georgia, serif;
```

Inter falls back to system-ui, then sans-serif. JetBrains Mono falls back to
ui-monospace, then monospace.

## Wordmark spec

- Mark and wordmark text share a baseline.
- Mark height = wordmark cap-height × 1.4.
- Gap between mark and text: 0.5 × cap-height.
- Wordmark text is title-cased with the corporate-style "Everything Agents",
  not "EVERYTHING AGENTS" or "everythingagents".
- Letter-spacing on the wordmark: `-0.01em`.

## Don'ts

- Don't recreate the wordmark in another font.
- Don't stretch, condense, italicize, or re-color the wordmark.
- Don't add taglines under the wordmark in marks bound for headers or
  letterheads.
