export async function register({ email, password, name }) {
  // 여기에 실제 API 호출 코드 넣으면 됨.
  // 지금은 간단히 모킹:
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

export async function savePreference(preference, token) {
  // 실제 서버에 취향 저장 API 호출 코드 넣기
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

/*
import axios from 'axios';

const BASE_URL = 'https://backend.com/api'; // 백엔드 주소로 바꾸기

export async function login({ email, password }) {
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      email,
      password,
    });
    return response.data; // 보통 { token, user } 이런 형태일 것
  } catch (error) {
    // 에러 처리 (네트워크 오류나 401 같은 에러)
    throw error.response?.data || { message: '서버 오류 발생' };
  }
}
*/
