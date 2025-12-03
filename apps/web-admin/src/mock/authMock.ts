export const mockAuth = {
  login: async (username: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username === "test" && password === "password") {
      return {
        accessToken: "mock_jwt_token_12345",
        refreshToken: "mock_refresh_token_67890",
        user: {
          id: "1",
          email: "test@example.com",
          username: "test",
          nickname: "test user 1"
        }
      };
    } else {
      throw new Error("Invalid credentials");
    }
  },

  signup: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      message: "Account created successfully",
      user: {
        id: Date.now().toString(),
        email: data.email,
        username: data.username,
        nickname: data.nickname
      }
    };
  }
};
