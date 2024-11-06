// src/services/TMDBMovieService.js
import axios from 'axios';

class TMDBMovieService {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.themoviedb.org/3',
      params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY
      }
    });
  }

  async getRandomMovie() {
    try {
      // Get a random page of popular movies (first 5 pages)
      const page = Math.floor(Math.random() * 5) + 1;
      const { data } = await this.api.get('/movie/popular', {
        params: { page }
      });

      // Select random movie from the page
      const movie = data.results[Math.floor(Math.random() * data.results.length)];

      // Get movie images
      const imagesData = await this.api.get(`/movie/${movie.id}/images`);
      
      // Get more movie details for better hints
      const details = await this.api.get(`/movie/${movie.id}`);

      // Combine stills and backdrops, prefer stills if available
      const allImages = [
        ...(imagesData.data.stills || []),
        ...(imagesData.data.backdrops || [])
      ].slice(0, 6);

      // If we don't have enough images, repeat the last one
      while (allImages.length < 6) {
        allImages.push(allImages[allImages.length - 1] || imagesData.data.backdrops[0]);
      }

      return {
        id: movie.id,
        title: movie.title,
        frames: allImages.map(img => 
          `https://image.tmdb.org/t/p/w780${img.file_path}`
        ),
        hint: `${details.data.release_date.split('-')[0]} ${
          details.data.genres[0]?.name
        } movie: ${details.data.overview.split('.')[0]}`,
        year: details.data.release_date.split('-')[0]
      };
    } catch (error) {
      console.error('Error fetching movie:', error);
      throw new Error('Failed to fetch movie data');
    }
  }

  async getMoviesByGenre(genreId) {
    try {
      const { data } = await this.api.get('/discover/movie', {
        params: {
          with_genres: genreId,
          sort_by: 'popularity.desc'
        }
      });
      return data.results;
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      throw new Error('Failed to fetch movies by genre');
    }
  }

  async getGenres() {
    try {
      const { data } = await this.api.get('/genre/movie/list');
      return data.genres;
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw new Error('Failed to fetch genres');
    }
  }
}

export default TMDBMovieService;