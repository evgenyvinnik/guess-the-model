import logo from './assets/logo.png';

function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <img src={logo} alt="Guess The Model logo" className="w-64" />
    </div>
  );
}

export default Home;
