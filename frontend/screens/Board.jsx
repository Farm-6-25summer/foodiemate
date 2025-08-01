import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";

const initial = [
  {
    id: "1",
    title: "저녁 같이 먹을 사람?",
    content: "한강 근처에서 치킨 먹을래?",
  },
  { id: "2", title: "점심에 분식 할인하던데", content: "같이 갈 사람?" },
];

export default function Board() {
  const [posts, setPosts] = useState(initial);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const addPost = () => {
    if (!title.trim() || !content.trim()) return;
    setPosts([{ id: Date.now().toString(), title, content }, ...posts]);
    setTitle("");
    setContent("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>게시판</Text>
      <TextInput
        placeholder="제목"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="내용"
        value={content}
        onChangeText={setContent}
        style={[styles.input, { height: 80 }]}
        multiline
      />
      <Button title="글 쓰기" onPress={addPost} />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text>{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: "600", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  post: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#fafafa",
    borderRadius: 8,
  },
  postTitle: { fontWeight: "700", marginBottom: 6 },
});
