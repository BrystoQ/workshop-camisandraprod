import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../socket";
import InputComponent from "./Input/Input";
import Button from "./Buttons/Button";

interface RouteParams {
  gameId: string;
}

const CreateRoom: React.FC = () => {
  const { gameId } = useParams<RouteParams>();
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    const roomId = Math.random().toString(36).substring(7);
    socket.emit("createRoom", { roomId, userName, gameId });
    console.log("Create room emitted:", { roomId, userName, gameId });
    navigate(`/room/${roomId}`);
  };

  return (
    <div>
      <InputComponent
        placeholder="Votre prénom"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        width={300}
      />
      <div style={{ position: "absolute", bottom: "10%" }}>
        <Button text="C'est parti !" onClick={createRoom} width={300} />
      </div>
    </div>
  );
};

export default CreateRoom;
