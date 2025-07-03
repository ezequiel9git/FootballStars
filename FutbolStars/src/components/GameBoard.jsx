// src/components/GameBoard.jsx
import React, { useContext } from "react";
import { GameContext, cardTypes } from "../context/GameContext.jsx";
import { players } from "../context/players.js";

function GameBoard() {
  const { state, dispatch } = useContext(GameContext);

  const handleCardClick = (card) => {
    dispatch({ type: "PLAY_CARD", payload: { card } });
  };

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

  const cardsToRender = [
    cardTypes.DELANTERO_NORMAL,
    cardTypes.DELANTERO_ESTRELLA,
    cardTypes.CENTROCAMPISTA_NORMAL,
    cardTypes.CENTROCAMPISTA_ESTRELLA,
    cardTypes.DEFENSA_NORMAL,
    cardTypes.DEFENSA_ESTRELLA,
  ];

  return (
    <div>
      <h2>Equipo A: {state.selectedTeams.teamA}</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {cardsToRender.map((card) => (
          <div key={card}>
            <img
              src={getCardImage(card, "teamA")}
              alt={card}
              style={{ width: "100px", cursor: "pointer" }}
              onClick={() => handleCardClick(card)}
            />
            <p style={{ textAlign: "center" }}>{getPlayerName(card, "teamA")}</p>
          </div>
        ))}
      </div>

      <h2>Equipo B: {state.selectedTeams.teamB}</h2>
      <div style={{ display: "flex", gap: "10px" }}>
        {cardsToRender.map((card) => (
          <div key={card}>
            <img
              src={getCardImage(card, "teamB")}
              alt={card}
              style={{ width: "100px", cursor: "pointer" }}
              onClick={() => handleCardClick(card)}
            />
            <p style={{ textAlign: "center" }}>{getPlayerName(card, "teamB")}</p>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: "20px" }}>{state.message}</h3>
      <div style={{ marginTop: "10px" }}>
        <h4>Log del Partido:</h4>
        <ul>
          {state.log.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GameBoard;
