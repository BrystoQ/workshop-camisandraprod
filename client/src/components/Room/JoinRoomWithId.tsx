import React, { useState } from "react";
import { useNavigate, useParams, Params } from "react-router-dom";
import socket from "../../socket";
import Button from "../Buttons/Button";
import InputComponent from "../Input/Input";
import "./joinroom.scss";

const JoinRoomWithId: React.FC = () => {
  const { roomId } = useParams<Params<string>>();
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const joinRoom = () => {
    if (userName.trim() === "") {
      alert("Veuillez entrer un prénom.");
      return;
    }

    socket.emit("joinRoom", { roomId, userName });
    console.log("Join room emitted:", { roomId, userName });
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="joinroom">
      <h3>Rejoindre la session: {roomId}</h3>
      <InputComponent
        placeholder="Votre prénom"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <div style={{ position: "absolute", bottom: "10%" }}>
        <Button text="Rejoindre" onClick={joinRoom} width={300} />
      </div>
    </div>
  );
};

export default JoinRoomWithId;
