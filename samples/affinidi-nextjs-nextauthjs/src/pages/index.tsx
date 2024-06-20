const Home = () => {
  return (
    <>
      <h1 className="text-2xl font-semibold pb-6">
        Welcome to Affinidi Sample Application
      </h1>
      <p className="pb-4 text-xl">This app showcases how to:</p>
      <ul className="grid gap-2 text-lg">
        <li>- Integrate Affinidi Login using NextAuth.js</li>
        <li>- Issue credentials to Affinidi Vault</li>
        <li>- Query credentials through Affinidi Iota Framework</li>
      </ul>
    </>
  );
};

export default Home;
