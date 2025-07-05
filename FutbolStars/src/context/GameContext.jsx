import React, { createContext, useReducer, useContext } from "react";
import { players } from "./players.js";
import { diceRules } from "../data/diceRules.js";

// Contexto global para el estado del juego
export const GameContext = createContext();

// Estado inicial del juego
const initialState = {
  currentTurn: "teamA", // Equipo que inicia
  selectedTeams: {
    teamA: "",
    teamB: "",
  },
  currentPlayer: {
    team: "teamA",
    role: "CENTROCAMPISTA_NORMAL", // Primer jugador
  },
  score: {
    teamA: 0,
    teamB: 0,
  },
  log: [], // Historial de jugadas y mensajes
  message: "Empieza el partido",
  diceResult: null, // Resultado del dado principal
  gameOver: false,
  cornerActive: false, // Indica si hay córner en juego
  cornerTeam: null,    // Equipo que ejecuta el córner
  secondaryDiceResult: null, // Resultado del dado secundario
  foulActive: false,   // Indica si hay falta activa
};

// Devuelve el nombre del jugador según el tipo de carta y equipo
function getPlayerName(cardType, teamKey, state) {
  const teamName = state.selectedTeams[teamKey] ?? teamKey;
  return players[teamName]?.[cardType] ?? "Jugador desconocido";
}

// Devuelve el equipo contrario
function getOppositeTeam(team) {
  return team === "teamA" ? "teamB" : "teamA";
}

// Reducer principal que gestiona las acciones del juego
function reducer(state, action) {
  switch (action.type) {
    case "SET_TEAMS":
      // Inicializa los equipos y el estado del partido
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
      // Procesa el resultado de los dados y actualiza el estado del juego
      const { roll, rule, logEntry, secondaryRoll } = action.payload;
      let mainRoll = roll;
      let secondaryDiceResult = secondaryRoll;
      let foulActive = state.foulActive;
      let foulJustActivated = false;
      let message = "";
      let newLog = [...state.log, logEntry];
      let nextPlayer = { ...state.currentPlayer };
      let newScore = { ...state.score };
      let gameOver = false;
      let cornerActive = state.cornerActive;
      let cornerTeam = state.cornerTeam;
      const { team, role } = state.currentPlayer;
      const opponentTeam = getOppositeTeam(team);
      const playerName = getPlayerName(role, team, state);

      // --- Lógica especial si hay córner activo ---
      if (state.cornerActive) {
        if ([1, 2, 4].includes(roll)) {
          // Pierde el turno tras el córner
          message = `Córner para ${getPlayerName(role, team, state)}: Pierde el turno.`;
          nextPlayer = {
            team: getOppositeTeam(state.cornerTeam),
            role: "CENTROCAMPISTA_NORMAL",
          };
          cornerActive = false;
          cornerTeam = null;
        } else if ([3, 5].includes(roll)) {
          // Se repite el córner
          message = `Córner para ${getPlayerName(role, team, state)}: ¡Se repite el córner!`;
        } else if (roll === 6) {
          // Gol de córner
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
          secondaryDiceResult,
          score: newScore,
          currentPlayer: gameOver ? state.currentPlayer : nextPlayer,
          gameOver,
          cornerActive,
          cornerTeam,
          foulActive: false, // nunca hay falta en córner
        };
      }

      // --- Procesamiento del dado secundario ---
      if (secondaryRoll === 1) {
        // Saque de banda: cambia la posesión
        message = `¡Saque de banda! Turno para ${getPlayerName("CENTROCAMPISTA_NORMAL", opponentTeam, state)}.`;
        nextPlayer = {
          team: opponentTeam,
          role: "CENTROCAMPISTA_NORMAL",
        };
        newLog.push(message);
        return {
          ...state,
          message,
          log: newLog,
          diceResult: roll,
          secondaryDiceResult,
          score: newScore,
          currentPlayer: nextPlayer,
          foulActive: false,
        };
      } else if (secondaryRoll === 6) {
        // Falta: la próxima tirada suma +1
        foulActive = true;
        foulJustActivated = true;
        message = `¡Falta a favor de ${playerName}! En la próxima tirada, suma +1 al dado principal (excepto si sale 6).`;
        newLog.push(message);
      }

      // Si hay falta activa, sumar +1 al dado principal (excepto si ya es 6)
      let effectiveRoll = mainRoll;
      if (state.foulActive && mainRoll < 6) {
        effectiveRoll = mainRoll + 1;
        message = `Se aplica la falta anterior: el dado principal suma +1 (de ${mainRoll} a ${effectiveRoll}).`;
        newLog.push(message);
        foulActive = false; // Se consume la falta
      }

      // --- Procesamiento normal de la jugada principal ---
      const effectiveRule = diceRules[role]?.[effectiveRoll];
      if (!effectiveRule) {
        message = "Acción indefinida.";
        newLog.push(message);
      } else {
        switch (effectiveRule.action) {
          case "GOL":
            // Suma gol y verifica si termina el partido
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
            // Pasa el balón al siguiente jugador
            nextPlayer = {
              team: effectiveRule.otherTeam ? opponentTeam : team,
              role: effectiveRule.next,
            };
            message = `${playerName} pasa a ${getPlayerName(nextPlayer.role, nextPlayer.team, state)}.`;
            break;
          case "PIERDE_TURNO":
            // Pierde el turno, cambia la posesión
            nextPlayer = {
              team: opponentTeam,
              role: "CENTROCAMPISTA_NORMAL",
            };
            message = `${playerName} pierde el turno. Balón para ${getPlayerName("CENTROCAMPISTA_NORMAL", opponentTeam, state)}.`;
            break;
          case "TIRA_DE_NUEVO":
            // El mismo jugador tira de nuevo
            message = `${playerName} vuelve a tirar.`;
            break;
          case "CORNER":
            // Se activa el córner
            message = `¡Córner para ${playerName}! Lanza el dado para el córner.`;
            cornerActive = true;
            cornerTeam = team;
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
        diceResult: mainRoll,
        secondaryDiceResult,
        score: newScore,
        currentPlayer: gameOver ? state.currentPlayer : nextPlayer,
        gameOver,
        cornerActive,
        cornerTeam,
        foulActive,
      };
    }

    default:
      return state;
  }
}

// Hook para consumir el contexto del juego
export function useGame() {
  return useContext(GameContext);
}

// Proveedor del contexto del juego
export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
