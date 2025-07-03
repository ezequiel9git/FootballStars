import React, { createContext, useReducer, useContext } from "react";
import { players } from "./players.js";
import { diceRules } from "../data/diceRules.js";

export const GameContext = createContext();

const initialState = {
  currentTurn: "teamA",
  selectedTeams: {
    teamA: "",
    teamB: "",
  },
  currentPlayer: {
    team: "teamA",
    role: "CENTROCAMPISTA_NORMAL", // Empieza el partido con este rol
  },
  score: {
    teamA: 0,
    teamB: 0,
  },
  log: [],
  message: "Empieza el partido",
  diceResult: null,
  gameOver: false,
};

function getPlayerName(cardType, teamKey, state) {
  const teamName = state.selectedTeams[teamKey] ?? teamKey;
  return players[teamName]?.[cardType] ?? "Jugador desconocido";
}

function getOppositeTeam(team) {
  return team === "teamA" ? "teamB" : "teamA";
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_TEAMS":
      return {
        ...state,
        selectedTeams: action.payload,
        message: `Empieza el partido: Centrocampista Normal de ${action.payload.teamA}`,
        currentPlayer: {
          team: "teamA",
          role: "CENTROCAMPISTA_NORMAL",
        },
        score: {
          teamA: 0,
          teamB: 0,
        },
        log: [],
        gameOver: false,
      };

    case "PROCESS_DICE_RESULT": {
      const { roll, rule, logEntry } = action.payload;
      const { team, role } = state.currentPlayer;
      const opponentTeam = getOppositeTeam(team);
      const playerName = getPlayerName(role, team, state);
      let message = "";
      let nextPlayer = { ...state.currentPlayer };
      let newScore = { ...state.score };
      let newLog = [...state.log, logEntry];
      let gameOver = false;

      if (!rule) {
        message = "Acción indefinida.";
        newLog.push(message);
      } else {
        switch (rule.action) {
          case "GOL":
            newScore[team] += 1;
            message = `¡GOOOOL de ${playerName}!`;
            newLog.push(message);
            if (newScore.teamA + newScore.teamB >= 5) {
              message += " 🏁 ¡Fin del partido!";
              gameOver = true;
            } else {
              nextPlayer = {
                team: opponentTeam,
                role: "CENTROCAMPISTA_NORMAL", // reinicia en centro
              };
            }
            break;

          case "PASA":
            nextPlayer = {
              team: rule.otherTeam ? opponentTeam : team,
              role: rule.next,
            };
            message = `${playerName} pasa a ${getPlayerName(nextPlayer.role, nextPlayer.team, state)}.`;
            break;

          case "PIERDE_TURNO":
            nextPlayer = {
              team: opponentTeam,
              role: "CENTROCAMPISTA_NORMAL", // reinicia en centro
            };
            message = `${playerName} pierde el turno. Balón para ${getPlayerName("CENTROCAMPISTA_NORMAL", opponentTeam, state)}.`;
            break;

          case "TIRA_DE_NUEVO":
            // El jugador mantiene el turno
            message = `${playerName} vuelve a tirar.`;
            break;

          default:
            message = "Acción no reconocida.";
            break;
        }
      }

      return {
        ...state,
        message,
        log: newLog,
        diceResult: roll,
        score: newScore,
        currentPlayer: gameOver ? state.currentPlayer : nextPlayer,
        gameOver,
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
