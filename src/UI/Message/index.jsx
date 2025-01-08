import { useContext } from "react"
import { GameContext } from "../../Context"
import './Message.scss'
import { useNavigate } from "react-router-dom";

function Message() {
  const context = useContext(GameContext);
  const navigate = useNavigate();

  let winner = {};

  const findWinner = () => {
    const players = context.players;
    const sortedPlayers = players.sort((a, b) => b.points - a.points);
    winner = sortedPlayers[0];    
  }
  
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

  findWinner();

  return (
    <>
      <div className="message-container">
        {
          context.showMessage && (
            <>
              <h1 className="message-title">RULES</h1>
              <ol>
                <li className="message-text">Turns: Players take turns drawing a line (horizontal or vertical) between two adjacent points on the grid.</li>
                <li className="message-text">Closing areas: When a player closes an area (at least one square), that area is marked as theirs.</li>
                <li className="message-text">Scoring: Each closed square is worth 10 points. If the closed area contains multiple squares, the score equals the number of squares in the area.</li>
                <li className="message-text">End of the game: The player with the most points wins.</li>
              </ol>
              <button className="button-restart" onClick={closeMessage}>ACCEPT</button>
            </>
          )
        }
        {
          context.showWinner && (
            <>
              <h1 className="message-title">WINNER</h1>
              <p className="message-winner">🥳{winner.name}🥳</p>
              <p className="message-winner">{winner.points}</p>
              <button className="button-restart" onClick={restart}>RESTART</button>
            </>
          )
        }
      </div>
    </>
  )
}

export {Message}
