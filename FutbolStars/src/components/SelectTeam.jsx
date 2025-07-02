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
    <div className="max-w-xl mx-auto mt-16 p-6 bg-white rounded-xl shadow-lg space-y-8 text-center">
      <h2 className="text-3xl font-bold">Selecciona tus equipos</h2>

      <div className="grid grid-cols-2 gap-6 items-center justify-center">
        {/* Selección Team A */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Equipo A</h3>
          <select
            value={teamA}
            onChange={(e) => setTeamA(e.target.value)}
            className="border rounded px-3 py-2 w-full"
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
              className="w-24 h-24 mt-4 mx-auto"
            />
          )}
        </div>

        {/* Selección Team B */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Equipo B</h3>
          <select
            value={teamB}
            onChange={(e) => setTeamB(e.target.value)}
            className="border rounded px-3 py-2 w-full"
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
              className="w-24 h-24 mt-4 mx-auto"
            />
          )}
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={!teamA || !teamB || teamA === teamB}
        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow disabled:opacity-50"
      >
        🚀 Comenzar partido
      </button>

      {teamA === teamB && teamA !== "" && (
        <p className="text-red-600 font-semibold mt-2">
          Los equipos no pueden ser iguales.
        </p>
      )}
    </div>
  );
}
