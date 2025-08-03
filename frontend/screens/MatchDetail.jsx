// MatchDetail.jsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import MapView, { Marker } from "react-native-maps";

const { width } = Dimensions.get("window");
const MAP_HEIGHT = 250;

export default function MatchDetail({ route, navigation }) {
  const { post } = route.params;

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" backgroundColor="white" />
        <View style={styles.center}>
          <Text style={styles.errorText}>게시글 정보를 불러올 수 없어요.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // TODO: 실제 post에 위도/경도 들어오면 아래를 post.latitude, post.longitude로 대체
  const latitude = post.latitude ?? 37.56; // 충무로 대략 위치
  const longitude = post.longitude ?? 126.994;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="white" />

      {/* 맵: 상단 fixed height */}
      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          showsUserLocation={false}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Marker
            coordinate={{ latitude, longitude }}
            title={post.title}
            description={post.location}
          />
        </MapView>
      </View>

      {/* 기존 내용 */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.header}>
          <Image source={{ uri: post.avatar }} style={styles.avatar} />
          <View style={styles.info}>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.location}>{post.location}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.content}>{post.content}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>연락하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>매칭하기</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* 필요하면 시간, 인원, 댓글, 버튼 등 추가 */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  mapWrapper: {
    width: "100%",
    height: MAP_HEIGHT,
    backgroundColor: "#f0f0f0",
  },
  map: {
    flex: 1,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
    backgroundColor: "#eee",
  },
  info: { flex: 1 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 4 },
  location: { fontSize: 14, color: "#666" },
  section: { marginTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  content: { fontSize: 15, lineHeight: 22, color: "#333" },
  errorText: { fontSize: 16, color: "#f00" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 280,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: "#FF9728",
    alignItems: "center",
    width: "48%",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
