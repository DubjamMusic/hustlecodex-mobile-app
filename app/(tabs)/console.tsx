import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Metric {
  id: string;
  title: string;
  value: number;
  max: number;
  unit: string;
  icon: "cpu" | "server.rack" | "network" | "cloud.fill";
  trend: number;
}

interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  time: string;
}

interface Integration {
  id: string;
  name: string;
  enabled: boolean;
  icon: "cloud.fill" | "server.rack" | "network";
}

export default function ConsoleScreen() {
  const colors = useColors();
  
  const [metrics, setMetrics] = useState<Metric[]>([
    { id: "1", title: "CPU Utilization", value: 34, max: 100, unit: "%", icon: "cpu", trend: 2.3 },
    { id: "2", title: "Memory Usage", value: 62, max: 100, unit: "%", icon: "server.rack", trend: -1.5 },
    { id: "3", title: "Disk I/O", value: 28, max: 100, unit: "%", icon: "network", trend: 0.8 },
    { id: "4", title: "Network Latency", value: 12, max: 200, unit: "ms", icon: "cloud.fill", trend: -3.2 },
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      severity: "critical",
      title: "High CPU Spike on prod-server-03",
      description: "CPU utilization exceeded 85% threshold for 5 minutes",
      time: "2 min ago",
    },
    {
      id: "2",
      severity: "warning",
      title: "Memory Pressure - Database Cluster",
      description: "Memory usage at 92% on database-01.us-east-1.prod",
      time: "5 min ago",
    },
    {
      id: "3",
      severity: "info",
      title: "Deployment Complete",
      description: "v2.4.1 successfully deployed to us-west-2 region",
      time: "12 min ago",
    },
  ]);

  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: "1", name: "AWS", enabled: true, icon: "cloud.fill" },
    { id: "2", name: "GCP", enabled: true, icon: "cloud.fill" },
    { id: "3", name: "Azure", enabled: false, icon: "cloud.fill" },
    { id: "4", name: "Kubernetes", enabled: true, icon: "server.rack" },
  ]);

  const [systemStatus, setSystemStatus] = useState({
    status: "Operational",
    uptime: 99.97,
    activeAlerts: 3,
    deployments: 14,
  });

  // Simulate real-time metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(5, Math.min(metric.max * 0.95, metric.value + (Math.random() - 0.5) * 8)),
        trend: (Math.random() - 0.5) * 10,
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, max: number) => {
    const percent = (value / max) * 100;
    if (percent > 80) return colors.error;
    if (percent > 60) return colors.warning;
    return colors.success;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return colors.error;
      case "warning": return colors.warning;
      default: return colors.primary;
    }
  };

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(int => 
      int.id === id ? { ...int, enabled: !int.enabled } : int
    ));
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    setSystemStatus(prev => ({ ...prev, activeAlerts: prev.activeAlerts - 1 }));
  };

  return (
    <ScreenContainer>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-4">
          <View className="flex-row items-center">
            <View 
              className="w-10 h-10 rounded-xl items-center justify-center mr-3"
              style={{ backgroundColor: colors.primary + '20' }}
            >
              <IconSymbol name="chart.bar.fill" size={22} color={colors.primary} />
            </View>
            <View>
              <Text className="text-foreground text-2xl font-bold">Prestige Console</Text>
              <Text className="text-muted text-sm">Infrastructure Intelligence</Text>
            </View>
          </View>
        </View>

        {/* Status Bar */}
        <View className="flex-row mx-6 mb-6 gap-3">
          <View className="flex-1 bg-surface rounded-xl p-3 border border-border">
            <Text className="text-muted text-xs mb-1">System Status</Text>
            <View className="flex-row items-center">
              <View 
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: colors.success }}
              />
              <Text className="text-success text-sm font-semibold">{systemStatus.status}</Text>
            </View>
          </View>
          <View className="flex-1 bg-surface rounded-xl p-3 border border-border">
            <Text className="text-muted text-xs mb-1">Uptime</Text>
            <Text className="text-success text-lg font-bold">{systemStatus.uptime}%</Text>
          </View>
          <View className="flex-1 bg-surface rounded-xl p-3 border border-border">
            <Text className="text-muted text-xs mb-1">Alerts</Text>
            <Text className="text-warning text-lg font-bold">{systemStatus.activeAlerts}</Text>
          </View>
        </View>

        {/* Real-time Metrics */}
        <View className="px-6 mb-6">
          <Text className="text-foreground text-lg font-bold mb-3">Real-Time Metrics</Text>
          <View className="flex-row flex-wrap gap-3">
            {metrics.map((metric) => (
              <View 
                key={metric.id}
                className="bg-surface rounded-xl p-4 border border-border"
                style={{ width: '48%' }}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View 
                    className="w-8 h-8 rounded-lg items-center justify-center"
                    style={{ backgroundColor: colors.primary + '20' }}
                  >
                    <IconSymbol name={metric.icon} size={16} color={colors.primary} />
                  </View>
                  <View className="flex-row items-center">
                    <IconSymbol 
                      name={metric.trend >= 0 ? "arrow.up.right" : "arrow.up.right"} 
                      size={12} 
                      color={metric.trend >= 0 ? colors.error : colors.success}
                      style={{ transform: [{ rotate: metric.trend >= 0 ? '0deg' : '90deg' }] }}
                    />
                    <Text 
                      className="text-xs ml-0.5"
                      style={{ color: metric.trend >= 0 ? colors.error : colors.success }}
                    >
                      {Math.abs(metric.trend).toFixed(1)}%
                    </Text>
                  </View>
                </View>
                <Text className="text-muted text-xs mb-1">{metric.title}</Text>
                <Text className="text-foreground text-2xl font-bold">
                  {metric.value.toFixed(0)}{metric.unit}
                </Text>
                <View className="h-1.5 bg-border rounded-full overflow-hidden mt-2">
                  <View 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${(metric.value / metric.max) * 100}%`,
                      backgroundColor: getStatusColor(metric.value, metric.max),
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Active Alerts */}
        <View className="px-6 mb-6">
          <Text className="text-foreground text-lg font-bold mb-3">Active Alerts</Text>
          {alerts.length === 0 ? (
            <View className="bg-surface rounded-xl p-6 border border-border items-center">
              <IconSymbol name="checkmark.circle.fill" size={32} color={colors.success} />
              <Text className="text-foreground font-semibold mt-2">All Clear</Text>
              <Text className="text-muted text-sm">No active alerts</Text>
            </View>
          ) : (
            alerts.map((alert) => (
              <TouchableOpacity
                key={alert.id}
                onPress={() => dismissAlert(alert.id)}
                activeOpacity={0.8}
                className="bg-surface rounded-xl p-4 mb-3 border-l-4"
                style={{ 
                  borderLeftColor: getSeverityColor(alert.severity),
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
              >
                <View className="flex-row items-start">
                  <View 
                    className="w-8 h-8 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: getSeverityColor(alert.severity) + '20' }}
                  >
                    <IconSymbol 
                      name={alert.severity === 'info' ? 'info.circle.fill' : 'exclamationmark.triangle.fill'} 
                      size={16} 
                      color={getSeverityColor(alert.severity)} 
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground font-semibold">{alert.title}</Text>
                    <Text className="text-muted text-sm mt-1">{alert.description}</Text>
                    <Text className="text-muted text-xs mt-2">{alert.time}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Integrations */}
        <View className="px-6 mb-6">
          <Text className="text-foreground text-lg font-bold mb-3">Integrations</Text>
          <View className="bg-surface rounded-xl border border-border overflow-hidden">
            {integrations.map((integration, index) => (
              <TouchableOpacity
                key={integration.id}
                onPress={() => toggleIntegration(integration.id)}
                activeOpacity={0.7}
                className="flex-row items-center justify-between p-4"
                style={index < integrations.length - 1 ? { borderBottomWidth: 1, borderBottomColor: colors.border } : {}}
              >
                <View className="flex-row items-center">
                  <View 
                    className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                    style={{ backgroundColor: integration.enabled ? colors.primary + '20' : colors.border }}
                  >
                    <IconSymbol 
                      name={integration.icon} 
                      size={20} 
                      color={integration.enabled ? colors.primary : colors.muted} 
                    />
                  </View>
                  <Text className="text-foreground font-semibold">{integration.name}</Text>
                </View>
                <View 
                  className="w-12 h-7 rounded-full p-1"
                  style={{ backgroundColor: integration.enabled ? colors.success : colors.border }}
                >
                  <View 
                    className="w-5 h-5 rounded-full bg-foreground"
                    style={{ 
                      marginLeft: integration.enabled ? 'auto' : 0,
                    }}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
