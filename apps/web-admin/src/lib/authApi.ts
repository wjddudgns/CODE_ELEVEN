import { apiPost } from "./api";

export interface LoginRequest {
  username: string;
  password: string;
}

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

export interface SignupRequest {
  email: string;
  username: string;
  password: string;
  nickname: string;
}

export interface SignupResponse {
  message: string;
  user: {
    id: string;
    email: string;
    username: string;
    nickname: string;
  };
}

export const AuthApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // For development: mock response
    // Replace with real API when backend is ready
    if (process.env.NODE_ENV === "development") {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful login for testing
      if (data.username === "test" && data.password === "password") {
        return {
          accessToken: "mock_access_token_" + Date.now(),
          refreshToken: "mock_refresh_token_" + Date.now(),
          user: {
            id: "1",
            email: "test@example.com",
            username: "test",
            nickname: "Test User"
          }
        };
      } else {
        throw new Error("Invalid username or password");
      }
    }

    // Production: real API call
    return apiPost("/auth/login", data);
  },

  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    // For development: mock response
    if (process.env.NODE_ENV === "development") {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful registration
      return {
        message: "Registration successful",
        user: {
          id: Date.now().toString(),
          email: data.email,
          username: data.username,
          nickname: data.nickname
        }
      };
    }

    // Production: real API call
    return apiPost("/auth/signup", data);
  },

  refreshToken: async (token: string): Promise<{ accessToken: string; refreshToken: string }> => {
    // For development: mock response
    if (process.env.NODE_ENV === "development") {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        accessToken: "mock_refreshed_access_token_" + Date.now(),
        refreshToken: "mock_refreshed_refresh_token_" + Date.now()
      };
    }

    // Production: real API call
    return apiPost("/auth/refresh", { token });
  },
};
