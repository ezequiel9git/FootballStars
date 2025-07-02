// GameContext.js
import React, { createContext, useReducer, useContext } from "react"; 
import { players } from "./players.js";


export const GameContext = createContext();

export const cardTypes = {
  DELANTERO_NORMAL: "DELANTERO_NORMAL",
  DELANTERO_ESTRELLA: "DELANTERO_ESTRELLA",
  CENTROCAMPISTA_NORMAL: "CENTROCAMPISTA_NORMAL",
  CENTROCAMPISTA_ESTRELLA: "CENTROCAMPISTA_ESTRELLA",
  DEFENSA_NORMAL: "DEFENSA_NORMAL",
  DEFENSA_ESTRELLA: "DEFENSA_ESTRELLA",
};

const initialState = {
  currentTurn: "teamA",
  teamHands: {
    teamA: [],
    teamB: [],
  },
  selectedTeams: {
    teamA: "",
    teamB: "",
  },
  log: [],
  ballPossession: "teamA",
  message: "Empieza el partido",
};

function getPlayerName(cardType, teamKey, state) {
  const teamName = state.selectedTeams[teamKey] ?? teamKey;
  return players[teamName]?.[cardType] ?? "Jugador desconocido";
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_TEAMS":
      return {
        ...state,
        selectedTeams: action.payload,
        message: `Empieza el partido: Centrocampista Normal de ${action.payload.teamA}`,
      };
    case "PLAY_CARD": {
      const card = action.payload.card;
      const team = state.ballPossession;

      const playerName = getPlayerName(card, team, state);
      const newLog = [...state.log, `Pasa el balón a ${playerName}`];

      return {
        ...state,
        log: newLog,
        currentTurn: team === "teamA" ? "teamB" : "teamA",
        ballPossession: team === "teamA" ? "teamB" : "teamA",
        message: `Turno de ${team === "teamA" ? "teamB" : "teamA"}`,
      };
    }
    case "ADD_GOAL":
      return {
        ...state,
        log: [...state.log, "¡GOOOOOOL!"],
      };
    default:
      return state;
  }
}

export function useGame() {
  return useContext(GameContext);
}

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
