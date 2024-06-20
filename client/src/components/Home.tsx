import Button from "./Buttons/Button";
import { logo } from "../assets";
import { useNavigate } from "react-router-dom";
import "./Home.scss";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h1>Zouhieir & Kassandra !</h1>
      <img src={logo} alt="logo Camissandra" width={300} height={300} />
      <Button width={300} text="Commencer" onClick={() => navigate("/start")} />
      <p>Testez Votre Amour Sans Pression !</p>
    </div>
  );
};

export default Home;
