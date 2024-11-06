// src/components/game/ScoreBoard.jsx
export function ScoreBoard({ score, pointsAvailable, difficulty }) {
  return (
    <div className="text-center mb-6">
      <div className="text-2xl font-bold">Score: {score}</div>
      <div className="text-gray-600">Points available: {pointsAvailable}</div>
      <div className="text-gray-600">Difficulty: {difficulty}</div>
    </div>
  );
}
