import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArtist, getArtists, createSong } from '../../api/api';
import Loading from '../components/Loading';
import '../assets/Css/addPage.css';

const Add = () => {
  const navigate = useNavigate();

  // Estado para armazenar a senha de autenticação
  const [password, setPassword] = useState('');

  // Estados para o Artista
  const [imageArtist, setImageArtist] = useState(''); // URL da imagem do artista
  const [nameArtist, setNameArtist] = useState(''); // Nome do artista
  const [bannerArtist, setBannerArtist] = useState(''); // URL do banner do artista

  // Estados para a Música
  const [imageSong, setImageSong] = useState(''); // URL da imagem da música
  const [nameSong, setNameSong] = useState(''); // Nome da música
  const [selectedArtist, setSelectedArtist] = useState(''); // Nome do artista selecionado
  const [artistId, setArtistId] = useState(''); // ID do artista selecionado
  const [duration, setDuration] = useState(''); // Duração da música (em formato mm:ss)
  const [audio, setAudio] = useState(''); // URL do áudio da música
  const [search, setSearch] = useState(''); // Termo de busca para artistas
  const [artists, setArtists] = useState([]); // Lista de artistas

  // Estado para verificar se o usuário está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('accessGranted') === 'true');

  // Estado de carregamento
  const [isloading, setIsLoading] = useState(true);

  // Função que busca os artistas quando o componente é carregado
  useEffect(() => {
    const fetchData = async () => {
      try {
        const artists = await getArtists(Infinity); // Busca todos os artistas
        setArtists(artists); 
      } catch (error) {
        console.error('Erro ao buscar artistas:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  // Filtra os artistas com base no termo de busca
  const filteredArtists = search.trim()
    ? artists.filter((artist) => artist.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  // Função para limpar todos os inputs
  const clearInput = () => {
    setImageArtist('');
    setNameArtist('');
    setBannerArtist('');
    setImageSong('');
    setNameSong('');
    setSelectedArtist('');
    setArtistId('');
    setDuration('');
    setAudio('');
    setSearch('');
  };

  // Função para exibir um popup de aviso
  const showAlert = (message) => {
    alert(message); // Exibe o popup de alerta
  };

  // Função para criar um novo artista
  const handleCreateArtist = () => {
    if (!password) {
      showAlert('A senha não pode estar vazia!'); // Exibe alerta se a senha estiver vazia
      return;
    }
    const newArtist = { imageArtist, nameArtist, bannerArtist };
    console.log('Artista criado:', JSON.stringify(newArtist, null, 2));
    createArtist(nameArtist, imageArtist, bannerArtist, password); 
    clearInput(); 
  };

  // Função para selecionar um artista da lista
  const handleSelectArtist = (artist) => {
    setSelectedArtist(artist.name); 
    setArtistId(artist.id); 
    setSearch(''); 
  };

  // Função para criar uma nova música
  const handleCreateMusic = () => {
    if (!password) {
      showAlert('A senha não pode estar vazia!'); // Exibe alerta se a senha estiver vazia
      return;
    }
    const newMusic = { imageSong, nameSong, duration, audio, artistId };
    console.log('Música criada:', JSON.stringify(newMusic, null, 2));
    createSong(imageSong, nameSong, duration, audio, artistId, password); 
    clearInput(); 
  };

  // Função para lidar com o evento de carregamento dos metadados do áudio
  const handleAudioLoaded = (event) => {
    const audioDuration = event.target.duration;
    const minutes = Math.floor(audioDuration / 60); // Calcula os minutos
    const seconds = Math.floor(audioDuration % 60); // Calcula os segundos
    const formattedDuration = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Formata a duração para mm:ss
    setDuration(formattedDuration); 
  };

  // Redireciona para a página de senha se o usuário não estiver autenticado
  if (!isAuthenticated) {
    navigate('/password');
  }

  // Exibe a tela de carregamento enquanto os dados estão sendo carregados
  if (isloading) {
    return <Loading />;
  }

  return (
    <div className="page-add__body">
      {/* Frame para inserir a senha de autenticação */}
      <div className="frame__password">
        <input
          type="text"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
      </div>

      {/* Frames do lado esquerdo */}
      <div className="page-add__box">
        {/* Frame de Adicionar Artista */}
        <div className="frame">
          <h2>Adicionar Artista</h2>
          <input
            type="text"
            placeholder="Nome"
            value={nameArtist}
            onChange={(e) => setNameArtist(e.target.value)}
            className="input"
          />
          <div className="page-add__box-inputs">
            <input
              type="text"
              placeholder="Imagem"
              value={imageArtist}
              onChange={(e) => setImageArtist(e.target.value)}
              className="input"
            />
            <input
              type="text"
              placeholder="Banner"
              value={bannerArtist}
              onChange={(e) => setBannerArtist(e.target.value)}
              className="input"
            />
          </div>
          <button onClick={handleCreateArtist} className="button">Criar Artista</button>
        </div>

        {/* Frame de Adicionar Música */}
        <div className="frame">
          <h2>Adicionar Música</h2>
          <input
            type="text"
            placeholder="Nome"
            value={nameSong}
            onChange={(e) => setNameSong(e.target.value)}
            className="input"
          />


          <div className="page-add__box-inputs">
            <input
              type="text"
              placeholder="Imagem"
              value={imageSong}
              onChange={(e) => setImageSong(e.target.value)}
              className="input"
            />
            <input
              type="text"
              placeholder="Áudio"
              value={audio}
              onChange={(e) => setAudio(e.target.value)}
              className="input"
            />
            <input
              type="text"
              placeholder="Duração"
              value={duration}
              readOnly
              className="input"
            />
          </div>
          <div className="searchContainer">
            <input
              type="text"
              placeholder="Buscar artista"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
            />
            {/* Lista de artistas filtrados */}
            {search && (
              <ul className="list">
                {filteredArtists.map((artist) => (
                  <li
                    key={artist.id}
                    onClick={() => handleSelectArtist(artist)}
                    className="listItem"
                  >
                    {artist.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input
            type="text"
            placeholder="Artista"
            value={selectedArtist}
            readOnly
            className="input"
          />
          <button onClick={handleCreateMusic} className="button">Criar Música</button>
        </div>
      </div>

      {/* Frames do lado direito */}
      <div className="page-add__box">
        {/* Pré-visualização da Imagem do Artista e banner */}
        <div className="frame__artist">
          <h2>Pré-visualização da Artista</h2>
          <div className="page-add__div-banner" style={{ backgroundImage: `url(${bannerArtist})` }}>
            <div className="page-add__div-image" style={{ backgroundImage: `url(${imageArtist})` }}></div>
          </div>
          <h1>{nameArtist}</h1>
        </div>

        {/* Pré-visualização da Música */}
        <div className="frame__song">
          <h2>Pré-visualização da Música</h2>
          <img src={imageSong} alt="" className="page-add__image-song" />
          <div className="page-add__div-name-audio">
            <h1>{nameSong}</h1>
            <p>{selectedArtist}</p>
            <p>{duration}</p>
          </div>
          {/* Player de Áudio */}
          {audio && (
            <div className="audio-player">
              <audio controls src={audio} onLoadedMetadata={handleAudioLoaded}>
                Seu navegador não suporta o elemento de áudio.
              </audio>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Add;
