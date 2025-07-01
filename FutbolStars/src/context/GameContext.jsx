// src/context/GameContext.jsx
import { createContext, useReducer, useContext } from "react";
import { cardTypes } from "../data/cards";
import { diceRules } from "../data/diceRules";
import { actions } from "../data/actions";
import { rollDice } from "../utils/dice";

const GameContext = createContext();

const initialState = {
  currentPlayer: "teamA",
  currentCard: cardTypes.CENTROCAMPISTA_NORMAL,
  possession: "teamA",
  goals: {
    teamA: 0,
    teamB: 0,
  },
  history: [],
  gameOver: false,
  message: "Empieza el partido: Centrocampista Normal de Team A",
  dice: null,
  rolling: false,
  selectedTeams: {
    teamA: null,
    teamB: null,
  },
};

function applyDiceResult(state) {
  const dice = state.dice;
  const rule = diceRules[state.currentCard]?.[dice];
  const opponent = state.possession === "teamA" ? "teamB" : "teamA";

  const newState = { ...state };
  newState.history = [
    ...state.history,
    `⚽ ${state.possession.toUpperCase()} (${state.currentCard}) tiró un ${dice}`,
  ];

  switch (rule) {
    case actions.GOL:
      newState.goals[state.possession]++;
      newState.message = `GOOOOL de ${state.possession.toUpperCase()} 🎉`;
      newState.currentCard = cardTypes.CENTROCAMPISTA_NORMAL;
      newState.possession = opponent;
      break;

    case actions.REPETIR_TIRO:
      newState.message = `Repite el tiro (${state.currentCard})`;
      break;

    case actions.PIERDE_TURNO_CENTRO_NORMAL_RIVAL:
      newState.possession = opponent;
      newState.currentCard = cardTypes.CENTROCAMPISTA_NORMAL;
      newState.message = `Pierde el turno. Balón al Centrocampista Normal de ${opponent}`;
      break;

    case actions.PIERDE_TURNO_DEFENSA_NORMAL_RIVAL:
      newState.possession = opponent;
      newState.currentCard = cardTypes.DEFENSA_NORMAL;
      newState.message = `Pierde el turno. Balón al Defensa Normal de ${opponent}`;
      break;

    case actions.PIERDE_TURNO_DELANTERO_NORMAL_RIVAL:
      newState.possession = opponent;
      newState.currentCard = cardTypes.DELANTERO_NORMAL;
      newState.message = `Pierde el turno. Balón al Delantero Normal de ${opponent}`;
      break;

    default:
      newState.currentCard = rule;
      newState.message = `Pasa el balón a ${rule}`;
      break;
  }

  if (newState.goals.teamA + newState.goals.teamB >= 5) {
    newState.message = `🏁 Final del partido. Resultado: ${newState.goals.teamA} - ${newState.goals.teamB}`;
    newState.gameOver = true;
  }

  return newState;
}

function gameReducer(state, action) {
  switch (action.type) {
    case "ROLL_DICE":
      if (state.rolling || state.gameOver) return state;

      return {
        ...state,
        dice: rollDice(),
        rolling: true,
      };

    case "END_ROLL":
      return {
        ...applyDiceResult({ ...state, rolling: false }),
      };

    case "RESET":
      return {
        ...initialState,
        selectedTeams: state.selectedTeams, // conservar equipos seleccionados
      };

    case "SET_TEAMS":
      return {
        ...state,
        selectedTeams: {
          teamA: action.payload.teamA,
          teamB: action.payload.teamB,
        },
        gameOver: false,
        history: [],
        goals: { teamA: 0, teamB: 0 },
        possession: "teamA",
        currentPlayer: "teamA",
        currentCard: cardTypes.CENTROCAMPISTA_NORMAL,
        message: `Comienza el partido: ${action.payload.teamA} vs ${action.payload.teamB}`,
      };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
