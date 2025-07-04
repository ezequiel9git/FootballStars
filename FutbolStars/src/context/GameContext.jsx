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
  cornerActive: false,
  cornerTeam: null,
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
      let cornerActive = state.cornerActive;
      let cornerTeam = state.cornerTeam;

      // Si estamos en modo córner, procesar el dado como córner
      if (state.cornerActive) {
        if ([1, 2, 4].includes(roll)) {
          message = `Córner para ${getPlayerName(role, team, state)}: Pierde el turno.`;
          nextPlayer = {
            team: getOppositeTeam(state.cornerTeam),
            role: "CENTROCAMPISTA_NORMAL",
          };
          cornerActive = false;
          cornerTeam = null;
        } else if ([3, 5].includes(roll)) {
          message = `Córner para ${getPlayerName(role, team, state)}: ¡Se repite el córner!`;
          // El mismo equipo repite el córner, no cambia el turno ni cornerActive
        } else if (roll === 6) {
          newScore[state.cornerTeam] += 1;
          message = `¡GOOOOL de córner de ${getPlayerName(role, team, state)}!`;
          if (newScore.teamA + newScore.teamB >= 5) {
            message += " 🏁 ¡Fin del partido!";
            gameOver = true;
          } else {
            nextPlayer = {
              team: getOppositeTeam(state.cornerTeam),
              role: "CENTROCAMPISTA_NORMAL",
            };
          }
          cornerActive = false;
          cornerTeam = null;
        }
        newLog.push(message);
        return {
          ...state,
          message,
          log: newLog,
          diceResult: roll,
          score: newScore,
          currentPlayer: gameOver ? state.currentPlayer : nextPlayer,
          gameOver,
          cornerActive,
          cornerTeam,
        };
      }

      // Si NO estamos en modo córner, procesar normalmente
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
                role: "CENTROCAMPISTA_NORMAL",
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
              role: "CENTROCAMPISTA_NORMAL",
            };
            message = `${playerName} pierde el turno. Balón para ${getPlayerName("CENTROCAMPISTA_NORMAL", opponentTeam, state)}.`;
            break;

          case "TIRA_DE_NUEVO":
            message = `${playerName} vuelve a tirar.`;
            break;

          case "CORNER":
            message = `¡Córner para ${playerName}! Lanza el dado para el córner.`;
            cornerActive = true;
            cornerTeam = team;
            // El jugador mantiene el turno para tirar el córner
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
        cornerActive,
        cornerTeam,
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
