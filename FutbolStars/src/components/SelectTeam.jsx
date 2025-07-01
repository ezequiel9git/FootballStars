// src/components/SelectTeam.jsx
import { useState } from "react";
import { useGame } from "../context/GameContext";

const TEAMS = ["Barcelona", "RealMadrid", "ManchesterCity", "Bayern"];

export default function SelectTeam({ onStart }) {
  const { dispatch } = useGame();
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");

  const handleStart = () => {
    if (teamA && teamB && teamA !== teamB) {
      dispatch({ type: "SET_TEAMS", payload: { teamA, teamB } });
      onStart();
    } else {
      alert("Selecciona dos equipos diferentes.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-xl text-center space-y-4">
      <h2 className="text-2xl font-bold">Selecciona los equipos</h2>

      <div className="space-y-2">
        <div>
          <label className="block font-semibold">Equipo A</label>
          <select
            value={teamA}
            onChange={(e) => setTeamA(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Seleccionar --</option>
            {TEAMS.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold">Equipo B</label>
          <select
            value={teamB}
            onChange={(e) => setTeamB(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Seleccionar --</option>
            {TEAMS.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleStart}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
      >
        ⚽ Comenzar Partido
      </button>
    </div>
  );
}
