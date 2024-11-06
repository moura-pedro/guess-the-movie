export function GameOver({ score, movieTitle, onNewGame }) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Game Over!</h2>
          <p>The movie was: {movieTitle}</p>
          <p className="text-2xl font-bold mt-2">Final Score: {score}</p>
        </div>
        <button
          onClick={onNewGame}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Play Again
        </button>
      </div>
    );
  }