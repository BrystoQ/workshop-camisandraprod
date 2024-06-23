import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Buttons/Button";
import ButtonNext from "../Buttons/ButtonNext";
import { compatibilityQuestions } from "../../constants/questions";
import Card from "../Card/Card";
import socket from "../../socket";
import "./quiz-woyt.css";
import "./question.css";

interface Quiz2Props {
  users: string[];
}

const Quiz2: React.FC<Quiz2Props> = ({ users }) => {
  const [questions, setQuestions] = useState<
    { question: string; answers: string[] }[]
  >([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [allQuestionsCompleted, setAllQuestionsCompleted] = useState(false);
  const [results, setResults] = useState<
    { question: string; answers: { [key: string]: string } }[] | undefined
  >();
  const [isCreator, setIsCreator] = useState(false);
  const [userAnswered, setUserAnswered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const data = compatibilityQuestions;
    setQuestions(data);

    socket.on("roomCreator", (creatorId: string) => {
      const isCreatorNow = socket.id === creatorId;
      setIsCreator(isCreatorNow);
      console.log("roomCreator event received:", creatorId);
      console.log("isCreator state set to:", isCreatorNow);
    });

    socket.on("updateAnswers", (updatedAnswers: { [key: string]: string }) => {
      setAnswers(updatedAnswers);
      setUserAnswered(updatedAnswers[socket.id] !== undefined);
      console.log("updateAnswers event received:", updatedAnswers);
    });

    socket.on("nextQuestion", (nextQuestionIndex: number) => {
      setCurrentQuestionIndex(nextQuestionIndex);
      setUserAnswered(false);
      console.log("nextQuestion event received:", nextQuestionIndex);
    });

    socket.on(
      "endQuiz",
      (finalAnswers: { [key: string]: { [key: string]: string } }) => {
        if (questions.length > 0) {
          const newResults = Object.keys(finalAnswers).map((index) => ({
            question: questions[parseInt(index)].question,
            answers: finalAnswers[index],
          }));
          setResults(newResults);
          setAllQuestionsCompleted(true);
          setCurrentQuestionIndex(0); // Reset to first question for displaying results in order
          console.log("endQuiz event received:", newResults);
        }
      }
    );

    socket.on(
      "startResult",
      (results: { question: string; answers: { [key: string]: string } }[]) => {
        setResults(results);
        setAllQuestionsCompleted(true);
        console.log("startResult event received:", results);
      }
    );

    return () => {
      socket.off("roomCreator");
      socket.off("updateAnswers");
      socket.off("nextQuestion");
      socket.off("endQuiz");
      socket.off("startResult");
    };
  }, [questions]);

  const handleSelection = (value: string) => {
    const newAnswers = { ...answers, [socket.id]: value };
    setAnswers(newAnswers);
    setUserAnswered(true);
    socket.emit("answer", {
      questionIndex: currentQuestionIndex,
      answer: value,
    });
  };

  const handleNextResult = () => {
    if (results && currentQuestionIndex < results.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      console.log(
        "handleNextResult: currentQuestionIndex",
        currentQuestionIndex + 1
      );
    }
  };

  const handlePreviousResult = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const calculateCompatibility = () => {
    let equalAnswers = 0;
    if (results) {
      results.forEach((result) => {
        const answerValues = Object.values(result.answers);
        if (answerValues.every((answer) => answer === answerValues[0])) {
          equalAnswers++;
        }
      });
    }
    const compatibilityPercentage = (equalAnswers / questions.length) * 100;
    return compatibilityPercentage;
  };

  return (
    <div>
      {!allQuestionsCompleted && (
        <div key={currentQuestionIndex}>
          <div className="progress-counter-bg1">
            <div className="progress-counter-bg2">
              <div className="progress-counter">
                {currentQuestionIndex + 1} / {questions.length}
              </div>
            </div>
          </div>
          <Card width={316} height={138}>
            <div className="question">Qui de nous :</div>
            <div className="question__specific">
              {questions[currentQuestionIndex]?.question}
            </div>
          </Card>
          <div className="answers">
            {questions[currentQuestionIndex]?.answers?.map((answer, index) => (
              <Button
                width={350}
                text={answer}
                key={index}
                onClick={() => handleSelection(answer)}
              />
            ))}
          </div>
        </div>
      )}

      {allQuestionsCompleted && results && results.length > 0 && (
        <div>
          <div className="progress-counter-bg1">
            <div className="progress-counter-bg2">
              <div className="progress-counter">
                {currentQuestionIndex + 1} / {results.length}
              </div>
            </div>
          </div>
          <div key={`result-${currentQuestionIndex}`}>
            <Card
              width={316}
              height={138}
              key={`result-${currentQuestionIndex}`}
            >
              <div className="question">Qui de nous</div>
              <div className="question__specific">
                {results[currentQuestionIndex]?.question}
              </div>
            </Card>
            <p>
              {results[currentQuestionIndex]?.answers &&
                Object.entries(results[currentQuestionIndex].answers).map(
                  ([user, answer], index) => (
                    <span
                      key={index}
                      style={{
                        fontSize: "1.5rem",
                      }}
                    >
                      {user}
                      <Card width={316} height={138}>
                        {answer}
                      </Card>
                    </span>
                  )
                )}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center", // Center-align the next button
              marginTop: "16px",
            }}
          >
            {currentQuestionIndex < results.length - 1 && (
              <ButtonNext
                onClick={handleNextResult}
                disabled={currentQuestionIndex === results.length - 1}
              />
            )}
          </div>
          {currentQuestionIndex === results.length - 1 && (
            <div>
              <div>Vous êtes compatible à {calculateCompatibility()}%</div>
              <button onClick={() => navigate("/end")}>Fin</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz2;
