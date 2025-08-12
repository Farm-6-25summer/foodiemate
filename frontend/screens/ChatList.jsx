import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const posts = [
  {
    id: "1",
    time: "김동국 님",
    title: "외 1인",
    desc: "네 좀 이따 뵐게요~",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH8eWtajBr4f6nazCrWLan-Bq0QAlwZvZyHA&s",
  },
  {
    id: "2",
    time: "이아코 님",
    title: "외 3인",
    desc: "조심히 들어가세요!",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD2gTimwZfhw-QIuoTfxQNfgQQb3s9hgy6sg&s",
  },
  {
    id: "3",
    time: "박남산 님",
    title: "외 2인",
    desc: "네 나중에 또 같이 밥 먹어요ㅎㅎ",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0Gi4RC-_RrXyaEaiqR0YVMwfL2S4mV-_MJg&s",
  },
  {
    id: "4",
    time: "난아코 님",
    title: "외 2인",
    desc: "담에 또 봐요 조심히 가세요!!",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&size=250",
  },
  {
    id: "5",
    time: "신공학관거주자 님",
    title: "외 4인",
    desc: "오늘 식사 즐거웠어요~",
    avatar: "https://ui-avatars.com/api/?name=Shingong-Hak&size=250",
  },
  {
    id: "6",
    time: "김동국학생 님",
    title: "외 1인",
    desc: "다음에도 시간 되면 봐요!",
    avatar: "https://i.pravatar.cc/250",
  },
  {
    id: "7",
    time: "충무로인간 님",
    title: "외 2인",
    desc: "역까지 잘 가세요~",
    avatar: "https://i.pravatar.cc/100?img=8",
  },
  {
    id: "8",
    time: "이동대 님",
    title: "외 1인",
    desc: "오늘 날씨 진짜 좋았네요!",
    avatar: "https://i.pravatar.cc/100?img=9",
  },
];

export default function FeedScreen() {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => Alert.alert(`${item.title}`, `${item.desc}`)}
    >
      <Image source={{ uri: item.avatar }} style={styles.thumbnail} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>
          {item.time} {item.title}
        </Text>
        <Text style={styles.desc} numberOfLines={1}>
          {item.desc}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor="white" />
      {/* 상단: 채팅 */}

      <View style={styles.container}>
        {/* Category Tabs */}
        <View style={styles.headerRow}>
          <Text style={styles.chatName}>채팅</Text>
        </View>
        {/* Post List */}
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 40 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  chatName: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "left",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    paddingTop: 24,
    paddingBottom: -34,
  },
  tabContainer: { flexDirection: "row", marginBottom: 12 },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  tabSelected: { backgroundColor: "#FF9728" },
  tabText: { color: "#333", fontSize: 14 },
  tabTextSelected: { color: "#fff", fontSize: 14, fontWeight: "600" },
  postItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ddd",
    marginRight: 12,
  },
  title: { fontWeight: "600", fontSize: 15 },
  desc: { color: "#666", fontSize: 13, marginTop: 4 },
});
