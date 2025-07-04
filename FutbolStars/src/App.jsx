// src/App.jsx
import { useGame } from "./context/GameContext";
import GameBoard from "./components/GameBoard";
import SelectTeam from "./components/SelectTeam";

function App() {
  const { state } = useGame();
  const { selectedTeams } = state;

  const equiposSeleccionados =
    selectedTeams.teamA && selectedTeams.teamB;

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/Fondo1.jpg')" }}>
      <main className="min-h-screen bg-gradient-to-b from-green-100 to-green-300 py-10">
        {equiposSeleccionados ? <GameBoard /> : <SelectTeam />}
      </main>
    </div>
  );
}

export default App;
