import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { MainDrawerParamList } from '../../navigations/MainNavigator';
import { DrawerScreenProps } from '@react-navigation/drawer';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  fee: number;
  registered: boolean;
  description: string;
  cpdPoints: number;
  availableSpots: number;
  registeredCount: number;
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Annual Accounting Conference 2024',
    date: '2024-08-15',
    time: '09:00 AM',
    location: 'Lagos Convention Centre',
    type: 'Conference',
    fee: 15000,
    registered: false,
    description:
      'Join leading accounting professionals for a day of insights, networking, and professional development.',
    cpdPoints: 40,
    availableSpots: 150,
    registeredCount: 89,
  },
  {
    id: 2,
    title: 'Digital Transformation in Finance Workshop',
    date: '2024-08-22',
    time: '02:00 PM',
    location: 'Virtual Event',
    type: 'Workshop',
    fee: 8000,
    registered: true,
    description:
      'Learn about the latest digital tools and technologies transforming the finance industry.',
    cpdPoints: 20,
    availableSpots: 100,
    registeredCount: 67,
  },
  {
    id: 3,
    title: 'Tax Policy Updates Seminar',
    date: '2024-08-30',
    time: '10:00 AM',
    location: 'Abuja Business District',
    type: 'Seminar',
    fee: 5000,
    registered: false,
    description:
      'Stay current with the latest changes in tax policies and regulations.',
    cpdPoints: 15,
    availableSpots: 80,
    registeredCount: 34,
  },
  {
    id: 4,
    title: 'Professional Ethics Masterclass',
    date: '2024-09-05',
    time: '11:00 AM',
    location: 'ICAN House, Victoria Island',
    type: 'Masterclass',
    fee: 12000,
    registered: false,
    description:
      'Deep dive into professional ethics and standards for chartered accountants.',
    cpdPoints: 30,
    availableSpots: 50,
    registeredCount: 23,
  },
];

type Props = DrawerScreenProps<MainDrawerParamList, 'events'> & {
  onLogout: () => void;
};;

const EventsScreen: React.FC<Props> = ({ navigation, route, onLogout }) => {
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'registered'>(
    'upcoming'
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const openEventDetails = (event: Event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  const registerForEvent = (eventId?: number) => {
    if (!selectedEvent) return;

    Alert.alert(
      'Confirm Registration',
      `Register for ${selectedEvent.title}?\nFee: ₦${selectedEvent.fee.toLocaleString()}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Register',
          onPress: () => {
            Alert.alert('Success', 'Registration successful!');
            closeModal();
          },
        },
      ]
    );
  };

  const getFilteredEvents = () => {
    switch (selectedTab) {
      case 'upcoming':
        return mockEvents.filter(event => !event.registered);
      case 'registered':
        return mockEvents.filter(event => event.registered);
      default:
        return mockEvents;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'conference':
        return '#9f7aea';
      case 'workshop':
        return '#3182ce';
      case 'seminar':
        return '#38a169';
      case 'masterclass':
        return '#d69e2e';
      default:
        return '#666';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Header
          title="Events & Training"
          showBack
          onBack={() => navigation.navigate('dashboard')}
        />

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'upcoming' && styles.activeTab]}
            onPress={() => setSelectedTab('upcoming')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'upcoming' && styles.activeTabText,
              ]}
            >
              Upcoming Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'registered' && styles.activeTab]}
            onPress={() => setSelectedTab('registered')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'registered' && styles.activeTabText,
              ]}
            >
              My Events
            </Text>
          </TouchableOpacity>
        </View>

        {/* Events List */}
        <View style={styles.section}>
          {getFilteredEvents().map(event => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventCard}
              onPress={() => openEventDetails(event)}
            >
              <View style={styles.eventHeader}>
                <View style={styles.eventDateContainer}>
                  <Text style={styles.eventDate}>{formatDate(event.date)}</Text>
                  <Text style={styles.eventTime}>{event.time}</Text>
                </View>
                <View
                  style={[
                    styles.eventTypeBadge,
                    { backgroundColor: getEventTypeColor(event.type) },
                  ]}
                >
                  <Text style={styles.eventTypeText}>{event.type}</Text>
                </View>
              </View>

              <Text style={styles.eventTitle}>{event.title}</Text>

              <View style={styles.eventDetails}>
                <View style={styles.eventDetailRow}>
                  <Ionicons name="location" size={16} color="#666" />
                  <Text style={styles.eventDetailText}>{event.location}</Text>
                </View>
                <View style={styles.eventDetailRow}>
                  <Ionicons name="people" size={16} color="#666" />
                  <Text style={styles.eventDetailText}>
                    {event.registeredCount}/{event.availableSpots} registered
                  </Text>
                </View>
              </View>

              <View style={styles.eventFooter}>
                <View style={styles.eventPricing}>
                  <Text style={styles.eventFee}>
                    ₦{event.fee.toLocaleString()}
                  </Text>
                  <Text style={styles.cpdPoints}>{event.cpdPoints} CPD Points</Text>
                </View>
                {event.registered && (
                  <View style={styles.registeredBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#38a169" />
                    <Text style={styles.registeredText}>Registered</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Event Details Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedEvent?.title}</Text>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalDescription}>
                  {selectedEvent?.description}
                </Text>

                <View style={styles.eventDetailsContainer}>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar" size={20} color="#666" />
                    <Text style={styles.detailText}>
                      {selectedEvent && formatDate(selectedEvent.date)} at{' '}
                      {selectedEvent?.time}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="location" size={20} color="#666" />
                    <Text style={styles.detailText}>{selectedEvent?.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="card" size={20} color="#666" />
                    <Text style={styles.detailText}>
                      Fee: ₦{selectedEvent?.fee.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="trophy" size={20} color="#666" />
                    <Text style={styles.detailText}>
                      CPD Points: {selectedEvent?.cpdPoints}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="people" size={20} color="#666" />
                    <Text style={styles.detailText}>
                      {selectedEvent?.registeredCount}/
                      {selectedEvent?.availableSpots} registered
                    </Text>
                  </View>
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                {selectedEvent?.registered ? (
                  <TouchableOpacity style={styles.registeredButton} disabled>
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                    <Text style={styles.registeredButtonText}>
                      Already Registered
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.registerButton}
                    onPress={() => registerForEvent(selectedEvent?.id)}
                  >
                    <Text style={styles.registerButtonText}>
                      Register Now - ₦{selectedEvent?.fee.toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>
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
  tabContainer: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#3182ce',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  eventCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventDateContainer: {
    flex: 1,
  },
  eventDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3182ce',
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  eventTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventTypeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 12,
  },
  eventDetails: {
    marginBottom: 12,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventPricing: {
    flex: 1,
  },
  eventFee: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  cpdPoints: {
    fontSize: 12,
    color: '#38a169',
    fontWeight: '600',
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#c6f6d5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  registeredText: {
    fontSize: 12,
    color: '#38a169',
    fontWeight: '600',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a202c',
    flex: 1,
    lineHeight: 28,
  },
  modalBody: {
    padding: 20,
  },
  modalDescription: {
    fontSize: 16,
    color: '#4a5568',
    lineHeight: 24,
    marginBottom: 20,
  },
  eventDetailsContainer: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#4a5568',
    marginLeft: 10,
    flex: 1,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  registerButton: {
    backgroundColor: '#3182ce',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  registeredButton: {
    backgroundColor: '#38a169',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  registeredButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventsScreen;
