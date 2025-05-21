import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("access_token"); // hoặc 'token' tùy backend bạn trả về
    if (token) {
      localStorage.setItem("access_token", token);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [location, navigate]);
  return <div>Đang xử lý đăng nhập...</div>;
};

export default OAuth2RedirectHandler;