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

  // Función para crear la cuadrícula
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
          topMarked: false,
          rightMarked: false,
          bottomMarked: false,
          leftMarked: false,
        });
      }
      newGrid.push(currentRow);
    }
    return newGrid;
  };

  // Función para dibujar la cuadrícula
  const color = (active) => {
    return active ? 'rgb(255, 255, 255)' : 'rgba(211, 211, 211, 0.48)';
  }

  const drawGrid = (ctx, grid) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Limpiar canvas
    grid.forEach((rows) => {
      rows.forEach((cell) => {
        ctx.beginPath();
        ctx.moveTo(cell.xOrigin, cell.yOrigin);
        ctx.lineTo(cell.xFinal, cell.yOrigin);
        ctx.lineWidth = 3;
        ctx.strokeStyle = color(cell.topMarked);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cell.xFinal, cell.yOrigin);
        ctx.lineTo(cell.xFinal, cell.yFinal);
        ctx.lineWidth = 3;
        ctx.strokeStyle = color(cell.rightMarked);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cell.xOrigin, cell.yFinal);
        ctx.lineTo(cell.xFinal, cell.yFinal);
        ctx.lineWidth = 3;
        ctx.strokeStyle = color(cell.bottomMarked);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cell.xOrigin, cell.yOrigin);
        ctx.lineTo(cell.xOrigin, cell.yFinal);
        ctx.lineWidth = 3;
        ctx.strokeStyle = color(cell.leftMarked);
        ctx.stroke();

      });
    });
  };

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

      const grid = createGrid(sizeGrid[context.gridSize || "small"]);
      context.setGridCanvas(grid);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [context.gridSize]);

  // Dibujar el grid cuando context.gridCanvas cambia
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
      style={{
        border: "5px solid white",
        display: "block",
        margin: "auto",
      }}
    />
  );
};

export { Canvas };