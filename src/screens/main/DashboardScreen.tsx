import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
<<<<<<< HEAD
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/api";
=======
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { MainDrawerParamList } from "../../navigations/MainNavigator";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/api";
import { DashboardStats, Notification } from "../../types/api";
>>>>>>> feat: update project

const { width } = Dimensions.get("window");

type DashboardStats = {
  cpdPoints: number;
  requiredPoints: number;
  completedModules: number;
  upcomingEvents: number;
  balance: number;
  pendingTransactions: number;
  unreadNotifications: number;
  activePolls: number;
};

type NotificationItem = {
  id: string;
  title: string;
  message: string;
<<<<<<< HEAD
  type: string;
  createdAt: string;
};

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "CPD Seminar Tomorrow",
    message: "Digital Transformation in Accounting",
    type: "cpd",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Payment Reminder",
    message: "Annual membership due in 5 days",
    type: "financial",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "New Survey Available",
    message: "Professional Development Needs Assessment",
    type: "survey",
    createdAt: new Date().toISOString(),
  },
];

interface Props {
  navigation?: any;
  onLogout?: () => void;
}

const DashboardScreen: React.FC<Props> = ({ navigation, onLogout }) => {
=======
  time: string;
  type: "cpd" | "financial" | "survey";
};

const mockUser: User = {
  id: 1,
  name: "John Doe",
  email: "john.doe@ican.ng",
  membershipId: "ICAN/2024/001",
  membershipLevel: "Associate",
  profileImage: null,
  balance: 45000,
  cpdPoints: 120,
};

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "CPD Seminar Tomorrow",
    message: "Digital Transformation in Accounting",
    time: "2 hours ago",
    type: "cpd",
  },
  {
    id: 2,
    title: "Payment Reminder",
    message: "Annual membership due in 5 days",
    time: "1 day ago",
    type: "financial",
  },
  {
    id: 3,
    title: "New Survey Available",
    message: "Professional Development Needs Assessment",
    time: "3 days ago",
    type: "survey",
  },
];

type Props = DrawerScreenProps<MainDrawerParamList, "dashboard"> & {
  onLogout: () => void;
};

const DashboardScreen: React.FC<Props> = ({ navigation, route, onLogout }) => {
>>>>>>> feat: update project
  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
<<<<<<< HEAD
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(mockNotifications);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
=======
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
>>>>>>> feat: update project

  useEffect(() => {
    loadDashboardData();
  }, []);
<<<<<<< HEAD

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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ICAN Dashboard</Text>
        </View>
=======

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load dashboard stats and notifications in parallel
      const [statsResponse, notificationsResponse] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getNotifications({ limit: 5 }),
      ]);

      if (statsResponse.success && statsResponse.data) {
        setDashboardStats(statsResponse.data);
      }

      if (notificationsResponse.success && notificationsResponse.data) {
        setNotifications(notificationsResponse.data.data);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Fallback to mock data
      setNotifications(mockNotifications);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="ICAN Dashboard" />
>>>>>>> feat: update project
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
<<<<<<< HEAD
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ICAN Dashboard</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Unable to load user data</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadDashboardData}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
=======
        <Header title="ICAN Dashboard" />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Unable to load user data</Text>
>>>>>>> feat: update project
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ICAN Dashboard</Text>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.name
<<<<<<< HEAD
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
=======
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
>>>>>>> feat: update project
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
<<<<<<< HEAD
              ₦
              {(dashboardStats?.balance || user?.balance || 0).toLocaleString()}
=======
              ₦{user.balance.toLocaleString()}
>>>>>>> feat: update project
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
<<<<<<< HEAD
              onPress={() => navigation?.navigate("financial")}
=======
              onPress={() => navigation.navigate("financial")}
>>>>>>> feat: update project
            >
              <Ionicons name="card" size={32} color="#3182ce" />
              <Text style={styles.actionText}>Pay Dues</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
<<<<<<< HEAD
              onPress={() => navigation?.navigate("cpd")}
=======
              onPress={() => navigation.navigate("cpd")}
>>>>>>> feat: update project
            >
              <Ionicons name="book" size={32} color="#38a169" />
              <Text style={styles.actionText}>CPD Modules</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
<<<<<<< HEAD
              onPress={() => navigation?.navigate("events")}
=======
              onPress={() => navigation.navigate("events")}
>>>>>>> feat: update project
            >
              <Ionicons name="calendar" size={32} color="#d69e2e" />
              <Text style={styles.actionText}>Events</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
<<<<<<< HEAD
              onPress={() => navigation?.navigate("voting")}
=======
              onPress={() => navigation.navigate("voting")}
>>>>>>> feat: update project
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
                <Text style={styles.notificationTime}>
                  {new Date(notification.createdAt).toLocaleDateString()}
                </Text>
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
<<<<<<< HEAD
  },
  header: {
    backgroundColor: "#3182ce",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
=======
>>>>>>> feat: update project
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
<<<<<<< HEAD
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#3182ce",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 10,
=======
>>>>>>> feat: update project
  },
});

export default DashboardScreen;
