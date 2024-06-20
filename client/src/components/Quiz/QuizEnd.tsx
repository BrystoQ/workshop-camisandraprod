import React from "react";
import Card from "../Card/Card";

const QuizEnd: React.FC = () => {
  return (
    <div>
      <h1>Quiz End</h1>
      <p>Nous aussi on à fait le test</p>
      <Card width={316} height={138}>
        <iframe src="https://www.youtube.com/watch?v=lsuji4pm5OY"></iframe>
      </Card>
      <div>
        <ul>
          <li>link</li>
          <li>link</li>
          <li>link</li>
          <li>link</li>
        </ul>
      </div>
    </div>
  );
};

export default QuizEnd;
