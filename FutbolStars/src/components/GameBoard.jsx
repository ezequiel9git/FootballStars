// src/components/GameBoard.jsx
import { useGame } from "../context/GameContext";

export default function GameBoard() {
  const { state, dispatch } = useGame();

  // Función para obtener el nombre del archivo de la carta
  function getCardImage(card, team) {
    const key = card
      .replace("Delantero", "DC")
      .replace("Centrocampista", "MD")
      .replace("Defensa", "DF")
      .replace(" Estrella", "S")
      .replace(" Normal", "")
      .toUpperCase();

    return `/cards/${key}_${team}.png`;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-2xl space-y-6 text-center">
      <h1 className="text-3xl font-bold">⚽ Football Stars</h1>

      {/* Marcador */}
      <div className="flex justify-around text-xl font-semibold">
        <span>Crystal FC: {state.goals.teamA} 🟦</span>
        <span>Dark FC: {state.goals.teamB} 🟥</span>
      </div>

      {/* Jugador actual y su carta */}
      <div className="p-4 bg-gray-100 rounded-xl flex flex-col items-center">
        <p className="text-lg mb-2">
          Turno de <strong>{state.possession.toUpperCase()}</strong>
        </p>
        <p className="text-xl mb-4">
          Jugador actual: <strong>{state.currentCard}</strong>
        </p>
        <img
          src={getCardImage(state.currentCard, state.possession)}
          alt={`${state.currentCard}`}
          className="w-40 h-auto shadow-lg rounded-xl border border-gray-300"
        />
      </div>

      {/* Botones de acción */}
      <div className="space-x-4">
        <button
          onClick={() => dispatch({ type: "ROLL_DICE" })}
          disabled={state.gameOver}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow disabled:opacity-50"
        >
          🎲 Tirar Dado
        </button>

        <button
          onClick={() => dispatch({ type: "RESET" })}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded shadow"
        >
          🔄 Reiniciar
        </button>
      </div>

      {/* Mensaje del turno */}
      <div className="p-4 text-lg bg-yellow-100 border border-yellow-300 rounded-xl">
        {state.message}
      </div>

      {/* Historial de jugadas */}
      <div className="text-left mt-6 max-h-60 overflow-y-auto text-sm bg-gray-50 p-3 rounded border">
        <h2 className="font-bold mb-2">Historial de jugadas</h2>
        {state.history.length === 0 ? (
          <p>No hay jugadas aún.</p>
        ) : (
          <ul className="list-disc list-inside space-y-1">
            {state.history.slice().reverse().map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

