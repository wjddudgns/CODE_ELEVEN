import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthApi } from "./lib/authApi";
import { useUserStore } from "./store/user";
import "./Auth.css";

// 로그인 페이지 컴포넌트
export default function Login() {
  const navigate = useNavigate();
  const { login } = useUserStore();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 입력 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 로그인 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // API를 통해 로그인 시도
      const response = await AuthApi.login({
        username: formData.username,
        password: formData.password,
      });

      // 로컬 스토리지에 토큰 저장
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      // 사용자 상태 저장소 업데이트
      login({
        id: response.user.id,
        email: response.user.email,
        username: response.user.username,
        nickname: response.user.nickname,
        token: response.accessToken,
        refreshToken: response.refreshToken,
      });

      // 홈 페이지로 이동
      navigate("/");
    } catch (err: any) {
      // 에러 메시지 설정
      setError(err.message || "로그인에 실패했습니다. 자격 증명을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>WriteFlow 로그인</h2>
          <p>당신의 감정 일기에 접속하세요</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">
              사용자 이름
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="사용자 이름을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            계정이 없으신가요?{" "}
            <button
              type="button"
              className="auth-switch-button"
              onClick={() => navigate("/signup")}
            >
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
