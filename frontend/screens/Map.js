import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, StyleSheet, ActivityIndicator, TextInput,
  FlatList, TouchableOpacity, Alert, Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";

const GOOGLE_PLACES_KEY = "YOUR_API_KEY"; // ← 실제 키로 교체 (Places API 활성화 필요)
const FALLBACK = { latitude: 37.5665, longitude: 126.9780, latitudeDelta: 0.012, longitudeDelta: 0.012 };

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  // 검색 상태
  const [query, setQuery] = useState("");
  const [suggests, setSuggests] = useState([]);
  const [places, setPlaces] = useState([]); // 지도에 표시된 식당들

  // 현재 위치
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") { setRegion(FALLBACK); return; }
        const acc = Platform.OS === "ios" ? Location.Accuracy.Balanced : Location.Accuracy.High;
        const pos = await Promise.race([
          Location.getCurrentPositionAsync({ accuracy: acc }),
          new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 6000)),
        ]);
        setRegion({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          latitudeDelta: 0.012, longitudeDelta: 0.012,
        });
      } catch { setRegion(FALLBACK); }
      finally { setLoading(false); }
    })();
  }, []);

  // 자동완성(디바운스 간단 구현)
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!query || query.length < 2) { setSuggests([]); return; }
      try {
        const url =
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&language=ko&types=establishment&key=${GOOGLE_PLACES_KEY}`;
        const res = await fetch(url);
        const json = await res.json();
        setSuggests(json.predictions || []);
      } catch { /* noop */ }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const pickPlace = async (prediction) => {
    try {
      // details
      const durl =
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&language=ko&key=${GOOGLE_PLACES_KEY}`;
      const dres = await fetch(durl);
      const djson = await dres.json();
      const details = djson.result;
      if (!details || !details.geometry) return;

      const { lat, lng } = details.geometry.location;
      const p = {
        id: prediction.place_id,
        name: details.name,
        address: details.formatted_address,
        rating: details.rating,
        location: { latitude: lat, longitude: lng },
      };
      setPlaces((prev) => (prev.some((x) => x.id === p.id) ? prev : [...prev, p]));
      const next = { ...p.location, latitudeDelta: 0.008, longitudeDelta: 0.008 };
      setRegion(next);
      mapRef.current?.animateToRegion(next, 500);
      setQuery(details.name);
      setSuggests([]);
    } catch (e) {
      Alert.alert("오류", "장소 정보를 불러오지 못했습니다.");
    }
  };

  if (loading || !region) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>지도를 불러오는 중…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* 상단 검색바 오버레이 */}
      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="식당 검색"
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
        {suggests.length > 0 && (
          <View style={styles.dropdown}>
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={suggests}
              keyExtractor={(it) => it.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.item} onPress={() => pickPlace(item)}>
                  <Text numberOfLines={1} style={styles.itemText}>{item.description}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* 지도 */}
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        showsUserLocation
        showsMyLocationButton
        loadingEnabled
      >
        {places.map((p) => (
          <Marker key={p.id} coordinate={p.location} title={p.name} description={p.address}>
            <Callout onPress={() => Alert.alert(p.name, p.address)}>
              <View style={{ maxWidth: 260 }}>
                <Text style={{ fontWeight: "700" }}>{p.name}</Text>
                <Text style={{ color: "#555", marginTop: 2 }}>{p.address}</Text>
                {p.rating ? <Text style={{ marginTop: 2 }}>⭐ {p.rating}</Text> : null}
                <Text style={{ color: "#FF9728", marginTop: 6 }}>탭하여 상세 보기</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },

  // 상단 검색 오버레이
  searchWrap: {
    position: "absolute",
    top: 8,
    left: 12,
    right: 12,
    zIndex: 20,
  },
  searchInput: {
    height: 44,
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    fontSize: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  dropdown: {
    marginTop: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
    maxHeight: 220,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  item: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "#eee" },
  itemText: { fontSize: 13, color: "#333" },
});
