import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthApi } from "./lib/authApi";
import "./Auth.css";

// 회원가입 페이지 컴포넌트
export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    nickname: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 입력 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 유효성 검사
  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다");
      return false;
    }
    if (formData.password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("유효한 이메일 주소를 입력해주세요");
      return false;
    }
    return true;
  };

  // 회원가입 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // API를 통해 회원가입 시도
      await AuthApi.signup({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        nickname: formData.nickname,
      });

      setSuccess("계정이 성공적으로 생성되었습니다! 지금 로그인하세요.");

      // 폼 초기화
      setFormData({
        email: "",
        username: "",
        password: "",
        nickname: "",
        confirmPassword: "",
      });

      // 2초 후 자동으로 로그인 페이지로 이동
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>계정 만들기</h2>
          <p>당신의 감정 여정을 시작하세요</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">
              이메일 *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">
              사용자 이름 *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="사용자 이름을 선택하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="nickname">
              표시 이름 *
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              required
              placeholder="다른 사람들이 볼 이름"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              비밀번호 *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="최소 6자 이상"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              비밀번호 확인 *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "계정 생성 중..." : "회원가입"}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            이미 계정이 있으신가요?{" "}
            <button
              type="button"
              className="auth-switch-button"
              onClick={() => navigate("/login")}
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
