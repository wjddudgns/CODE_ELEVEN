import { create } from "zustand";
import { persist } from "zustand/middleware";

// 사용자 인터페이스 정의
interface User {
  id: string;
  email: string;
  username: string;
  nickname: string;
  token?: string;
  refreshToken?: string;
}

// 사용자 상태 저장소 인터페이스
interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
}

// 사용자 상태 저장소 생성
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 로그인 함수: 사용자 데이터 저장
      login: (userData) => {
        // localStorage에 토큰 저장
        if (userData.token) {
          localStorage.setItem("accessToken", userData.token);
        }
        if (userData.refreshToken) {
          localStorage.setItem("refreshToken", userData.refreshToken);
        }

        set({
          user: userData,
          isAuthenticated: true,
          error: null
        });
      },

      // 로그아웃 함수: 모든 데이터 초기화
      logout: () => {
        // localStorage에서 토큰 제거
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("token"); // A 부분 호환성

        set({
          user: null,
          isAuthenticated: false,
          error: null
        });
      },

      // 사용자 정보 업데이트
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      // 에러 메시지 초기화
      clearError: () => set({ error: null }),
    }),
    {
      name: "user-storage", // localStorage 키 이름
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
