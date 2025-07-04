import React, { useContext, useState } from "react";
import { GameContext } from "../context/GameContext.jsx";
import { cardLabels } from "../data/cards.js";
import { players } from "../context/players.js";
import { diceRules } from "../data/diceRules";

function GameBoard() {
  const { state, dispatch } = useContext(GameContext);
  const [diceResult, setDiceResult] = useState(null);
  const [rolling, setRolling] = useState(false);

  const handleRollDice = () => {
    if (!state.currentPlayer || state.gameOver) return;

    setRolling(true);
    setDiceResult(null);

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDiceResult(roll);
      setRolling(false);

      const { team, role } = state.currentPlayer;
      const teamName = state.selectedTeams[team];
      const playerName = players[teamName]?.[role] ?? "Jugador desconocido";
      const rule = diceRules?.[role]?.[roll];

      let message = `⚽ ${playerName} lanza el dado: ${roll}. `;
      if (!rule) {
        message += "Acción indefinida.";
      } else {
        switch (rule.action) {
          case "GOL":
            message += "¡GOOOOL!";
            break;
          case "PASA":
            const nextPlayerName =
              players[state.selectedTeams[team]]?.[rule.next] ?? "Jugador desconocido";
            message += `Pasa el balón a ${nextPlayerName}.`;
            break;
          case "PIERDE_TURNO":
            message += "Pierde el turno.";
            break;
          case "TIRA_DE_NUEVO":
            message += "Vuelve a tirar.";
            break;
          default:
            message += "Acción indefinida.";
        }
      }

      dispatch({
        type: "PROCESS_DICE_RESULT",
        payload: {
          roll,
          rule,
          logEntry: message,
        },
      });
    }, 1000);
  };

  const cardsToRender = [
    "DELANTERO_NORMAL",
    "DELANTERO_ESTRELLA",
    "CENTROCAMPISTA_NORMAL",
    "CENTROCAMPISTA_ESTRELLA",
    "DEFENSA_NORMAL",
    "DEFENSA_ESTRELLA",
  ];

  function getCardImage(card, teamKey) {
    const teamName = state.selectedTeams[teamKey];
    if (!teamName) return "";

    const cardMap = {
      DELANTERO_NORMAL: "DC",
      DELANTERO_ESTRELLA: "DCS",
      CENTROCAMPISTA_NORMAL: "MD",
      CENTROCAMPISTA_ESTRELLA: "MDS",
      DEFENSA_NORMAL: "DF",
      DEFENSA_ESTRELLA: "DFS",
    };

    const cardCode = cardMap[card] ?? "UNKNOWN";
    const sanitizedTeamName = encodeURIComponent(teamName);
    return `/cards/${sanitizedTeamName}_${cardCode}.png`;
  }

  function getPlayerName(card, teamKey) {
    const teamName = state.selectedTeams[teamKey];
    return players[teamName]?.[card] ?? "Jugador desconocido";
  }

  const activePlayer =
    state.currentPlayer &&
    players[state.selectedTeams[state.currentPlayer.team]]?.[state.currentPlayer.role];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* 🔢 Marcador */}
      <div className="flex justify-between items-center bg-green-300 rounded-2xl shadow-lg p-6">
        <div className="flex flex-col items-center">
          <img
            src={`/shields/Escudo_${state.selectedTeams.teamA}.png`}
            alt={state.selectedTeams.teamA}
            className="w-20 h-20 object-contain"
          />
          <p className="mt-2 font-semibold text-green-700">
            {state.selectedTeams.teamA}
          </p>
        </div>

        <div className="text-center">
          <p className="text-5xl font-extrabold text-green-800">
            {state.score.teamA} - {state.score.teamB}
          </p>
          <p className="text-sm mt-1 text-gray-700 uppercase tracking-wide">Marcador</p>
        </div>

        <div className="flex flex-col items-center">
          <img
            src={`/shields/Escudo_${state.selectedTeams.teamB}.png`}
            alt={state.selectedTeams.teamB}
            className="w-20 h-20 object-contain"
          />
          <p className="mt-2 font-semibold text-blue-700">
            {state.selectedTeams.teamB}
          </p>
        </div>
      </div>

      {/* 🎲 Dado + Acción */}
      <div className="flex flex-col items-center text-center space-y-4">
        <p className="text-lg font-semibold text-gray-700">
          Turno de: {activePlayer ?? "Desconocido"}
        </p>
        <img
          src={
            rolling
              ? "/dice/Dado.gif"
              : diceResult
              ? `/dice/${diceResult}.png`
              : "/dice/1.png"
          }
          alt="Dado"
          className="w-20 h-20 cursor-pointer hover:scale-110 transition-transform"
          onClick={handleRollDice}
        />
        <p className="text-xl font-bold text-gray-800">{state.message}</p>
      </div>

      {/* 🧩 Sección inferior: 3 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipo Local */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-xl font-bold text-green-700 text-center mb-4">
            {state.selectedTeams.teamA}
          </h2>
          <div className="grid grid-cols-2 gap-4 justify-items-center">
            {cardsToRender.map((card) => (
              <div key={card} className="text-center">
                <img
                  src={getCardImage(card, "teamA")}
                  alt={card}
                  className="w-45" // Aumenta el tamaño de la carta
                />
                <p className="text-xs text-gray-500">{cardLabels[card]}</p>
                <p className="text-sm font-medium mt-1">{getPlayerName(card, "teamA")}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Log del partido */}
        <div className="bg-gray-50 rounded-xl shadow-inner p-4 overflow-y-auto max-h-[520px] border border-gray-200">
          <h3 className="text-lg font-bold text-gray-700 mb-3 text-center">
            📋 Log del Partido
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            {state.log.map((entry, index) => (
              <li key={index}>{entry}</li>
            ))}
          </ul>
        </div>

        {/* Equipo Visitante */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-xl font-bold text-blue-700 text-center mb-4">
            {state.selectedTeams.teamB}
          </h2>
          <div className="grid grid-cols-2 gap-4 justify-items-center">
            {cardsToRender.map((card) => (
              <div key={card} className="text-center">
                <img
                  src={getCardImage(card, "teamB")}
                  alt={card}
                  className="w-45" // Aumenta el tamaño de la carta
                />
                <p className="text-xs text-gray-500">{cardLabels[card]}</p>
                <p className="text-sm font-medium mt-1">{getPlayerName(card, "teamB")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameBoard;
