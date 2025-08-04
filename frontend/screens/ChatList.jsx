import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const categories = ["한식", "양식", "중식", "일식", "분식"];
const posts = [
  { id: "1", time: "오후 1시", title: "김치만선생, (2/4)", desc: "함께 식사할 분 구해요!" },
  { id: "2", time: "오전 11시", title: "필동 부대찌개, (3/4)", desc: "점심 같이 하실 분~" },
  { id: "3", time: "오후 12시", title: "동대닭한마리, (1/4)", desc: "닭한마리 같이 드실 분" },
];

export default function FeedScreen() {
  const [selectedCategory, setSelectedCategory] = useState("한식");

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.postItem}>
      <View style={styles.thumbnail} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.time}, {item.title}</Text>
        <Text style={styles.desc} numberOfLines={1}>{item.desc}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Category Tabs */}
      <View style={styles.tabContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, selectedCategory === cat && styles.tabSelected]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={selectedCategory === cat ? styles.tabTextSelected : styles.tabText}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Post List */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  tabContainer: { flexDirection: "row", marginBottom: 12 },
  tab: {
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: "#f0f0f0", marginRight: 8
  },
  tabSelected: { backgroundColor: "#FF9728" },
  tabText: { color: "#333" },
  tabTextSelected: { color: "#fff" },
  postItem: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  thumbnail: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#ddd", marginRight: 12 },
  title: { fontWeight: "600", fontSize: 15 },
  desc: { color: "#666", fontSize: 13, marginTop: 4 },
});
