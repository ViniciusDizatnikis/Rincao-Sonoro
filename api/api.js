import axios from 'axios';

const URL = 'https://api-rincao-sonoro.vercel.app';

// Função para criar artista
export const createArtist = async (name, image, banner, password) => {
  if (!name || !image || !banner || !password) {
    throw new Error('Nome, imagem e banner são obrigatórios');
  }

  try {
    const response = await axios.post(`${URL}/artists`, {
      name,
      image,
      banner,
      password: 'RincaoSonoroCreatePass'
    });
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro ao criar artista:', error);
    throw error; // Re-throw ou retorne uma mensagem de erro
  }
};

// Função para criar música
export const createSong = async (image, name, duration, audio, artist, password) => {
  if (!image || !name || !duration || !audio || !artist || !password) {
    throw new Error('Imagem, nome, duração, áudio, artista e Senha são obrigatórios');
  }

  try {
    const response = await axios.post(`${URL}/songs`, {
      image,
      name,
      duration,
      audio,
      artist,
      password: password
    });
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro ao criar música:', error);
    throw error; // Re-throw ou retorne uma mensagem de erro
  }
};

// Função para pegar artistas
export const getArtists = async (quantity) => {
  try {
    const response = await axios.get(`${URL}/artists`);
    const artists = response.data.slice(0, quantity);
    return artists;
  } catch (error) {
    console.error('Erro ao buscar artistas:', error);
    throw error;
  }
};

// Função para pegar nome do artista por ID
export const getArtistNameById = async (id) => {
  try {
    const response = await axios.get(`${URL}/artists/name/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar nome do artista:', error);
    throw error;
  }
};

// Função para pegar músicas
export const getSongs = async (quantity) => {
  try {
    const response = await axios.get(`${URL}/songs`);
    const songs = response.data.slice(0, quantity);
    return songs;
  } catch (error) {
    console.error('Erro ao buscar músicas:', error);
    throw error;
  }
};

// Função para pegar artista por ID
export const getArtistById = async (id) => {
  try {
    const response = await axios.get(`${URL}/artists/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar artista por ID:', error);
    throw error;
  }
};

// Função para pegar música por ID
export const getSongById = async (id) => {
  try {
    const response = await axios.get(`${URL}/songs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar música por ID:', error);
    throw error;
  }
};

// Função para pegar músicas por ID do artista
export const getSongByArtistId = async (id) => {
  try {
    const response = await axios.get(`${URL}/songs/artist/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar músicas pelo ID do artista:', error);
    throw error;
  }
};
