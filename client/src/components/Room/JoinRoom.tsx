import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";
import Button from "../Buttons/Button";
import InputComponent from "../Input/Input";
import "./joinroom.scss";

const JoinRoom: React.FC = () => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const joinRoom = () => {
    socket.emit("checkRoom", roomId, (roomExists: boolean) => {
      if (roomExists) {
        socket.emit("joinRoom", { roomId, userName });
        console.log("Join room emitted:", { roomId, userName });
        navigate(`/room/${roomId}`);
      } else {
        setErrorMessage("La session n'existe pas.");
      }
    });
  };

  return (
    <div className="joinroom">
      <h3>Rejoindre une session</h3>
      <InputComponent
        placeholder="ID de la session"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />

      <InputComponent
        placeholder="Votre prénom"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <Button text="Rejoindre" onClick={joinRoom} />
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default JoinRoom;
