// src/components/GameBoard.jsx
import React, { useContext, useState } from "react";
import { GameContext } from "../context/GameContext.jsx";
import { cardTypes, cardLabels } from "../data/cards.js";
import { players } from "../context/players.js";
import { diceRules } from "../data/diceRules";


function GameBoard() {
  const { state, dispatch } = useContext(GameContext);
  const [diceResult, setDiceResult] = useState(null);
  const [rolling, setRolling] = useState(false);

  const handleCardClick = (card) => {
    // El clic en carta ya no lanza el dado directamente
    dispatch({ type: "SELECT_CARD", payload: { card } });
  };

  const handleRollDice = () => {
    if (!state.selectedCard) {
      alert("Selecciona primero una carta para tirar el dado.");
      return;
    }

    setRolling(true);
    setDiceResult(null);

    // Simula la animación
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDiceResult(roll);
      setRolling(false);

      const card = state.selectedCard;
      const result = diceRules[card]?.[roll];

      dispatch({ type: "PROCESS_DICE_RESULT", payload: { roll, result } });
    }, 1000);
  };

  const cardsToRender = [
    cardTypes.DELANTERO_NORMAL,
    cardTypes.DELANTERO_ESTRELLA,
    cardTypes.CENTROCAMPISTA_NORMAL,
    cardTypes.CENTROCAMPISTA_ESTRELLA,
    cardTypes.DEFENSA_NORMAL,
    cardTypes.DEFENSA_ESTRELLA,
  ];

  function getCardImage(card, teamKey) {
    const teamName = state.selectedTeams[teamKey];
    if (!teamName) return "";

    const cardMap = {
      [cardTypes.DELANTERO_NORMAL]: "DC",
      [cardTypes.DELANTERO_ESTRELLA]: "DCS",
      [cardTypes.CENTROCAMPISTA_NORMAL]: "MD",
      [cardTypes.CENTROCAMPISTA_ESTRELLA]: "MDS",
      [cardTypes.DEFENSA_NORMAL]: "DF",
      [cardTypes.DEFENSA_ESTRELLA]: "DFS",
    };

    const cardCode = cardMap[card] ?? "UNKNOWN";
    const sanitizedTeamName = encodeURIComponent(teamName);
    return `/cards/${sanitizedTeamName}_${cardCode}.png`;
  }

  function getPlayerName(card, teamKey) {
    const teamName = state.selectedTeams[teamKey];
    return players[teamName]?.[card] ?? "Jugador desconocido";
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      {/* Top Section: Shields + Score */}
      <div className="flex justify-between items-center bg-white shadow-md rounded-xl px-6 py-4 mb-8">
        <div className="flex flex-col items-center">
          <img
            src={`/shields/Escudo_${state.selectedTeams.teamA}.png`}
            alt={state.selectedTeams.teamA}
            className="w-20 h-20 object-contain"
          />
          <p className="mt-2 font-semibold">{state.selectedTeams.teamA}</p>
        </div>

        <div className="text-center">
          <p className="text-4xl font-bold text-green-600">0 - 0</p>
          <p className="text-sm text-gray-600 mt-1">Marcador</p>
        </div>

        <div className="flex flex-col items-center">
          <img
            src={`/shields/Escudo_${state.selectedTeams.teamB}.png`}
            alt={state.selectedTeams.teamB}
            className="w-20 h-20 object-contain"
          />
          <p className="mt-2 font-semibold">{state.selectedTeams.teamB}</p>
        </div>
      </div>

      {/* Dado + Mensaje */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <img
          src={
            rolling
              ? "/dice/Dado.gif"
              : diceResult
              ? `/dice/${diceResult}.png`
              : "/dice/1.png"
          }
          alt="Dado"
          className="w-16 h-16 cursor-pointer"
          onClick={handleRollDice}
        />
        <p className="text-xl font-bold text-center text-gray-800">
          {state.message}
        </p>
      </div>

      {/* Cards Team A */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-10">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-700">
          {state.selectedTeams.teamA}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {cardsToRender.map((card) => (
            <div key={card} className="text-center">
              <img
                src={getCardImage(card, "teamA")}
                alt={card}
                className="w-24 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => handleCardClick(card)}
              />
              <p className="text-xs text-gray-500">
                {cardLabels[card]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cards Team B */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
          {state.selectedTeams.teamB}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {cardsToRender.map((card) => (
            <div key={card} className="text-center">
              <img
                src={getCardImage(card, "teamB")}
                alt={card}
                className="w-24 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => handleCardClick(card)}
              />
              <p className="mt-2 text-sm font-medium">
                {getPlayerName(card, "teamB")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Log del partido */}
      <div className="mt-10 bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800">
          📋 Log del Partido:
        </h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          {state.log.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GameBoard;
