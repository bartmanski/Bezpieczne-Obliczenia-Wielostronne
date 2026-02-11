import { Image } from "expo-image";
import { StyleSheet, Pressable, TextInput, Text, View } from "react-native";
import { useState, useEffect } from "react";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useLocation } from "@/hooks/location";
import { API_BASE_URL, REFRESH_TIME_SECONDS } from "@/config/api";
import { randomBigInt, hashToBigInt, modPow, P } from "@/utils/cryptoUtils";
import { calcPoints } from "@/api/pointsApi";

export default function HomeScreen() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState<string[]>([]);
  const { point } = useLocation();
  const [privateKey, setPrivateKey] = useState<bigint | null>(null);

  useEffect(() => {
    randomBigInt().then(setPrivateKey);
  }, []);

  async function sendLocationToDo() {
    try {
      if (!location || !point || !privateKey) return;
      const points = calcPoints(point.latitude, point.longitude);
      console.log("Wysyłam lokalizację dla:", username, points);

      const hashedPoints = await Promise.all(
        points.map(async (p) => {
          const h = await hashToBigInt(JSON.stringify(p));
          return modPow(h, privateKey, P).toString();
        })
      );

      const res = await fetch(`${API_BASE_URL}/hashed_once`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: {
            userId: username,
            pos: hashedPoints,
          },
        }),
      });
      const data = await res.json();
      console.log("hashed_once response:", data);

      if (data.positions) {
        const hashes: Record<string, string[]> = {};

        data.positions.forEach((otherUser: any) => {
          //  console.log("Other user:", otherUser);
          const otherUserHashPositions = otherUser.pos.map((p: string) => {
            return modPow(BigInt(p), privateKey, P).toString();
          });
          hashes[otherUser.id] = otherUserHashPositions;
        });

        // console.log("Calculated hashes for others:", hashes);

        const res2 = await fetch(`${API_BASE_URL}/hashed_twice`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              value: {
                id: username,
                hashes: hashes,
              },
            }),
          });
          const data2 = await res2.json(); 
          if(data2.nearby_users){
             const users = data2.nearby_users.map((u:any) => u.user);
             setNearbyUsers(users);
             console.log("Nearby users:", users);
          }
          console.log("hashed_twice response:", data2);
      }
    } catch (e) {
      console.log("Błąd sendLocationToDo:", e);
    }
  }

  async function handleLogin() {
    if (!username.trim()) return;

    setIsLoggedIn(true);

    await sendLocationToDo();
  }


  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(() => {
      sendLocationToDo();
    }, REFRESH_TIME_SECONDS*1000);

    return () => clearInterval(interval);
  }, [isLoggedIn]);


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#0B1220", dark: "#0B1220" }}
      headerImage={
        <View style={styles.heroArt}>
          <Image
            source={require("@/assets/images/partial-react-logo.png")}
            style={styles.heroLogo}
          />
          <View style={styles.heroGlow} />
        </View>
      }
    >
      <ThemedView style={styles.hero}>
        <View style={styles.heroTopRow}>
          <View style={styles.brand}>
            <ThemedText type="title" style={styles.brandTitle}>
              Kto Na Piwo?
            </ThemedText>
            <ThemedText style={styles.brandSubtitle}>
              {isLoggedIn ? "Czekamy na ekipę 🍺" : "Zaloguj się"}
            </ThemedText>
          </View>
          <HelloWave />
        </View>

        <View style={styles.waitingPanel}>
          {nearbyUsers.map((u, i) => (
            <View key={i} style={styles.userRow}>
              <Text style={styles.userText}>{u}</Text>
            </View>
          ))}
        </View>

        {!isLoggedIn && (
          // ===== LOGOWANIE =====
          <View style={styles.loginBox}>
            <TextInput
              placeholder="Nazwa użytkownika"
              placeholderTextColor="rgba(148,163,184,0.6)"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
            />

            <Pressable
              onPress={handleLogin}
              disabled={!username.trim()}
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && styles.pressed,
                !username.trim() && styles.disabled,
              ]}
            >
              <Text style={styles.primaryBtnText}>Zaloguj</Text>
            </Pressable>
          </View>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  heroArt: {
    height: 200,
    overflow: "hidden",
  },
  heroLogo: {
    height: 220,
    width: 360,
    position: "absolute",
    right: -80,
    top: -20,
    opacity: 0.18,
  },
  heroGlow: {
    position: "absolute",
    left: -120,
    top: -120,
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: "rgba(59, 130, 246, 0.22)",
  },

  hero: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.18)",
    marginBottom: 12,
    gap: 12,
  },

  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  brand: { gap: 6 },
  brandTitle: { fontSize: 28, lineHeight: 30 },
  brandSubtitle: { opacity: 0.85, fontSize: 13 },

  loginBox: { gap: 12 },

  input: {
    borderRadius: 14,
    padding: 12,
    backgroundColor: "rgba(148,163,184,0.12)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
    color: "white",
  },

  primaryBtn: {
    borderRadius: 16,
    padding: 12,
    backgroundColor: "rgba(59,130,246,0.92)",
    alignItems: "center",
  },

  primaryBtnText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
  },

  waitingPanel: { gap: 10 },

  userRow: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(148,163,184,0.1)",
  },

  userText: {
    color: "white",
    fontWeight: "700",
  },

  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  disabled: { opacity: 0.4 },
});
