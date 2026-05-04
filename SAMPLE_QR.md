# Sample setup QR

The setup screen accepts a QR code containing a small JSON object with two
fields:

```json
{
  "participantId": "P042",
  "scenario": "scenario-A"
}
```

- `participantId` — any non-empty string. It will be sanitised when used in
  exported filenames (anything outside `[A-Za-z0-9_-]` becomes `-`).
- `scenario` — must match one of the IDs defined in
  [`src/config/scenarios.ts`](./src/config/scenarios.ts). The current set is
  `scenario-A`, `scenario-B`, `scenario-C`, `scenario-D`, `pilot`. Editing
  that file is the supported way to change the allowed list.

If the scanned QR is malformed or references an unknown scenario, the app
shows a toast error and re-arms the scanner.

## Generated example

A pre-rendered example for `P042` / `scenario-A` lives at
[`docs/sample-setup-qr.png`](./docs/sample-setup-qr.png) — it's the QR shown
below.

![Sample setup QR for P042 / scenario-A](./docs/sample-setup-qr.png)

## Generate your own

The simplest path is the `qrcode` CLI (already in `devDependencies` via the
`qrcode` package):

```bash
npx qrcode -t png -o docs/sample-setup-qr.png \
  '{"participantId":"P042","scenario":"scenario-A"}'
```

Or one-liner from Node:

```bash
node -e "require('qrcode').toFile('out.png', \
  JSON.stringify({participantId:'P099',scenario:'pilot'}), \
  {errorCorrectionLevel:'M', width: 320, margin: 2})"
```

For batch printing, render a small HTML page with one `<canvas>` per QR and
print it. The 30 cm scan distance the app targets is comfortably achievable
with QR images of ~3 cm on a side.
