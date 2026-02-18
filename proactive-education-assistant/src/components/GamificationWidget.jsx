// import { useGame } from "../context/GamificationContext";
// import { getLevel } from "../utils/gamificationLogic";

// export default function GamificationWidget() {
//   const { xp, streak } = useGame();
//   const level = getLevel(xp);

//   return (
//     <div className="bg-white border rounded-lg p-4 space-y-2">
//       <p className="font-semibold">🎮 Teacher Progress</p>

//       <p className="text-sm">Level {level.level} — {level.name}</p>

//       <div className="w-full bg-slate-200 rounded-full h-2">
//         <div
//           className="bg-blue-600 h-2 rounded-full"
//           style={{ width: `${Math.min(xp, 100)}%` }}
//         />
//       </div>

//       <p className="text-xs text-slate-600">XP: {xp}</p>
//       <p className="text-xs text-slate-600">🔥 Streak: {streak} days</p>
//     </div>
//   );
// }




import { useGame } from "../context/GamificationContext";

export default function GamificationWidget() {
  const { xp } = useGame();

  return (
    <div className="bg-white p-4 rounded-md border mb-4">
      <p className="text-sm text-slate-500">Teacher XP</p>
      <p className="text-2xl font-semibold">{xp}</p>
    </div>
  );
}
