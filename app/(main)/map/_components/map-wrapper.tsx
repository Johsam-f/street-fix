import { getMapIssues } from './actions';
import { MapContainer } from './map-container';
import { MapLegend } from './map-legend';
import { MapStats } from './map-stats';

export async function MapWrapper() {
  const issues = await getMapIssues();

  return (
    <>
      <MapContainer issues={issues} />
      <MapLegend />
      <MapStats issues={issues} />
    </>
  );
}
