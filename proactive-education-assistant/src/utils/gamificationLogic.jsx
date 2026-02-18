    export function getLevel(xp) {
  if (xp < 50) return { level: 1, name: "Beginner Educator" };
  if (xp < 150) return { level: 2, name: "Active Mentor" };
  if (xp < 300) return { level: 3, name: "Student Champion" };
  if (xp < 500) return { level: 4, name: "Dropout Defender" };
  return { level: 5, name: "Community Hero" };
}
