/**
 * Read/write the small ?lat=&lon=&tz= shared state from the URL.
 * Used to make plans deep-linkable without any backend.
 */

export interface SharedState {
  lat: number;
  lon: number;
  tz: string;
}

export function readStateFromUrl(search: string): SharedState | null {
  const params = new URLSearchParams(search);
  const lat = Number(params.get("lat"));
  const lon = Number(params.get("lon"));
  const tz = params.get("tz");
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || !tz) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  return { lat, lon, tz };
}

export function writeStateToUrl(state: SharedState, base: string): string {
  const params = new URLSearchParams({
    lat: state.lat.toFixed(4),
    lon: state.lon.toFixed(4),
    tz: state.tz,
  });
  return `${base}?${params.toString()}`;
}
