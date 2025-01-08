import { useContext } from "react"
import { GameContext } from "../../Context"
import './Message.scss'
import { useNavigate } from "react-router-dom";

function Message() {
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

  const closeMessage = () => {
    context.setShowMessage(false);
  }

  return (
    <>
      <div className="message-container">
        {
          context.showMessage && (
            <>
              <h1 className="message-title"></h1>
              <p className="message-text"></p>
              <button className="button-restart" onClick={closeMessage}>ACCEPT</button>
            </>
          )
        }
        {
          context.showWinner && (
            <>
              <h1 className="message-title"></h1>
              <p className="message-text"></p>
              <button className="button-restart" onClick={restart}>RESTART</button>
            </>
          )
        }
      </div>
    </>
  )
}

export {Message}
