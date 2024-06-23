import React from "react";
import Card from "../Card/Card";
import "../Home.scss";

const QuizEnd: React.FC = () => {
  return (
    <div className="end">
      <h1 style={{ color: "white", textAlign: "center" }}>
        Nous aussi on à fait le test
      </h1>
      <Card width={316} height={138}>
        <iframe src="https://www.youtube.com/watch?v=lsuji4pm5OY"></iframe>
      </Card>
      <div>
        <p>Vous pouvez aussi nous rejoindre sur:</p>
        <ul>
          <li>link</li>
          <li>link</li>
        </ul>
      </div>
    </div>
  );
};

export default QuizEnd;
