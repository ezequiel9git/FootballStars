import { cardTypes } from "./cards.js";

export const diceRules = {
  [cardTypes.DELANTERO_ESTRELLA]: {
    1: { action: "PIERDE_TURNO" },
    2: { action: "PASA", next: cardTypes.CENTROCAMPISTA_ESTRELLA },
    3: { action: "PASA", next: cardTypes.DELANTERO_NORMAL },
    4: { action: "TIRA_DE_NUEVO" },
    5: { action: "GOL" },
    6: { action: "GOL" },
  },
  [cardTypes.DELANTERO_NORMAL]: {
    1: { action: "PIERDE_TURNO" },
    2: { action: "PASA", next: cardTypes.CENTROCAMPISTA_NORMAL },
    3: { action: "PASA", next: cardTypes.CENTROCAMPISTA_ESTRELLA },
    4: { action: "PASA", next: cardTypes.DELANTERO_ESTRELLA },
    5: { action: "TIRA_DE_NUEVO" },
    6: { action: "GOL" },
  },
  [cardTypes.CENTROCAMPISTA_ESTRELLA]: {
    1: { action: "PIERDE_TURNO" },
    2: { action: "PASA", next: cardTypes.DEFENSA_ESTRELLA },
    3: { action: "PASA", next: cardTypes.CENTROCAMPISTA_NORMAL },
    4: { action: "PASA", next: cardTypes.DELANTERO_NORMAL },
    5: { action: "PASA", next: cardTypes.DELANTERO_ESTRELLA },
    6: { action: "TIRA_DE_NUEVO" },
  },
  [cardTypes.CENTROCAMPISTA_NORMAL]: {
    1: { action: "PIERDE_TURNO" },
    2: { action: "PASA", next: cardTypes.DEFENSA_NORMAL },
    3: { action: "PASA", next: cardTypes.DEFENSA_ESTRELLA },
    4: { action: "TIRA_DE_NUEVO" },
    5: { action: "PASA", next: cardTypes.CENTROCAMPISTA_ESTRELLA },
    6: { action: "PASA", next: cardTypes.DELANTERO_NORMAL },
  },
  [cardTypes.DEFENSA_ESTRELLA]: {
    1: { action: "PIERDE_TURNO" },
    2: { action: "PASA", next: cardTypes.DEFENSA_NORMAL },
    3: { action: "PASA", next: cardTypes.DEFENSA_NORMAL },
    4: { action: "PASA", next: cardTypes.CENTROCAMPISTA_NORMAL },
    5: { action: "PASA", next: cardTypes.CENTROCAMPISTA_NORMAL },
    6: { action: "PASA", next: cardTypes.CENTROCAMPISTA_ESTRELLA },
  },
  [cardTypes.DEFENSA_NORMAL]: {
    1: { action: "PIERDE_TURNO" },
    2: { action: "PIERDE_TURNO" },
    3: { action: "TIRA_DE_NUEVO" },
    4: { action: "PASA", next: cardTypes.DEFENSA_ESTRELLA },
    5: { action: "PASA", next: cardTypes.CENTROCAMPISTA_NORMAL },
    6: { action: "PASA", next: cardTypes.CENTROCAMPISTA_ESTRELLA },
  },
};
