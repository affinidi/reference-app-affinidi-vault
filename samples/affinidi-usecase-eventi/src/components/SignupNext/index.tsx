import Link from "next/link";
import * as S from "../Signup/index.styled";

const Signup = () => {
  return (
    <S.Wrapper>
      <S.TopOptions>
        Step 2 of 4
        <S.FormContainer>
          <form>
            <label htmlFor="firstName"> Phone Number </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Country Code + Phone Number"
            />
            <label htmlFor="email"> Address </label>
            <input type="email" name="email" id="email" required />
            <label htmlFor="password"> City </label>
            <input
              type="text"
              name="password"
              id="password"
              placeholder=""
              readOnly
            />

            <label htmlFor="cpassword"> Country </label>
            <input
              type="text"
              name="cpassword"
              id="cpassword"
              value=""
              readOnly
            />
            <label htmlFor="cpassword"> Postal Code </label>
            <input
              type="text"
              name="cpassword"
              id="cpassword"
              value=""
              placeholder="Numerics Only"
              readOnly
            />

            <button
              type="submit"
              className="hover:bg-black bg-gray-600 rounded text-white py-1 mt-4 w-full"
            >
              Continue
            </button>
          </form>
        </S.FormContainer>
        <hr />
        <span>
          By creating an account, you agree to website
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
