import { useContext, useState } from "react"
import './Home.scss';
import { GameContext } from "../../Context";
import { useNavigate } from "react-router-dom";

function Home() {
  const context = useContext(GameContext);
  const navigate = useNavigate();

  const playersChange = (e) => {
    const value = parseInt(e.target.value, 10);
    context.setSelectedPlayers(value); 
  }

  const gridChange = (e) => {
    const value = e.target.value;
    context.setGridSize(value);     
  }

  function updatePlayerName(index, newName) {
    context.setPlayers((prevPlayers) =>
      prevPlayers.map((player, i) =>
        i === index ? { ...player, name: newName } : player
      )
    );
  }
  
  return (
    <>
      <h1 className="title">Grid Game</h1>

      <select className="players-select" value={context.selectedPlayers} onChange={playersChange}>
        <option value="2">2 Players</option>
        <option value="3">3 Players</option>
        <option value="4">4 Players</option>
      </select>

      <div className="players-container">
      {
        context.players.map((player, index) => 
          <input
            className={`player-${index + 1}`}
            key={index} 
            type="text" 
            placeholder={player.name} 
            onChange={(e) => updatePlayerName(index, e.target.value)}/>
        )
      }
      </div>

      <label className="label-size" htmlFor="options">Grid Size:</label>
      <select id="options" className="size-select" value={context.gridSize} onChange={gridChange}>
        <option value="small">Small</option>
        <option value="middle">Middle</option>
        <option value="big">Big</option>
      </select>

      <button onClick={() => navigate('/game')} className="button-start">START</button>

    </>
  )
}

export {Home}
