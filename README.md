# GraphHopper TypeScript API

A TypeScript library for interacting with the GraphHopper API, including modules for Routing, Isochrone, Matrix, Map Matching, Optimization, and Geocoding. All modules are written in TypeScript and ready for use in Node.js and browser environments.

## Installation

```
npm install graphhopper
```

## Dependencies

- [axios](https://www.npmjs.com/package/axios) is required for HTTP requests (installed automatically).

## Usage Example

```typescript
import {
  GraphHopperInput,
  GraphHopperRouting,
  GraphHopperIsochrone,
  GraphHopperMatrix,
  GraphHopperMapMatching,
  GraphHopperOptimization,
  GraphHopperGeocoding
} from 'graphhopper';

// Routing Example
const routing = new GraphHopperRouting({ key: 'YOUR_API_KEY' });
routing.doRequest({
  points: [[13.388860,52.517037],[13.397634,52.529407]],
  profile: 'car'
}).then(result => {
  console.log('Routing result:', result);
});

// Isochrone Example
const isochrone = new GraphHopperIsochrone({ key: 'YOUR_API_KEY' });
isochrone.doRequest({
  point: '52.517037,13.388860',
  time_limit: 600,
  profile: 'car'
}).then(result => {
  console.log('Isochrone result:', result);
});

// Matrix Example
const matrix = new GraphHopperMatrix({ key: 'YOUR_API_KEY' });
matrix.doRequest({
  from_points: [[13.388860,52.517037]],
  to_points: [[13.397634,52.529407]],
  profile: 'car'
}).then(result => {
  console.log('Matrix result:', result);
});

// Map Matching Example
const mapMatching = new GraphHopperMapMatching({ key: 'YOUR_API_KEY' });
mapMatching.doRequest('<gpx>...</gpx>').then(result => {
  console.log('Map Matching result:', result);
});

// Optimization Example
const optimization = new GraphHopperOptimization({ key: 'YOUR_API_KEY' });
optimization.doVRPRequest([[13.388860,52.517037],[13.397634,52.529407]], 1).then(result => {
  console.log('Optimization result:', result);
});

// Geocoding Example
const geocoding = new GraphHopperGeocoding({ key: 'YOUR_API_KEY' });
geocoding.doRequest({ query: 'Berlin' }).then(result => {
  console.log('Geocoding result:', result);
});
```

For more advanced usage and parameter options, see the [GraphHopper OpenAPI documentation](https://docs.graphhopper.com/openapi).

## Modules

- **GraphHopperInput**: Utility for lat/lng input and conversion.
- **GraphHopperRouting**: Routing API client.
- **GraphHopperIsochrone**: Isochrone API client.
- **GraphHopperMatrix**: Matrix API client.
- **GraphHopperMapMatching**: Map Matching API client.
- **GraphHopperOptimization**: Vehicle Routing Problem (VRP) API client.
- **GraphHopperGeocoding**: Geocoding API client.

## TypeScript Support

All modules are fully typed. Import types for strict usage:

```typescript
import { GraphHopperRoutingArgs } from 'graphhopper';
```

## License

MIT

---

**This TypeScript module was created by GitHub Copilot, based on the original JavaScript GraphHopper client. The code was modernized, typed, and refactored for npm and TypeScript best practices.**
