import React, { ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/Room/JoinRoom";
import JoinRoomWithId from "./components/Room/JoinRoomWithId";
import Room from "./components/Room/Room";
import QuizEnd from "./components/Quiz/QuizEnd";
import Start from "./components/Start";
import "./index.scss"; // Assurez-vous de lier le fichier SCSS

interface BubbleBackgroundProps {
  children: ReactNode;
}

const BubbleBackground: React.FC<BubbleBackgroundProps> = ({ children }) => {
  const bubbles = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="root">
      {bubbles.map((bubble) => (
        <div key={bubble} className={`bubble bubble-${bubble}`} />
      ))}
      <div className="main">{children}</div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BubbleBackground>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start" element={<Start />} />
        <Route path="/create-room/:gameId" element={<CreateRoom />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/join/:roomId" element={<JoinRoomWithId />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/end" element={<QuizEnd />} />
      </Routes>
    </BubbleBackground>
  );
};

export default App;
