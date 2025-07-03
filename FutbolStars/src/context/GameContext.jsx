// src/context/GameContext.jsx
import React, { createContext, useReducer, useContext } from "react";
import { players } from "./players.js";
import { cardTypes } from "../data/cards.js";
import { diceRules } from "../data/diceRules.js";

export const GameContext = createContext();

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
  selectedCard: null,
  log: [],
  ballPossession: "teamA",
  message: "Empieza el partido",
  diceResult: null,
  score: {
    teamA: 0,
    teamB: 0,
  },
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

    case "SELECT_CARD":
      return {
        ...state,
        selectedCard: action.payload,
        message: `Seleccionado: ${getPlayerName(action.payload, state.ballPossession, state)}`,
      };

    case "ROLL_DICE":
      return {
        ...state,
        diceResult: action.payload,
      };

    case "PROCESS_DICE_RESULT": {
      const { selectedCard, ballPossession, diceResult } = state;
      const opponent = ballPossession === "teamA" ? "teamB" : "teamA";
      const result = diceRules[selectedCard]?.[diceResult];

      let newLog = [...state.log, `⚽ ${getPlayerName(selectedCard, ballPossession, state)} lanza el dado: ${diceResult}`];
      let message = "";
      let nextTurn = opponent;
      let score = { ...state.score };

      switch (result) {
        case "GOL":
          score[ballPossession] += 1;
          message = `¡GOOOOOL de ${getPlayerName(selectedCard, ballPossession, state)}!`;
          newLog.push(message);
          break;
        case "REPETIR_TIRO":
          message = `${getPlayerName(selectedCard, ballPossession, state)} repite turno`;
          newLog.push(message);
          nextTurn = ballPossession;
          break;
        case "PIERDE_TURNO_DEFENSA_NORMAL_RIVAL":
        case "PIERDE_TURNO_DELANTERO_NORMAL_RIVAL":
        case "PIERDE_TURNO_CENTRO_NORMAL_RIVAL":
          message = `¡${opponent} pierde el turno!`;
          newLog.push(message);
          nextTurn = ballPossession;
          break;
        default:
          if (Object.values(cardTypes).includes(result)) {
            const targetName = getPlayerName(result, ballPossession, state);
            message = `Pasa a ${targetName}`;
            newLog.push(message);
          } else {
            message = "Acción indefinida";
            newLog.push(message);
          }
          break;
      }

      return {
        ...state,
        message,
        log: newLog,
        currentTurn: nextTurn,
        ballPossession: nextTurn,
        selectedCard: null,
        diceResult: null,
        score,
      };
    }

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
