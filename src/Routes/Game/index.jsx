import { useContext } from "react"
import { GameContext } from "../../Context"
import {Canvas} from "../../UI/Canvas"
import {Message} from "../../UI/Message"
import './Game.scss'
import { useNavigate } from "react-router-dom"


function Game() {
  const context = useContext(GameContext);
  const navigate = useNavigate();
  
    const restart = () => {
      context.setSelectedPlayers(2);
  
      const updatedPlayers = Array.from({ length: context.selectedPlayers }, (player, i) => ({
        id: i + 1,
        name: `Player ${i + 1}`,
        points: 0,
      }));
      context.setPlayers(updatedPlayers);
      context.setGridSize('middle');
      context.setTurn(0);
      context.setShowMessage(true);
      context.setShowWinner(false);
      navigate('/');
    }
  
  return (
    <>
      <div className="game-container">

          <div className="section-container">

            <button className="button-restart" onClick={restart}>RESTART</button>

            <div className="player-container">
              {
                context.players.map((player,index) => 
                  <div key={index} className={`player player-${index + 1} ${context.turn == index ? '' : 'player-disabled'}`}>
                    <h3 className="player-name">{player.name}</h3>
                    <p>{player.points}</p>
                  </div>
                )
              }
            </div>

          </div>

        <Canvas></Canvas>

        {(context.showMessage || context.showWinner) && (
          <Message/>
        )}
      </div>
    </>
  )
}

export {Game}
