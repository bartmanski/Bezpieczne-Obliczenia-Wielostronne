import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { ACCURACY } from "@/config/api";
import { Coords, Point } from "@/model/types";


function IntWithAcc(value: number, decimals: number) {
  const f = value * (10 ** decimals);
  return parseInt(f.toString());
}



export function useLocation() {
  const [location, setLocation] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [point, setPoints] = useState<Point | null>(null)

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

    const latRounded = IntWithAcc(location.latitude, ACCURACY);
    const lonRounded = IntWithAcc(location.longitude, ACCURACY);


    setPoints({ latitude: location.latitude, longitude: location.longitude } as Point);
  }, [location]);


  return { point, loading, error };
}

