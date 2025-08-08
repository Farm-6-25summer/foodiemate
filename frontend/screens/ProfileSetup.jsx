import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileSetup = () => {
  const navigation = useNavigation();

  const [selectedFoods, setSelectedFoods] = useState([]);
  const [age, setAge] = useState("");
  const [time, setTime] = useState(new Date()); // Date 객체로 시간 관리
  const [showTimePicker, setShowTimePicker] = useState(false);

  const foodOptions = ["한식", "양식", "중식", "일식", "분식", "디저트"];

  useEffect(() => {
    AsyncStorage.getItem("userPreferences").then((json) => {
      if (json) {
        const data = JSON.parse(json);
        setSelectedFoods(data.foods || []);
        setAge(data.age || "");
        if (data.time) {
          setTime(new Date(data.time));
        }
      }
    });
  }, []);

  const toggleFood = (food) => {
    if (selectedFoods.includes(food)) {
      setSelectedFoods(selectedFoods.filter((f) => f !== food));
    } else {
      setSelectedFoods([...selectedFoods, food]);
    }
  };

  const onTimeChange = (event, selectedDate) => {
    setShowTimePicker(Platform.OS === "ios"); // ios는 picker 계속 보여줌, android는 닫음
    if (selectedDate) {
      setTime(selectedDate);
    }
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // 0 -> 12
    const mins = minutes < 10 ? `0${minutes}` : minutes;
    return `${ampm} ${hours}:${mins}`;
  };

  const onPressAgree = async () => {
    try {
      if (!age) {
        alert("나이를 입력하세요.");
        return;
      }
      if (!time) {
        alert("이용 시간을 선택하세요.");
        return;
      }

      const dataToSave = {
        foods: selectedFoods,
        age,
        time: time.toISOString(),
      };

      await AsyncStorage.setItem("userPreferences", JSON.stringify(dataToSave));
      await AsyncStorage.setItem("ProfileSetupDone", "true");
      await AsyncStorage.setItem("age", age);

      console.log("프로필 저장 완료:", dataToSave);

      navigation.navigate("MainTabs", { screen: "Home" });
    } catch (error) {
      console.error("프로필 저장 실패:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ScrollView style={{ flex: 0.8 }} contentContainerStyle={styles.main}>
            <View style={styles.header}>
              <Text style={styles.title}>
                매칭 서비스 이용을 위해{"\n"}취향을 알려주세요!
              </Text>
            </View>

            <View style={styles.profileSetupList}>
              {/* 나이 입력 */}
              <View style={styles.profileSetupItemAge}>
                <Text style={styles.profileSetupItemAgeText}>나이</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.profileSetupItemAgeInput}
                    keyboardType="numeric"
                    onChangeText={setAge}
                    value={age}
                  />
                  <Text style={styles.unitText}>세</Text>
                </View>
              </View>

              {/* 선호 음식 다중 선택 */}
              <View style={styles.profileSetupItemOX}>
                <Text style={styles.profileSetupItemOXText}>
                  선호하는 음식 카테고리
                </Text>
                <View style={styles.foodButtonContainer}>
                  {foodOptions.map((food) => (
                    <Pressable
                      key={food}
                      onPress={() => toggleFood(food)}
                      style={[
                        styles.foodButton,
                        selectedFoods.includes(food) &&
                          styles.foodButtonSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.foodButtonText,
                          selectedFoods.includes(food) &&
                            styles.foodButtonTextSelected,
                        ]}
                      >
                        {food}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* 시간대 선택 */}
              <View style={styles.profileSetupItemOX}>
                <Text style={styles.profileSetupItemOXText}>
                  주로 이용하는 시간
                </Text>
                <Pressable
                  style={styles.timePickerButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.timePickerButtonText}>
                    {formatTime(time)}
                  </Text>
                </Pressable>
                {showTimePicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={time}
                    mode="time"
                    is24Hour={false}
                    display="spinner"
                    onChange={onTimeChange}
                  />
                )}
              </View>
            </View>
          </ScrollView>
          {/* 시작 버튼 */}
          <View style={styles.footerbutton}>
            <Pressable style={styles.button} onPress={onPressAgree}>
              <Text style={styles.buttonText}>시작하기</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default ProfileSetup;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: {
    paddingHorizontal: 16,
    flex: 1,
  },
  header: { marginTop: 40, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "600" },
  main: {
    flex: 1,
  },
  profileSetupList: { marginTop: 15 },
  profileSetupItemAge: { marginBottom: 36 },
  profileSetupItemAgeText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  unitText: {
    position: "absolute",
    left: 100,
    top: 15,
    fontSize: 16,
    fontWeight: "600",
    color: "#FF9728",
  },
  profileSetupItemAgeInput: {
    borderRadius: 8,
    padding: 18,
    width: 130,
    height: 50,
    backgroundColor: "#fff6eb",
  },
  profileSetupItemOX: { marginBottom: 36, width: "100%" },
  profileSetupItemOXText: { fontSize: 16, fontWeight: "600", marginBottom: 16 },
  foodButtonContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  foodButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 10,
    marginBottom: 10,
  },
  foodButtonSelected: { backgroundColor: "#FF9728" },
  foodButtonText: { color: "#333" },
  foodButtonTextSelected: { color: "#fff" },
  timePickerButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "#fff6eb",
    borderRadius: 8,
    width: 130,
  },
  timePickerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  footerbutton: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 0.1,
  },
  button: {
    backgroundColor: "#FF9728",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    height: 60,
    justifyContent: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});
