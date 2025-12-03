import { apiPost } from "./api";

// 로그인 요청 인터페이스
export interface LoginRequest {
  username: string;
  password: string;
}

// 로그인 응답 인터페이스
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    nickname: string;
  };
}

// 회원가입 요청 인터페이스
export interface SignupRequest {
  email: string;
  username: string;
  password: string;
  nickname: string;
}

// 회원가입 응답 인터페이스
export interface SignupResponse {
  message: string;
  user: {
    id: string;
    email: string;
    username: string;
    nickname: string;
  };
}

// 인증 API 함수들
export const AuthApi = {
  // 로그인 함수
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // 개발 환경: 모의 응답
    if (process.env.NODE_ENV === "development") {
      // 네트워크 지연 모의
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 테스트용 모의 로그인
      if (data.username === "test" && data.password === "password") {
        return {
          accessToken: "mock_access_token_" + Date.now(),
          refreshToken: "mock_refresh_token_" + Date.now(),
          user: {
            id: "1",
            email: "test@example.com",
            username: "test",
            nickname: "테스트 사용자"
          }
        };
      } else {
        throw new Error("잘못된 사용자 이름 또는 비밀번호입니다.");
      }
    }

    // 프로덕션: 실제 API 호출
    return apiPost("/auth/login", data);
  },

  // 회원가입 함수
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    // 개발 환경: 모의 응답
    if (process.env.NODE_ENV === "development") {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 모의 회원가입 성공
      return {
        message: "회원가입이 성공적으로 완료되었습니다.",
        user: {
          id: Date.now().toString(),
          email: data.email,
          username: data.username,
          nickname: data.nickname
        }
      };
    }

    // 프로덕션: 실제 API 호출
    return apiPost("/auth/signup", data);
  },

  // 토큰 갱신 함수
  refreshToken: async (token: string): Promise<{ accessToken: string; refreshToken: string }> => {
    // 개발 환경: 모의 응답
    if (process.env.NODE_ENV === "development") {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        accessToken: "mock_refreshed_access_token_" + Date.now(),
        refreshToken: "mock_refreshed_refresh_token_" + Date.now()
      };
    }

    // 프로덕션: 실제 API 호출
    return apiPost("/auth/refresh", { token });
  },
};
