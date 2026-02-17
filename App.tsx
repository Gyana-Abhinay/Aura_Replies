import React, { useState, useCallback, useRef, useEffect, useMemo, ChangeEvent } from 'react';

// --- EXPANDED RANDOM ANSWERS ---
const randomAnswers = [
  "Aura answers only to its master.",
  "Not in the mood to answer.",
  "The ether is silent on this matter...",
  "The stars do not align for such a query.",
  "That is a question for another time.",
  "Seek the answer within yourself.",
  "The future is clouded, ask again later.",
  "Consult the void, for it holds what you seek.",
  "Energy signatures are unclear. Rephrase your petition.",
  "The path you walk is your own to discover.",
  "A whisper on the cosmic wind is your only reply.",
];

// --- BACKGROUND COMPONENTS ---

const Stars: React.FC = () => {
  const stars = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      brightness: Math.random() * 0.6 + 0.3,
    }))
    , []);

  return (
    <div className="stars">
      {stars.map(s => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            '--duration': `${s.duration}s`,
            '--delay': `${s.delay}s`,
            '--brightness': s.brightness,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

// --- CHILD COMPONENTS ---

const Header: React.FC = () => (
  <div className="header">
    <h1 className="header-title">Aura Replies</h1>
    <p className="header-subtitle">The digital ether speaks</p>
  </div>
);

const AuraCoreAnimation: React.FC<{ isThinking: boolean }> = ({ isThinking }) => (
  <div className={`aura-core ${isThinking ? 'thinking' : ''}`}>
    <div className="aura-ring aura-ring-1"></div>
    <div className="aura-ring aura-ring-2"></div>
    <div className="aura-ring aura-ring-3"></div>
    <div className="aura-ring aura-ring-4"></div>
    <div className="aura-spark"></div>
    <div className="aura-center-dot"></div>
  </div>
);

interface PetitionInputProps {
  petitionDisplay: string;
  isHiding: boolean;
  showAnswer: boolean;
  onPetitionInput: (newValue: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const PetitionInput: React.FC<PetitionInputProps> = ({
  petitionDisplay,
  isHiding,
  showAnswer,
  onPetitionInput,
  inputRef,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (showAnswer) return;
    onPetitionInput(e.target.value);
  };

  return (
    <div className="form-group input-wrapper">
      <label htmlFor="petition" className="form-label">Petition</label>

      {/* Proxy Display (Visual Text) */}
      <div className="proxy-display" aria-hidden="true">
        {petitionDisplay || (!isHiding && !showAnswer ? <span className="proxy-placeholder">Begin your petition...</span> : "")}
      </div>

      {/* Real Input (Password Type to kill suggestions) */}
      <input
        ref={inputRef}
        id="petition"
        name={`petition_${Math.random().toString(36).slice(2, 9)}`}
        type="password"
        className={`form-input real-password-input ${isHiding ? 'hiding-glow' : ''}`}
        value={petitionDisplay}
        onChange={handleChange}
        disabled={showAnswer}
        autoComplete="one-time-code"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        data-lpignore="true"
      />
    </div>
  );
};

interface AuraFormProps {
  petitionDisplay: string;
  question: string;
  isHiding: boolean;
  showAnswer: boolean;
  onPetitionInput: (newValue: string) => void;
  setQuestion: (value: string) => void;
  handleAskAura: () => void;
  petitionInputRef: React.RefObject<HTMLInputElement | null>;
}

const AuraForm: React.FC<AuraFormProps> = (props) => (
  <>
    <PetitionInput
      petitionDisplay={props.petitionDisplay}
      isHiding={props.isHiding}
      showAnswer={props.showAnswer}
      onPetitionInput={props.onPetitionInput}
      inputRef={props.petitionInputRef}
    />
    <div className="form-group">
      <label htmlFor="question" className="form-label">Question</label>
      <input
        id="question"
        type="text"
        name={`question_${Math.random().toString(36).slice(2, 9)}`}
        placeholder="Ask your question..."
        className="form-input"
        value={props.question}
        onChange={(e) => props.setQuestion(e.target.value)}
        disabled={props.showAnswer}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        data-lpignore="true"
      />
    </div>
    <button
      onClick={props.handleAskAura}
      disabled={!props.question || !props.petitionDisplay}
      className="ask-button"
    >
      Ask Aura
    </button>
  </>
);

interface AuraResponseProps {
  typedAnswer: string;
  isTyping: boolean;
  handleReset: () => void;
}

const AuraResponse: React.FC<AuraResponseProps> = ({ typedAnswer, isTyping, handleReset }) => (
  <div className="response-card">
    <p className="response-label">Aura's response</p>
    <p className="response-text">
      {typedAnswer}
      {isTyping && <span className="response-cursor" />}
    </p>
    <button onClick={handleReset} className="reset-button">
      Ask Another
    </button>
  </div>
);

const Footer: React.FC = () => (
  <div className="footer">
    <p>Developed by AuraTech Vision</p>
  </div>
);

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [petitionDisplay, setPetitionDisplay] = useState('');
  const [question, setQuestion] = useState('');
  const [hiddenAnswer, setHiddenAnswer] = useState('');
  const [isHiding, setIsHiding] = useState(false);

  const [finalAnswer, setFinalAnswer] = useState('');
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const hiddenAnswerRef = useRef(hiddenAnswer);
  const isHidingRef = useRef(isHiding);
  const petitionDisplayRef = useRef(petitionDisplay);
  const petitionInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { hiddenAnswerRef.current = hiddenAnswer; }, [hiddenAnswer]);
  useEffect(() => { isHidingRef.current = isHiding; }, [isHiding]);
  useEffect(() => { petitionDisplayRef.current = petitionDisplay; }, [petitionDisplay]);

  const PETITION_PHRASE = 'Aura please answer the following question.';

  // --- Typewriter Effect ---
  useEffect(() => {
    if (showAnswer && finalAnswer) {
      setTypedAnswer('');
      setIsTyping(true);
      if (finalAnswer.length > 0) {
        const interval = setInterval(() => {
          setTypedAnswer((prev) => {
            if (prev.length < finalAnswer.length) {
              return finalAnswer.substring(0, prev.length + 1);
            } else {
              clearInterval(interval);
              setIsTyping(false);
              return prev;
            }
          });
        }, 50);
        return () => clearInterval(interval);
      }
    }
  }, [finalAnswer, showAnswer]);

  // --- Mobile-compatible petition input handler ---
  const handlePetitionInput = useCallback((newValue: string) => {
    const currentDisplay = petitionDisplayRef.current;
    const currentHidden = hiddenAnswerRef.current;
    const hiding = isHidingRef.current;

    if (!hiding) {
      if (currentDisplay === '' && newValue === '.') {
        setIsHiding(true);
        setHiddenAnswer('');
        setPetitionDisplay(PETITION_PHRASE.substring(0, 1));
        requestAnimationFrame(() => {
          const input = petitionInputRef.current;
          if (input) {
            const len = PETITION_PHRASE.substring(0, 1).length;
            input.setSelectionRange(len, len);
          }
        });
        return;
      }
      setPetitionDisplay(newValue);
      return;
    }

    const lengthDiff = newValue.length - currentDisplay.length;

    if (lengthDiff < 0) {
      if (currentHidden.length > 0) {
        const newHidden = currentHidden.slice(0, -1);
        setHiddenAnswer(newHidden);
        const newDisplay = PETITION_PHRASE.substring(0, newHidden.length + 1);
        setPetitionDisplay(newDisplay);
        requestAnimationFrame(() => {
          const input = petitionInputRef.current;
          if (input) {
            input.setSelectionRange(newDisplay.length, newDisplay.length);
          }
        });
      } else {
        setIsHiding(false);
        setPetitionDisplay('');
      }
    } else if (lengthDiff > 0) {
      const addedChars = newValue.substring(currentDisplay.length);

      for (const char of addedChars) {
        if (char === '.') {
          const newDisplay = PETITION_PHRASE.substring(0, hiddenAnswerRef.current.length + 2);
          setIsHiding(false);
          setPetitionDisplay(newDisplay);
          requestAnimationFrame(() => {
            const input = petitionInputRef.current;
            if (input) {
              input.setSelectionRange(newDisplay.length, newDisplay.length);
            }
          });
          return;
        }
        const updatedHidden = hiddenAnswerRef.current + char;
        hiddenAnswerRef.current = updatedHidden;
        setHiddenAnswer(updatedHidden);

        if ((updatedHidden.length + 1) < PETITION_PHRASE.length) {
          const newDisplay = PETITION_PHRASE.substring(0, updatedHidden.length + 1);
          setPetitionDisplay(newDisplay);
          requestAnimationFrame(() => {
            const input = petitionInputRef.current;
            if (input) {
              input.setSelectionRange(newDisplay.length, newDisplay.length);
            }
          });
        } else {
          setIsHiding(false);
          setPetitionDisplay(PETITION_PHRASE);
          return;
        }
      }
    }
  }, []);

  const handleAskAura = () => {
    setIsThinking(true);
    setTimeout(() => {
      let answerToSet = '';
      if (hiddenAnswer) {
        answerToSet = hiddenAnswer;
      } else {
        const randomIndex = Math.floor(Math.random() * randomAnswers.length);
        answerToSet = randomAnswers[randomIndex];
      }
      setFinalAnswer(answerToSet);
      setIsThinking(false);
      setShowAnswer(true);
    }, 2500);
  };

  const handleReset = () => {
    setPetitionDisplay('');
    setQuestion('');
    setHiddenAnswer('');
    setFinalAnswer('');
    setTypedAnswer('');
    setIsHiding(false);
    setShowAnswer(false);
    setIsTyping(false);
  };

  return (
    <>
      {/* Background layers */}
      <div className="cosmic-bg" />
      <Stars />
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />
      <div className="floating-orb orb-3" />

      {/* Main content */}
      <div className="app-container">
        <div className="main-content">
          <AuraCoreAnimation isThinking={isThinking || showAnswer} />
          <div className="glass-card">
            <Header />
            {!showAnswer ? (
              <AuraForm
                petitionDisplay={petitionDisplay}
                question={question}
                isHiding={isHiding}
                showAnswer={showAnswer}
                onPetitionInput={handlePetitionInput}
                setQuestion={setQuestion}
                handleAskAura={handleAskAura}
                petitionInputRef={petitionInputRef}
              />
            ) : (
              <AuraResponse typedAnswer={typedAnswer} isTyping={isTyping} handleReset={handleReset} />
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default App;