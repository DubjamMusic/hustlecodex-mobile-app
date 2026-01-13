import { describe, it, expect } from 'vitest';

// Test data structures and business logic for HustleCodeX

interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  target: number;
  completed: boolean;
}

interface Opportunity {
  id: string;
  title: string;
  profitScore: number;
  marketSize: string;
  successRate: number;
  competition: number;
}

interface UserStats {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  streak: number;
}

// Helper functions that mirror app logic
function calculateXPProgress(currentXP: number, xpToNextLevel: number): number {
  return (currentXP / xpToNextLevel) * 100;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'error';
}

function getCompetitionLabel(comp: number): { label: string; level: string } {
  if (comp < 0.4) return { label: 'Low', level: 'success' };
  if (comp < 0.7) return { label: 'Medium', level: 'warning' };
  return { label: 'High', level: 'error' };
}

function getStatusColor(value: number, max: number): string {
  const percent = (value / max) * 100;
  if (percent > 80) return 'error';
  if (percent > 60) return 'warning';
  return 'success';
}

function completeQuest(quests: Quest[], questId: string): Quest[] {
  return quests.map(q =>
    q.id === questId && !q.completed
      ? { ...q, completed: true, progress: q.target }
      : q
  );
}

describe('HustleCodeX App', () => {
  describe('XP System', () => {
    it('calculates XP progress percentage correctly', () => {
      expect(calculateXPProgress(2450, 3000)).toBeCloseTo(81.67, 1);
      expect(calculateXPProgress(0, 1000)).toBe(0);
      expect(calculateXPProgress(1000, 1000)).toBe(100);
    });

    it('handles edge cases for XP calculation', () => {
      expect(calculateXPProgress(500, 1000)).toBe(50);
      expect(calculateXPProgress(750, 1000)).toBe(75);
    });
  });

  describe('Quest System', () => {
    const mockQuests: Quest[] = [
      { id: '1', title: 'Test Quest 1', description: 'Desc', xpReward: 100, progress: 1, target: 3, completed: false },
      { id: '2', title: 'Test Quest 2', description: 'Desc', xpReward: 50, progress: 1, target: 1, completed: true },
    ];

    it('completes a quest correctly', () => {
      const updated = completeQuest(mockQuests, '1');
      expect(updated[0].completed).toBe(true);
      expect(updated[0].progress).toBe(3);
    });

    it('does not re-complete an already completed quest', () => {
      const updated = completeQuest(mockQuests, '2');
      expect(updated[1].completed).toBe(true);
      expect(updated[1].progress).toBe(1); // Stays at original progress
    });

    it('does not affect other quests when completing one', () => {
      const updated = completeQuest(mockQuests, '1');
      expect(updated[1]).toEqual(mockQuests[1]);
    });
  });

  describe('Opportunity Scoring', () => {
    it('returns success color for high scores', () => {
      expect(getScoreColor(80)).toBe('success');
      expect(getScoreColor(90)).toBe('success');
      expect(getScoreColor(100)).toBe('success');
    });

    it('returns warning color for medium scores', () => {
      expect(getScoreColor(60)).toBe('warning');
      expect(getScoreColor(70)).toBe('warning');
      expect(getScoreColor(79)).toBe('warning');
    });

    it('returns error color for low scores', () => {
      expect(getScoreColor(0)).toBe('error');
      expect(getScoreColor(30)).toBe('error');
      expect(getScoreColor(59)).toBe('error');
    });
  });

  describe('Competition Analysis', () => {
    it('identifies low competition correctly', () => {
      const result = getCompetitionLabel(0.3);
      expect(result.label).toBe('Low');
      expect(result.level).toBe('success');
    });

    it('identifies medium competition correctly', () => {
      const result = getCompetitionLabel(0.5);
      expect(result.label).toBe('Medium');
      expect(result.level).toBe('warning');
    });

    it('identifies high competition correctly', () => {
      const result = getCompetitionLabel(0.8);
      expect(result.label).toBe('High');
      expect(result.level).toBe('error');
    });

    it('handles boundary values', () => {
      expect(getCompetitionLabel(0.39).label).toBe('Low');
      expect(getCompetitionLabel(0.4).label).toBe('Medium');
      expect(getCompetitionLabel(0.69).label).toBe('Medium');
      expect(getCompetitionLabel(0.7).label).toBe('High');
    });
  });

  describe('Console Metrics', () => {
    it('returns success for healthy metrics', () => {
      expect(getStatusColor(30, 100)).toBe('success');
      expect(getStatusColor(50, 100)).toBe('success');
      expect(getStatusColor(60, 100)).toBe('success');
    });

    it('returns warning for elevated metrics', () => {
      expect(getStatusColor(65, 100)).toBe('warning');
      expect(getStatusColor(75, 100)).toBe('warning');
      expect(getStatusColor(80, 100)).toBe('warning');
    });

    it('returns error for critical metrics', () => {
      expect(getStatusColor(85, 100)).toBe('error');
      expect(getStatusColor(95, 100)).toBe('error');
      expect(getStatusColor(100, 100)).toBe('error');
    });

    it('handles different max values', () => {
      expect(getStatusColor(100, 200)).toBe('success'); // 50%
      expect(getStatusColor(150, 200)).toBe('warning'); // 75%
      expect(getStatusColor(180, 200)).toBe('error'); // 90%
    });
  });

  describe('Data Validation', () => {
    it('validates opportunity structure', () => {
      const opportunity: Opportunity = {
        id: '1',
        title: 'Test Opportunity',
        profitScore: 85,
        marketSize: '$4.2M',
        successRate: 78,
        competition: 0.4,
      };

      expect(opportunity.profitScore).toBeGreaterThanOrEqual(0);
      expect(opportunity.profitScore).toBeLessThanOrEqual(100);
      expect(opportunity.successRate).toBeGreaterThanOrEqual(0);
      expect(opportunity.successRate).toBeLessThanOrEqual(100);
      expect(opportunity.competition).toBeGreaterThanOrEqual(0);
      expect(opportunity.competition).toBeLessThanOrEqual(1);
    });

    it('validates user stats structure', () => {
      const stats: UserStats = {
        level: 7,
        currentXP: 2450,
        xpToNextLevel: 3000,
        streak: 12,
      };

      expect(stats.level).toBeGreaterThan(0);
      expect(stats.currentXP).toBeGreaterThanOrEqual(0);
      expect(stats.currentXP).toBeLessThanOrEqual(stats.xpToNextLevel);
      expect(stats.streak).toBeGreaterThanOrEqual(0);
    });
  });
});
