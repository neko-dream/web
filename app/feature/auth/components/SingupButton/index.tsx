import { useNavigate } from "react-router";
import GoogleLoginButton from "~/components/Button/template/GoogleLoginButton";

export default function SingupButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    const result = window.confirm("Googleの認証ページに飛びます。");
    if (result) {
      navigate("/api/redirecter/signup");
    }
  };

  return <GoogleLoginButton onClick={handleClick} />;
}
