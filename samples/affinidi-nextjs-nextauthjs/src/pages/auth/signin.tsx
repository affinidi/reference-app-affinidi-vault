import { useRouter } from "next/router";

const SignInPage = () => {
  const router = useRouter();
  // Verbatim Auth0 error_description forwarded by middleware as `message`.
  const raw = router.query.message;
  const message = Array.isArray(raw) ? raw[0] : raw;

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold pb-6">Sign in</h1>

      {message ? (
        <div
          role="alert"
          className="mb-6 p-4 border border-red-300 bg-red-50 text-red-700 rounded-md"
        >
          {message}
        </div>
      ) : (
        <p className="pb-4">
          Use the login options in the top navigation bar to sign in.
        </p>
      )}
    </div>
  );
};

export default SignInPage;
