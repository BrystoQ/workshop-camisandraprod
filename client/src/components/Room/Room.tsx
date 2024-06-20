import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Params } from "react-router-dom";
import {
  woytQuestions,
  compatibilityQuestions,
} from "../../constants/questions";
import socket from "../../socket";
import Quiz1 from "../Quiz/Quiz1";
import Quiz2 from "../Quiz/Quiz2";
import QRCode from "qrcode.react";
import Button from "../Buttons/Button";
import "./room.scss";

const Room: React.FC = () => {
  const { roomId } = useParams<Params<string>>();
  const navigate = useNavigate();
  const [users, setUsers] = useState<string[]>([]);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [gameId, setGameId] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [copySuccess, setCopySuccess] = useState("");

  const MIN_PLAYERS_QUIZ1 = 2;
  const MIN_PLAYERS_QUIZ2 = 2;

  useEffect(() => {
    socket.on("updateRoom", ({ userName, action }) => {
      setUsers((prevUsers) => {
        if (action === "joined") {
          return [...prevUsers, userName];
        } else if (action === "left") {
          return prevUsers.filter((user) => user !== userName);
        } else {
          return prevUsers;
        }
      });
    });

    socket.on("roomUsers", (usersInRoom) => {
      setUsers(usersInRoom);
    });

    socket.on("roomCreator", (creatorId) => {
      setIsCreator(socket.id === creatorId);
    });

    socket.on("gameChosen", (chosenGameId) => {
      setGameId(chosenGameId);
    });

    socket.on("startSession", (totalQuestions) => {
      setSessionStarted(true);
      setTotalQuestions(totalQuestions);
    });

    return () => {
      socket.off("updateRoom");
      socket.off("roomUsers");
      socket.off("roomCreator");
      socket.off("gameChosen");
      socket.off("startSession");
    };
  }, []);

  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      if (users.length === 0) {
        navigate("/start");
      }
    }, 4000); // Délai de 2 secondes avant la redirection

    return () => clearTimeout(redirectTimeout);
  }, [users, navigate]);

  const startSession = () => {
    if (
      (gameId === "quiz2" && users.length !== MIN_PLAYERS_QUIZ2) ||
      (gameId === "quiz1" && users.length < MIN_PLAYERS_QUIZ1)
    ) {
      alert("Nombre de joueurs insuffisant pour démarrer la session.");
      return;
    }

    const totalQuestions =
      gameId === "quiz1" ? woytQuestions.length : compatibilityQuestions.length;
    socket.emit("startSession", roomId, totalQuestions);
  };

  const renderQuiz = () => {
    if (gameId === "quiz1") {
      return <Quiz1 users={users} />;
    } else if (gameId === "quiz2") {
      return <Quiz2 users={users} />;
    } else {
      return <div>Invalid game ID</div>;
    }
  };

  const roomLink = `${window.location.origin}/join/${roomId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomLink).then(
      () => {
        setCopySuccess("Link copied!");
        setTimeout(() => setCopySuccess(""), 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const minPlayers = gameId === "quiz2" ? MIN_PLAYERS_QUIZ2 : MIN_PLAYERS_QUIZ1;

  return (
    <div className="room">
      {!sessionStarted && (
        <div>
          <h3>
            Partagez ce lien avec votre moitié et découvrez si vous êtes
            vraiment faits l’un pour l’autre !
          </h3>
          <QRCode value={roomLink} />
          <Button
            text={roomLink}
            onClick={() => {
              copyToClipboard();
            }}
            width={400}
          />

          <ul>
            {users.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
          <p>Nombre minimum de joueurs requis: {minPlayers}</p>
          {isCreator && (
            <Button text="Match Time!" onClick={startSession} width={300} />
          )}
        </div>
      )}
      {sessionStarted && renderQuiz()}
    </div>
  );
};

export default Room;
