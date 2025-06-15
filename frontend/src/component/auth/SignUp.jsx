import Template from "../Template";
import signupImg from "../../assets/signup.png";

function SignUp() {
  const handleSignUpSuccess = () => {
    setFormType("login");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-light font-[Inter]">
      <Template
        title="Join BlogBlaze - Ignite Your Blogging Journey"
        description1="Express your thoughts, build your audience, and grow your influence."
        imagePlaceholderUrl={signupImg}
        formType="signup"
        onSignUpSuccess={handleSignUpSuccess}
      />
    </div>
  );
}

export default SignUp;
