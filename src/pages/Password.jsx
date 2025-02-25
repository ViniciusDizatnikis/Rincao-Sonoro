import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import "../assets/Css/passwordPage.css";

const PasswordPage = () => {
  const correctPassword = "DevVinicius"; // Defina a senha correta aqui

  // Estado para armazenar a senha digitada pelo usuário
  const [password, setPassword] = useState("");

  // Estado para armazenar mensagens de erro
  const [error, setError] = useState("");

  // Hook para navegação entre rotas
  const navigate = useNavigate();

  //Estado de Carregamento
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se o acesso já foi concedido assim que o componente for montado
  useEffect(() => {
    // Verifica se o sessionStorage contém a chave "accessGranted" com valor "true"
    if (sessionStorage.getItem("accessGranted") === "true") {
      navigate("/add"); // Redireciona para a página "/add" se o acesso já foi concedido
    }

    setIsLoading(false);
  }, [navigate]);

  // Função chamada ao submeter o formulário
  const handleSubmit = (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)


    // Verifica se a senha digitada pelo usuário está correta
    if (password === correctPassword) {
      sessionStorage.setItem("accessGranted", "true"); // Armazena a variável no sessionStorage
      navigate("/add"); // Redireciona para a página "/add"
    } else {
      setError("Senha incorreta, tente novamente!"); // Exibe mensagem de erro se a senha estiver incorreta
    }
  };

  //Tela de Carregamento
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="password-page">
      {/* Título da página */}
      <h2>Insira a Senha para Acessar</h2>

      {/* Formulário para inserção da senha */}
      <form onSubmit={handleSubmit}>
        {/* Campo de entrada para a senha */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite a senha"
          required // Campo obrigatório
          className="password-input"
        />

        {/* Botão para submeter o formulário */}
        <button type="submit" className="password-button">
          Entrar
        </button>
      </form>

      {/* Exibe mensagem de erro se houver */}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default PasswordPage;