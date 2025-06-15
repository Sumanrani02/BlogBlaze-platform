import Template from "../Template";
import loginImg from "../../assets/login.png";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate("/");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-light font-[Inter]">
      <Template
        title="Welcome Back to BlogBlaze"
        description1="Share your stories, inspire others, and spark conversations."
        imagePlaceholderUrl={loginImg}
        formType="login"
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default Login;
