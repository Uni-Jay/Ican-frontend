import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import { MainDrawerParamList } from "../../navigations/MainNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/api";
import { Transaction } from "../../types/api";

type User = {
  balance: number;
};

const mockUser: User = {
  balance: 45000,
};

type Props = DrawerScreenProps<MainDrawerParamList, "financial"> & {
  onLogout: () => void;
};

const FinancialScreen: React.FC<Props> = ({ navigation, route, onLogout }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [transferRecipient, setTransferRecipient] = useState<string>("");

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    try {
      setIsLoading(true);

      const [transactionsResponse, balanceResponse] = await Promise.all([
        apiService.getTransactions({ limit: 10 }),
        apiService.getBalance(),
      ]);

      if (transactionsResponse.success && transactionsResponse.data) {
        setTransactions(
          transactionsResponse.data.data || transactionsResponse.data
        );
      }

      if (balanceResponse.success && balanceResponse.data) {
        setBalance(balanceResponse.data);
      }
    } catch (error) {
      console.error("Error loading financial data:", error);
      Alert.alert("Error", "Failed to load financial data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadFinancialData();
    setIsRefreshing(false);
  };

  const handlePayDues = async () => {
    try {
      const response = await apiService.makePayment({
        type: "dues",
        amount: 25000,
        description: "Annual membership dues 2024",
      });

      if (response.success && response.data) {
        Alert.alert(
          "Payment Initiated",
          "You will be redirected to complete your payment",
          [
            {
              text: "OK",
              onPress: () => {
                // In a real app, you would open the payment URL
                console.log("Payment URL:", response.data.paymentUrl);
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to initiate payment");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Financial Services"
          showBack
          onBack={() => navigation.navigate("dashboard")}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3182ce" />
          <Text style={styles.loadingText}>Loading financial data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <Header
          title="Financial Services"
          showBack
          onBack={() => navigation.navigate("dashboard")}
        />

        <View style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>Available Balance</Text>
          <Text style={styles.balanceAmount}>
            ₦{(balance?.currentBalance || user?.balance || 0).toLocaleString()}
          </Text>
          {balance?.pendingTransactions > 0 && (
            <Text style={styles.pendingText}>
              {balance.pendingTransactions} pending transaction
              {balance.pendingTransactions > 1 ? "s" : ""}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Payments</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={styles.paymentCard}
              onPress={handlePayDues}
            >
              <Ionicons name="card" size={24} color="#3182ce" />
              <Text style={styles.paymentText}>Annual Dues</Text>
              <Text style={styles.paymentAmount}>₦25,000</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paymentCard}>
              <Ionicons name="school" size={24} color="#38a169" />
              <Text style={styles.paymentText}>CPD Course</Text>
              <Text style={styles.paymentAmount}>₦5,000</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transfer Funds</Text>
          <View style={styles.transferForm}>
            <TextInput
              style={styles.input}
              placeholder="Recipient Member ID"
              value={transferRecipient}
              onChangeText={setTransferRecipient}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={transferAmount}
              onChangeText={setTransferAmount}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.transferButton}>
              <Text style={styles.buttonText}>Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionCard}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {new Date(transaction.date).toLocaleDateString()}
                  </Text>
                  <Text
                    style={[
                      styles.transactionStatus,
                      {
                        color:
                          transaction.status === "completed"
                            ? "#38a169"
                            : transaction.status === "failed"
                            ? "#e53e3e"
                            : "#d69e2e",
                      },
                    ]}
                  >
                    {transaction.status.charAt(0).toUpperCase() +
                      transaction.status.slice(1)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    {
                      color:
                        transaction.type === "refund" ? "#38a169" : "#e53e3e",
                    },
                  ]}
                >
                  {transaction.type === "refund" ? "+" : "-"}₦
                  {transaction.amount.toLocaleString()}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={48} color="#a0aec0" />
              <Text style={styles.emptyStateText}>No transactions yet</Text>
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
  balanceCard: {
    backgroundColor: "white",
    margin: 20,
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#3182ce",
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
  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  paymentCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a202c",
    marginVertical: 8,
    textAlign: "center",
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3182ce",
  },
  transferForm: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#f9fafb",
  },
  transferButton: {
    backgroundColor: "#3182ce",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  transactionCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a202c",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: "#666",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e53e3e",
  },
  transactionStatus: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  pendingText: {
    fontSize: 12,
    color: "#d69e2e",
    marginTop: 4,
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
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyStateText: {
    marginTop: 10,
    fontSize: 16,
    color: "#a0aec0",
    textAlign: "center",
  },
});

export default FinancialScreen;
