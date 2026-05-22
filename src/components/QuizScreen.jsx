export default function QuizScreen({ step, total, question, onSelect }) {
  if (!question) return null;

  const progressPct = Math.round((step / total) * 100);

  return (
    <div className="screen quiz">
      <div className="quiz-header">
        <div className="quiz-progress-row">
          <span className="quiz-step">
            {step + 1} <span className="quiz-step-total">/ {total}</span>
          </span>
          <span className="quiz-category">{question.category}</span>
        </div>
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <h2 className="quiz-question">{question.question}</h2>

      <div className="quiz-options">
        {question.options.map((opt, i) => (
          <button
            key={i}
            className="quiz-option"
            onClick={() => onSelect(opt)}
          >
            <span className="quiz-option-index">{String.fromCharCode(65 + i)}</span>
            <span className="quiz-option-label">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
