import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (gameOver) resetGame();
          else setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        // Check collision with self
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, Math.max(50, INITIAL_SPEED - score / 5));
    return () => clearInterval(interval);
  }, [direction, food, gameOver, isPaused, score, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    prevSnakeRef.current = snake; // For potential trail effects
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ffff' : '#ff00ff';
      ctx.shadowBlur = index === 0 ? 15 : 5;
      ctx.shadowColor = index === 0 ? '#00ffff' : '#ff00ff';
      
      // Add a slight glitch offset to segments
      const offset = gameOver ? Math.random() * 4 - 2 : 0;
      ctx.fillRect(
        segment.x * cellSize + 1 + offset,
        segment.y * cellSize + 1 + offset,
        cellSize - 2,
        cellSize - 2
      );
    });

    // Draw food
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ffffff';
    const foodPulse = Math.sin(Date.now() / 100) * 2;
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      (cellSize / 3) + foodPulse,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.shadowBlur = 0;
  }, [snake, food, gameOver]);

  const prevSnakeRef = useRef<Point[]>([]);

  return (
    <div className="relative flex flex-col items-center gap-6">
      <div className="flex justify-between w-full px-4 font-retro text-xs text-neon-cyan">
        <div className="glitch-text" data-text={`SCORE: ${score.toString().padStart(5, '0')}`}>
          SCORE: {score.toString().padStart(5, '0')}
        </div>
        <div className="text-neon-magenta">
          HI-SCORE: 00000
        </div>
      </div>

      <div className="relative p-1 neon-border bg-black/50 backdrop-blur-sm">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="block"
        />
        
        {(gameOver || isPaused) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-10">
            {gameOver ? (
              <>
                <h2 className="font-retro text-2xl text-neon-magenta mb-4 glitch-effect">SYSTEM FAILURE</h2>
                <p className="font-retro text-xs text-white mb-8">FINAL SCORE: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 font-retro text-xs neon-border-magenta text-neon-magenta hover:bg-neon-magenta hover:text-black transition-all cursor-pointer"
                >
                  REBOOT SYSTEM
                </button>
              </>
            ) : (
              <>
                <h2 className="font-retro text-2xl text-neon-cyan mb-8 glitch-effect">PAUSED</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-6 py-3 font-retro text-xs neon-border text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all cursor-pointer"
                >
                  RESUME UPLINK
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="font-mono text-[10px] text-gray-500 tracking-widest uppercase">
        [ ARROWS ] TO MOVE | [ SPACE ] TO PAUSE
      </div>
    </div>
  );
}
