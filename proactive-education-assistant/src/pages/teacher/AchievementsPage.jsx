import { useGame } from "../../context/GamificationContext";

export default function AchievementsPage() {
  const { achievements } = useGame();

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Achievements</h1>

      {achievements.length === 0 ? (
        <p className="text-slate-600">No achievements unlocked yet.</p>
      ) : (
        <ul className="space-y-2">
          {achievements.map((a, i) => (
            <li key={i} className="bg-white p-3 rounded border">
              🏅 {a}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
