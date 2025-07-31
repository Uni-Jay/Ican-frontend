import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";

interface Props {
  navigation?: any;
  onLogout?: () => void;
}

const DashboardScreenSimple: React.FC<Props> = ({ navigation, onLogout }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ICAN Dashboard</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Unable to load user data</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => {}}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
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
              ₦{(user?.balance || 50000).toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Account Balance</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="school" size={24} color="#38a169" />
            <Text style={styles.statValue}>
              {user?.cpdPoints || 25}
            </Text>
            <Text style={styles.statLabel}>CPD Points</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation?.navigate("financial")}
            >
              <Ionicons name="card" size={32} color="#3182ce" />
              <Text style={styles.actionText}>Pay Dues</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation?.navigate("cpd")}
            >
              <Ionicons name="book" size={32} color="#38a169" />
              <Text style={styles.actionText}>CPD Modules</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation?.navigate("events")}
            >
              <Ionicons name="calendar" size={32} color="#d69e2e" />
              <Text style={styles.actionText}>Events</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation?.navigate("voting")}
            >
              <Ionicons name="checkbox" size={32} color="#9f7aea" />
              <Text style={styles.actionText}>Vote</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Updates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Updates</Text>
          <View style={styles.notificationCard}>
            <View style={styles.notificationIcon}>
              <Ionicons name="school" size={20} color="#3182ce" />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>Welcome to ICAN Portal</Text>
              <Text style={styles.notificationMessage}>
                Your professional development journey starts here
              </Text>
              <Text style={styles.notificationTime}>Today</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={onLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
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
    width: "48%",
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
  errorText: {
    fontSize: 16,
    color: "#e53e3e",
    textAlign: "center",
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
  logoutButton: {
    backgroundColor: "#e53e3e",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default DashboardScreenSimple;
