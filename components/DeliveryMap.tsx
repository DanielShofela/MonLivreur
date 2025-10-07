import React, { useState, useCallback } from 'react';
import axios from 'axios';
import LocationSearchInput from './LocationSearchInput';
import MapView from './MapView';
import RouteInfo from './RouteInfo';

interface Location {
  lat: number;
  lon: number;
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    suburb?: string;
  };
}

const DeliveryMap: React.FC = () => {
  const [startPoint, setStartPoint] = useState<Location | null>(null);
  const [endPoint, setEndPoint] = useState<Location | null>(null);
  const [route, setRoute] = useState<[number, number][] | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: number | null; duration: number | null }>({ distance: null, duration: null });
  const [price, setPrice] = useState<number | null>(null);

  const calculateRoute = useCallback(async () => {
    if (!startPoint || !endPoint) return;

    try {
      const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${startPoint.lon},${startPoint.lat};${endPoint.lon},${endPoint.lat}?overview=full&geometries=geojson`);
      const data = response.data;
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        setRoute(route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]])); // Lat, Lon
        setRouteInfo({ distance: route.distance, duration: route.duration });
        calculatePrice(route.distance, startPoint, endPoint);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  }, [startPoint, endPoint]);

  const calculatePrice = (distance: number, start: Location, end: Location) => {
    const startCommune = start.address.city || start.address.town || start.address.municipality || start.address.suburb;
    const endCommune = end.address.city || end.address.town || end.address.municipality || end.address.suburb;

    if (startCommune && endCommune && startCommune === endCommune) {
      setPrice(500);
    } else {
      const pricePerKm = 100;
      setPrice(Math.round((distance / 1000) * pricePerKm));
    }
  };

  return (
    <div className="p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
      <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Planifier une livraison</h2>
        <div className="flex flex-col gap-4 md:flex-row">
          <LocationSearchInput
            onLocationSelect={(loc) => setStartPoint(loc as Location)}
            placeholder="Adresse de départ"
          />
          <LocationSearchInput
            onLocationSelect={(loc) => setEndPoint(loc as Location)}
            placeholder="Adresse d'arrivée"
          />
          <button
            onClick={calculateRoute}
            disabled={!startPoint || !endPoint}
            className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Valider
          </button>
        </div>
      </div>

      <MapView start={startPoint} end={endPoint} route={route} />

      <RouteInfo
        distance={routeInfo.distance}
        duration={routeInfo.duration}
        price={price}
      />
    </div>
  );
};

export default DeliveryMap;
