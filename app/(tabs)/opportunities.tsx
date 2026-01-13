import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Opportunity {
  id: string;
  title: string;
  description: string;
  profitScore: number;
  marketSize: string;
  successRate: number;
  executionCost: string;
  roiPotential: string;
  monetization: string;
  source: string;
  competition: number;
}

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "1",
    title: "Simple Task Tracker for Small Teams",
    description: "Every PM tool has features we don't need. Just want simple task tracking and deadlines.",
    profitScore: 87,
    marketSize: "$4.2M",
    successRate: 78,
    executionCost: "$15K",
    roiPotential: "12.4x",
    monetization: "SaaS Subscription",
    source: "Reddit",
    competition: 0.4,
  },
  {
    id: "2",
    title: "Automated Invoicing for Freelancers",
    description: "Spend 2 hours weekly on invoices. Current tools either too expensive or missing key features.",
    profitScore: 82,
    marketSize: "$3.1M",
    successRate: 71,
    executionCost: "$20K",
    roiPotential: "8.7x",
    monetization: "Freemium",
    source: "Reddit",
    competition: 0.5,
  },
  {
    id: "3",
    title: "Unified Remote Team Communication",
    description: "Using 5 different apps for team communication. Everything is fragmented. Need unified solution.",
    profitScore: 74,
    marketSize: "$8.5M",
    successRate: 62,
    executionCost: "$45K",
    roiPotential: "5.2x",
    monetization: "Enterprise License",
    source: "Reddit",
    competition: 0.7,
  },
  {
    id: "4",
    title: "Checkout Flow Optimizer",
    description: "Analytics show 67% cart abandonment at shipping step. Users frustrated with complex shipping options.",
    profitScore: 91,
    marketSize: "$12.3M",
    successRate: 85,
    executionCost: "$25K",
    roiPotential: "18.2x",
    monetization: "Commission Based",
    source: "Database Analytics",
    competition: 0.3,
  },
  {
    id: "5",
    title: "API Documentation Generator",
    description: "Developers struggling with API integration. 156 tickets this month about unclear documentation.",
    profitScore: 79,
    marketSize: "$2.8M",
    successRate: 74,
    executionCost: "$18K",
    roiPotential: "7.9x",
    monetization: "SaaS Subscription",
    source: "Support Tickets",
    competition: 0.45,
  },
];

export default function OpportunitiesScreen() {
  const colors = useColors();
  const [opportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.warning;
    return colors.error;
  };

  const getCompetitionLabel = (comp: number) => {
    if (comp < 0.4) return { label: "Low", color: colors.success };
    if (comp < 0.7) return { label: "Medium", color: colors.warning };
    return { label: "High", color: colors.error };
  };

  const renderOpportunity = ({ item }: { item: Opportunity }) => {
    const isExpanded = selectedId === item.id;
    const compInfo = getCompetitionLabel(item.competition);

    return (
      <TouchableOpacity
        onPress={() => setSelectedId(isExpanded ? null : item.id)}
        activeOpacity={0.8}
        className="bg-surface rounded-2xl p-5 mb-4 border border-border"
      >
        {/* Header Row */}
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1 mr-3">
            <Text className="text-foreground text-lg font-bold leading-tight">{item.title}</Text>
            <View className="flex-row items-center mt-1">
              <View className="bg-border px-2 py-0.5 rounded">
                <Text className="text-muted text-xs">{item.source}</Text>
              </View>
              <View className="ml-2 px-2 py-0.5 rounded" style={{ backgroundColor: compInfo.color + '20' }}>
                <Text style={{ color: compInfo.color }} className="text-xs font-medium">
                  {compInfo.label} Competition
                </Text>
              </View>
            </View>
          </View>
          
          {/* Profit Score Circle */}
          <View 
            className="w-16 h-16 rounded-full items-center justify-center border-2"
            style={{ borderColor: getScoreColor(item.profitScore) }}
          >
            <Text 
              className="text-xl font-bold"
              style={{ color: getScoreColor(item.profitScore) }}
            >
              {item.profitScore}
            </Text>
            <Text className="text-muted text-[10px]">SCORE</Text>
          </View>
        </View>

        {/* Description */}
        <Text className="text-muted text-sm leading-relaxed mb-4" numberOfLines={isExpanded ? undefined : 2}>
          {item.description}
        </Text>

        {/* Stats Grid */}
        <View className="flex-row flex-wrap gap-2 mb-3">
          <View className="bg-border/50 px-3 py-2 rounded-lg flex-row items-center">
            <IconSymbol name="chart.bar.fill" size={14} color={colors.primary} />
            <Text className="text-foreground text-sm font-semibold ml-1.5">{item.marketSize}</Text>
            <Text className="text-muted text-xs ml-1">Market</Text>
          </View>
          <View className="bg-border/50 px-3 py-2 rounded-lg flex-row items-center">
            <IconSymbol name="target" size={14} color={colors.success} />
            <Text className="text-foreground text-sm font-semibold ml-1.5">{item.successRate}%</Text>
            <Text className="text-muted text-xs ml-1">Success</Text>
          </View>
          <View className="bg-border/50 px-3 py-2 rounded-lg flex-row items-center">
            <IconSymbol name="arrow.up.right" size={14} color={colors.accent} />
            <Text className="text-foreground text-sm font-semibold ml-1.5">{item.roiPotential}</Text>
            <Text className="text-muted text-xs ml-1">ROI</Text>
          </View>
        </View>

        {/* Expanded Details */}
        {isExpanded && (
          <View className="mt-2 pt-4 border-t border-border">
            <View className="flex-row justify-between mb-3">
              <View>
                <Text className="text-muted text-xs">Execution Cost</Text>
                <Text className="text-foreground text-base font-semibold">{item.executionCost}</Text>
              </View>
              <View className="items-end">
                <Text className="text-muted text-xs">Monetization</Text>
                <Text className="text-foreground text-base font-semibold">{item.monetization}</Text>
              </View>
            </View>

            <View className="flex-row gap-3 mt-2">
              <TouchableOpacity 
                className="flex-1 py-3 rounded-xl items-center"
                style={{ backgroundColor: colors.primary }}
                activeOpacity={0.8}
              >
                <Text className="text-background font-semibold">Interested</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 py-3 rounded-xl items-center border border-border"
                activeOpacity={0.8}
              >
                <Text className="text-muted font-semibold">Skip</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Expand Indicator */}
        <View className="items-center mt-2">
          <IconSymbol 
            name="chevron.right" 
            size={16} 
            color={colors.muted} 
            style={{ transform: [{ rotate: isExpanded ? '-90deg' : '90deg' }] }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer>
      {/* Header */}
      <View className="px-6 pt-4 pb-4">
        <Text className="text-muted text-sm">Profit Intelligence</Text>
        <Text className="text-foreground text-3xl font-bold">Opportunities</Text>
        <Text className="text-muted text-sm mt-1">
          {opportunities.length} opportunities ranked by profit potential
        </Text>
      </View>

      {/* Filter Pills */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="px-6 mb-4"
        contentContainerStyle={{ gap: 8 }}
      >
        <View className="px-4 py-2 rounded-full" style={{ backgroundColor: colors.primary }}>
          <Text className="text-background text-sm font-semibold">All</Text>
        </View>
        <View className="px-4 py-2 rounded-full bg-surface border border-border">
          <Text className="text-muted text-sm">High Score</Text>
        </View>
        <View className="px-4 py-2 rounded-full bg-surface border border-border">
          <Text className="text-muted text-sm">Low Competition</Text>
        </View>
        <View className="px-4 py-2 rounded-full bg-surface border border-border">
          <Text className="text-muted text-sm">SaaS</Text>
        </View>
      </ScrollView>

      {/* Opportunities List */}
      <FlatList
        data={opportunities}
        renderItem={renderOpportunity}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}
