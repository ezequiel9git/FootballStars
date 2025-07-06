import React, { useContext, useState } from "react";
import { GameContext } from "../context/GameContext.jsx";
import { cardLabels } from "../data/cards.js";
import { players } from "../context/players.js";
import { diceRules } from "../data/diceRules";
import ConfettiBurst from "./ConfettiBurst";

function GameBoard() {
  // Acceso al estado global del juego y a la función dispatch
  const { state, dispatch } = useContext(GameContext);

  // Estado local para animación del dado y confeti
  const [diceResult, setDiceResult] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Maneja la tirada del dado principal
  const handleRollDice = () => {
    if (!state.currentPlayer || state.gameOver) return;

    setRolling(true);
    setDiceResult(null);

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      // Si hay córner, el dado secundario es null
      const secondaryRoll = state.cornerActive ? null : Math.floor(Math.random() * 6) + 1;
      setDiceResult(roll);
      setRolling(false);

      const { team, role } = state.currentPlayer;
      const teamName = state.selectedTeams[team];
      const playerName = players[teamName]?.[role] ?? "Jugador desconocido";
      const rule = diceRules?.[role]?.[roll];

      let message = `⚽ ${playerName} lanza el dado: ${roll}. `;
      let isGoal = false;
      if (!rule) {
        message += "Acción indefinida.";
      } else {
        switch (rule.action) {
          case "GOL":
            message += "¡GOOOOL!";
            isGoal = true;
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

      if (isGoal) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1200);
      }

      dispatch({
        type: "PROCESS_DICE_RESULT",
        payload: {
          roll,
          rule,
          logEntry: message,
          secondaryRoll, // <-- Añade el dado secundario aquí
        },
      });
    }, 1000);
  };

  // Cartas que se muestran para cada equipo
  const cardsToRender = [
    "DELANTERO_NORMAL",
    "DELANTERO_ESTRELLA",
    "CENTROCAMPISTA_NORMAL",
    "CENTROCAMPISTA_ESTRELLA",
    "DEFENSA_NORMAL",
    "DEFENSA_ESTRELLA",
  ];

  // Devuelve la ruta de la imagen de la carta según el equipo y tipo
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

  // Devuelve el nombre del jugador según la carta y el equipo
  function getPlayerName(card, teamKey) {
    const teamName = state.selectedTeams[teamKey];
    return players[teamName]?.[card] ?? "Jugador desconocido";
  }

  // Nombre del jugador activo current
  const activePlayer =
    state.currentPlayer &&
    players[state.selectedTeams[state.currentPlayer.team]]?.[state.currentPlayer.role];

  return (
    <>
      <div className="fixed inset-0 w-screen h-screen -z-10 bg-futbol bg-cover bg-center"></div>
      <div className="relative z-10">
        {/* 🎉 Animación de confeti al marcar gol */}
        <ConfettiBurst show={showConfetti} />
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
          {/* 🔢 Marcador de ambos equipos */}
          <div className="flex justify-between items-center bg-blue-100 rounded-2xl shadow-lg p-6">
            <div className="flex flex-col items-center">
              <img
                src={`/shields/Escudo_${state.selectedTeams.teamA}.png`}
                alt={state.selectedTeams.teamA}
                className="w-20 h-20 object-contain"
              />
              <p className="mt-2 font-semibold text-red-700">
                {state.selectedTeams.teamA}
              </p>
            </div>

            <div className="text-center">
              <p className="text-5xl font-extrabold text-blue-800">
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

          {/* 🎲 Dado y mensaje de acción */}
          <div className="flex justify-between items-center bg-blue-100 rounded-2xl shadow-lg p-6">
            <p className="text-lg font-semibold text-gray-700">
              Turno de: {activePlayer ?? "Desconocido"}
              {state.cornerActive && (
                <span className="ml-2 text-orange-600 font-bold animate-pulse">CÓRNER</span>
              )}
            </p>
            <div className="flex items-center space-x-6">
              {/* Dado principal */}
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
              {/* Dado secundario */}
              {!state.cornerActive && (
                <img
                  src={
                    rolling
                      ? "/dice/Dado.gif"
                      : state.secondaryDiceResult === 1
                      ? "/dice/BalonFuera.png"
                      : state.secondaryDiceResult === 6
                      ? "/dice/falta.png"
                      : [2, 3, 4, 5].includes(state.secondaryDiceResult)
                      ? "/dice/BalonJuego.png"
                      : "/dice/BalonJuego.png"
                  }
                  alt="Dado secundario"
                  className="w-16 h-16"
                  style={{ opacity: 0.85 }}
                />
              )}
            </div>
            <p className="text-xl font-bold text-gray-800">{state.message}</p>
          </div>

          {/* 🧩 Sección inferior: equipos y narración */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Equipo Local */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <img
                src={`/shields/Escudo_${state.selectedTeams.teamA}.png`}
                alt={state.selectedTeams.teamA}
                className="w-20 h-20 object-contain justify-items-center mx-auto mb-4"
              />
              <h2 className="text-xl font-bold text-red-700 text-center mb-4">
                {state.selectedTeams.teamA}
              </h2>
              <div className="grid grid-cols-2 gap-4 justify-items-center">
                {cardsToRender.map((card) => (
                  <div key={card} className="text-center">
                    <img
                      src={getCardImage(card, "teamA")}
                      alt={card}
                      className="w-35 h-45 mx-auto rounded-lg shadow-lg border-2 border-red-300 hover:scale-110 hover:shadow-red-400 transition"
                    />
                    <p className="text-xs text-gray-500">{cardLabels[card]}</p>
                    <p className="text-sm font-medium mt-1">{getPlayerName(card, "teamA")}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna central: carta en posesión y narrativa */}
            <div className="flex flex-col items-center">
              {/* Carta del jugador en posesión o córner */}
              <div className="flex flex-col items-center mb-4 bg-white/90 rounded-xl shadow-md p-3 w-full">
                {state.cornerActive ? (
                  <img
                    src="/cards/Corner.png"
                    alt="Córner"
                    className="w-24 h-32 mx-auto rounded-lg shadow-lg border-2 border-yellow-400 hover:scale-110 hover:shadow-yellow-400 transition"
                  />
                ) : (
                  state.currentPlayer && (
                    <img
                      src={getCardImage(state.currentPlayer.role, state.currentPlayer.team)}
                      alt={cardLabels[state.currentPlayer.role]}
                      className="w-34 h-50 mx-auto rounded-lg shadow-lg border-2 border-green-400 hover:scale-110 hover:shadow-green-400 transition"
                    />
                  )
                )}
                <p className="mt-2 text-base font-semibold text-gray-700">
                  {state.cornerActive
                    ? "Córner"
                    : state.currentPlayer
                    ? getPlayerName(state.currentPlayer.role, state.currentPlayer.team)
                    : ""}
                </p>
              </div>
              {/* Log del partido (narración) */}
              <div className="bg-white/80 rounded-xl shadow-inner p-4 overflow-y-auto max-h-[440px] border border-gray-200 backdrop-blur-sm scrollbar-thin scrollbar-thumb-green-400 w-full">
                <h3 className="text-lg font-bold text-gray-700 mb-3 text-center">
                  📋 Narración del partido
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {state.log.slice().reverse().map((entry, index) => (
                    <li key={index}>{entry}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Equipo Visitante */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <img
                src={`/shields/Escudo_${state.selectedTeams.teamB}.png`}
                alt={state.selectedTeams.teamB}
                className="w-20 h-20 object-contain justify-items-center mx-auto mb-4"
              />
              <h2 className="text-xl font-bold text-blue-700 text-center mb-4">
                {state.selectedTeams.teamB}
              </h2>
              <div className="grid grid-cols-2 gap-4 justify-items-center">
                {cardsToRender.map((card) => (
                  <div key={card} className="text-center">
                    <img
                      src={getCardImage(card, "teamB")}
                      alt={card}
                      className="w-35 h-45 mx-auto rounded-lg shadow-lg border-2 border-blue-300 hover:scale-110 hover:shadow-blue-400 transition"
                    />
                    <p className="text-xs text-gray-500">{cardLabels[card]}</p>
                    <p className="text-sm font-medium mt-1">{getPlayerName(card, "teamB")}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GameBoard;
