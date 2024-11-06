export function GuessInput({ value, onChange, onSubmit }) {
    return (
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter movie title..."
          className="flex-1 p-2 border rounded"
          onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
        />
        <button
          onClick={onSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Guess
        </button>
      </div>
    );
  }