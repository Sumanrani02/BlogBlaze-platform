import Template from "../Template";
import loginImg from "../../assets/login.png";

function Login() {
  const handleLoginSuccess = () => {
    // In a real app, this would redirect to a dashboard or home page
    console.log("Login successful, would typically redirect now.");
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
