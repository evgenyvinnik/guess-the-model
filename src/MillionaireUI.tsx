import questionImage from './assets/question.png';

function MillionaireUI() {
  const answers = ['Humanity', 'Health', 'Honor', 'Household'];
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-b from-indigo-950 to-blue-900 p-4 text-white">
      <img
        src={questionImage}
        alt="Question subject"
        className="h-32 w-32 rounded-full object-cover"
      />
      <div className="w-full max-w-2xl">
        <div className="btn btn-primary pointer-events-none w-full text-center">
          In the UK, the abbreviation NHS stands for National what Service?
        </div>
      </div>
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
        {answers.map((answer) => (
          <button
            key={answer}
            type="button"
            className="btn btn-outline btn-primary w-full"
          >
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MillionaireUI;
