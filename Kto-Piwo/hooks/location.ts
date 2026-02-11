import { useState, useEffect } from "react";
import * as Location from "expo-location";

type Coords = {
  latitude: number;
  longitude: number;
};

type Point = {
  latitude: number;
  longitude: number;
};

function round(value: number, decimals = 3) {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}

function metersToLatDeg(m: number) {
  return m / 111320;
}

function metersToLonDeg(m: number, lat: number) {
  return m / (111320 * Math.cos(lat * Math.PI / 180));
}

function calcPoints(
    cardLat: number,
    cardLon: number,
    m : number = 100, 
    accuracy: number = 3,
) {
    const dLat = metersToLatDeg(m)
    const dLon = metersToLonDeg(m, cardLat)

//     return {
//     center: { latitude: cardLat, longitude: cardLon },
//     north: { latitude: cardLat + dLat, longitude: cardLon },
//     south: { latitude: cardLat - dLat, longitude: cardLon },
//     east:  { latitude: cardLat, longitude: cardLon + dLon },
//     west:  { latitude: cardLat, longitude: cardLon - dLon },
//   };
    return {
    center: { latitude: cardLat, longitude: cardLon },
    north: { latitude: cardLat + Math.pow(10, -accuracy), longitude: cardLon },
    south: { latitude: cardLat - + Math.pow(10, -accuracy), longitude: cardLon },
    east:  { latitude: cardLat, longitude: cardLon + Math.pow(10, -accuracy) },
    west:  { latitude: cardLat, longitude: cardLon - Math.pow(10, -accuracy)},
  };
}

export function useLocation() {
  const [location, setLocation] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState<Point[]| null>(null)

  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;

    async function startTracking() {
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          throw new Error("No location permission");
        }

        const first = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setLocation({
          latitude: first.coords.latitude,
          longitude: first.coords.longitude,
        });
        setLoading(false);

        sub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 1,
          },
          (pos) => {
            setLocation({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
          }
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Location error");
        setLoading(false);
      }
    }

    startTracking();

    return () => {
      sub?.remove();
    };
  }, []);

  useEffect(() => {
  if (!location) {
    return;
  }

  const latRounded = round(location.latitude, 3);
  const lonRounded = round(location.longitude, 3);

  const pointsFromLat = calcPoints(
    latRounded,
    location.longitude,
    100
  );

  const pointsFromLon = calcPoints(
    location.latitude,
    lonRounded,
    100
  );

  const allPoints: Point[] = [
    pointsFromLat.center,
    pointsFromLat.north,
    pointsFromLat.south,
    pointsFromLat.east,
    pointsFromLat.west,

    pointsFromLon.center,
    pointsFromLon.north,
    pointsFromLon.south,
    pointsFromLon.east,
    pointsFromLon.west,
  ];

  setPoints(allPoints);
}, [location]);


  return { location, points,  loading, error };
}

