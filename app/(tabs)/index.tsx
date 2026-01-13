import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  target: number;
  completed: boolean;
}

interface UserStats {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  streak: number;
  opportunitiesFound: number;
  questsCompleted: number;
}

export default function HomeScreen() {
  const colors = useColors();
  
  const [stats, setStats] = useState<UserStats>({
    level: 7,
    currentXP: 2450,
    xpToNextLevel: 3000,
    streak: 12,
    opportunitiesFound: 23,
    questsCompleted: 45,
  });

  const [dailyQuests, setDailyQuests] = useState<Quest[]>([
    {
      id: "1",
      title: "Opportunity Hunter",
      description: "Analyze 3 profit opportunities",
      xpReward: 150,
      progress: 1,
      target: 3,
      completed: false,
    },
    {
      id: "2",
      title: "System Check",
      description: "Review console metrics",
      xpReward: 50,
      progress: 0,
      target: 1,
      completed: false,
    },
    {
      id: "3",
      title: "Streak Keeper",
      description: "Log in daily",
      xpReward: 25,
      progress: 1,
      target: 1,
      completed: true,
    },
  ]);

  const xpProgress = (stats.currentXP / stats.xpToNextLevel) * 100;

  const completeQuest = (questId: string) => {
    setDailyQuests(quests =>
      quests.map(q =>
        q.id === questId && !q.completed
          ? { ...q, completed: true, progress: q.target }
          : q
      )
    );
  };

  return (
    <ScreenContainer>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Text className="text-muted text-sm">Welcome back, Hustler</Text>
          <Text className="text-foreground text-3xl font-bold">Level Up Your Game</Text>
        </View>

        {/* Level & XP Card */}
        <View className="mx-6 mb-6 bg-surface rounded-2xl p-5 border border-border">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View 
                className="w-14 h-14 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: colors.primary + '20' }}
              >
                <Text className="text-2xl font-bold" style={{ color: colors.primary }}>
                  {stats.level}
                </Text>
              </View>
              <View>
                <Text className="text-foreground text-lg font-semibold">Level {stats.level}</Text>
                <Text className="text-muted text-sm">Code Apprentice</Text>
              </View>
            </View>
            <View className="items-end">
              <View className="flex-row items-center">
                <IconSymbol name="flame.fill" size={18} color={colors.warning} />
                <Text className="text-warning text-lg font-bold ml-1">{stats.streak}</Text>
              </View>
              <Text className="text-muted text-xs">Day Streak</Text>
            </View>
          </View>

          {/* XP Progress Bar */}
          <View className="mb-2">
            <View className="flex-row justify-between mb-1">
              <Text className="text-muted text-xs">XP Progress</Text>
              <Text className="text-muted text-xs">{stats.currentXP} / {stats.xpToNextLevel}</Text>
            </View>
            <View className="h-3 bg-border rounded-full overflow-hidden">
              <View 
                className="h-full rounded-full"
                style={{ 
                  width: `${xpProgress}%`,
                  backgroundColor: colors.primary,
                }}
              />
            </View>
          </View>
          <Text className="text-muted text-xs text-center">
            {stats.xpToNextLevel - stats.currentXP} XP to Level {stats.level + 1}
          </Text>
        </View>

        {/* Quick Stats */}
        <View className="flex-row mx-6 mb-6 gap-3">
          <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
            <IconSymbol name="lightbulb.fill" size={20} color={colors.accent} />
            <Text className="text-foreground text-2xl font-bold mt-2">{stats.opportunitiesFound}</Text>
            <Text className="text-muted text-xs">Opportunities</Text>
          </View>
          <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
            <IconSymbol name="target" size={20} color={colors.success} />
            <Text className="text-foreground text-2xl font-bold mt-2">{stats.questsCompleted}</Text>
            <Text className="text-muted text-xs">Quests Done</Text>
          </View>
          <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
            <IconSymbol name="trophy.fill" size={20} color={colors.secondary} />
            <Text className="text-foreground text-2xl font-bold mt-2">8</Text>
            <Text className="text-muted text-xs">Badges</Text>
          </View>
        </View>

        {/* Daily Quests Section */}
        <View className="px-6 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-foreground text-xl font-bold">Daily Quests</Text>
            <View className="bg-primary/20 px-3 py-1 rounded-full">
              <Text style={{ color: colors.primary }} className="text-xs font-semibold">
                {dailyQuests.filter(q => q.completed).length}/{dailyQuests.length} Complete
              </Text>
            </View>
          </View>

          {dailyQuests.map((quest) => (
            <TouchableOpacity
              key={quest.id}
              onPress={() => completeQuest(quest.id)}
              activeOpacity={0.7}
              className="bg-surface rounded-xl p-4 mb-3 border border-border"
              style={quest.completed ? { borderColor: colors.success + '50' } : {}}
            >
              <View className="flex-row items-start">
                <View 
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ 
                    backgroundColor: quest.completed ? colors.success + '20' : colors.primary + '20'
                  }}
                >
                  {quest.completed ? (
                    <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                  ) : (
                    <IconSymbol name="target" size={20} color={colors.primary} />
                  )}
                </View>
                <View className="flex-1">
                  <Text 
                    className="text-foreground font-semibold text-base"
                    style={quest.completed ? { textDecorationLine: 'line-through', opacity: 0.6 } : {}}
                  >
                    {quest.title}
                  </Text>
                  <Text className="text-muted text-sm mt-0.5">{quest.description}</Text>
                  
                  {/* Progress Bar */}
                  <View className="mt-3">
                    <View className="h-2 bg-border rounded-full overflow-hidden">
                      <View 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${(quest.progress / quest.target) * 100}%`,
                          backgroundColor: quest.completed ? colors.success : colors.primary,
                        }}
                      />
                    </View>
                    <View className="flex-row justify-between mt-1">
                      <Text className="text-muted text-xs">{quest.progress}/{quest.target}</Text>
                      <View className="flex-row items-center">
                        <IconSymbol name="bolt.fill" size={12} color={colors.accent} />
                        <Text className="text-accent text-xs font-semibold ml-1">+{quest.xpReward} XP</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Motivational Quote */}
        <View className="mx-6 mb-6 bg-surface rounded-xl p-5 border border-border">
          <Text className="text-muted text-xs uppercase tracking-wider mb-2">Daily Motivation</Text>
          <Text className="text-foreground text-base italic leading-relaxed">
            "Recovery = your main quest. Daily wins = XP. Keep grinding."
          </Text>
          <Text className="text-primary text-sm mt-2 font-semibold">— HustleCodeX</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
