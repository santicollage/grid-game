import { useEffect, useRef, useContext,  useState } from "react";
import { GameContext } from "../../Context";

const Canvas = () => {
  const context = useContext(GameContext);
  const [pendingAction, setPendingAction] = useState(null);

  const canvasRef = useRef(null);

  let size =
    window.innerWidth > window.innerHeight
      ? window.innerHeight * 0.8
      : window.innerWidth * 0.8;

  const sizeGrid = {
    small: 6,
    middle: 8,
    big: 10,
  };
  
  const colors = [
    '#E7FF17',
    '#3EFF17',
    '#172AFF',
    '#FF171B'
  ];

  // Function to create the grid
  const createGrid = (columns, rows = columns) => {
    const spacing = (size - 10) / columns;
    const newGrid = [];

    for (let row = 0; row < rows; row++) {
      const currentRow = [];
      for (let column = 0; column < columns; column++) {
        currentRow.push({
          xOrigin: spacing * column + 5,
          yOrigin: spacing * row  + 5,
          xFinal: spacing * (column + 1) + 5,
          yFinal: spacing * (row + 1) + 5,
          topMarked: false,
          rightMarked: false,
          bottomMarked: false,
          leftMarked: false,
          fill: false,
          color: 'rgba(211, 211, 211, 0.48)',
        });
      }
      newGrid.push(currentRow);
    }
    return newGrid;
  };

  // Define the thickness and color of the line
  const color = (active) => {
    return active ? 'rgb(255, 255, 255)' : 'rgba(211, 211, 211, 0.48)';
  }
  const stroke = (active) => {
    return active ? 5 : 2;
  }

  // Function to draw the grid
  const drawGrid = (ctx, grid) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Limpiar canvas
    grid.forEach((rows) => {
      rows.forEach((cell) => {
        
        if(cell.fill) {
          ctx.fillStyle = cell.color;
          ctx.fillRect(cell.xOrigin, cell.yOrigin, cell.xFinal - cell.xOrigin, cell.yFinal - cell.yOrigin);
        }

        ctx.beginPath();
        ctx.moveTo(cell.xOrigin, cell.yOrigin);
        ctx.lineTo(cell.xFinal, cell.yOrigin);
        ctx.lineWidth = stroke(cell.topMarked);
        ctx.strokeStyle = color(cell.topMarked);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cell.xFinal, cell.yOrigin);
        ctx.lineTo(cell.xFinal, cell.yFinal);
        ctx.lineWidth = stroke(cell.rightMarked);
        ctx.strokeStyle = color(cell.rightMarked);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cell.xOrigin, cell.yFinal);
        ctx.lineTo(cell.xFinal, cell.yFinal);
        ctx.lineWidth = stroke(cell.bottomMarked);
        ctx.strokeStyle = color(cell.bottomMarked);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cell.xOrigin, cell.yOrigin);
        ctx.lineTo(cell.xOrigin, cell.yFinal);
        ctx.lineWidth = stroke(cell.leftMarked);
        ctx.strokeStyle = color(cell.leftMarked);
        ctx.stroke();

      });
    });
  };

  // Function to update the turn
  const updateTurn = () => {
    context.setTurn((prevTurn) => prevTurn == context.players.length - 1 ? 0 : prevTurn + 1);   
  }  

  // Function to update the points
  const updatePoints = (grid, turn) => {
    const points = grid.flat().filter((cell) => cell.fill).length - context.gridCanvas.flat().filter((cell) => cell.fill).length;
    context.players[turn].points += points * 10;
    context.setGridCanvas(grid);
  }

  // Function that handles the click of the line
  const handleClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const spacing = size / sizeGrid[context.gridSize];    

    const activateLine = (row, column) => { 
      //distances to the diagonal of the square
      const totalDistance1 = (clickX - context.gridCanvas[row][column].xOrigin) + (clickY - context.gridCanvas[row][column].yOrigin);
      const totalDistance2 = (context.gridCanvas[row][column].xFinal - clickX) + (clickY - context.gridCanvas[row][column].yOrigin);  

      const updateGrid = (row, column, direction) => {
        context.setGridCanvas((prevGrid) => {
          let newGrid = structuredClone(prevGrid);
          switch (direction) {
            case 'top':
              newGrid[row][column].topMarked = true;
              break;
            case 'right':
              newGrid[row][column].rightMarked = true;
              break;
            case 'bottom':
              newGrid[row][column].bottomMarked = true;
              break;
            case 'left':
              newGrid[row][column].leftMarked = true;
              break;
          
            default:
              break;
          }
          return newGrid;
        })
        setPendingAction({ row, column, direction });
      }
      
      if (totalDistance1 < spacing && totalDistance2 < spacing) {
        if (!context.gridCanvas[row][column].topMarked && !context.gridCanvas[row][column].fill) {
          if(row > 0) {
            updateGrid(row - 1, column, 'bottom');
          }
          updateGrid(row, column, 'top');
        }
      } else if (totalDistance1 > spacing && totalDistance2 < spacing) {
        if (!context.gridCanvas[row][column].rightMarked && !context.gridCanvas[row][column].fill) {
          if(column < sizeGrid[context.gridSize] - 1) {
            updateGrid(row, column + 1, 'left');
          }
          updateGrid(row, column, 'right');
          
        }
      } else if (totalDistance1 > spacing && totalDistance2 > spacing) {
        if (!context.gridCanvas[row][column].bottomMarked && !context.gridCanvas[row][column].fill) {
          if(row < sizeGrid[context.gridSize] - 1) {
            updateGrid(row + 1, column, 'top');
          }
          updateGrid(row, column, 'bottom');
        }
      } else if (totalDistance1 < spacing && totalDistance2 > spacing) {
        if (!context.gridCanvas[row][column].leftMarked && !context.gridCanvas[row][column].fill) {
          if(column > 0) {
            updateGrid(row, column - 1, 'right');
          }
          updateGrid(row, column, 'left');
        }
      }
    }
    
    //Find the square where it was clicked
    context.gridCanvas.forEach((rows, row) => {
      rows.forEach((cell, column) => {
        if (clickX - cell.xOrigin > 0 && clickY - cell.yOrigin > 0 && clickX - cell.xFinal < 0 && clickY - cell.yFinal < 0) {
          activateLine(row, column);
        }
      })
    })
    
  }

  // Function that rectifies if points are achieved
  const rectifyPoints = (row, column, direction) => {

    let grid = structuredClone(context.gridCanvas);

    const fillSquare = (rowPartial, columnPartial, direction) => {

      grid[rowPartial][columnPartial].fill = true;
      grid[rowPartial][columnPartial].color = colors[context.turn];

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      if((rowPartial + 1 == grid.length && !grid[rowPartial][columnPartial].bottomMarked)
        || (columnPartial + 1 == grid.length && !grid[rowPartial][columnPartial].rightMarked) 
        || (rowPartial - 1 < 0 && !grid[rowPartial][columnPartial].topMarked) 
        || (columnPartial - 1 < 0 && !grid[rowPartial][columnPartial].leftMarked)) {
        return false;
      } else if((grid[rowPartial][columnPartial].rightMarked || grid[rowPartial][columnPartial + 1].fill) && 
      (grid[rowPartial][columnPartial].bottomMarked || grid[rowPartial  + 1][columnPartial].fill) &&
      (grid[rowPartial][columnPartial].leftMarked || grid[rowPartial][columnPartial - 1].fill) &&
      (grid[rowPartial][columnPartial].topMarked || grid[rowPartial - 1][columnPartial].fill)) {  
        return true;
      }
      
      let allValid = true;

      switch (direction) {
          case 'top':
              if (!grid[rowPartial][columnPartial].rightMarked && !grid[rowPartial][columnPartial + 1].fill) {
                  allValid = allValid && fillSquare(rowPartial, columnPartial + 1, 'left');
              }
              if (!grid[rowPartial][columnPartial].bottomMarked && !grid[rowPartial + 1][columnPartial].fill) {
                  allValid = allValid && fillSquare(rowPartial + 1, columnPartial, 'top');
              }
              if (!grid[rowPartial][columnPartial].leftMarked && !grid[rowPartial][columnPartial - 1].fill) {
                  allValid = allValid && fillSquare(rowPartial, columnPartial - 1, 'right');
              }
              break;
  
          case 'right':
              if (!grid[rowPartial][columnPartial].leftMarked && !grid[rowPartial][columnPartial - 1].fill) {
                  allValid = allValid && fillSquare(rowPartial, columnPartial - 1, 'right');
              }
              if (!grid[rowPartial][columnPartial].topMarked && !grid[rowPartial - 1][columnPartial].fill) {
                  allValid = allValid && fillSquare(rowPartial - 1, columnPartial, 'bottom');
              }
              if (!grid[rowPartial][columnPartial].bottomMarked && !grid[rowPartial + 1][columnPartial].fill) {
                  allValid = allValid && fillSquare(rowPartial + 1, columnPartial, 'top');
              }
              break;
  
          case 'bottom':
              if (!grid[rowPartial][columnPartial].rightMarked && !grid[rowPartial][columnPartial + 1].fill) {
                  allValid = allValid && fillSquare(rowPartial, columnPartial + 1, 'left');
              }
              if (!grid[rowPartial][columnPartial].topMarked && !grid[rowPartial - 1][columnPartial].fill) {
                  allValid = allValid && fillSquare(rowPartial - 1, columnPartial, 'bottom');
              }
              if (!grid[rowPartial][columnPartial].leftMarked && !grid[rowPartial][columnPartial - 1].fill) {
                  allValid = allValid && fillSquare(rowPartial, columnPartial - 1, 'right');
              }
              break;
  
          case 'left':
              if (!grid[rowPartial][columnPartial].rightMarked && !grid[rowPartial][columnPartial + 1].fill) {
                  allValid = allValid && fillSquare(rowPartial, columnPartial + 1, 'left');
              }
              if (!grid[rowPartial][columnPartial].bottomMarked && !grid[rowPartial + 1][columnPartial].fill) {
                  allValid = allValid && fillSquare(rowPartial + 1, columnPartial, 'top');
              }
              if (!grid[rowPartial][columnPartial].topMarked && !grid[rowPartial - 1][columnPartial].fill) {
                  allValid = allValid && fillSquare(rowPartial - 1, columnPartial, 'bottom');
              }
              break;
  
          default:
              break;
      }

      return allValid;
    }
    
    let firstIteration = fillSquare(row, column, direction);

    if(firstIteration) {
      updatePoints(grid, context.turn);
      return;
    } else {
      grid = structuredClone(context.gridCanvas);
      let secondIteration;
  
      switch (direction) {
        case 'top':
          if(row > 0) secondIteration = fillSquare(row - 1, column, 'bottom');
          break;
        case 'right':
          if(column < sizeGrid[context.gridSize] - 1) secondIteration = fillSquare(row, column + 1, 'left');
          break;
        case 'bottom':
          if(row < sizeGrid[context.gridSize] - 1) secondIteration = fillSquare(row + 1, column, 'top');
          break;
        case 'left':
          if(column > 0) secondIteration = fillSquare(row, column - 1, 'right');
          break;
      
        default:
          break;
      }
      if(secondIteration) {
        updatePoints(grid, context.turn);
        return;
      }      
    }
  }

  // Function that handles resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const handleResize = () => {
      size =
        window.innerWidth > window.innerHeight
          ? window.innerHeight * 0.8
          : window.innerWidth * 0.8;

      canvas.width = size;
      canvas.height = size;

      const grid = createGrid(sizeGrid[context.gridSize]);
      context.setGridCanvas(grid);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [context.gridSize]);

  // Draw the grid when context.gridCanvas changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (context.gridCanvas) {
      drawGrid(ctx, context.gridCanvas);
    }

    if (pendingAction) {
      const { row, column, direction } = pendingAction;
      rectifyPoints(row, column, direction);
      setPendingAction(null);
      updateTurn();
    }

    context.players.forEach((player) => {
      if(player.points > (sizeGrid[context.gridSize] * sizeGrid[context.gridSize] * 10 / context.selectedPlayers)) {
        console.log('win');
        
      }
    })
  }, [context.gridCanvas]);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      style={{
        border: "none",
        display: "block",
        margin: "auto",
        backdropFilter: "blur(5px)",
      }}
    />
  );
};

export { Canvas };