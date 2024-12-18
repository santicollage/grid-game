import { useEffect, useRef, useContext } from "react";
import { GameContext } from "../../Context";
import { useNavigate } from "react-router-dom";

const Canvas = () => {
  const context = useContext(GameContext);
  const navigate = useNavigate();

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

  // Function to create the grid
  const createGrid = (columns, rows = columns) => {
    const spacing = size / columns;
    const newGrid = [];

    for (let row = 0; row < rows; row++) {
      const currentRow = [];
      for (let column = 0; column < columns; column++) {
        currentRow.push({
          xOrigin: spacing * column,
          yOrigin: spacing * row,
          xFinal: spacing * (column + 1),
          yFinal: spacing * (row + 1),
          topMarked: row == 0 ? true : false,
          rightMarked: column == columns - 1 ? true : false,
          bottomMarked: row == rows - 1 ? true : false,
          leftMarked: column == 0 ? true : false,
        });
      }
      newGrid.push(currentRow);
    }
    return newGrid;
  };

  // Function to draw the grid
  const color = (active) => {
    return active ? 'rgb(255, 255, 255)' : 'rgba(211, 211, 211, 0.48)';
  }
  const stroke = (active) => {
    return active ? 5 : 2;
  }

  const drawGrid = (ctx, grid) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Limpiar canvas
    grid.forEach((rows) => {
      rows.forEach((cell) => {
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

  const handleClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const spacing = size / sizeGrid[context.gridSize];

    console.log(context.turn);
    

    const activateLine = (row, column) => {
      context.setGridCanvas((prevGrid) => {
        const newGrid = [...prevGrid];

        //distances to the diagonal of the square
        const totalDistance1 = (clickX - newGrid[row][column].xOrigin) + (clickY - newGrid[row][column].yOrigin);
        const totalDistance2 = (newGrid[row][column].xFinal - clickX) + (clickY - newGrid[row][column].yOrigin); 

        const updateTurn = () => {
          context.setTurn((prevTurn) => prevTurn == context.players.length - 1 ? 0 : prevTurn + 1);
        }       

        if (totalDistance1 < spacing && totalDistance2 < spacing) {
          !newGrid[row][column].topMarked && updateTurn();
          newGrid[row][column].topMarked = true;
          if(row > 0) {
            newGrid[row - 1][column].bottomMarked = true;
          }
        } else if (totalDistance1 > spacing && totalDistance2 < spacing) {
          !newGrid[row][column].rightMarked && updateTurn();
          newGrid[row][column].rightMarked = true;
          if(column < sizeGrid[context.gridSize] - 1) {
            newGrid[row][column + 1].leftMarked = true;
          }
        } else if (totalDistance1 > spacing && totalDistance2 > spacing) {
          !newGrid[row][column].bottomMarked && updateTurn();
          newGrid[row][column].bottomMarked = true;
          if(row < sizeGrid[context.gridSize] - 1) {
            newGrid[row + 1][column].topMarked = true;
          }
        } else if (totalDistance1 < spacing && totalDistance2 > spacing) {
          !newGrid[row][column].leftMarked && updateTurn();
          newGrid[row][column].leftMarked = true;
          if(column > 0) {
            newGrid[row][column - 1].rightMarked = true;
          }
        } 

        return newGrid;
      })
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
  }, [context.gridCanvas]);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      style={{
        border: "5px solid white",
        display: "block",
        margin: "auto",
      }}
    />
  );
};

export { Canvas };