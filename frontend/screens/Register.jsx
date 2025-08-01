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
import { register as apiRegister } from "../services/api"; // 백엔드 api (없으면 모킹 가능)

export default function Register({ navigation }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "", name: "" },
  });

  const onSubmit = async (data) => {
    try {
      // 실제 API 있으면 호출
      await apiRegister({
        email: data.email,
        password: data.password,
        name: data.name,
      });
      Alert.alert("회원가입 성공", "이제 로그인해줘!");
      navigation.replace("Login");
    } catch (e) {
      Alert.alert("회원가입 실패", e.message || "알 수 없는 오류");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>

      <Controller
        control={control}
        name="name"
        rules={{ required: "이름 입력해줘" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="이름"
            value={value}
            onChangeText={onChange}
            style={[styles.input, errors.name && styles.errorInput]}
          />
        )}
      />
      {errors.name && (
        <Text style={styles.errorText}>{errors.name.message}</Text>
      )}

      <Controller
        control={control}
        name="email"
        rules={{
          required: "이메일을 입력하세요.",
          pattern: { value: /\S+@\S+\.\S+/, message: "이메일 형식이 아니야" },
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
          minLength: { value: 6, message: "6자리 이상이어야 합니다." },
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
        title={isSubmitting ? "로딩..." : "가입하기"}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      />

      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>로그인하러가기</Text>
        </TouchableOpacity>
      </View>
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
  row: { flexDirection: "row", justifyContent: "center", marginTop: 12 },
  linkText: { color: "#0066cc" },
});
