import { ACCURACY } from "@/config/api";
import { Point } from "@/model/types";

function IntWithAcc(value: number, decimals: number) {
    const f = value * (10 ** decimals);
    return parseInt(f.toString());
}

export function calcPoints(
    latitude: number, longitude: number): Point[] {
    latitude = IntWithAcc(latitude, ACCURACY);
    longitude = IntWithAcc(longitude, ACCURACY);
    return [
        { latitude, longitude },
        { latitude: latitude + 1, longitude },
        { latitude: latitude - 1, longitude },
        { latitude, longitude: longitude + 1 },
        { latitude, longitude: longitude - 1 },
        { latitude: latitude + 1, longitude: longitude + 1 },
        { latitude: latitude - 1, longitude: longitude - 1 },
        { latitude: latitude - 1, longitude: longitude + 1 },
        { latitude: latitude + 1, longitude: longitude - 1 },
    ];
}