// src/services/TMDBMovieService.js
import axios from 'axios';

class TMDBMovieService {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.themoviedb.org/3',
      params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY,
      },
    });
  }

  async discoverMovies({ yearStart, yearEnd, minVoteCount, sortBy }) {
    try {
      const params = {
        sort_by: sortBy || 'popularity.desc',
        'vote_count.gte': minVoteCount || 0,
      };

      if (yearStart) {
        params['primary_release_date.gte'] = `${yearStart}-01-01`;
      }
      if (yearEnd) {
        params['primary_release_date.lte'] = `${yearEnd}-12-31`;
      }

      const { data } = await this.api.get('/discover/movie', { params });
      return data.results;
    } catch (error) {
      console.error('Error discovering movies:', error);
      throw new Error('Failed to discover movies');
    }
  }

  async getMoviesByDifficulty(difficulty) {
    switch (difficulty) {
      case 'easy':
        // Very popular recent movies
        return await this.discoverMovies({
          yearStart: 2020,
          minVoteCount: 10000,
          sortBy: 'popularity.desc',
        });
      case 'medium':
        // Moderately popular movies from last 20 years
        return await this.discoverMovies({
          yearStart: 2000,
          minVoteCount: 1000,
          sortBy: 'vote_average.desc',
        });
      case 'hard':
        // Less popular older movies
        return await this.discoverMovies({
          yearEnd: 1999,
          minVoteCount: 100,
          sortBy: 'vote_average.desc',
        });
      default:
        // Default to 'easy' if difficulty not recognized
        return await this.discoverMovies({
          yearStart: 2020,
          minVoteCount: 10000,
          sortBy: 'popularity.desc',
        });
    }
  }

  async getRandomMovie(difficulty = 'easy') {
    try {
      const movies = await this.getMoviesByDifficulty(difficulty);
      if (!movies.length) {
        throw new Error('No movies found for this difficulty');
      }

      // Select a random movie from the list
      const movie = movies[Math.floor(Math.random() * movies.length)];

      // Get movie images
      const imagesData = await this.api.get(`/movie/${movie.id}/images`);

      // Get more movie details for better hints
      const details = await this.api.get(`/movie/${movie.id}`);

      // Combine stills and backdrops, prefer stills if available
      const allImages = [
        ...(imagesData.data.stills || []),
        ...(imagesData.data.backdrops || []),
      ].slice(0, 6);

      // If we don't have enough images, repeat the last one
      while (allImages.length < 6) {
        allImages.push(
          allImages[allImages.length - 1] || imagesData.data.backdrops[0]
        );
      }

      return {
        id: movie.id,
        title: movie.title,
        frames: allImages.map(
          (img) => `https://image.tmdb.org/t/p/w780${img.file_path}`
        ),
        hint: `${details.data.release_date.split('-')[0]} ${
          details.data.genres[0]?.name
        } movie: ${details.data.overview.split('.')[0]}`,
        year: details.data.release_date.split('-')[0],
        difficulty, // Include difficulty level
      };
    } catch (error) {
      console.error('Error fetching movie:', error);
      throw new Error('Failed to fetch movie data');
    }
  }

  // Existing methods (getMoviesByGenre, getGenres)...
}

export default TMDBMovieService;
