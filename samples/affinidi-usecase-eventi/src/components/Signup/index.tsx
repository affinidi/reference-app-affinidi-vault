import { useRouter } from "next/router";
import * as S from "./index.styled";
import Link from "next/link";

const Signup = () => {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/signupnext");
  };

  return (
    <S.Wrapper>
      <S.TopOptions>
        Create an account : Step 1 of 4
        <S.FormContainer>
          <form>
            <label htmlFor="firstName"> Your name </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="First and Last Name"
            />
            <label htmlFor="email"> Email </label>
            <input type="email" name="email" id="email" required />
            <label htmlFor="password"> Password </label>
            <input
              type="text"
              name="password"
              id="password"
              placeholder="Atleast 6 characters"
              readOnly
            />

            <label htmlFor="cpassword"> Reenter Password</label>
            <input
              type="text"
              name="cpassword"
              id="cpassword"
              value=""
              readOnly
            />
            <img src="/images/captcha.png" />
            <button
              type="submit"
              className="hover:bg-black bg-gray-600 rounded text-white py-1 mt-4 w-full"
              onClick={handleContinue}
            >
              Continue
            </button>
          </form>
        </S.FormContainer>
        <hr />
        <span>
          By creating an account, you agree to this websites
          <br />
          <Link href="/">Conditions of Use</Link> and
          <Link href="/">Privacy Notice.</Link>
        </span>
        <br />
        <br />
        <hr />
        <span>
          Already have an account ? <Link href="/">Sign in</Link>
        </span>
      </S.TopOptions>
    </S.Wrapper>
  );
};

export default Signup;
