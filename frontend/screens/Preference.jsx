import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { savePreference } from "../services/api"; // 백엔드에 취향 저장
import AsyncStorage from "@react-native-async-storage/async-storage";

const options = ["한식", "양식", "중식", "일식", "분식"];

export default function Preference({ navigation }) {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggle = (opt) => {
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  };

  const onSave = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("로그인 필요");
      await savePreference({ likes: selected }, token);
      Alert.alert("저장됨", "취향이 저장되었어!");
      navigation.replace("Main");
    } catch (e) {
      Alert.alert("실패", e.message || "문제 생김");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>좋아하는 음식 타입 골라줘</Text>
      <View style={styles.list}>
        {options.map((o) => (
          <TouchableOpacity
            key={o}
            onPress={() => toggle(o)}
            style={[
              styles.tag,
              selected.includes(o) ? styles.tagSelected : styles.tagDefault,
            ]}
          >
            <Text
              style={
                selected.includes(o) ? styles.tagTextSelected : styles.tagText
              }
            >
              {o}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button
        title={loading ? "저장 중..." : "저장하기"}
        onPress={onSave}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 60 },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  list: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  tag: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    margin: 4,
  },
  tagDefault: { backgroundColor: "#eee" },
  tagSelected: { backgroundColor: "#333" },
  tagText: { color: "#000" },
  tagTextSelected: { color: "#fff" },
});
