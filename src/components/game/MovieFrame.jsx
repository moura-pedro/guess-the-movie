export function MovieFrame({ src, frameNumber }) {
    return (
      <div className="relative rounded-lg overflow-hidden shadow-lg">
        <img
          src={src}
          alt={`Movie frame ${frameNumber}`}
          className="w-full h-auto"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
          Frame {frameNumber}/6
        </div>
      </div>
    );
  }
  