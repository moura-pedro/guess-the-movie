// src/App.jsx
import { MovieFrame } from "./components/game/MovieFrame";
import { GuessInput } from "./components/game/GuessInput";
import { ScoreBoard } from "./components/game/ScoreBoard";
import { GameOver } from "./components/game/GameOver";
import { useGame } from './hooks/useGame';

function App() {
  const {
    currentFrame,
    userGuess,
    setUserGuess,
    gameOver,
    score,
    showHint,
    setShowHint,
    movieData,
    loading,
    handleGuess,
    startNewGame,
    getPointsForFrame,
  } = useGame();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!movieData) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Movie Guessing Game
      </h1>

      <ScoreBoard
        score={score}
        pointsAvailable={getPointsForFrame(currentFrame)}
      />

      <MovieFrame
        src={movieData.frames[currentFrame]}
        frameNumber={currentFrame + 1}
      />

      {!gameOver ? (
        <div className="space-y-4 mt-6">
          <GuessInput
            value={userGuess}
            onChange={setUserGuess}
            onSubmit={handleGuess}
          />

          <button
            onClick={() => setShowHint(true)}
            className="text-blue-500 hover:text-blue-600"
          >
            Need a hint?
          </button>

          {showHint && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-blue-800">{movieData.hint}</p>
            </div>
          )}
        </div>
      ) : (
        <GameOver
          score={score}
          movieTitle={movieData.title}
          onNewGame={startNewGame}
        />
      )}
    </div>
  );
}

export default App;