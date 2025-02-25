import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faCirclePause, faBackwardStep, faForwardStep, faVolumeHigh, faVolumeLow, faVolumeOff } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

// Função de formatação de tempo para o player (exibe tempo no formato MM:SS)
const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, "0");
  const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

// Função para converter o tempo no formato MM:SS para segundos
const timeInSeconds = (timeString) => {
  const [minutes, seconds] = timeString.split(":").map(Number);
  return minutes * 60 + seconds;
};

const Player = ({ duration, audio, previousSong, nextSong, disablePrevious, disabledNext, type }) => {
  const audioPlayer = useRef(null);
  const volumePlayer = useRef(null);
  const progressPlayer = useRef(null);
  const navigate = useNavigate();

  // Estado para controlar o status de reprodução, tempo atual, volume, progresso, etc.
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(formatTime(0));
  const durationInSeconds = timeInSeconds(duration);
  const [isChangingTrack, setIsChangingTrack] = useState(false);
  const [volume, setVolume] = useState(parseFloat(localStorage.getItem("playerVolume")) || 1);
  const [progress, setProgress] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  // Efeito para garantir que a música comece a tocar após a troca de faixa
  useEffect(() => {
    if (isChangingTrack) {
      setIsChangingTrack(false);
      if (isPlaying && audioPlayer.current) {
        audioPlayer.current.play();
      }
    }
  }, [audio]);

  // Efeito para pausar ou reproduzir a música conforme o estado 'isPlaying'
  useEffect(() => {
    if (audioPlayer.current && !isChangingTrack) {
      isPlaying ? audioPlayer.current.play() : audioPlayer.current.pause();
    }
  }, [isPlaying]);

  // Efeito para salvar o volume no localStorage e atualizar o volume do player
  useEffect(() => {
    localStorage.setItem("playerVolume", volume);

    if (audioPlayer.current) {
      audioPlayer.current.volume = volume;
    }

    if (volumePlayer.current) {
      volumePlayer.current.style.setProperty("--_progress", `${volume * 100}%`);
    }
  }, [volume]);

  // Função para alternar entre play e pause
  const playPause = () => {
    if (audioPlayer.current) {
      setIsPlaying((prev) => !prev);
    }
  };

  // Função para atualizar o tempo e a barra de progresso enquanto a música toca
  const handleTimeUpdate = () => {
    if (audioPlayer.current && !isChangingTrack && !isSeeking) {
      const current = audioPlayer.current.currentTime;
      setCurrentTime(formatTime(current));
      const progressPercentage = (current / durationInSeconds) * 100;
      setProgress(progressPercentage);

      // Atualiza a barra de progresso visualmente
      if (progressPlayer.current) {
        progressPlayer.current.style.setProperty("--_progress", `${progressPercentage}%`);
      }
    }
  };

  // Função chamada quando o usuário começa a interagir com a barra de progresso
  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  // Função chamada durante o arrasto da barra de progresso
  const handleSeek = (event) => {
    const newProgress = event.target.value;
    const newTime = (newProgress / 100) * durationInSeconds;

    setProgress(newProgress);
    setCurrentTime(formatTime(newTime));

    // Atualiza a barra de progresso visualmente
    if (progressPlayer.current) {
      progressPlayer.current.style.setProperty("--_progress", `${newProgress}%`);
    }
  };

  // Função chamada quando o usuário termina de interagir com a barra de progresso
  const handleSeekEnd = (event) => {
    if (audioPlayer.current) {
      const newTime = (event.target.value / 100) * durationInSeconds;
      audioPlayer.current.currentTime = newTime;
      setCurrentTime(formatTime(newTime));
      setProgress(event.target.value);
      setIsSeeking(false);

      // Atualiza a barra de progresso visualmente
      event.target.style.setProperty("--_progress", `${event.target.value}%`);
    }
  };

  // Função chamada quando o volume é alterado
  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    event.target.style.setProperty("--_progress", `${newVolume * 100}%`); // Atualiza a barra de volume visualmente
  };

  // Função para definir o ícone do volume com base no valor
  const getVolumeIcon = () => {
    if (volume === 0) return faVolumeOff;
    if (volume < 0.3) return faVolumeLow;
    return faVolumeHigh;
  };

  // Função para finalizar a playlist quando a música acabar
  const endPlaylist = () => {
    if (audioPlayer.current) {
      audioPlayer.current.currentTime = 0; // Reseta o tempo
      setCurrentTime(formatTime(0)); // Atualiza o tempo para 00:00
      setProgress(0); // Reseta o progresso
      audioPlayer.current.pause();
      setIsPlaying(false);
    }
  };

  // Função para tocar a próxima ou anterior música
  const handleNextOrPrevious = async (nextTrackIdPromise) => {
    const nextTrackId = await nextTrackIdPromise;

    if (nextTrackId === undefined) {
      endPlaylist(); // Se não houver próxima música, finaliza a playlist
      return;
    }

    setIsChangingTrack(true); // Inicia a troca de música
    setCurrentTime(formatTime(0)); // Reseta o tempo
    navigate(`/song/${nextTrackId}/${type}`); // Navega para a próxima música

    // Reproduz a música após a navegação
    if (isPlaying) {
      setTimeout(() => {
        if (audioPlayer.current) {
          audioPlayer.current.play();
        }
      }, 1000);
    }
  };

  return (
    <div className="player">
      {/* Controladores de Play/Pause e Navegação */}
      <div className="player__controllers">
        <FontAwesomeIcon
          className="player__icon"
          icon={faBackwardStep}
          onClick={disablePrevious ? undefined : () => handleNextOrPrevious(previousSong())}
          style={{ color: disablePrevious ? "#666" : "#fff", cursor: disablePrevious ? "not-allowed" : "pointer" }}
        />
        <FontAwesomeIcon
          className="player__icon player__icon--play"
          icon={isPlaying ? faCirclePause : faCirclePlay}
          onClick={playPause}
        />

        <FontAwesomeIcon
          className="player__icon"
          icon={faForwardStep}
          onClick={disabledNext ? undefined : () => handleNextOrPrevious(nextSong())}
          style={{ color: disabledNext ? "#666" : "#fff", cursor: disabledNext ? "not-allowed" : "pointer" }}
        />
      </div>

      {/* Barra de Progresso */}
      <div className="player__bar">
        <p>{currentTime}</p>
        <input
          ref={progressPlayer}
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onMouseDown={handleSeekStart}
          onMouseUp={handleSeekEnd}
          onTouchStart={handleSeekStart}
          onTouchEnd={handleSeekEnd}
          onChange={handleSeek}
          className="player__bar"
          aria-label="Barra de progresso da música"
        />
        <p>{duration}</p>
      </div>

      {/* Controle de Volume */}
      <div className="player__volume">
        <label htmlFor="volumeControl">
          <FontAwesomeIcon icon={getVolumeIcon()} />
        </label>
        <input
          id="volumeControl"
          ref={volumePlayer}
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          aria-label="Controle de volume"
        />
      </div>

      {/* Elemento de Áudio */}
      <audio
        ref={audioPlayer}
        src={audio}
        onTimeUpdate={handleTimeUpdate}
        onEnded={(e) => handleNextOrPrevious(nextSong())}
      ></audio>
    </div>
  );
};

export default Player;
