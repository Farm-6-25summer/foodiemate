import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const dummyPosts = [
  { id: "1", title: "한식 같이 먹을 사람?", category: "한식", user: "지민" },
  {
    id: "2",
    title: "분식 먹고 싶어하는 사람?",
    category: "분식",
    user: "유나",
  },
  { id: "3", title: "양식 점심 같이?", category: "양식", user: "서연" },
];

const categories = ["한식", "양식", "중식", "일식", "분식"];

export default function Home({ navigation }) {
  const [selected, setSelected] = useState("한식");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    setFiltered(dummyPosts.filter((p) => p.category === selected));
  }, [selected]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>밥친구 찾기</Text>
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

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => Alert.alert("글 눌림", item.title)}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMeta}>
              {item.category} · {item.user}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ marginTop: 20 }}>조건에 맞는 글이 없습니다.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: "600", marginBottom: 12 },
  tabs: { flexDirection: "row", marginBottom: 16, flexWrap: "wrap", gap: 6 },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 6,
    marginBottom: 6,
  },
  tabActive: { backgroundColor: "#333" },
  tabText: { color: "#000" },
  tabTextActive: { color: "#fff" },
  card: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: { fontWeight: "600", marginBottom: 4 },
  cardMeta: { color: "#666" },
});
