// src/App.jsx
import { useState } from "react";
import GameBoard from "./components/GameBoard";
import SelectTeam from "./components/SelectTeam";
import { useGame } from "./context/GameContext";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const { state } = useGame();

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-100 to-green-300 py-10">
      {gameStarted && state.selectedTeams.teamA && state.selectedTeams.teamB ? (
        <GameBoard />
      ) : (
        <SelectTeam onStart={() => setGameStarted(true)} />
      )}
    </main>
  );
}

export default App;
