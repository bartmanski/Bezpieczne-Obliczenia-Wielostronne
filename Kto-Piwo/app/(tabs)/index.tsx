import { Image } from "expo-image";
import { Platform, StyleSheet, Pressable } from "react-native";
import { Text, View } from "react-native";
import { useLocation } from "../../hooks/location";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";

export default function HomeScreen() {
  const { location, points, loading, error } = useLocation();

  const status = loading
    ? { label: "Szukam lokalizacji…", tone: "muted" as const }
    : error
      ? { label: "Brak lokalizacji", tone: "danger" as const }
      : location
        ? { label: "Lokalizacja OK", tone: "success" as const }
        : { label: "Nieustalone", tone: "muted" as const };

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
              TEST TEST
            </ThemedText>
          </View>

          <View style={styles.waveWrap}>
            <HelloWave />
          </View>
        </View>

        <View style={[styles.chip, chipTone(status.tone)]}>
          <Text style={styles.chipText}>{status.label}</Text>
        </View>

        <View style={styles.ctaRow}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.pressed,
              (loading || !!error) && styles.disabled,
            ]}
            disabled={loading || !!error}
            onPress={() => alert("Stwórz wypad: TODO")}
          >
            <Text style={styles.primaryBtnText}>Stwórz wypad</Text>
            <Text style={styles.primaryBtnSub}>Zaproś ekipę i ustaw miejsce</Text>
          </Pressable>

          <View style={styles.secondaryRow}>
            <Pressable
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
              onPress={() => alert("Dołącz: TODO")}
            >
              <Text style={styles.secondaryBtnText}>Dołącz</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
              onPress={() => alert("Udostępnij: TODO")}
            >
              <Text style={styles.secondaryBtnText}>Udostępnij</Text>
            </Pressable>
          </View>
        </View>
      </ThemedView>

      {/* LOKALIZACJA */}
      <ThemedView style={styles.card}>
        <View style={styles.cardHeader}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Twoja pozycja
          </ThemedText>
          <Text style={styles.cardHint}>
            {Platform.OS === "web" ? "Web bywa kapryśny z GPS" : "Z telefonu działa najlepiej"}
          </Text>
        </View>

        {loading && <ThemedText style={styles.muted}>Pobieram…</ThemedText>}

        {error && <ThemedText style={styles.danger}>{error}</ThemedText>}

        {!loading && !error && location && (
          <View style={styles.kvGrid}>
            <View style={styles.kv}>
              <Text style={styles.k}>Szerokość</Text>
              <Text style={styles.v}>{location.latitude.toFixed(6)}</Text>
            </View>
            <View style={styles.kv}>
              <Text style={styles.k}>Długość</Text>
              <Text style={styles.v}>{location.longitude.toFixed(6)}</Text>
            </View>
          </View>
        )}

        {!loading && !error && !location && (
          <ThemedText style={styles.muted}>
            Brak danych. Jeśli to Android, sprawdź uprawnienia lokalizacji.
          </ThemedText>
        )}
      </ThemedView>

      {/* PUNKTY */}
      {!!points?.length && (
        <ThemedView style={styles.card}>
          <View style={styles.cardHeader}>
            <ThemedText type="subtitle" style={styles.cardTitle}>
              Punkty pomocnicze
            </ThemedText>
            <Text style={styles.cardHint}>{points.length} szt.</Text>
          </View>

          <View style={styles.list}>
            {points.map((p, i) => (
              <View key={i} style={styles.row}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{i + 1}</Text>
                </View>
                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle}>Punkt {i + 1}</Text>
                  <Text style={styles.rowSub}>
                    {p.latitude.toFixed(6)}, {p.longitude.toFixed(6)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ThemedView>
      )}

      {/* Nawigacja demo może zostać, ale schowana jako “Więcej” */}
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle" style={styles.cardTitle}>
          Więcej
        </ThemedText>

        <Link href="/modal">
          <Link.Trigger>
            <Text style={styles.linkLike}>Otwórz ekran modalny</Text>
          </Link.Trigger>
          <Link.Preview />
        </Link>
      </ThemedView>
    </ParallaxScrollView>
  );
}

function chipTone(tone: "muted" | "success" | "danger") {
  if (tone === "success") return { backgroundColor: "rgba(34, 197, 94, 0.18)", borderColor: "rgba(34, 197, 94, 0.35)" };
  if (tone === "danger") return { backgroundColor: "rgba(239, 68, 68, 0.16)", borderColor: "rgba(239, 68, 68, 0.35)" };
  return { backgroundColor: "rgba(148, 163, 184, 0.14)", borderColor: "rgba(148, 163, 184, 0.30)" };
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
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  brand: { flex: 1, gap: 6 },
  brandTitle: { fontSize: 28, lineHeight: 30 },
  brandSubtitle: {
    opacity: 0.85,
    fontSize: 13,
    lineHeight: 18,
  },
  waveWrap: { paddingTop: 2 },

  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: {
    color: "rgba(226, 232, 240, 0.92)",
    fontSize: 12,
    fontWeight: "600",
  },

  ctaRow: { gap: 10 },
  primaryBtn: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(59, 130, 246, 0.92)",
  },
  primaryBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
  primaryBtnSub: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    marginTop: 4,
  },
  secondaryRow: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(148, 163, 184, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.22)",
    alignItems: "center",
  },
  secondaryBtnText: {
    color: "rgba(226, 232, 240, 0.92)",
    fontWeight: "700",
  },

  pressed: { transform: [{ scale: 0.99 }], opacity: 0.92 },
  disabled: { opacity: 0.45 },

  card: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: "rgba(2, 6, 23, 0.55)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.14)",
    marginBottom: 12,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 10,
  },
  cardTitle: { fontSize: 16 },
  cardHint: { color: "rgba(148, 163, 184, 0.85)", fontSize: 12 },

  muted: { opacity: 0.75 },
  danger: { color: "rgba(248, 113, 113, 1)" },

  kvGrid: { flexDirection: "row", gap: 10 },
  kv: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    backgroundColor: "rgba(148, 163, 184, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.18)",
    gap: 6,
  },
  k: { color: "rgba(148, 163, 184, 0.9)", fontSize: 12, fontWeight: "600" },
  v: { color: "rgba(226, 232, 240, 0.95)", fontSize: 14, fontWeight: "800" },

  list: { gap: 10 },
  row: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(148, 163, 184, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.14)",
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "rgba(59, 130, 246, 0.22)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.28)",
  },
  badgeText: {
    color: "rgba(226, 232, 240, 0.95)",
    fontWeight: "900",
    fontSize: 12,
  },
  rowBody: { flex: 1, gap: 2 },
  rowTitle: { color: "rgba(226, 232, 240, 0.95)", fontWeight: "800" },
  rowSub: { color: "rgba(148, 163, 184, 0.95)", fontSize: 12 },

  linkLike: {
    color: "rgba(96, 165, 250, 0.95)",
    fontWeight: "700",
  },
});
