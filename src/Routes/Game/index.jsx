import { useContext } from "react"
import { GameContext } from "../../Context"
import {Canvas} from "../../UI/Canvas"
import './Game.scss'

function Game() {
  const context = useContext(GameContext);

  console.log(context.gridSize, context.players);
  

  return (
    <>
      <div className="game-container">
        <h1>Game</h1>

        <Canvas></Canvas>
      </div>
    </>
  )
}

export {Game}
