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
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { MainDrawerParamList } from '../../navigations/MainNavigator';
import { DrawerScreenProps } from '@react-navigation/drawer';

interface Vote {
  id: number;
  title: string;
  description: string;
  type: 'election' | 'poll' | 'survey';
  status: 'active' | 'completed' | 'upcoming';
  startDate: string;
  endDate: string;
  participants: number;
  hasVoted: boolean;
  category: string;
  options?: VoteOption[];
  questions?: SurveyQuestion[];
}

interface VoteOption {
  id: number;
  text: string;
  votes: number;
}

interface SurveyQuestion {
  id: number;
  question: string;
  type: 'multiple_choice' | 'text' | 'rating';
  options?: string[];
  required: boolean;
}

const mockVotes: Vote[] = [
  {
    id: 1,
    title: 'ICAN Council Election 2024',
    description: 'Vote for the new council members who will represent the interests of chartered accountants nationwide.',
    type: 'election',
    status: 'active',
    startDate: '2024-08-01',
    endDate: '2024-08-31',
    participants: 2341,
    hasVoted: false,
    category: 'Governance',
    options: [
      { id: 1, text: 'Dr. Adebayo Johnson', votes: 892 },
      { id: 2, text: 'Mrs. Funmi Okafor', votes: 756 },
      { id: 3, text: 'Mr. Chidi Emenike', votes: 693 },
    ],
  },
  {
    id: 2,
    title: 'Professional Development Priorities',
    description: 'Help us understand what professional development areas are most important to our members.',
    type: 'survey',
    status: 'active',
    startDate: '2024-08-15',
    endDate: '2024-09-15',
    participants: 1567,
    hasVoted: true,
    category: 'Development',
    questions: [
      {
        id: 1,
        question: 'Which skill area would you like more training in?',
        type: 'multiple_choice',
        options: ['Digital Finance Tools', 'Tax Updates', 'Audit Standards', 'Ethics & Compliance'],
        required: true,
      },
      {
        id: 2,
        question: 'Rate your satisfaction with current CPD offerings',
        type: 'rating',
        required: true,
      },
    ],
  },
  {
    id: 3,
    title: 'Annual Conference Theme',
    description: 'Vote on the theme for our upcoming annual conference.',
    type: 'poll',
    status: 'active',
    startDate: '2024-08-10',
    endDate: '2024-08-25',
    participants: 843,
    hasVoted: false,
    category: 'Events',
    options: [
      { id: 1, text: 'Future of Finance', votes: 321 },
      { id: 2, text: 'Digital Transformation', votes: 298 },
      { id: 3, text: 'Sustainable Accounting', votes: 224 },
    ],
  },
  {
    id: 4,
    title: 'Member Satisfaction Survey 2024',
    description: 'Share your feedback on ICAN services and help us improve our offerings.',
    type: 'survey',
    status: 'upcoming',
    startDate: '2024-09-01',
    endDate: '2024-09-30',
    participants: 0,
    hasVoted: false,
    category: 'Feedback',
  },
];

type Props = DrawerScreenProps<MainDrawerParamList, 'voting'> & {
  onLogout: () => void;
};

const VotingSurveysScreen: React.FC<Props> = ({ navigation, route, onLogout }) => {
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed' | 'upcoming'>('active');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVote, setSelectedVote] = useState<Vote | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [surveyAnswers, setSurveyAnswers] = useState<{[key: number]: any}>({});

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const openVoteDetails = (vote: Vote) => {
    setSelectedVote(vote);
    setSelectedOption(null);
    setSurveyAnswers({});
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedVote(null);
    setSelectedOption(null);
    setSurveyAnswers({});
  };

  const submitVote = () => {
    if (!selectedVote) return;

    if (selectedVote.type === 'survey') {
      const requiredQuestions = selectedVote.questions?.filter(q => q.required) || [];
      const answeredRequired = requiredQuestions.every(q => surveyAnswers[q.id]);
      
      if (!answeredRequired) {
        Alert.alert('Error', 'Please answer all required questions.');
        return;
      }
    } else if (!selectedOption) {
      Alert.alert('Error', 'Please select an option before voting.');
      return;
    }

    Alert.alert(
      'Confirm Submission',
      `Submit your ${selectedVote.type === 'survey' ? 'survey responses' : 'vote'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            Alert.alert('Success', `${selectedVote.type === 'survey' ? 'Survey responses' : 'Vote'} submitted successfully!`);
            closeModal();
          },
        },
      ]
    );
  };

  const getFilteredVotes = () => {
    return mockVotes.filter(vote => vote.status === selectedTab);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#38a169';
      case 'completed':
        return '#666';
      case 'upcoming':
        return '#3182ce';
      default:
        return '#666';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'election':
        return 'ballot';
      case 'poll':
        return 'bar-chart';
      case 'survey':
        return 'clipboard';
      default:
        return 'help-circle';
    }
  };

  const handleSurveyAnswer = (questionId: number, answer: any) => {
    setSurveyAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* <Header
          showBack
          onBack={() => navigation.navigate('dashboard')}
        /> */}

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'active' && styles.activeTab]}
            onPress={() => setSelectedTab('active')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'active' && styles.activeTabText,
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'completed' && styles.activeTab]}
            onPress={() => setSelectedTab('completed')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'completed' && styles.activeTabText,
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
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
              Upcoming
            </Text>
          </TouchableOpacity>
        </View>

        {/* Votes List */}
        <View style={styles.section}>
          {getFilteredVotes().map(vote => (
            <TouchableOpacity
              key={vote.id}
              style={styles.voteCard}
              onPress={() => openVoteDetails(vote)}
            >
              <View style={styles.voteHeader}>
                <View style={styles.voteTypeContainer}>
                  <Ionicons
                    name={getTypeIcon(vote.type) as any} // cast to any to avoid TS error
                    size={20}
                    color="#3182ce"
                    />
                  <Text style={styles.voteType}>{vote.type.toUpperCase()}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(vote.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{vote.status.toUpperCase()}</Text>
                </View>
              </View>

              <Text style={styles.voteTitle}>{vote.title}</Text>
              <Text style={styles.voteDescription} numberOfLines={2}>
                {vote.description}
              </Text>

              <View style={styles.voteDetails}>
                <View style={styles.voteDetailRow}>
                  <Ionicons name="calendar" size={16} color="#666" />
                  <Text style={styles.voteDetailText}>
                    {formatDate(vote.startDate)} - {formatDate(vote.endDate)}
                  </Text>
                </View>
                <View style={styles.voteDetailRow}>
                  <Ionicons name="people" size={16} color="#666" />
                  <Text style={styles.voteDetailText}>
                    {vote.participants} participants
                  </Text>
                </View>
              </View>

              <View style={styles.voteFooter}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{vote.category}</Text>
                </View>
                {vote.hasVoted && (
                  <View style={styles.votedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#38a169" />
                    <Text style={styles.votedText}>Participated</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Vote Details Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedVote?.title}</Text>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalDescription}>
                  {selectedVote?.description}
                </Text>

                <View style={styles.voteDetailsContainer}>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar" size={20} color="#666" />
                    <Text style={styles.detailText}>
                      {selectedVote && formatDate(selectedVote.startDate)} - {selectedVote && formatDate(selectedVote.endDate)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="people" size={20} color="#666" />
                    <Text style={styles.detailText}>
                      {selectedVote?.participants} participants
                    </Text>
                  </View>
                </View>

                {/* Voting Options */}
                {selectedVote?.options && (
                  <View style={styles.optionsContainer}>
                    <Text style={styles.optionsTitle}>Select your choice:</Text>
                    {selectedVote.options.map(option => (
                      <TouchableOpacity
                        key={option.id}
                        style={[
                          styles.optionCard,
                          selectedOption === option.id && styles.selectedOption,
                        ]}
                        onPress={() => setSelectedOption(option.id)}
                        disabled={selectedVote.hasVoted}
                      >
                        <View style={styles.optionContent}>
                          <Text style={styles.optionText}>{option.text}</Text>
                          {selectedVote.hasVoted && (
                            <Text style={styles.voteCount}>{option.votes} votes</Text>
                          )}
                        </View>
                        {selectedOption === option.id && (
                          <Ionicons name="radio-button-on" size={20} color="#3182ce" />
                        )}
                        {selectedOption !== option.id && !selectedVote.hasVoted && (
                          <Ionicons name="radio-button-off" size={20} color="#666" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Survey Questions */}
                {selectedVote?.questions && (
                  <View style={styles.questionsContainer}>
                    <Text style={styles.questionsTitle}>Survey Questions:</Text>
                    {selectedVote.questions.map(question => (
                      <View key={question.id} style={styles.questionCard}>
                        <Text style={styles.questionText}>
                          {question.question}
                          {question.required && <Text style={styles.required}> *</Text>}
                        </Text>
                        
                        {question.type === 'multiple_choice' && question.options && (
                          <View style={styles.choiceOptions}>
                            {question.options.map((option, index) => (
                              <TouchableOpacity
                                key={index}
                                style={[
                                  styles.choiceOption,
                                  surveyAnswers[question.id] === option && styles.selectedChoice,
                                ]}
                                onPress={() => handleSurveyAnswer(question.id, option)}
                                disabled={selectedVote.hasVoted}
                              >
                                <Text style={styles.choiceText}>{option}</Text>
                                {surveyAnswers[question.id] === option && (
                                  <Ionicons name="checkmark" size={16} color="#3182ce" />
                                )}
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}

                        {question.type === 'text' && (
                          <TextInput
                            style={styles.textInput}
                            placeholder="Enter your answer..."
                            multiline
                            value={surveyAnswers[question.id] || ''}
                            onChangeText={(text) => handleSurveyAnswer(question.id, text)}
                            editable={!selectedVote.hasVoted}
                          />
                        )}

                        {question.type === 'rating' && (
                          <View style={styles.ratingContainer}>
                            {[1, 2, 3, 4, 5].map(rating => (
                              <TouchableOpacity
                                key={rating}
                                onPress={() => handleSurveyAnswer(question.id, rating)}
                                disabled={selectedVote.hasVoted}
                              >
                                <Ionicons
                                  name={surveyAnswers[question.id] >= rating ? "star" : "star-outline"}
                                  size={24}
                                  color="#f6ad55"
                                />
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>

              <View style={styles.modalFooter}>
                {selectedVote?.hasVoted ? (
                  <TouchableOpacity style={styles.participatedButton} disabled>
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                    <Text style={styles.participatedButtonText}>
                      Already Participated
                    </Text>
                  </TouchableOpacity>
                ) : selectedVote?.status === 'active' ? (
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={submitVote}
                  >
                    <Text style={styles.submitButtonText}>
                      Submit {selectedVote?.type === 'survey' ? 'Survey' : 'Vote'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.disabledButton} disabled>
                    <Text style={styles.disabledButtonText}>
                      {selectedVote?.status === 'upcoming' ? 'Not Yet Available' : 'Voting Closed'}
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
  voteCard: {
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
  voteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  voteTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3182ce',
    marginLeft: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  voteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 8,
  },
  voteDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  voteDetails: {
    marginBottom: 12,
  },
  voteDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  voteDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  voteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: '#edf2f7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#4a5568',
    fontWeight: '600',
  },
  votedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#c6f6d5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  votedText: {
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
    maxHeight: '85%',
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
  voteDetailsContainer: {
    marginBottom: 25,
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
  optionsContainer: {
    marginBottom: 20,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 15,
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedOption: {
    borderColor: '#3182ce',
    backgroundColor: '#ebf8ff',
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#1a202c',
    fontWeight: '500',
  },
  voteCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  questionsContainer: {
    marginBottom: 20,
  },
  questionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 15,
  },
  questionCard: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a202c',
    marginBottom: 12,
  },
  required: {
    color: '#e53e3e',
  },
  choiceOptions: {
    marginTop: 10,
  },
  choiceOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  selectedChoice: {
    borderColor: '#3182ce',
    backgroundColor: '#ebf8ff',
  },
  choiceText: {
    fontSize: 14,
    color: '#1a202c',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    backgroundColor: 'white',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  submitButton: {
    backgroundColor: '#3182ce',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  participatedButton: {
    backgroundColor: '#38a169',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  participatedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#cbd5e0',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VotingSurveysScreen;