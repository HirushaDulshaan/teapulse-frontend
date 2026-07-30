// lib/geoUtils.ts
// Shoelace formula for calculating polygon area from GPS coordinates (lat/lng)
export function calculateLandArea(points: [number, number][]) {
  if (!points || points.length < 3) return { acres: 0, perches: 0, sqMeters: 0 };

  const R = 6378137; // Earth's radius in meters
  let area = 0;

  if (points.length > 2) {
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      
      const lat1 = (p1[0] * Math.PI) / 180;
      const lat2 = (p2[0] * Math.PI) / 180;
      const dLng = ((p2[1] - p1[1]) * Math.PI) / 180;

      area += (dLng) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }
    area = Math.abs((area * R * R) / 2); // Sq Meters
  }

  const acres = area / 4046.86;
  const perches = area / 25.2929;

  return {
    acres: parseFloat(acres.toFixed(2)),
    perches: Math.round(perches),
    sqMeters: Math.round(area),
  };
}