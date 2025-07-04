// src/components/SelectTeam.jsx
import { useState } from "react";
import { useGame } from "../context/GameContext";

const availableTeams = [
  "FC Barcelona",
  "Crystal FC",
  "Darkness FC",
  "Real Madrid CF",
];

export default function SelectTeam() {
  const { dispatch } = useGame();
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleStart = () => {
    if (!teamA || !teamB || teamA === teamB) return;

    dispatch({
      type: "SET_TEAMS",
      payload: { teamA, teamB },
    });

    setSubmitted(true);
  };

  if (submitted) {
    return null; // El GameBoard ya se renderiza desde App.jsx
  }

  return (
    <div className="max-w-xl mx-auto mt-16 p-8 bg-gradient-to-br from-blue-200 via-green-100 to-orange-300 rounded-2xl shadow-2xl border-4 border-green-700/30 space-y-10 text-center relative overflow-hidden">
      {/* Fondo decorativo de balón */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <svg width="320" height="320" viewBox="0 0 320 320" fill="none">
          <circle cx="160" cy="160" r="140" fill="#16a34a" />
          <circle cx="160" cy="160" r="100" fill="#fff" />
          <circle cx="160" cy="160" r="60" fill="#16a34a" />
        </svg>
      </div>

      <h2 className="text-4xl font-extrabold text-green-900 flex items-center justify-center gap-3 relative z-10">
        <span>⚽</span> Selecciona tus equipos
      </h2>

      <div className="grid grid-cols-2 gap-8 items-center justify-center relative z-10">
        {/* Selección Team A */}
        <div className="bg-white/80 rounded-xl shadow-lg p-6 border-2 border-red-500 flex flex-col items-center transition-transform hover:scale-105">
          <h3 className="text-xl font-bold mb-3 text-red-800 flex items-center gap-2">
            <span>🏠</span> Local
          </h3>
          <select
            value={teamA}
            onChange={(e) => setTeamA(e.target.value)}
            className="border-2 border-red-400 rounded px-3 py-2 w-full text-lg focus:ring-2 focus:ring-red-500 transition"
          >
            <option value="">Selecciona equipo</option>
            {availableTeams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
          {teamA && (
            <img
              src={`/shields/Escudo_${teamA}.png`}
              alt={teamA}
              className="w-24 h-24 mt-4 mx-auto drop-shadow-lg border-4 border-red-300 rounded-full bg-white"
            />
          )}
        </div>

        {/* Selección Team B */}
        <div className="bg-white/80 rounded-xl shadow-lg p-6 border-2 border-blue-500 flex flex-col items-center transition-transform hover:scale-105">
          <h3 className="text-xl font-bold mb-3 text-blue-800 flex items-center gap-2">
            <span>🛫</span> Visitante
          </h3>
          <select
            value={teamB}
            onChange={(e) => setTeamB(e.target.value)}
            className="border-2 border-blue-400 rounded px-3 py-2 w-full text-lg focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Selecciona equipo</option>
            {availableTeams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
          {teamB && (
            <img
              src={`/shields/Escudo_${teamB}.png`}
              alt={teamB}
              className="w-24 h-24 mt-4 mx-auto drop-shadow-lg border-4 border-blue-300 rounded-full bg-white"
            />
          )}
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={!teamA || !teamB || teamA === teamB}
        className="mt-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-full shadow-lg text-xl font-bold flex items-center gap-2 mx-auto transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        🚀 Comenzar partido
      </button>

      {teamA === teamB && teamA !== "" && (
        <p className="text-red-600 font-semibold mt-4 text-lg animate-bounce">
          Los equipos no pueden ser iguales.
        </p>
      )}
    </div>
  );
}
