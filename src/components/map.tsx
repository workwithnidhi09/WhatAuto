
'use client';

import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

type Location = {
  key: string;
  position: {
    lat: number;
    lng: number;
  };
  demand: string;
};

type MapComponentProps = {
  locations: Location[];
};

export default function MapComponent({ locations }: MapComponentProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border bg-muted">
        <p className="text-muted-foreground">Google Maps API key is missing.</p>
      </div>
    );
  }

  const center = locations.length > 0 ? locations[0].position : { lat: 40.7128, lng: -74.0060 };

  return (
    <APIProvider apiKey={apiKey}>
      <div className="h-[500px] w-full rounded-lg overflow-hidden border">
        <Map
          defaultCenter={center}
          defaultZoom={10}
          mapId="retail-genius-map"
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {locations.map((location) => (
            <AdvancedMarker key={location.key} position={location.position}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-lg
                    ${location.demand === 'High' ? 'bg-red-500' : ''}
                    ${location.demand === 'Medium' ? 'bg-yellow-500' : ''}
                    ${location.demand === 'Low' ? 'bg-green-500' : ''}
                `}>
                    {location.demand.charAt(0)}
                </div>
            </AdvancedMarker>
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}
