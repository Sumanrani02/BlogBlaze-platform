import Template from "../Template";
import loginImg from "../../assets/login.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Login() {
  const {isAuthenticated,user: reduxUser } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();

  
  const handleLoginSuccess = (loggedInUser) => {
    if (loggedInUser && loggedInUser.isAdmin) { 
      navigate("/admin-dashboard");
    } else {
      navigate("/");
    }
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
