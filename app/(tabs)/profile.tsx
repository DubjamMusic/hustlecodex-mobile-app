import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: "trophy.fill" | "star.fill" | "flame.fill" | "bolt.fill" | "target";
  unlocked: boolean;
  unlockedAt?: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  xp: number;
  xpRequired: number;
}

export default function ProfileScreen() {
  const colors = useColors();

  const [user] = useState({
    name: "Code Hustler",
    title: "Apprentice Developer",
    level: 7,
    totalXP: 12450,
    currentStreak: 12,
    longestStreak: 28,
    questsCompleted: 45,
    opportunitiesAnalyzed: 23,
    joinedDate: "Dec 2024",
  });

  const [achievements] = useState<Achievement[]>([
    { id: "1", title: "First Steps", description: "Complete your first quest", icon: "star.fill", unlocked: true, unlockedAt: "Dec 15, 2024" },
    { id: "2", title: "Streak Master", description: "Maintain a 7-day streak", icon: "flame.fill", unlocked: true, unlockedAt: "Dec 22, 2024" },
    { id: "3", title: "Opportunity Hunter", description: "Analyze 10 opportunities", icon: "target", unlocked: true, unlockedAt: "Jan 3, 2025" },
    { id: "4", title: "Code Warrior", description: "Reach Level 10", icon: "trophy.fill", unlocked: false },
    { id: "5", title: "Lightning Fast", description: "Complete 5 quests in one day", icon: "bolt.fill", unlocked: false },
    { id: "6", title: "Profit Prophet", description: "Find 50 opportunities", icon: "star.fill", unlocked: false },
  ]);

  const [skills] = useState<Skill[]>([
    { id: "1", name: "Problem Analysis", level: 4, maxLevel: 10, xp: 340, xpRequired: 500 },
    { id: "2", name: "Market Research", level: 3, maxLevel: 10, xp: 180, xpRequired: 400 },
    { id: "3", name: "Code Execution", level: 2, maxLevel: 10, xp: 90, xpRequired: 300 },
    { id: "4", name: "System Monitoring", level: 5, maxLevel: 10, xp: 420, xpRequired: 600 },
  ]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <ScreenContainer>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View className="px-6 pt-4 pb-6">
          <View className="items-center">
            {/* Avatar */}
            <View 
              className="w-24 h-24 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: colors.primary + '20', borderWidth: 3, borderColor: colors.primary }}
            >
              <Text className="text-4xl font-bold" style={{ color: colors.primary }}>
                {user.level}
              </Text>
            </View>
            <Text className="text-foreground text-2xl font-bold">{user.name}</Text>
            <Text className="text-muted text-base">{user.title}</Text>
            
            {/* Level Badge */}
            <View 
              className="mt-3 px-4 py-1.5 rounded-full flex-row items-center"
              style={{ backgroundColor: colors.secondary + '20' }}
            >
              <IconSymbol name="star.fill" size={14} color={colors.secondary} />
              <Text className="text-secondary text-sm font-semibold ml-1">Level {user.level}</Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="flex-row flex-wrap mx-6 mb-6 gap-3">
          <View className="bg-surface rounded-xl p-4 border border-border" style={{ width: '48%' }}>
            <IconSymbol name="bolt.fill" size={20} color={colors.accent} />
            <Text className="text-foreground text-2xl font-bold mt-2">{user.totalXP.toLocaleString()}</Text>
            <Text className="text-muted text-xs">Total XP</Text>
          </View>
          <View className="bg-surface rounded-xl p-4 border border-border" style={{ width: '48%' }}>
            <IconSymbol name="flame.fill" size={20} color={colors.warning} />
            <Text className="text-foreground text-2xl font-bold mt-2">{user.currentStreak}</Text>
            <Text className="text-muted text-xs">Day Streak</Text>
          </View>
          <View className="bg-surface rounded-xl p-4 border border-border" style={{ width: '48%' }}>
            <IconSymbol name="target" size={20} color={colors.success} />
            <Text className="text-foreground text-2xl font-bold mt-2">{user.questsCompleted}</Text>
            <Text className="text-muted text-xs">Quests Done</Text>
          </View>
          <View className="bg-surface rounded-xl p-4 border border-border" style={{ width: '48%' }}>
            <IconSymbol name="lightbulb.fill" size={20} color={colors.primary} />
            <Text className="text-foreground text-2xl font-bold mt-2">{user.opportunitiesAnalyzed}</Text>
            <Text className="text-muted text-xs">Opportunities</Text>
          </View>
        </View>

        {/* Skills Section */}
        <View className="px-6 mb-6">
          <Text className="text-foreground text-lg font-bold mb-3">Skill Tree</Text>
          <View className="bg-surface rounded-xl border border-border overflow-hidden">
            {skills.map((skill, index) => (
              <View 
                key={skill.id}
                className="p-4"
                style={index < skills.length - 1 ? { borderBottomWidth: 1, borderBottomColor: colors.border } : {}}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-foreground font-semibold">{skill.name}</Text>
                  <View className="flex-row items-center">
                    <Text className="text-primary font-bold">Lv.{skill.level}</Text>
                    <Text className="text-muted text-xs ml-1">/{skill.maxLevel}</Text>
                  </View>
                </View>
                <View className="h-2 bg-border rounded-full overflow-hidden">
                  <View 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${(skill.xp / skill.xpRequired) * 100}%`,
                      backgroundColor: colors.primary,
                    }}
                  />
                </View>
                <Text className="text-muted text-xs mt-1">{skill.xp}/{skill.xpRequired} XP to next level</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements Section */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-foreground text-lg font-bold">Achievements</Text>
            <Text className="text-muted text-sm">{unlockedCount}/{achievements.length} Unlocked</Text>
          </View>
          <View className="flex-row flex-wrap gap-3">
            {achievements.map((achievement) => (
              <View 
                key={achievement.id}
                className="bg-surface rounded-xl p-4 border border-border"
                style={{ 
                  width: '48%',
                  opacity: achievement.unlocked ? 1 : 0.5,
                }}
              >
                <View 
                  className="w-12 h-12 rounded-full items-center justify-center mb-3"
                  style={{ 
                    backgroundColor: achievement.unlocked ? colors.accent + '20' : colors.border,
                  }}
                >
                  {achievement.unlocked ? (
                    <IconSymbol name={achievement.icon} size={24} color={colors.accent} />
                  ) : (
                    <IconSymbol name="lock.fill" size={20} color={colors.muted} />
                  )}
                </View>
                <Text className="text-foreground font-semibold text-sm">{achievement.title}</Text>
                <Text className="text-muted text-xs mt-1" numberOfLines={2}>{achievement.description}</Text>
                {achievement.unlocked && achievement.unlockedAt && (
                  <Text className="text-success text-xs mt-2">{achievement.unlockedAt}</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Settings Section */}
        <View className="px-6 mb-6">
          <Text className="text-foreground text-lg font-bold mb-3">Settings</Text>
          <View className="bg-surface rounded-xl border border-border overflow-hidden">
            <TouchableOpacity 
              className="flex-row items-center justify-between p-4"
              style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <IconSymbol name="bell.fill" size={20} color={colors.primary} />
                <Text className="text-foreground font-medium ml-3">Notifications</Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.muted} />
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-row items-center justify-between p-4"
              style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <IconSymbol name="gear" size={20} color={colors.primary} />
                <Text className="text-foreground font-medium ml-3">Preferences</Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.muted} />
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-row items-center justify-between p-4"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <IconSymbol name="info.circle.fill" size={20} color={colors.primary} />
                <Text className="text-foreground font-medium ml-3">About HustleCodeX</Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.muted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Member Since */}
        <View className="px-6 mb-6 items-center">
          <Text className="text-muted text-sm">Member since {user.joinedDate}</Text>
          <Text className="text-muted text-xs mt-1">Version 1.0.0</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
