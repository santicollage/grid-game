import { createContext, useEffect, useState } from 'react';

export const GameContext = createContext();

export const GameProvider = ({children}) => {
  //number of players
  const [selectedPlayers, setSelectedPlayers] = useState(2);

  //player information
  const [players, setPlayers] = useState([]);
  useEffect(() => {
    const updatedPlayers = Array.from({ length: selectedPlayers }, (player, i) => ({
      id: i + 1,
      name: `Player ${i + 1}`,
      points: 0,
    }));
    setPlayers(updatedPlayers);
  }, [selectedPlayers]);

  //grid size 
  const [gridSize, setGridSize] = useState('middle');

  //Canvas
  const [gridCanvas, setGridCanvas] = useState([]);


  return (
    <GameContext.Provider value={{
      selectedPlayers,
      setSelectedPlayers,
      players,
      setPlayers,
      gridSize,
      setGridSize,
      gridCanvas,
      setGridCanvas
    }}>
      {children}
    </GameContext.Provider>
  )
}