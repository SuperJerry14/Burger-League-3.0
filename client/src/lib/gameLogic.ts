import type { Achievement } from './constants';

export class GameLogic {
  // Calculate hero cost with scaling
  static getHeroCost(baseCost: number, owned: number): number {
    return Math.floor(baseCost * Math.pow(1.15, owned));
  }

  // Calculate hero BPS with prestige bonus
  static getHeroBPS(baseBPS: number, prestigePoints: number): number {
    const prestigeMultiplier = 1 + (prestigePoints * 0.05);
    return baseBPS * prestigeMultiplier;
  }

  // Calculate click value with prestige bonus
  static getClickValue(basePower: number, prestigePoints: number): number {
    const prestigeMultiplier = 1 + (prestigePoints * 0.1);
    return Math.floor(basePower * prestigeMultiplier);
  }

  // Format large numbers with suffixes
  static formatNumber(num: number): string {
    if (num < 1000) return Math.floor(num).toString();
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
    if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
    return (num / 1000000000000).toFixed(1) + 'T';
  }

  // Check if achievement is completed
  static checkAchievement(achievement: Achievement, gameState: any): boolean {
    switch (achievement.type) {
      case 'burgers':
        return gameState.totalBurgers >= achievement.target;
      case 'clicks':
        return gameState.totalClicks >= achievement.target;
      case 'heroes':
        return gameState.owned.reduce((sum: number, count: number) => sum + count, 0) >= achievement.target;
      case 'bps':
        return gameState.bps >= achievement.target;
      default:
        return false;
    }
  }

  // Calculate prestige requirement
  static getPrestigeRequirement(): number {
    return 1000000; // 1 million burgers
  }

  // Calculate prestige points earned
  static calculatePrestigePoints(totalBurgers: number): number {
    return Math.floor(totalBurgers / this.getPrestigeRequirement());
  }

  // Generate random particle color
  static getRandomParticleColor(): string {
    const colors = ['#ffc107', '#ff8800', '#28a745', '#007bff', '#dc3545', '#6f42c1'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Calculate offline earnings
  static calculateOfflineEarnings(bps: number, offlineTimeMs: number): number {
    const maxOfflineHours = 24;
    const offlineHours = Math.min(offlineTimeMs / (1000 * 60 * 60), maxOfflineHours);
    return bps * offlineHours * 3600; // Convert to seconds
  }

  // Balance check for game economy
  static isGameBalanced(gameState: any): boolean {
    // Simple balance check - ensure player isn't progressing too fast
    const timePerBurger = gameState.totalClicks > 0 ? gameState.totalBurgers / gameState.totalClicks : 1;
    return timePerBurger > 0.1; // At least 0.1 seconds per burger on average
  }

  // Get achievement progress percentage
  static getAchievementProgress(achievement: Achievement, gameState: any): number {
    switch (achievement.type) {
      case 'burgers':
        return Math.min((gameState.totalBurgers / achievement.target) * 100, 100);
      case 'clicks':
        return Math.min((gameState.totalClicks / achievement.target) * 100, 100);
      case 'heroes':
        const totalHeroes = gameState.owned.reduce((sum: number, count: number) => sum + count, 0);
        return Math.min((totalHeroes / achievement.target) * 100, 100);
      case 'bps':
        return Math.min((gameState.bps / achievement.target) * 100, 100);
      default:
        return 0;
    }
  }
}
