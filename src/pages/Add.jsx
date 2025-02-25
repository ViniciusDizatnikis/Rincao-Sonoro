import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArtist, getArtists, createSong } from '../../api/api';
import Loading from '../components/Loading';
import '../assets/Css/addPage.css';

const Add = () => {
  const navigate = useNavigate();

  // Estado para armazenar a senha de autenticação
  const [password, setPassword] = useState('');

  // Estados para Artista
  const [imageArtist, setImageArtist] = useState(''); // URL da imagem do artista
  const [nameArtist, setNameArtist] = useState(''); // Nome do artista
  const [bannerArtist, setBannerArtist] = useState(''); // URL do banner do artista

  // Estados para Música
  const [imageSong, setImageSong] = useState(''); // URL da imagem da música
  const [nameSong, setNameSong] = useState(''); // Nome da música
  const [selectedArtist, setSelectedArtist] = useState(''); // Nome do artista selecionado
  const [artistId, setArtistId] = useState(''); // ID do artista selecionado
  const [duration, setDuration] = useState(''); // Duração da música
  const [audio, setAudio] = useState(''); // URL do áudio da música
  const [search, setSearch] = useState(''); // Termo de busca para artistas
  const [artists, setArtists] = useState([]); // Lista de artistas

  // Estado para verificar se o usuário está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('accessGranted') === 'true'
  );

  //Estado de Carregamento
  const [isloading, setIsLoading] = useState(true);

  
  // Buscar artistas ao carregar o componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const artists = await getArtists(Infinity); // Busca todos os artistas
        setArtists(artists); // Atualiza o estado com a lista de artistas
      }catch(error){
        console.error('Erro ao buscar artistas:', error);
      }finally{
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated]);
  
  // Filtrar artistas com base na pesquisa
  const filteredArtists = search.trim()
  ? artists.filter((artist) => artist.name.toLowerCase().includes(search.toLowerCase()))
  : [];
  
  // Limpar todos os inputs
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
  
  // Função para criar um novo artista
  const handleCreateArtist = () => {
    const newArtist = { imageArtist, nameArtist, bannerArtist };
    console.log('Artista criado:', JSON.stringify(newArtist, null, 2));
    createArtist(nameArtist, imageArtist, bannerArtist, password); // Chama a API para criar o artista
    clearInput(); // Limpa os campos após a criação
  };
  
  // Função para selecionar um artista da lista
  const handleSelectArtist = (artist) => {
    setSelectedArtist(artist.name); // Define o nome do artista selecionado
    setArtistId(artist.id); // Define o ID do artista selecionado
    setSearch(''); // Limpa o campo de busca
  };
  
  // Função para criar uma nova música
  const handleCreateMusic = () => {
    const newMusic = { imageSong, nameSong, duration, audio, artistId };
    console.log('Música criada:', JSON.stringify(newMusic, null, 2));
    createSong(imageSong, nameSong, duration, audio, artistId, password); // Chama a API para criar a música
    clearInput(); // Limpa os campos após a criação
  };
  
  if(!isAuthenticated) {
    navigate('/password');
  }

  if(isloading){
    return <Loading />;
  }

  return (
    <div className="page-add__body">
      {/* Frame para inserir a senha de autenticação */}
      <div className='frame__password'>
        <input
          type="text"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
      </div>

      {/* Frames do lado esquerdo */}
      <div className='page-add__box'>
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
          <input
            type="text"
            placeholder="Duração"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
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
      <div className='page-add__box'>
        {/* Pré-visualização da Imagem do Artista e banner */}
        <div className='frame__artist'>
          <h2>Pré-visualização da Artista</h2>
          <div className='page-add__div-banner' style={{ backgroundImage: `url(${bannerArtist})` }}>
            <div className='page-add__div-image' style={{ backgroundImage: `url(${imageArtist})` }}></div>
          </div>
          <h1>{nameArtist}</h1>
        </div>

        {/* Pré-visualização da Música */}
        <div className='frame__song'>
          <h2>Pré-visualização da Música</h2>
          <img src={imageSong} alt="" className='page-add__image-song' />
          <div className='page-add__div-name-audio'>
            <h1>{nameSong}</h1>
            <p>{selectedArtist}</p>
            <p>{duration}</p>
          </div>
          {/* Player de Áudio */}
          {audio && (
            <div className="audio-player">
              <audio controls src={audio}>
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