export function ScoreBoard({ score, pointsAvailable }) {
    return (
      <div className="text-center mb-6">
        <div className="text-2xl font-bold">Score: {score}</div>
        <div className="text-gray-600">
          Points available: {pointsAvailable}
        </div>
      </div>
    );
  }