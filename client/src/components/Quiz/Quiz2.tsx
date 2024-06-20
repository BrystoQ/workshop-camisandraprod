import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Buttons/Button";
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
    console.log("answer event emitted:", {
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
      console.log(
        "handlePreviousResult: currentQuestionIndex",
        currentQuestionIndex - 1
      );
    }
  };

  useEffect(() => {
    console.log("Quiz2 State:", {
      questions,
      answers,
      currentQuestionIndex,
      allQuestionsCompleted,
      results,
      isCreator,
      userAnswered,
      users,
    });
  }, [
    questions,
    answers,
    currentQuestionIndex,
    allQuestionsCompleted,
    results,
    isCreator,
    userAnswered,
    users,
  ]);

  useEffect(() => {
    if (allQuestionsCompleted) {
      navigate("/end");
    }
  }, [allQuestionsCompleted, navigate]);

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
          <div className="progress-counter">
            Question {currentQuestionIndex + 1} / {questions.length}
          </div>
          <Card width={316} height={138}>
            <div className="question">
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

      {allQuestionsCompleted && results && (
        <div>
          <div className="progress-counter">
            Résultat {currentQuestionIndex + 1} / {results.length}
          </div>
          <div key={`result-${currentQuestionIndex}`}>
            <div className="question">
              {results[currentQuestionIndex]?.question}
            </div>
            {results[currentQuestionIndex]?.answers &&
              Object.entries(results[currentQuestionIndex].answers).map(
                ([player, answer], index) => (
                  <p key={index}>
                    {player}: {answer}
                  </p>
                )
              )}
          </div>
          {isCreator && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "16px",
              }}
            >
              <button
                onClick={handlePreviousResult}
                disabled={currentQuestionIndex === 0}
              >
                Précédent
              </button>
              <button
                onClick={handleNextResult}
                disabled={currentQuestionIndex === results.length - 1}
              >
                Suivant
              </button>
            </div>
          )}
          {currentQuestionIndex === results.length - 1 && (
            <div>
              <div>Vous êtes compatible à {calculateCompatibility()}%</div>
            </div>
          )}
        </div>
      )}

      {users.length > 0 && (
        <div>
          <div className="users">
            <div className="users__title">Participants</div>
            <div className="users__list">
              {users.map((user, index) => (
                <div key={index}>{user}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz2;
