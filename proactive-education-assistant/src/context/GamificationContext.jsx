import { createContext, useContext, useState } from "react";

const GameContext = createContext();

export function GamificationProvider({ children }) {
  const [xp, setXp] = useState(0);

  const addXP = (amount) => setXp(prev => prev + amount);

  return (
    <GameContext.Provider value={{ xp, addXP }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
