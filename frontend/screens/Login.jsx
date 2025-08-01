import React from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import { login as apiLogin } from "../services/api"; // 백엔드 api (없으면 모킹 가능)

export default function Login({ navigation }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      // 모킹 로그인 - 실제 백엔드 준비 전
      const fakeUser = { name: "홍길동", email: data.email };
      const fakeToken = "fake-jwt-token";

      await AsyncStorage.setItem("token", fakeToken);
      await AsyncStorage.setItem("user", JSON.stringify(fakeUser));

      navigation.replace("Main"); // 하단탭 메인으로 이동
    } catch (e) {
      Alert.alert("로그인 실패", "알 수 없는 오류가 생겼습니다.");
    }
  };
  /* 실제 로그인 기능능
  const onSubmit = async (data) => {
    try {
      const res = await login({ email: data.email, password: data.password });
      await AsyncStorage.setItem('token', res.token);
      await AsyncStorage.setItem('user', JSON.stringify(res.user));
      navigation.replace('Main'); // 로그인 성공하면 메인 화면으로
    } catch (err) {
      Alert.alert('로그인 실패', err.message || '아이디나 비밀번호 확인해줘');
    }
  };
  */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>

      <Controller
        control={control}
        name="email"
        rules={{
          required: "이메일 입력하세요.",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "유효한 이메일 형식이어야 합니다.",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="이메일"
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

      <Button
        title={isSubmitting ? "로딩..." : "로그인"}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      />

      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.linkText}>회원가입</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Preference")}>
          <Text style={styles.linkText}>취향 설정</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>* 실제 백엔드 준비되면 API 연동</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center" },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  errorInput: { borderColor: "#e74c3c" },
  errorText: { color: "#e74c3c", marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  linkText: { color: "#0066cc" },
  note: { marginTop: 12, fontSize: 12, color: "#666", textAlign: "center" },
});
