import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { HEROES, ACHIEVEMENTS, HIDDEN_ACHIEVEMENTS, INITIAL_CLICK_POWER, THAT_GUY_BOSS } from "../constants";
import { GameLogic } from "../gameLogic";
import type { Hero, Achievement, Boss } from "../constants";

interface GameState {
  // Core game state
  burgers: number;
  bps: number;
  totalBurgers: number;
  totalClicks: number;
  clickPower: number;
  
  // Heroes and upgrades
  heroes: Hero[];
  owned: number[];
  
  // Achievements
  achievements: Achievement[];
  hiddenAchievements: Achievement[];
  
  // Notifications
  showNotification: (message: string) => void;
  notification: string;
  showNotificationPopup: boolean;
  
  // Boss battle
  boss: Boss;
  attackBoss: () => void;
  isBossUnlocked: () => boolean;
  
  // Prestige system
  prestigeLevel: number;
  prestigePoints: number;
  
  // Game management
  gameLoaded: boolean;
  lastSave: number;
  
  // Actions
  addBurgers: (amount: number) => void;
  manualClick: () => void;
  buyHero: (heroId: number) => boolean;
  upgradeClickPower: () => boolean;
  checkAchievements: () => void;
  canPrestige: () => boolean;
  prestige: () => void;
  saveGame: () => void;
  loadGame: () => void;
  resetGame: () => void;
}

export const useBurgerGame = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    burgers: 0,
    bps: 0,
    totalBurgers: 0,
    totalClicks: 0,
    clickPower: INITIAL_CLICK_POWER,
    heroes: [...HEROES],
    owned: new Array(HEROES.length).fill(0),
    achievements: ACHIEVEMENTS.map(a => ({ ...a, completed: false })),
    hiddenAchievements: HIDDEN_ACHIEVEMENTS.map(a => ({ ...a, completed: false })),
    notification: "",
    showNotificationPopup: false,
    boss: { ...THAT_GUY_BOSS },
    prestigeLevel: 0,
    prestigePoints: 0,
    gameLoaded: false,
    lastSave: Date.now(),

    addBurgers: (amount: number) => {
      set((state) => ({
        burgers: state.burgers + amount,
        totalBurgers: state.totalBurgers + amount
      }));
    },

    manualClick: () => {
      set((state) => {
        const clickValue = GameLogic.getClickValue(state.clickPower, state.prestigePoints);
        return {
          burgers: state.burgers + clickValue,
          totalBurgers: state.totalBurgers + clickValue,
          totalClicks: state.totalClicks + 1
        };
      });
    },

    buyHero: (heroId: number) => {
      const state = get();
      const hero = state.heroes[heroId];
      const owned = state.owned[heroId];
      const cost = GameLogic.getHeroCost(hero.cost, owned);
      
      if (state.burgers >= cost) {
        const newOwned = [...state.owned];
        newOwned[heroId]++;
        
        const bpsIncrease = GameLogic.getHeroBPS(hero.bps, state.prestigePoints);
        
        set({
          burgers: state.burgers - cost,
          owned: newOwned,
          bps: state.bps + bpsIncrease
        });
        
        return true;
      }
      
      return false;
    },

    upgradeClickPower: () => {
      const state = get();
      const cost = state.clickPower * 10;
      
      if (state.burgers >= cost) {
        set({
          burgers: state.burgers - cost,
          clickPower: state.clickPower + 1
        });
        return true;
      }
      
      return false;
    },

    showNotification: (message: string) => {
      set({ 
        notification: message, 
        showNotificationPopup: true 
      });
      setTimeout(() => {
        set({ showNotificationPopup: false });
      }, 3000);
    },

    checkAchievements: () => {
      const state = get();
      let hasNewAchievement = false;
      
      const updatedAchievements = state.achievements.map(achievement => {
        if (!achievement.completed && GameLogic.checkAchievement(achievement, state)) {
          hasNewAchievement = true;
          get().showNotification(`Achievement Unlocked: ${achievement.name}`);
          return { ...achievement, completed: true };
        }
        return achievement;
      });
      
      const updatedHiddenAchievements = state.hiddenAchievements.map(achievement => {
        if (!achievement.completed && GameLogic.checkAchievement(achievement, state)) {
          hasNewAchievement = true;
          get().showNotification(`Secret Achievement Unlocked: ${achievement.name}`);
          return { ...achievement, completed: true };
        }
        return achievement;
      });
      
      set({ 
        achievements: updatedAchievements,
        hiddenAchievements: updatedHiddenAchievements
      });
    },

    canPrestige: () => {
      const state = get();
      return state.totalBurgers >= 1000000;
    },

    prestige: () => {
      const state = get();
      if (!state.canPrestige()) return;
      
      const newPrestigePoints = Math.floor(state.totalBurgers / 1000000);
      
      set({
        burgers: 0,
        bps: 0,
        clickPower: INITIAL_CLICK_POWER,
        owned: new Array(HEROES.length).fill(0),
        prestigeLevel: state.prestigeLevel + 1,
        prestigePoints: state.prestigePoints + newPrestigePoints,
        achievements: ACHIEVEMENTS.map(a => ({ ...a, completed: false })),
        hiddenAchievements: HIDDEN_ACHIEVEMENTS.map(a => ({ ...a, completed: false }))
      });
      
      get().showNotification(`Prestige! Gained ${newPrestigePoints} prestige points!`);
    },

    isBossUnlocked: () => {
      const state = get();
      return state.totalBurgers >= THAT_GUY_BOSS.unlockRequirement;
    },

    attackBoss: () => {
      const state = get();
      if (!state.boss.isActive) {
        if (state.isBossUnlocked()) {
          set(prev => ({ 
            boss: { ...prev.boss, isActive: true },
            notification: "That Guy has appeared! Click him to attack!",
            showNotificationPopup: true
          }));
          setTimeout(() => set({ showNotificationPopup: false }), 3000);
        }
        return;
      }

      const damage = GameLogic.getClickValue(state.clickPower, state.prestigePoints) * 100;
      const newHealth = Math.max(0, state.boss.currentHealth - damage);
      
      if (newHealth <= 0 && !state.boss.isDefeated) {
        set(prev => ({ 
          boss: { ...prev.boss, currentHealth: 0, isDefeated: true, isActive: false },
          notification: "That Guy defeated! You've completed the game!",
          showNotificationPopup: true
        }));
        get().checkAchievements();
      } else {
        set(prev => ({ 
          boss: { ...prev.boss, currentHealth: newHealth }
        }));
      }
    },

    saveGame: () => {
      const state = get();
      const saveData = {
        burgers: state.burgers,
        bps: state.bps,
        totalBurgers: state.totalBurgers,
        totalClicks: state.totalClicks,
        clickPower: state.clickPower,
        owned: state.owned,
        achievements: state.achievements,
        hiddenAchievements: state.hiddenAchievements,
        boss: state.boss,
        prestigeLevel: state.prestigeLevel,
        prestigePoints: state.prestigePoints,
        lastSave: Date.now()
      };
      
      localStorage.setItem('burgerGameSave', JSON.stringify(saveData));
      set({ lastSave: Date.now() });
      console.log('Game saved successfully');
    },

    loadGame: () => {
      try {
        const saveData = localStorage.getItem('burgerGameSave');
        if (saveData) {
          const parsed = JSON.parse(saveData);
          
          // Calculate offline progress (max 24 hours)
          const offlineTime = Math.min(Date.now() - (parsed.lastSave || Date.now()), 24 * 60 * 60 * 1000);
          const offlineBurgers = (parsed.bps || 0) * (offlineTime / 1000);
          
          set({
            burgers: (parsed.burgers || 0) + offlineBurgers,
            bps: parsed.bps || 0,
            totalBurgers: (parsed.totalBurgers || 0) + offlineBurgers,
            totalClicks: parsed.totalClicks || 0,
            clickPower: parsed.clickPower || INITIAL_CLICK_POWER,
            owned: parsed.owned || new Array(HEROES.length).fill(0),
            achievements: parsed.achievements || ACHIEVEMENTS.map(a => ({ ...a, completed: false })),
            hiddenAchievements: parsed.hiddenAchievements || HIDDEN_ACHIEVEMENTS.map(a => ({ ...a, completed: false })),
            boss: parsed.boss || { ...THAT_GUY_BOSS },
            prestigeLevel: parsed.prestigeLevel || 0,
            prestigePoints: parsed.prestigePoints || 0,
            gameLoaded: true
          });
          
          if (offlineBurgers > 0) {
            console.log(`Welcome back! You earned ${Math.floor(offlineBurgers).toLocaleString()} burgers while away!`);
          }
        } else {
          set({ gameLoaded: true });
        }
      } catch (error) {
        console.error('Failed to load game:', error);
        set({ gameLoaded: true });
      }
    },

    resetGame: () => {
      localStorage.removeItem('burgerGameSave');
      set({
        burgers: 0,
        bps: 0,
        totalBurgers: 0,
        totalClicks: 0,
        clickPower: INITIAL_CLICK_POWER,
        owned: new Array(HEROES.length).fill(0),
        achievements: ACHIEVEMENTS.map(a => ({ ...a, completed: false })),
        hiddenAchievements: HIDDEN_ACHIEVEMENTS.map(a => ({ ...a, completed: false })),
        prestigeLevel: 0,
        prestigePoints: 0,
        gameLoaded: true,
        lastSave: Date.now()
      });
    }
  }))
);
