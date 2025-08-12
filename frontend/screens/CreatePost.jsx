import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  FlatList,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, { Marker } from "react-native-maps";
import { KAKAO_REST_API_KEY } from "@env";

const categories = ["한식", "양식", "중식", "일식", "분식", "카페"];

export default function CreatePost({ navigation, route }) {
  const [people, setPeople] = useState("");
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [description, setDescription] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [places, setPlaces] = useState([]);
  const [region, setRegion] = useState({
    latitude: 37.5583,
    longitude: 127.001,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [category, setCategory] = useState(categories[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 백엔드 API 주소 (자신의 ngrok 주소 등으로 바꿔주세요)
  const API_BASE_URL = "https://f4a826201b7a.ngrok-free.app/api/posts";

  const searchPlaces = async (keyword) => {
    if (!keyword) {
      setPlaces([]);
      return;
    }
    try {
      const res = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(
          keyword
        )}`,
        {
          headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` },
        }
      );
      const json = await res.json();
      setPlaces(json.documents || []);
    } catch (e) {
      Alert.alert("검색 오류", "장소 검색 중 오류가 발생했습니다.");
    }
  };

  const onSelectPlace = (place) => {
    setSelectedPlace(place);
    setSearchKeyword(place.place_name);
    setRegion({
      latitude: Number(place.y),
      longitude: Number(place.x),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setPlaces([]);
  };

  const handleSubmit = async () => {
    if (!searchKeyword || !people || !description) {
      Alert.alert("입력 오류", "식당, 인원, 시간대를 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    const newPost = {
      category,
      title: `${time.getHours()}시 ${time.getMinutes()}분, ${searchKeyword}, (1/${people})`,
      content: description,
      location: selectedPlace ? selectedPlace.address_name : "충무로",
      avatar: "https://www.gravatar.com/avatar/?d=mp&s=100",
    };

    try {
      // 백엔드에 새 글 등록 요청
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error("게시글 등록에 실패했습니다.");
      }

      const savedPost = await response.json();

      // 부모 컴포넌트에 새 글 추가 함수가 있으면 호출해서 리스트 갱신
      if (route.params?.addPost) {
        await route.params.addPost(savedPost);
      }

      Alert.alert("등록 완료", "새 글이 등록되었습니다.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("등록 실패", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.label}>카테고리 선택</Text>
            <View style={styles.categoryContainer}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.categoryButton,
                    category === c && styles.categoryButtonActive,
                  ]}
                  onPress={() => setCategory(c)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      category === c && styles.categoryTextActive,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>식당 검색</Text>
            <TextInput
              style={styles.input}
              value={searchKeyword}
              onChangeText={(text) => {
                setSearchKeyword(text);
                searchPlaces(text);
              }}
              placeholder="식당 이름을 검색하세요"
              placeholderTextColor="#999"
            />

            {places.length > 0 && (
              <FlatList
                style={styles.searchResults}
                data={places}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.searchResultItem}
                    onPress={() => onSelectPlace(item)}
                  >
                    <Text>{item.place_name}</Text>
                    <Text style={styles.addressText}>{item.address_name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <MapView style={styles.map} region={region}>
              {selectedPlace && (
                <Marker
                  coordinate={{
                    latitude: Number(selectedPlace.y),
                    longitude: Number(selectedPlace.x),
                  }}
                  title={selectedPlace.place_name}
                  description={selectedPlace.address_name}
                />
              )}
            </MapView>

            <Text style={styles.label}>인원</Text>
            <TextInput
              style={styles.input}
              value={people}
              onChangeText={setPeople}
              placeholder="예: 4"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>시간대</Text>
            <Pressable
              style={styles.input}
              onPress={() => setShowTimePicker(true)}
            >
              <Text>
                {time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </Pressable>
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) setTime(selectedTime);
                }}
              />
            )}

            <Text style={styles.label}>추가 설명</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={description}
              onChangeText={setDescription}
              placeholder="간단한 설명을 적어주세요"
              multiline
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.button, isSubmitting && { opacity: 0.5 }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "등록 중..." : "등록하기"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 200 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 12 },
  categoryContainer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 2,
  },
  categoryButton: {
    flex: 1,
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  categoryButtonActive: {
    backgroundColor: "#FF9728",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  categoryTextActive: {
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginTop: 6,
  },
  searchResults: {
    maxHeight: 150,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  searchResultItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  addressText: {
    fontSize: 12,
    color: "#666",
  },
  map: {
    height: 200,
    marginTop: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#FF9728",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
