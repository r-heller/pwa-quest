// Trigger a download for a Blob or string in the browser. Handles cleanup.

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Defer revoke so iOS Safari has time to start the download.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadText(text: string, filename: string, mime: string): void {
  // Prefix with UTF-8 BOM for CSV/TXT so Excel on Windows opens them correctly
  // when the data contains non-ASCII characters. Harmless for other consumers.
  const withBom = mime.startsWith('text/') ? '﻿' + text : text;
  downloadBlob(new Blob([withBom], { type: `${mime};charset=utf-8` }), filename);
}
