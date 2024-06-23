import React from "react";
import Button from "./Buttons/Button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { gameList } from "../constants/games";
import "./start.scss";

interface Game {
  name: string;
  picture: string;
  id: string;
}

const Start: React.FC = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const data: Game[] = gameList;
    setGames(data);
  }, []);

  const handleGameSelect = (gameId: string) => {
    navigate(`/create-room/${gameId}`);
  };

  return (
    <div className="start">
      <h1>Romance Radar : Votre Couple Passe-t-il les Tests ?</h1>
      {games &&
        games.map((game: Game) => (
          <div
            className="game"
            key={game.name}
            onClick={() => handleGameSelect(game.id)}
          >
            <img src={game.picture} alt={game.name} width={100} height={100} />
            <h3 style={{ color: "#5b1cae" }}>{game.name}</h3>
          </div>
        ))}
      <div>
        <Button
          text="Rejoindre une partie"
          onClick={() => navigate("/join")}
          width={340}
        />
      </div>
    </div>
  );
};

export default Start;
