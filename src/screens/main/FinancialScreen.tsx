import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { MainDrawerParamList } from '../../navigations/MainNavigator';
import { DrawerScreenProps } from '@react-navigation/drawer';

type User = {
  balance: number;
};

const mockUser: User = {
  balance: 45000,
};

type Props = DrawerScreenProps<MainDrawerParamList, 'financial'> & {
  onLogout: () => void;
};

const FinancialScreen: React.FC<Props> = ({ navigation, route, onLogout }) => {
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [transferRecipient, setTransferRecipient] = useState<string>('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Header 
          title="Financial Services" 
          showBack 
          onBack={() => navigation.navigate('dashboard')} 
        />
        
        <View style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>Available Balance</Text>
          <Text style={styles.balanceAmount}>₦{mockUser.balance.toLocaleString()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Payments</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity style={styles.paymentCard}>
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
          <View style={styles.transactionCard}>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>Annual Membership</Text>
              <Text style={styles.transactionDate}>July 15, 2024</Text>
            </View>
            <Text style={styles.transactionAmount}>-₦25,000</Text>
          </View>
          <View style={styles.transactionCard}>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>CPD Module Payment</Text>
              <Text style={styles.transactionDate}>July 10, 2024</Text>
            </View>
            <Text style={styles.transactionAmount}>-₦5,000</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  balanceCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3182ce',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 15,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  paymentCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
    marginVertical: 8,
    textAlign: 'center',
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3182ce',
  },
  transferForm: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9fafb',
  },
  transferButton: {
    backgroundColor: '#3182ce',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  transactionCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
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
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e53e3e',
  },
});

export default FinancialScreen;
