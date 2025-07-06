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
    <>
      {equiposSeleccionados ? <GameBoard /> : <SelectTeam />}
    </>
  );
}

export default App;
