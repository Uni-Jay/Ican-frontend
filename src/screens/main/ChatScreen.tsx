import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  FlatList,
  Image,
  Modal,
  Animated,
  Dimensions,
  Vibration,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Header from '../../components/Header';
import { MainDrawerParamList } from '../../navigations/MainNavigator';
import { DrawerScreenProps } from '@react-navigation/drawer';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Message {
  id: number;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'voice' | 'video' | 'location';
  isOwn: boolean;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: number;
  editedAt?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  imageUrl?: string;
  voiceDuration?: number;
  isForwarded?: boolean;
  forwardedFrom?: string;
  reactions?: { [emoji: string]: string[] }; // emoji -> array of user IDs who reacted
  mentions?: string[]; // array of mentioned user IDs
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'group' | 'direct';
  participants: number;
  lastActive: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isOnline?: boolean;
  description?: string;
  createdBy?: string;
  admins?: string[];
  isPinned?: boolean;
  isMuted?: boolean;
  participantsList?: { id: string; name: string; isOnline: boolean; role?: 'admin' | 'member' }[];
}

// Mock chat rooms data with enhanced features
const mockChatRooms: ChatRoom[] = [
  {
    id: 'room1',
    name: 'ICAN Lagos Chapter',
    type: 'group',
    participants: 156,
    lastActive: '2024-08-30T09:25:00Z',
    lastMessage: 'Don\'t forget about our CPD session tomorrow at 2 PM...',
    lastMessageTime: '2024-08-30T09:25:00Z',
    unreadCount: 3,
    description: 'Official group for ICAN Lagos Chapter members',
    isPinned: true,
    participantsList: [
      { id: 'user1', name: 'Dr. Adebayo Johnson', isOnline: true, role: 'admin' },
      { id: 'user2', name: 'Mrs. Funmi Okafor', isOnline: false, role: 'member' },
      { id: 'user3', name: 'Mr. Chidi Emenike', isOnline: true, role: 'member' },
    ],
  },
  {
    id: 'room2',
    name: 'Dr. Adebayo Johnson',
    type: 'direct',
    participants: 2,
    lastActive: '2024-08-30T08:30:00Z',
    lastMessage: 'Good morning! Hope you had a great weekend.',
    lastMessageTime: '2024-08-30T08:30:00Z',
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: 'room3',
    name: 'Tax Updates Discussion',
    type: 'group',
    participants: 24,
    lastActive: '2024-08-29T16:45:00Z',
    lastMessage: 'The new corporate tax rates are quite favorable...',
    lastMessageTime: '2024-08-29T16:45:00Z',
    unreadCount: 1,
    isMuted: true,
  },
  {
    id: 'room4',
    name: 'Mrs. Funmi Okafor',
    type: 'direct',
    participants: 2,
    lastActive: '2024-08-29T14:20:00Z',
    lastMessage: 'Thanks for sharing the policy updates!',
    lastMessageTime: '2024-08-29T14:20:00Z',
    unreadCount: 0,
  },
  {
    id: 'room5',
    name: 'ICAN Study Group',
    type: 'group',
    participants: 8,
    lastActive: '2024-08-28T19:30:00Z',
    lastMessage: 'Let\'s schedule our next meeting for next week',
    lastMessageTime: '2024-08-28T19:30:00Z',
    unreadCount: 5,
    isPinned: true,
  },
];

// Enhanced mock messages with more features
const mockMessagesData: { [key: string]: Message[] } = {
  room1: [
    {
      id: 1,
      text: 'Good morning everyone! Hope you all had a great weekend.',
      senderId: 'user1',
      senderName: 'Dr. Adebayo Johnson',
      timestamp: '2024-08-30T08:30:00Z',
      type: 'text',
      isOwn: false,
      status: 'read',
      reactions: { '👍': ['user2', 'user3'], '❤️': ['current_user'] },
    },
    {
      id: 2,
      text: 'Morning Dr. Johnson! Yes, it was quite refreshing. Ready for the new week ahead.',
      senderId: 'current_user',
      senderName: 'You',
      timestamp: '2024-08-30T08:32:00Z',
      type: 'text',
      isOwn: true,
      status: 'read',
    },
    {
      id: 3,
      text: 'Has anyone reviewed the new tax policy updates that were released last Friday?',
      senderId: 'user2',
      senderName: 'Mrs. Funmi Okafor',
      timestamp: '2024-08-30T08:45:00Z',
      type: 'text',
      isOwn: false,
      status: 'read',
    },
    {
      id: 4,
      text: 'Yes, I went through them over the weekend. There are some significant changes to corporate tax rates.',
      senderId: 'current_user',
      senderName: 'You',
      timestamp: '2024-08-30T08:47:00Z',
      type: 'text',
      isOwn: true,
      status: 'read',
      editedAt: '2024-08-30T08:48:00Z',
    },
    {
      id: 5,
      text: 'Could you share the key highlights? I haven\'t had a chance to review them yet.',
      senderId: 'user3',
      senderName: 'Mr. Chidi Emenike',
      timestamp: '2024-08-30T09:15:00Z',
      type: 'text',
      isOwn: false,
      status: 'read',
    },
    {
      id: 6,
      text: 'Sure! The corporate tax rate has been reduced from 30% to 28% for companies with turnover below ₦25 million.',
      senderId: 'current_user',
      senderName: 'You',
      timestamp: '2024-08-30T09:18:00Z',
      type: 'text',
      isOwn: true,
      status: 'delivered',
      isForwarded: true,
      forwardedFrom: 'Tax Authority Updates',
      mentions: ['user3'],
    },
    {
      id: 7,
      text: 'That\'s great news for small and medium enterprises! Thanks for sharing.',
      senderId: 'user3',
      senderName: 'Mr. Chidi Emenike',
      timestamp: '2024-08-30T09:20:00Z',
      type: 'text',
      isOwn: false,
      status: 'read',
      replyTo: 6,
      reactions: { '🎉': ['current_user', 'user1'], '👏': ['user2'] },
    },
    {
      id: 8,
      text: 'Don\'t forget about our CPD session tomorrow at 2 PM. We\'ll be discussing these updates in detail.',
      senderId: 'user1',
      senderName: 'Dr. Adebayo Johnson',
      timestamp: '2024-08-30T09:25:00Z',
      type: 'text',
      isOwn: false,
      status: 'read',
    },
    {
      id: 9,
      text: '',
      senderId: 'user2',
      senderName: 'Mrs. Funmi Okafor',
      timestamp: '2024-08-30T09:30:00Z',
      type: 'image',
      isOwn: false,
      status: 'read',
      imageUrl: 'https://via.placeholder.com/300x200/3182ce/white?text=Tax+Policy+Document',
    },
    {
      id: 10,
      text: '',
      senderId: 'current_user',
      senderName: 'You',
      timestamp: '2024-08-30T09:35:00Z',
      type: 'voice',
      isOwn: true,
      status: 'delivered',
      voiceDuration: 45,
    },
  ],
  room2: [
    {
      id: 1,
      text: 'Good morning! Hope you had a great weekend.',
      senderId: 'user1',
      senderName: 'Dr. Adebayo Johnson',
      timestamp: '2024-08-30T08:30:00Z',
      type: 'text',
      isOwn: false,
      status: 'read',
    },
    {
      id: 2,
      text: 'Morning! Yes, it was wonderful. How was yours?',
      senderId: 'current_user',
      senderName: 'You',
      timestamp: '2024-08-30T08:32:00Z',
      type: 'text',
      isOwn: true,
      status: 'read',
    },
  ],
};

type Props = DrawerScreenProps<MainDrawerParamList, 'chat'> & {
  onLogout: () => void;
};

const ChatScreen: React.FC<Props> = ({ navigation, route, onLogout }) => {
  const [currentView, setCurrentView] = useState<'list' | 'chat'>('list');
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reactingToMessage, setReactingToMessage] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>(['user1', 'user3']);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [pinnedMessage, setPinnedMessage] = useState<Message | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState<Message[]>([]);
  const [messageSearchQuery, setMessageSearchQuery] = useState('');
  
  const scrollViewRef = useRef<ScrollView>(null);
  const recordingAnimation = useRef(new Animated.Value(1)).current;
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  // Common emojis for reactions
  const commonEmojis = ['❤️', '👍', '👎', '😂', '😢', '😮', '😡', '🎉'];

  useEffect(() => {
    if (currentView === 'chat') {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages, currentView]);

  // Simulated typing indicator
  useEffect(() => {
    if (currentView === 'chat' && Math.random() > 0.7) {
      const randomUsers = ['Dr. Adebayo Johnson', 'Mrs. Funmi Okafor'];
      const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)];
      
      setTypingUsers([randomUser]);
      const timeout = setTimeout(() => setTypingUsers([]), 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [messages]);

  // Recording animation
  useEffect(() => {
    if (isRecording) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(recordingAnimation, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(recordingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      return () => {
        animation.stop();
        clearInterval(timer);
      };
    } else {
      setRecordingTime(0);
    }
  }, [isRecording]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const openChat = (chatRoom: ChatRoom) => {
    setSelectedChatRoom(chatRoom);
    setMessages(mockMessagesData[chatRoom.id] || []);
    setCurrentView('chat');
    // Mark messages as read
    if (chatRoom.unreadCount && chatRoom.unreadCount > 0) {
      chatRoom.unreadCount = 0;
    }
  };

  const goBackToList = () => {
    setCurrentView('list');
    setSelectedChatRoom(null);
    setMessages([]);
    setInputText('');
    setReplyingTo(null);
    setIsSelectionMode(false);
    setSelectedMessages([]);
    setEditingMessage(null);
    setIsSearchMode(false);
  };

  const sendMessage = () => {
    if (inputText.trim() === '' || !selectedChatRoom) return;

    if (editingMessage) {
      // Edit existing message
      setMessages(prev =>
        prev.map(msg =>
          msg.id === editingMessage.id
            ? { ...msg, text: inputText.trim(), editedAt: new Date().toISOString() }
            : msg
        )
      );
      setEditingMessage(null);
    } else {
      // Send new message
      const newMessage: Message = {
        id: messages.length + Date.now(),
        text: inputText.trim(),
        senderId: 'current_user',
        senderName: 'You',
        timestamp: new Date().toISOString(),
        type: 'text',
        isOwn: true,
        status: 'sending',
        replyTo: replyingTo?.id,
        mentions: extractMentions(inputText),
      };

      setMessages(prev => [...prev, newMessage]);
      
      // Update chat room's last message
      if (selectedChatRoom) {
        selectedChatRoom.lastMessage = inputText.trim();
        selectedChatRoom.lastMessageTime = newMessage.timestamp;
      }

      // Simulate message status updates
      setTimeout(() => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
          )
        );
      }, 500);

      setTimeout(() => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
          )
        );
      }, 1000);

      setTimeout(() => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
          )
        );
      }, 2000);
    }

    setInputText('');
    setReplyingTo(null);
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }
    
    return mentions;
  };

  const sendVoiceMessage = async () => {
    if (!selectedChatRoom) return;

    const voiceMessage: Message = {
      id: messages.length + Date.now(),
      text: '',
      senderId: 'current_user',
      senderName: 'You',
      timestamp: new Date().toISOString(),
      type: 'voice',
      isOwn: true,
      status: 'sending',
      voiceDuration: recordingTime,
    };

    setMessages(prev => [...prev, voiceMessage]);
    setIsRecording(false);
    
    // Simulate status updates
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === voiceMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 1000);
  };

  const sendImageMessage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && selectedChatRoom) {
        const imageMessage: Message = {
          id: messages.length + Date.now(),
          text: '',
          senderId: 'current_user',
          senderName: 'You',
          timestamp: new Date().toISOString(),
          type: 'image',
          isOwn: true,
          status: 'sending',
          imageUrl: result.assets[0].uri,
        };

        setMessages(prev => [...prev, imageMessage]);
        setShowAttachmentOptions(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const sendFileMessage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && selectedChatRoom) {
        const fileMessage: Message = {
          id: messages.length + Date.now(),
          text: '',
          senderId: 'current_user',
          senderName: 'You',
          timestamp: new Date().toISOString(),
          type: 'file',
          isOwn: true,
          status: 'sending',
          fileName: result.assets[0].name,
          fileSize: result.assets[0].size,
          fileUrl: result.assets[0].uri,
        };

        setMessages(prev => [...prev, fileMessage]);
        setShowAttachmentOptions(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const handleLongPress = (message: Message) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Vibration.vibrate(50);
    }
    
    if (!isSelectionMode) {
      showMessageOptions(message);
    }
  };

  const handleMessagePress = (message: Message) => {
    if (isSelectionMode) {
      toggleMessageSelection(message.id);
    }
  };

  const toggleMessageSelection = (messageId: number) => {
    setSelectedMessages(prev => {
      if (prev.includes(messageId)) {
        const newSelection = prev.filter(id => id !== messageId);
        if (newSelection.length === 0) {
          setIsSelectionMode(false);
        }
        return newSelection;
      } else {
        return [...prev, messageId];
      }
    });
  };

  const startSelectionMode = (messageId: number) => {
    setIsSelectionMode(true);
    setSelectedMessages([messageId]);
  };

  const deleteSelectedMessages = () => {
    Alert.alert(
      'Delete Messages',
      `Delete ${selectedMessages.length} message(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMessages(prev => prev.filter(msg => !selectedMessages.includes(msg.id)));
            setIsSelectionMode(false);
            setSelectedMessages([]);
          },
        },
      ]
    );
  };

  const forwardSelectedMessages = () => {
    // In a real app, this would show a contact picker
    Alert.alert('Forward Messages', 'Feature would show contact picker in real app');
    setIsSelectionMode(false);
    setSelectedMessages([]);
  };

  const reactToMessage = (message: Message, emoji: string) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === message.id) {
          const reactions = msg.reactions ? { ...msg.reactions } : {};
          if (!reactions[emoji]) {
            reactions[emoji] = [];
          }
          
          const userIndex = reactions[emoji].indexOf('current_user');
          if (userIndex === -1) {
            reactions[emoji].push('current_user');
          } else {
            reactions[emoji].splice(userIndex, 1);
            if (reactions[emoji].length === 0) {
              delete reactions[emoji];
            }
          }
          
          return { ...msg, reactions };
        }
        return msg;
      })
    );
    
    setShowEmojiPicker(false);
    setReactingToMessage(null);
  };

  const pinMessage = (message: Message) => {
    setPinnedMessage(message);
    Alert.alert('Message Pinned', 'Message has been pinned to the chat');
  };

  const searchInMessages = (query: string) => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const results = messages.filter(msg =>
      msg.text.toLowerCase().includes(query.toLowerCase()) ||
      msg.senderName.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
  };

  const showMessageOptions = (message: Message) => {
    const options = ['Reply', 'React', 'Copy'];
    
    if (message.isOwn) {
      options.push('Edit', 'Delete');
    } else {
      options.push('Forward');
    }
    
    if (selectedChatRoom?.type === 'group') {
      options.push('Pin');
    }
    
    options.push('Select', 'Cancel');

    Alert.alert('Message Options', '', [
      ...options.slice(0, -1).map(option => ({
        text: option,
        onPress: () => {
          switch (option) {
            case 'Reply':
              setReplyingTo(message);
              break;
            case 'React':
              setReactingToMessage(message);
              setShowEmojiPicker(true);
              break;
            case 'Copy':
              // In React Native, you'd use Clipboard API
              Alert.alert('Copied', 'Message copied to clipboard');
              break;
            case 'Edit':
              setEditingMessage(message);
              setInputText(message.text);
              break;
            case 'Delete':
              Alert.alert('Delete Message', 'Are you sure?', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => setMessages(prev => prev.filter(msg => msg.id !== message.id)),
                },
              ]);
              break;
            case 'Forward':
              Alert.alert('Forward Message', 'Feature would show contact picker');
              break;
            case 'Pin':
              pinMessage(message);
              break;
            case 'Select':
              startSelectionMode(message.id);
              break;
          }
        },
      })),
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleTyping = (text: string) => {
    setInputText(text);
    
    // Simulate typing indicator for other users
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
    
    typingTimeout.current = setTimeout(() => {
      // Stop typing indicator
    }, 1000);
  };

  const toggleChatMute = () => {
    if (selectedChatRoom) {
      selectedChatRoom.isMuted = !selectedChatRoom.isMuted;
      Alert.alert(
        selectedChatRoom.isMuted ? 'Chat Muted' : 'Chat Unmuted',
        selectedChatRoom.isMuted ? 'You will not receive notifications' : 'You will receive notifications'
      );
    }
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => setMessages([]),
        },
      ]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending':
        return 'time-outline';
      case 'sent':
        return 'checkmark-outline';
      case 'delivered':
        return 'checkmark-done-outline';
      case 'read':
        return 'checkmark-done';
      default:
        return 'time-outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'read':
        return '#3182ce';
      case 'delivered':
        return '#38a169';
      default:
        return '#666';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredChatRooms = mockChatRooms
    .filter(room => room.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      // Sort by pinned first, then by last message time
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      const aTime = new Date(a.lastMessageTime || a.lastActive).getTime();
      const bTime = new Date(b.lastMessageTime || b.lastActive).getTime();
      return bTime - aTime;
    });

  const renderChatListItem = ({ item }: { item: ChatRoom }) => (
    <TouchableOpacity
      style={[styles.chatListItem, item.isPinned && styles.pinnedChatItem]}
      onPress={() => openChat(item)}
    >
      {item.isPinned && <Ionicons name="pin" size={12} color="#666" style={styles.pinIcon} />}
      
      <View style={styles.chatAvatar}>
        <Text style={styles.chatAvatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
        {item.type === 'direct' && item.isOnline && (
          <View style={styles.onlineIndicator} />
        )}
      </View>
      
      <View style={styles.chatInfoLarge}>
        <View style={styles.chatHeader}>
          <View style={styles.chatNameContainer}>
            <Text style={styles.chatName} numberOfLines={1}>
              {item.name}
            </Text>
            {item.isMuted && (
              <Ionicons name="volume-mute" size={14} color="#666" style={styles.muteIcon} />
            )}
          </View>
          <Text style={styles.chatTime}>
            {formatTime(item.lastMessageTime || item.lastActive)}
          </Text>
        </View>
        
        <View style={styles.chatPreview}>
          <Text style={styles.chatLastMessage} numberOfLines={1}>
            {item.type === 'group' && `${item.participants} members • `}
            {item.lastMessage || 'No messages yet'}
          </Text>
          {item.unreadCount && item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderReactionBar = (reactions: { [emoji: string]: string[] }) => {
    if (!reactions || Object.keys(reactions).length === 0) return null;

    return (
      <View style={styles.reactionBar}>
        {Object.entries(reactions).map(([emoji, users]) => (
          <TouchableOpacity key={emoji} style={styles.reactionBubble}>
            <Text style={styles.reactionEmoji}>{emoji}</Text>
            <Text style={styles.reactionCount}>{users.length}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderFileMessage = (message: Message) => (
    <TouchableOpacity style={styles.fileContainer}>
      <View style={styles.fileIcon}>
        <Ionicons name="document" size={24} color="#3182ce" />
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>
          {message.fileName}
        </Text>
        <Text style={styles.fileSize}>
          {formatFileSize(message.fileSize)}
        </Text>
      </View>
      <TouchableOpacity style={styles.downloadButton}>
        <Ionicons name="download" size={20} color="#3182ce" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderVoiceMessage = (message: Message) => (
    <View style={styles.voiceContainer}>
      <TouchableOpacity style={styles.playButton}>
        <Ionicons name="play" size={16} color="#3182ce" />
      </TouchableOpacity>
      <View style={styles.waveform}>
        {[...Array(12)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.waveformBar,
              { height: Math.random() * 20 + 5 }
            ]}
          />
        ))}
      </View>
      <Text style={styles.voiceDuration}>
        {message.voiceDuration ? `${Math.floor(message.voiceDuration / 60)}:${(message.voiceDuration % 60).toString().padStart(2, '0')}` : '0:00'}
      </Text>
    </View>
  );

  const renderImageMessage = (message: Message) => (
    <TouchableOpacity style={styles.imageContainer}>
      <Image
        source={{ uri: message.imageUrl }}
        style={styles.messageImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderMessage = (message: Message, index: number) => {
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const showDate = !prevMessage || 
      formatDate(message.timestamp) !== formatDate(prevMessage.timestamp);
    const showAvatar = !message.isOwn && 
      (!prevMessage || prevMessage.senderId !== message.senderId || showDate);

    const repliedMessage = message.replyTo 
      ? messages.find(msg => msg.id === message.replyTo)
      : null;

    const isSelected = selectedMessages.includes(message.id);

    return (
      <View key={message.id}>
        {showDate && (
          <View style={styles.dateSeparator}>
            <Text style={styles.dateText}>{formatDate(message.timestamp)}</Text>
          </View>
        )}
        
        <TouchableOpacity
          style={[
            styles.messageContainer,
            message.isOwn ? styles.ownMessage : styles.otherMessage,
            isSelected && styles.selectedMessage,
          ]}
          onPress={() => handleMessagePress(message)}
          onLongPress={() => handleLongPress(message)}
        >
          {isSelectionMode && (
            <View style={styles.selectionCheckbox}>
              <Ionicons
                name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                size={20}
                color={isSelected ? "#3182ce" : "#666"}
              />
            </View>
          )}

          {!message.isOwn && showAvatar && (
            <TouchableOpacity style={styles.avatar}>
              <Text style={styles.avatarText}>
                {message.senderName.charAt(0)}
              </Text>
            </TouchableOpacity>
          )}
          
          <View
            style={[
              styles.messageBubble,
              message.isOwn ? styles.ownBubble : styles.otherBubble,
              !message.isOwn && !showAvatar && styles.continuationBubble,
            ]}
          >
            {message.isForwarded && (
              <View style={styles.forwardedIndicator}>
                <Ionicons name="arrow-forward" size={12} color="#666" />
                <Text style={styles.forwardedText}>
                  Forwarded from {message.forwardedFrom}
                </Text>
              </View>
            )}

            {!message.isOwn && showAvatar && (
              <Text style={styles.senderName}>{message.senderName}</Text>
            )}
            
            {repliedMessage && (
              <TouchableOpacity style={styles.replyContainer}>
                <View style={styles.replyLine} />
                <View style={styles.replyContent}>
                  <Text style={styles.replyAuthor}>{repliedMessage.senderName}</Text>
                  <Text style={styles.replyText} numberOfLines={1}>
                    {repliedMessage.text || `${repliedMessage.type} message`}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            
            {/* Message Content Based on Type */}
            {message.type === 'text' && (
              <Text style={[
                styles.messageText,
                message.isOwn ? styles.ownMessageText : styles.otherMessageText
              ]}>
                {message.text}
              </Text>
            )}
            
            {message.type === 'image' && renderImageMessage(message)}
            {message.type === 'file' && renderFileMessage(message)}
            {message.type === 'voice' && renderVoiceMessage(message)}
            
            <View style={styles.messageFooter}>
              <View style={styles.messageFooterLeft}>
                <Text style={[
                  styles.timestamp,
                  message.isOwn ? styles.ownTimestamp : styles.otherTimestamp
                ]}>
                  {formatTime(message.timestamp)}
                  {message.editedAt && ' (edited)'}
                </Text>
                {message.isOwn && (
                  <Ionicons
                    name={getStatusIcon(message.status)}
                    size={12}
                    color={getStatusColor(message.status)}
                    style={styles.statusIcon}
                  />
                )}
              </View>
            </View>
            
            {message.reactions && renderReactionBar(message.reactions)}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // Chat List View
  if (currentView === 'list') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.listHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('dashboard')}
          >
            <Ionicons name="arrow-back" size={24} color="#1a202c" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Chats</Text>
          
          <TouchableOpacity style={styles.headerAction}>
            <Ionicons name="create-outline" size={24} color="#1a202c" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search chats..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FlatList
          data={filteredChatRooms}
          renderItem={renderChatListItem}
          keyExtractor={(item) => item.id}
          style={styles.chatList}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }

  // Chat View
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Chat Header */}
        <View style={styles.chatHeaderContainer}>
          {isSelectionMode ? (
            <View style={styles.selectionHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  setIsSelectionMode(false);
                  setSelectedMessages([]);
                }}
              >
                <Ionicons name="close" size={24} color="#1a202c" />
              </TouchableOpacity>
              
              <Text style={styles.selectionCount}>
                {selectedMessages.length} selected
              </Text>
              
              <View style={styles.selectionActions}>
                <TouchableOpacity
                  style={styles.selectionAction}
                  onPress={forwardSelectedMessages}
                >
                  <Ionicons name="arrow-forward" size={20} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.selectionAction}
                  onPress={deleteSelectedMessages}
                >
                  <Ionicons name="trash" size={20} color="#e53e3e" />
                </TouchableOpacity>
              </View>
            </View>
          ) : isSearchMode ? (
            <View style={styles.searchHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  setIsSearchMode(false);
                  setMessageSearchQuery('');
                  setSearchResults([]);
                }}
              >
                <Ionicons name="arrow-back" size={24} color="#1a202c" />
              </TouchableOpacity>
              
              <TextInput
                style={styles.searchHeaderInput}
                placeholder="Search messages..."
                value={messageSearchQuery}
                onChangeText={(text) => {
                  setMessageSearchQuery(text);
                  searchInMessages(text);
                }}
                autoFocus
              />
              
              {messageSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => {
                  setMessageSearchQuery('');
                  setSearchResults([]);
                }}>
                  <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={styles.backButton}
                onPress={goBackToList}
              >
                <Ionicons name="arrow-back" size={24} color="#1a202c" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.chatInfoSmall}
                onPress={() => setShowChatInfo(true)}
              >
                <Text style={styles.chatTitle}>{selectedChatRoom?.name}</Text>
                <Text style={styles.chatSubtitle}>
                  {selectedChatRoom?.type === 'group' 
                    ? `${selectedChatRoom.participants} members • ${onlineUsers.length} online`
                    : selectedChatRoom?.isOnline ? 'Online' : 'Last seen recently'
                  }
                </Text>
              </TouchableOpacity>
              
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.headerAction}
                  onPress={() => setIsSearchMode(true)}
                >
                  <Ionicons name="search" size={20} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerAction}>
                  <Ionicons name="videocam" size={22} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerAction}>
                  <Ionicons name="call" size={20} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.headerAction}
                  onPress={() => {
                    Alert.alert('Chat Options', '', [
                      { text: selectedChatRoom?.isMuted ? 'Unmute' : 'Mute', onPress: toggleChatMute },
                      { text: 'Clear Chat', onPress: clearChat },
                      { text: 'Chat Info', onPress: () => setShowChatInfo(true) },
                      { text: 'Cancel', style: 'cancel' },
                    ]);
                  }}
                >
                  <Ionicons name="ellipsis-vertical" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Pinned Message */}
        {pinnedMessage && (
          <TouchableOpacity style={styles.pinnedMessageBar}>
            <Ionicons name="pin" size={16} color="#3182ce" />
            <Text style={styles.pinnedMessageText} numberOfLines={1}>
              {pinnedMessage.text}
            </Text>
            <TouchableOpacity onPress={() => setPinnedMessage(null)}>
              <Ionicons name="close" size={16} color="#666" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {(isSearchMode ? searchResults : messages).map((message, index) => 
            renderMessage(message, index)
          )}
          
          {typingUsers.length > 0 && (
            <View style={styles.typingIndicator}>
              <View style={styles.typingBubble}>
                <Text style={styles.typingText}>
                  {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </Text>
                <View style={styles.typingDots}>
                  <View style={[styles.typingDot, styles.typingDot1]} />
                  <View style={[styles.typingDot, styles.typingDot2]} />
                  <View style={[styles.typingDot, styles.typingDot3]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Recording Indicator */}
        {isRecording && (
          <View style={styles.recordingIndicator}>
            <Animated.View style={[styles.recordingDot, { opacity: recordingAnimation }]} />
            <Text style={styles.recordingText}>Recording... {formatRecordingTime(recordingTime)}</Text>
            <TouchableOpacity
              style={styles.stopRecordingButton}
              onPress={() => setIsRecording(false)}
            >
              <Ionicons name="stop" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {/* Reply Bar */}
        {(replyingTo || editingMessage) && (
          <View style={styles.replyBar}>
            <View style={styles.replyBarContent}>
              <View style={styles.replyBarLine} />
              <View style={styles.replyBarText}>
                <Text style={styles.replyBarAuthor}>
                  {editingMessage ? 'Editing message' : `Replying to ${replyingTo?.senderName}`}
                </Text>
                <Text style={styles.replyBarMessage} numberOfLines={1}>
                  {editingMessage ? editingMessage.text : replyingTo?.text}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setReplyingTo(null);
                setEditingMessage(null);
                setInputText('');
              }}
              style={styles.cancelReply}
            >
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.attachButton}
            onPress={() => setShowAttachmentOptions(true)}
          >
            <Ionicons name="add" size={24} color="#666" />
          </TouchableOpacity>
          
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              value={inputText}
              onChangeText={handleTyping}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity style={styles.emojiButton}>
              <Ionicons name="happy-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          {inputText.trim() ? (
            <TouchableOpacity
              style={[styles.sendButton, styles.sendButtonActive]}
              onPress={sendMessage}
            >
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.sendButton}
              onLongPress={() => setIsRecording(true)}
              onPressOut={() => {
                if (isRecording && recordingTime > 0) {
                  sendVoiceMessage();
                } else {
                  setIsRecording(false);
                }
              }}
            >
              <Ionicons name="mic" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Attachment Options Modal */}
        <Modal
          visible={showAttachmentOptions}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAttachmentOptions(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowAttachmentOptions(false)}
          >
            <View style={styles.attachmentOptionsContainer}>
              <TouchableOpacity
                style={styles.attachmentOption}
                onPress={sendImageMessage}
              >
                <View style={[styles.attachmentOptionIcon, { backgroundColor: '#e53e3e' }]}>
                  <Ionicons name="image" size={24} color="white" />
                </View>
                <Text style={styles.attachmentOptionText}>Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.attachmentOption}
                onPress={sendFileMessage}
              >
                <View style={[styles.attachmentOptionIcon, { backgroundColor: '#3182ce' }]}>
                  <Ionicons name="document" size={24} color="white" />
                </View>
                <Text style={styles.attachmentOptionText}>Document</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.attachmentOption}>
                <View style={[styles.attachmentOptionIcon, { backgroundColor: '#38a169' }]}>
                  <Ionicons name="location" size={24} color="white" />
                </View>
                <Text style={styles.attachmentOptionText}>Location</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.attachmentOption}>
                <View style={[styles.attachmentOptionIcon, { backgroundColor: '#9f7aea' }]}>
                  <Ionicons name="person" size={24} color="white" />
                </View>
                <Text style={styles.attachmentOptionText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Emoji Picker Modal */}
        <Modal
          visible={showEmojiPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowEmojiPicker(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowEmojiPicker(false)}
          >
            <View style={styles.emojiPickerContainer}>
              <Text style={styles.emojiPickerTitle}>React with</Text>
              <View style={styles.emojiRow}>
                {commonEmojis.map(emoji => (
                  <TouchableOpacity
                    key={emoji}
                    style={styles.emojiOption}
                    onPress={() => reactingToMessage && reactToMessage(reactingToMessage, emoji)}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Chat Info Modal */}
        <Modal
          visible={showChatInfo}
          animationType="slide"
          onRequestClose={() => setShowChatInfo(false)}
        >
          <SafeAreaView style={styles.chatInfoContainer}>
            <View style={styles.chatInfoHeader}>
              <TouchableOpacity onPress={() => setShowChatInfo(false)}>
                <Ionicons name="close" size={24} color="#1a202c" />
              </TouchableOpacity>
              <Text style={styles.chatInfoTitle}>Chat Info</Text>
              <View style={{ width: 24 }} />
            </View>
            
            <ScrollView style={styles.chatInfoContent}>
              <View style={styles.chatInfoSection}>
                <View style={styles.chatInfoAvatar}>
                  <Text style={styles.chatInfoAvatarText}>
                    {selectedChatRoom?.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.chatInfoName}>{selectedChatRoom?.name}</Text>
                {selectedChatRoom?.description && (
                  <Text style={styles.chatInfoDescription}>
                    {selectedChatRoom.description}
                  </Text>
                )}
              </View>
              
              {selectedChatRoom?.type === 'group' && (
                <View style={styles.chatInfoSection}>
                  <Text style={styles.chatInfoSectionTitle}>
                    Members ({selectedChatRoom.participants})
                  </Text>
                  {selectedChatRoom.participantsList?.map(participant => (
                    <View key={participant.id} style={styles.participantItem}>
                      <View style={styles.participantAvatar}>
                        <Text style={styles.participantAvatarText}>
                          {participant.name.charAt(0)}
                        </Text>
                        {participant.isOnline && <View style={styles.onlineIndicator} />}
                      </View>
                      <View style={styles.participantInfo}>
                        <Text style={styles.participantName}>{participant.name}</Text>
                        <Text style={styles.participantStatus}>
                          {participant.role === 'admin' ? 'Admin' : 'Member'} • {participant.isOnline ? 'Online' : 'Offline'}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
              
              <View style={styles.chatInfoSection}>
                <TouchableOpacity style={styles.chatInfoOption}>
                  <Ionicons name="notifications" size={20} color="#666" />
                  <Text style={styles.chatInfoOptionText}>
                    {selectedChatRoom?.isMuted ? 'Unmute notifications' : 'Mute notifications'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.chatInfoOption}>
                  <Ionicons name="images" size={20} color="#666" />
                  <Text style={styles.chatInfoOptionText}>Media, links and docs</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.chatInfoOption}>
                  <Ionicons name="search" size={20} color="#666" />
                  <Text style={styles.chatInfoOptionText}>Search</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.chatInfoOption, styles.dangerOption]}>
                  <Ionicons name="trash" size={20} color="#e53e3e" />
                  <Text style={[styles.chatInfoOptionText, styles.dangerText]}>
                    Clear chat
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </KeyboardAvoidingView>
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
  
  // Common Elements
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerAction: {
    padding: 8,
  },
  
  // Chat List Styles
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#1a202c',
    textAlign: 'center',
    marginRight: 24,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a202c',
  },
  chatList: {
    flex: 1,
    backgroundColor: 'white',
  },
  chatListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f7fafc',
    position: 'relative',
  },
  pinnedChatItem: {
    backgroundColor: '#f0f8ff',
  },
  pinIcon: {
    position: 'absolute',
    top: 8,
    right: 16,
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3182ce',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  chatAvatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#38a169',
    borderWidth: 2,
    borderColor: 'white',
  },
  chatInfoSmall: {
    flex: 1,
  },
  chatInfoLarge: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    flex: 1,
  },
  muteIcon: {
    marginLeft: 4,
  },
  chatTime: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  chatPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatLastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#3182ce',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Chat View Styles
  chatHeaderContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  // Selection Mode Header
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectionCount: {
    flex: 1,
    fontSize: 18,
  },

  selectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectionAction: {
    padding: 8,
    marginLeft: 8,
  },
  // Search Mode Header
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchHeaderInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f7fafc',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1a202c',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a202c',
  },
  chatSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  chatInfoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a202c',
  },
  chatInfoSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  chatInfoAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3182ce',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  chatInfoAvatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
  chatInfoName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a202c',
  },
  chatInfoDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3182ce',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  participantAvatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
  },
  participantStatus: {
    fontSize: 14,
    color: '#666',
  },
  
  chatInfoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  chatInfoOptionText: {
    fontSize: 16,
    color: '#1a202c',
    marginLeft: 12,
  },
  chatInfoSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 8,
  },
  dangerOption: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    marginTop: 16,
  },
  dangerText: {
    color: '#e53e3e',
  },
  // Message Styles
 messageContainer: {
  flexDirection: 'row',
  marginVertical: 8,
  paddingHorizontal: 10,
},
  ownMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  selectedMessage: {
    backgroundColor: '#e2e8f0',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  ownBubble: {
    backgroundColor: '#3182ce',
    alignSelf: 'flex-end',
  },
  otherBubble: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    borderColor: '#e2e8f0',
    borderWidth: 1,
  },
  continuationBubble: {
    marginLeft: 40,
  },
  messageText: {
    fontSize: 16,
    color: '#1a202c',
  },
  ownMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#1a202c',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  messageFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  ownTimestamp: {
    color: 'white',
  },
  otherTimestamp: {
    color: '#666',
  },
  statusIcon: {
    marginLeft: 8,
  },
  reactionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  reactionIcon: {
    marginRight: 8,
  },
  reactionCount: {
    fontSize: 12,
    color: '#666',
  },
  dateSeparator: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginTop: 8,
  },
  messageFile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#f7fafc',
    marginTop: 8,
  },
  fileIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  fileName: {
    fontSize: 16,
    color: '#1a202c',
    flex: 1,
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
  },
  voiceMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#f7fafc',
    marginTop: 8,
  },
  voiceWaveform: {
    flex: 1,
    height: 20,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    marginRight: 12,
  },
  voiceDuration: {
    fontSize: 12,
    color: '#666',
  },
  recordingIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#3182ce',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
    marginRight: 8,
  },
  recordingText: {
    color: 'white',
    fontSize: 16,
  },
  stopRecordingButton: {
    marginLeft: 'auto',
    padding: 8,
    backgroundColor: '#e53e3e',
    borderRadius: 20,
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  replyBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  replyBarLine: {
    width: 2,
    height: '100%',
    backgroundColor: '#3182ce',
    marginRight: 8,
  },
  replyBarText: {
    flex: 1,
  },
  replyBarAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
  },

  replyBarMessage: {
    fontSize: 14,
    color: '#666',
  },
  cancelReply: {
    padding: 8,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  replyLine: {
    width: 2,
    height: '100%',
    backgroundColor: '#3182ce',
    marginRight: 8,
  },
  replyContent: {
    flex: 1,
  },
  replyAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
  },
  replyText: {
    fontSize: 14,
    color: '#666',
  },
  pinnedMessageBar: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinnedMessageText: {
    flex: 1,
    fontSize: 14,
    color: '#3182ce',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentOptionsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: '80%',
    alignItems: 'center',
  },
  attachmentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
  },
  attachmentOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  attachmentOptionText: {
    fontSize: 16,
    color: '#1a202c',
  },
  emojiPickerContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: '80%',
    alignItems: 'center',
  },
  emojiPickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 16,
  },

  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  emojiOption: {
    padding: 8,
    margin: 4,
  },
  emojiText: {
    fontSize: 24,
  },
  chatInfoContainer: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  chatInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  chatInfoContent: {
    flex: 1,
    padding: 16,
  },
  reactionBubble: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    alignItems: 'center',
  },
  reactionEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    margin: 8,
    backgroundColor: '#f0f4f8',
    borderRadius: 8,
    elevation: 1, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  fileInfo: {
    flex: 1,
  },
  downloadButton: {
    paddingLeft: 10,
  },
   voiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 12,
    margin: 8,
    borderRadius: 8,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e6f0fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  waveform: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    height: 30,
  },
  waveformBar: {
    width: 2,
    backgroundColor: '#3182ce',
    marginHorizontal: 1,
    borderRadius: 1,
  },
  imageContainer: {
  margin: 8,
  borderRadius: 10,
  overflow: 'hidden',
  maxWidth: '70%',
  alignSelf: 'flex-start', // or 'flex-end' depending on sender
  backgroundColor: '#f0f0f0',
  },
  selectionCheckbox: {
  marginRight: 10,
  justifyContent: 'center',
  alignItems: 'center',
},
avatar: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#3182ce',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 10,
},
avatarText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
forwardedIndicator: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 4,
},

forwardedText: {
  marginLeft: 4,
  fontSize: 12,
  color: '#666',
  fontStyle: 'italic',
},
senderName: {
  fontSize: 12,
  color: '#666',
  marginBottom: 2,
  marginLeft: 8,
},
messagesContainer: {
    flex: 1,
    backgroundColor: '#f7fafc',
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  messagesContent: {
    paddingBottom: 20,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  typingBubble: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '60%',
  },
  typingText: {
    fontSize: 14,
    color: '#4a5568',
    marginRight: 8,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    backgroundColor: '#3182ce',
    borderRadius: 3,
    marginHorizontal: 2,
    opacity: 0.3,
  },
  typingDot1: {
    opacity: 1,
  },
  typingDot2: {
    opacity: 0.6,
  },
  typingDot3: {
    opacity: 0.9,
  },
inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f0f4f8',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100, // limit multiline height
    paddingVertical: 6,
    color: '#1a202c',
  },
  emojiButton: {
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#e2e8f0',
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#3182ce',
  },

  });

export default ChatScreen;