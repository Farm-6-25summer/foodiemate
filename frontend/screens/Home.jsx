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
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

const categories = ["한식", "양식", "중식", "일식", "분식", "카페"];

export default function Home({ navigation }) {
  const [selected, setSelected] = useState(categories[0]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 백엔드 API 주소 (필요시 변경)
  const API_BASE_URL = "https://f4a826201b7a.ngrok-free.app/api/posts";

  // 서버에서 게시글 받아오기 (카테고리 필터링)
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}?category=${encodeURIComponent(selected)}`
      );
      if (!response.ok) throw new Error("네트워크 오류");
      const data = await response.json();
      setPosts(data);
    } catch (e) {
      Alert.alert("불러오기 실패", "게시글을 가져오는 중 오류가 발생했어요.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [selected]);

  // 새 글이 있는지 확인, 있으면 posts에 추가 후 params 초기화
  useFocusEffect(
    useCallback(() => {
      const routes = navigation.getState()?.routes || [];
      const createPostRoute = routes.find((r) => r.name === "CreatePost");
      if (createPostRoute?.params?.newPost) {
        setPosts((prev) => [createPostRoute.params.newPost, ...prev]);
        // params 초기화해서 중복 추가 방지
        navigation.setParams({ newPost: null }, createPostRoute.key);
      }
      fetchPosts();
    }, [navigation, fetchPosts])
  );

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
          <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">
            {item.title}
          </Text>
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
      <View style={styles.headerRow}>
        <Text style={styles.univName}>동국대</Text>
      </View>

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

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : posts.length === 0 ? (
        <Text style={styles.emptyText}>조건에 맞는 글이 없습니다.</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 10 }}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <Pressable
        style={styles.createPostButton}
        onPress={() => navigation.navigate("CreatePost")}
      >
        <Text style={styles.createPostButtonText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    paddingTop: 24,
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
    justifyContent: "flex-start",
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
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
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
  cardContent: { fontSize: 14, lineHeight: 20, color: "#333" },
  emptyText: { marginTop: 20, textAlign: "center", color: "#666" },

  createPostButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#FF9728",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  createPostButtonText: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
    lineHeight: 30,
  },
});
