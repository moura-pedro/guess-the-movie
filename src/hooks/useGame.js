// src/hooks/useGame.js
import { useState, useEffect } from 'react';
import TMDBMovieService from '../services/TMDBMovieService';

export function useGame() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [difficulty, setDifficulty] = useState('easy'); // Add difficulty state

  const movieService = new TMDBMovieService();

  const loadNewMovie = async (difficultyLevel = 'easy') => {
    setLoading(true);
    setError(null);
    try {
      const newMovie = await movieService.getRandomMovie(difficultyLevel);
      setMovieData(newMovie);
    } catch (error) {
      setError('Failed to load movie. Please try again.');
      console.error('Error loading movie:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuess = () => {
    if (!movieData) return;

    // Make the comparison more forgiving
    const cleanGuess = userGuess.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const correctAnswer = movieData.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

    if (cleanGuess === correctAnswer) {
      setScore(score + getPointsForFrame(currentFrame));
      setGameOver(true);
    } else if (currentFrame < 5) {
      setCurrentFrame(currentFrame + 1);
      setUserGuess('');
    } else {
      setGameOver(true);
    }
  };

  const startNewGame = async (difficultyLevel = 'easy') => {
    setCurrentFrame(0);
    setUserGuess('');
    setGameOver(false);
    setShowHint(false);
    setDifficulty(difficultyLevel); // Update difficulty
    await loadNewMovie(difficultyLevel);
  };

  const getPointsForFrame = (frameIndex) => {
    return 6 - frameIndex;
  };

  useEffect(() => {
    loadNewMovie(difficulty);
  }, []);

  return {
    currentFrame,
    userGuess,
    setUserGuess,
    gameOver,
    score,
    showHint,
    setShowHint,
    movieData,
    loading,
    error,
    difficulty,
    setDifficulty,
    handleGuess,
    startNewGame,
    getPointsForFrame,
  };
}
