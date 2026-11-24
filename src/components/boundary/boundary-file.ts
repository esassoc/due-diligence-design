// Shared between the Site Boundary map card and the Upload a Boundary File card:
// reading a chosen file (mock: by extension) and the window events the two
// cards talk through.

export const BOUNDARY_FILE_EVENT = 'dd:boundary-file';
export const BOUNDARY_CURRENT_EVENT = 'dd:boundary-current-file';
export const BOUNDARY_BROWSE_EVENT = 'dd:boundary-browse';

export type BoundaryFileResult =
  | { ok: true; name: string }
  | { ok: false; name: string; message: string };

const SUPPORTED = ['.geojson', '.json', '.kml', '.kmz', '.zip'];

/** Mock reader: a supported extension reads as the Cottonwood polygon; an empty zip has nothing in it. */
export function readBoundaryFile(file: File, uploadHint: string): BoundaryFileResult {
  const name = file.name;
  const lower = name.toLowerCase();
  const ext = lower.slice(lower.lastIndexOf('.'));
  if (!SUPPORTED.includes(ext)) {
    return { ok: false, name, message: `This file type can't be read. ${uploadHint}` };
  }
  if (ext === '.zip' && file.size === 0) {
    return { ok: false, name, message: `The zip has no shapefile or file geodatabase in it. ${uploadHint}` };
  }
  return { ok: true, name };
}

export function emitBoundaryFile(result: BoundaryFileResult): void {
  window.dispatchEvent(new CustomEvent<BoundaryFileResult>(BOUNDARY_FILE_EVENT, { detail: result }));
}
