import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

// 더미 데이터 (한식 5개)
const dummyPosts = [
  {
    id: "1",
    title: "오후 1시, 김치만선생, (2/4)",
    content:
      "한끼 식사 같이 하실 분 구해요! 꼭 김치만 아니어도 괜찮고 성별이나 나이대 상관 없어요",
    location: "충무로",
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: "2",
    title: "오전 11시, 필동면옥, (3/4)",
    content:
      "같이 웨이팅하면서 수다도 떨고 평양냉면도 먹어요 편하게 연락 주세요~",
    location: "충무로",
    avatar: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: "3",
    title: "오후 12시, 동대닭한마리, (1/4)",
    content: "닭한마리 같이 드실 분 구합니다",
    location: "충무로",
    avatar: "https://i.pravatar.cc/100?img=3",
  },
  {
    id: "4",
    title: "오후 1시, 필동 부대찌개, (1/2)",
    content: "오늘 친구가 결석해서 심심하네요",
    location: "충무로",
    avatar: "https://i.pravatar.cc/100?img=4",
  },
  {
    id: "5",
    title: "오후 1시, 행복한 맛집, (1/2)",
    content: "조용히 밥만 먹읍시다",
    location: "충무로",
    avatar: "https://i.pravatar.cc/100?img=5",
  },
];

const categories = ["한식", "양식", "중식", "일식", "분식"];

export default function Home({ navigation }) {
  const [selected, setSelected] = useState("한식");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      // 백엔드가 준비됐으면 여기에 실제 API 호출
      // 예시: const res = await fetch("https://api.example.com/match-posts");
      // const data = await res.json();
      // setPosts(data);

      // 아직 백엔드 없으면 더미 (한식만)
      // 다른 카테고리는 빈 배열이 나오도록 처리
      if (selected === "한식") {
        setPosts(dummyPosts);
      } else {
        setPosts([]); // 나중에 실제 API에서 카테고리 필터링해서 가져오면 대체
      }
    } catch (e) {
      Alert.alert("불러오기 실패", "게시글을 가져오는 중 오류가 발생했어요.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [selected]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("MatchDetail", { post: item })}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.titleWrapper}>
          <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.title}
          </Text>
          <Text style={styles.cardMeta}>{item.location}</Text>
        </View>
      </View>
      <Text style={styles.cardContent} numberOfLines={2} ellipsizeMode="tail">
        {item.content}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="white" />
      {/* 상단: 대학 이름 */}
      <View style={styles.headerRow}>
        <Text style={styles.univName}>동국대</Text>
      </View>

      {/* 카테고리 탭 */}
      <View style={styles.tabs}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setSelected(c)}
            style={[styles.tab, selected === c && styles.tabActive]}
          >
            <Text
              style={selected === c ? styles.tabTextActive : styles.tabText}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 리스트 */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 10 }}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>조건에 맞는 글이 없습니다.</Text>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    paddingTop: 24,
    paddingBottom: -34,
  },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  univName: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "left",
  },
  tabs: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 14,
    justifyContent: "center",
    gap: 6,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16.5,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 6,
  },
  tabActive: { backgroundColor: "#FF9728" },
  tabText: { color: "#333", fontWeight: "500" },
  tabTextActive: { color: "#fff", fontWeight: "600" },
  card: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    // 그림자 (iOS)
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    // Android
    elevation: 3,
  },
  cardHeader: { flexDirection: "row", marginBottom: 8, alignItems: "center" },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: "#ddd",
  },
  titleWrapper: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  cardMeta: { color: "#666", fontSize: 12 },
  cardContent: { fontSize: 14, lineHeight: 20, color: "#333" },
  emptyText: { marginTop: 20, textAlign: "center", color: "#666" },
});
