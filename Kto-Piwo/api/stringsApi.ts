import { API_BASE_URL } from "../config/api";

export async function fetchStrings(): Promise<string[]> {
    const res = await fetch(`${API_BASE_URL}/strings`, {
        headers: {
            "ngrok-skip-browser-warning": "true"
        }
    });

    if (!res.ok) {
        throw new Error("Failed to fetch strings");
    }
    const json = await res.json();
    return json;
}

export async function addString(value: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/strings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value })
    });

    if (!res.ok) {
        throw new Error("Failed to add string");
    }
}
