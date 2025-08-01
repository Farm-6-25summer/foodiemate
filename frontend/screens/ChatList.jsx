import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const dummyChats = [
  { id: "1", user: "지민", lastMessage: "안녕하세요 치킨 같이 드실래요?" },
  { id: "2", user: "유나", lastMessage: "조심히 가세요~" },
];

export default function ChatList() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>채팅 목록</Text>

      <FlatList
        data={dummyChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => alert(`${item.user}과 채팅 열기`)}
          >
            <Text style={styles.user}>{item.user}</Text>
            <Text style={styles.lastMessage}>{item.lastMessage}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>대화한 사람이 없어요.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: "600", marginBottom: 12 },
  chatItem: { paddingVertical: 12, borderBottomWidth: 1, borderColor: "#eee" },
  user: { fontWeight: "600" },
  lastMessage: { color: "#666" },
});
