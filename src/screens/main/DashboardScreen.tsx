import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { MainDrawerParamList } from "../../navigations/MainNavigator";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/api";
import {
  DashboardStats as APIDashboardStats,
  Notification,
} from "../../types/api";

const { width } = Dimensions.get("window");

type LocalDashboardStats = {
  cpdPoints: number;
  requiredPoints: number;
  completedModules: number;
  upcomingEvents: number;
  balance: number;
  pendingTransactions: number;
  unreadNotifications: number;
  activePolls: number;
};

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "CPD Seminar Tomorrow",
    message: "Digital Transformation in Accounting",
    time: "2 hours ago",
    type: "cpd",
  },
  {
    id: "2",
    title: "Payment Reminder",
    message: "Annual membership due in 5 days",
    time: "1 day ago",
    type: "financial",
  },
  {
    id: "3",
    title: "New Survey Available",
    message: "Professional Development Needs Assessment",
    time: "3 days ago",
    type: "general",
  },
];

type Props = DrawerScreenProps<MainDrawerParamList, "dashboard"> & {
  onLogout: () => void;
};

const DashboardScreen: React.FC<Props> = ({ navigation, route, onLogout }) => {
  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] =
    useState<LocalDashboardStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Try to load real data from API
      try {
        const [statsResponse, notificationsResponse] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getNotifications({ limit: 5 }),
        ]);

        if (statsResponse.success && statsResponse.data) {
          setDashboardStats(statsResponse.data);
        }

        if (notificationsResponse.success && notificationsResponse.data) {
          setNotifications(
            notificationsResponse.data.data || mockNotifications
          );
        }
      } catch (apiError) {
        console.log("API not available, using mock data");
        // Use mock data if API fails
        setNotifications(mockNotifications);
        setDashboardStats({
          cpdPoints: user?.cpdPoints || 25,
          requiredPoints: 40,
          completedModules: 5,
          upcomingEvents: 3,
          balance: user?.balance || 50000,
          pendingTransactions: 1,
          unreadNotifications: 7,
          activePolls: 2,
        });
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setNotifications(mockNotifications);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="ICAN Dashboard" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3182ce" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="ICAN Dashboard" />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Unable to load user data</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="ICAN Dashboard" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>{user.name || "User"}</Text>
              <Text style={styles.membershipId}>
                {user.membershipId || "ICAN Member"}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="wallet" size={24} color="#3182ce" />
            <Text style={styles.statValue}>
              ₦
              {(dashboardStats?.balance || user?.balance || 0).toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Account Balance</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="school" size={24} color="#38a169" />
            <Text style={styles.statValue}>
              {dashboardStats?.cpdPoints || user?.cpdPoints || 0}
            </Text>
            <Text style={styles.statLabel}>CPD Points</Text>
          </View>
        </View>

        {/* Additional Stats */}
        {dashboardStats && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color="#d69e2e" />
              <Text style={styles.statValue}>
                {dashboardStats.upcomingEvents}
              </Text>
              <Text style={styles.statLabel}>Upcoming Events</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="notifications" size={24} color="#9f7aea" />
              <Text style={styles.statValue}>
                {dashboardStats.unreadNotifications}
              </Text>
              <Text style={styles.statLabel}>Notifications</Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate("financial")}
            >
              <Ionicons name="card" size={32} color="#3182ce" />
              <Text style={styles.actionText}>Pay Dues</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate("cpd")}
            >
              <Ionicons name="book" size={32} color="#38a169" />
              <Text style={styles.actionText}>CPD Modules</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate("events")}
            >
              <Ionicons name="calendar" size={32} color="#d69e2e" />
              <Text style={styles.actionText}>Events</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate("voting")}
            >
              <Ionicons name="checkbox" size={32} color="#9f7aea" />
              <Text style={styles.actionText}>Vote</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Updates</Text>
          {notifications.slice(0, 3).map((notification) => (
            <View key={notification.id} style={styles.notificationCard}>
              <View style={styles.notificationIcon}>
                <Ionicons
                  name={
                    notification.type === "cpd"
                      ? "school"
                      : notification.type === "financial"
                      ? "card"
                      : "checkbox"
                  }
                  size={20}
                  color="#3182ce"
                />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>
                  {notification.title}
                </Text>
                <Text style={styles.notificationMessage}>
                  {notification.message}
                </Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
            </View>
          ))}

          {notifications.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No recent notifications</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  welcomeSection: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3182ce",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  userDetails: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: "#666",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a202c",
    marginVertical: 2,
  },
  membershipId: {
    fontSize: 14,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a202c",
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a202c",
    marginBottom: 15,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a202c",
    marginTop: 8,
    textAlign: "center",
  },
  notificationCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e6f3ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a202c",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#e53e3e",
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 10,
  },
});

export default DashboardScreen;
