import logo from './assets/logo.png';
import SvgButton from './SvgButton.tsx';

function MillionaireUI() {
  const answers = ['Humanity', 'Health', 'Honor', 'Household'];
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-b from-indigo-950 to-blue-900 p-4 text-white">
      <img src={logo} alt="Millionaire logo" className="w-32" />
      <SvgButton
        label="In the UK, the abbreviation NHS stands for National what Service?"
        width={700}
        disabled
        className="pointer-events-none"
      />
      <div className="grid grid-cols-2 gap-4">
        {answers.map((answer) => (
          <SvgButton key={answer} label={answer} width={340} />
        ))}
      </div>
    </div>
  );
}

export default MillionaireUI;
