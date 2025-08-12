import React from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    // 실제 백엔드와 연동했을 때 사용하는 코드
    try {
      const response = await fetch(
        "https://f4a826201b7a.ngrok-free.app/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "로그인 실패");
      }

      await AsyncStorage.setItem("LoggedIn", "true");

      const profileSetupDone = await AsyncStorage.getItem("ProfileSetupDone");

      if (profileSetupDone === "true") {
        navigation.navigate("MainTabs", { screen: "Home" });
      } else {
        navigation.navigate("ProfileSetup");
      }
    } catch (error) {
      Alert.alert(
        "로그인 실패",
        error.message || "아이디나 비밀번호를 확인해 주세요."
      );
    }
    /*
    // 백엔드 연동하지 않고 테스트할 때 사용하는 코드
    try {
      const profileSetupDone = await AsyncStorage.getItem("ProfileSetupDone");
      console.log("AsyncStorage - ProfileSetupDone:", profileSetupDone);
      console.log("입력된 이메일:", data.email);
      console.log("입력된 비밀번호:", data.password);

      if (!data.email || !data.password) {
        throw new Error("이메일과 비밀번호를 입력해주세요.");
      }

      await AsyncStorage.setItem("LoggedIn", "true");

      if (profileSetupDone === "true") {
        navigation.navigate("MainTabs", { screen: "Home" });
      } else {
        navigation.navigate("ProfileSetup");
      }
    } catch (error) {
      Alert.alert(
        "로그인 실패",
        error.message || "아이디나 비밀번호를 확인해 주세요."
      );
    }
    */
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>로그인</Text>

        <Controller
          control={control}
          name="email"
          rules={{
            required: "이메일을 입력하세요.",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "유효한 이메일 형식이어야 합니다.",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="이메일"
              placeholderTextColor={"#F57C00"}
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.input, errors.email && styles.errorInput]}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}

        <Controller
          control={control}
          name="password"
          rules={{
            required: "비밀번호를 입력하세요.",
            minLength: { value: 6, message: "최소 6자리 이상이어야 합니다." },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="비밀번호"
              placeholderTextColor={"#F57C00"}
              value={value}
              onChangeText={onChange}
              secureTextEntry
              style={[styles.input, errors.password && styles.errorInput]}
            />
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}

        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          style={({ pressed }) => [
            styles.loginButton,
            isSubmitting && styles.loginButtonDisabled,
            pressed && !isSubmitting && { opacity: 0.85 },
          ]}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>로그인</Text>
          )}
        </Pressable>

        <View style={styles.row}>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.linkText}>회원가입</Text>
          </TouchableOpacity>
          <Text style={styles.separator}>|</Text>
          <TouchableOpacity onPress={() => navigation.navigate("IdpwFind")}>
            <Text style={styles.linkText}>아이디/비밀번호 찾기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const ORANGE = "#F57C00";
const LIGHT_ORANGE = "#FFF3E0";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 60,
    textAlign: "center",
  },
  input: {
    borderRadius: 8,
    padding: 20,
    marginBottom: 17,
    backgroundColor: LIGHT_ORANGE,
    width: "100%",
    maxWidth: 400,
    height: 60,
  },
  loginButton: {
    backgroundColor: ORANGE,
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    height: 60,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  errorInput: {
    borderColor: "#e74c3c",
    borderWidth: 1,
  },
  errorText: {
    color: "#e74c3c",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
  linkText: {
    color: ORANGE,
    fontSize: 14,
    fontWeight: "500",
    marginHorizontal: 6,
  },
  separator: {
    color: ORANGE,
    marginHorizontal: 6,
    fontWeight: "400",
    fontSize: 14,
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#d32f2f",
    borderRadius: 6,
  },
  resetButtonText: {
    color: "#fff",
    textAlign: "center",
  },
});
