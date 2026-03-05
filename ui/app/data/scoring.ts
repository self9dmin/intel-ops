export function calculateScore(
  checkpoints: { points: number }[],
  timerSeconds: number,
  elapsedSeconds: number
): { baseScore: number; timeBonus: number; totalScore: number } {
  const baseScore = checkpoints.reduce((sum, cp) => sum + cp.points, 0);
  const timeRemaining = timerSeconds - elapsedSeconds;
  const timeBonus = Math.max(0, Math.floor(timeRemaining * 0.5));
  return { baseScore, timeBonus, totalScore: baseScore + timeBonus };
}
