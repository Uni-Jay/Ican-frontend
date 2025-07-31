import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { MainDrawerParamList } from '../../navigations/MainNavigator';
import { DrawerScreenProps } from '@react-navigation/drawer';

interface Message {
  id: number;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  isOwn: boolean;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: number;
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
}

// Mock chat rooms data
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
  },
  {
    id: 'room6',
    name: 'Mr. Chidi Emenike',
    type: 'direct',
    participants: 2,
    lastActive: '2024-08-28T11:15:00Z',
    lastMessage: 'That\'s great news for small enterprises!',
    lastMessageTime: '2024-08-28T11:15:00Z',
    unreadCount: 0,
    isOnline: false,
  },
];

// Mock messages for individual chats
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
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive in chat view
    if (currentView === 'chat') {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages, currentView]);

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

  const openChat = (chatRoom: ChatRoom) => {
    setSelectedChatRoom(chatRoom);
    setMessages(mockMessagesData[chatRoom.id] || []);
    setCurrentView('chat');
  };

  const goBackToList = () => {
    setCurrentView('list');
    setSelectedChatRoom(null);
    setMessages([]);
    setInputText('');
    setReplyingTo(null);
  };

  const sendMessage = () => {
    if (inputText.trim() === '' || !selectedChatRoom) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputText.trim(),
      senderId: 'current_user',
      senderName: 'You',
      timestamp: new Date().toISOString(),
      type: 'text',
      isOwn: true,
      status: 'sending',
      replyTo: replyingTo?.id,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setReplyingTo(null);

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
  };

  const replyToMessage = (message: Message) => {
    setReplyingTo(message);
  };

  const cancelReply = () => {
    setReplyingTo(null);
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

  const showMessageOptions = (message: Message) => {
    const options = ['Reply'];
    if (message.isOwn) {
      options.push('Edit', 'Delete');
    } else {
      options.push('Report');
    }
    options.push('Cancel');

    Alert.alert('Message Options', '', [
      ...options.slice(0, -1).map(option => ({
        text: option,
        onPress: () => {
          if (option === 'Reply') {
            replyToMessage(message);
          } else if (option === 'Delete') {
            setMessages(prev => prev.filter(msg => msg.id !== message.id));
          }
          // Handle other options as needed
        },
      })),
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const filteredChatRooms = mockChatRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChatListItem = ({ item }: { item: ChatRoom }) => (
    <TouchableOpacity
      style={styles.chatListItem}
      onPress={() => openChat(item)}
    >
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
          <Text style={styles.chatName} numberOfLines={1}>
            {item.name}
          </Text>
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

  const renderMessage = (message: Message, index: number) => {
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const showDate = !prevMessage || 
      formatDate(message.timestamp) !== formatDate(prevMessage.timestamp);
    const showAvatar = !message.isOwn && 
      (!prevMessage || prevMessage.senderId !== message.senderId || showDate);

    const repliedMessage = message.replyTo 
      ? messages.find(msg => msg.id === message.replyTo)
      : null;

    return (
      <View key={message.id}>
        {showDate && (
          <View style={styles.dateSeparator}>
            <Text style={styles.dateText}>{formatDate(message.timestamp)}</Text>
          </View>
        )}
        
        <View style={[
          styles.messageContainer,
          message.isOwn ? styles.ownMessage : styles.otherMessage
        ]}>
          {!message.isOwn && showAvatar && (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {message.senderName.charAt(0)}
              </Text>
            </View>
          )}
          
          <TouchableOpacity
            style={[
              styles.messageBubble,
              message.isOwn ? styles.ownBubble : styles.otherBubble,
              !message.isOwn && !showAvatar && styles.continuationBubble,
            ]}
            onLongPress={() => showMessageOptions(message)}
          >
            {!message.isOwn && showAvatar && (
              <Text style={styles.senderName}>{message.senderName}</Text>
            )}
            
            {repliedMessage && (
              <View style={styles.replyContainer}>
                <View style={styles.replyLine} />
                <View style={styles.replyContent}>
                  <Text style={styles.replyAuthor}>{repliedMessage.senderName}</Text>
                  <Text style={styles.replyText} numberOfLines={1}>
                    {repliedMessage.text}
                  </Text>
                </View>
              </View>
            )}
            
            <Text style={[
              styles.messageText,
              message.isOwn ? styles.ownMessageText : styles.otherMessageText
            ]}>
              {message.text}
            </Text>
            
            <View style={styles.messageFooter}>
              <Text style={[
                styles.timestamp,
                message.isOwn ? styles.ownTimestamp : styles.otherTimestamp
              ]}>
                {formatTime(message.timestamp)}
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
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (currentView === 'list') {
    return (
      <SafeAreaView style={styles.safeArea}>
        {/* Chat List Header */}
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

        {/* Search Bar */}
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

        {/* Chat List */}
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBackToList}
          >
            <Ionicons name="arrow-back" size={24} color="#1a202c" />
          </TouchableOpacity>
          
          <View style={styles. chatInfoSmall}>
            <Text style={styles.chatTitle}>{selectedChatRoom?.name}</Text>
            <Text style={styles.chatSubtitle}>
              {selectedChatRoom?.type === 'group' 
                ? `${selectedChatRoom.participants} members • Online`
                : selectedChatRoom?.isOnline ? 'Online' : 'Last seen recently'
              }
            </Text>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerAction}>
              <Ionicons name="videocam" size={22} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerAction}>
              <Ionicons name="call" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerAction}>
              <Ionicons name="ellipsis-vertical" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => renderMessage(message, index))}
          
          {isTyping && (
            <View style={styles.typingIndicator}>
              <View style={styles.typingBubble}>
                <View style={styles.typingDots}>
                  <View style={[styles.typingDot, styles.typingDot1]} />
                  <View style={[styles.typingDot, styles.typingDot2]} />
                  <View style={[styles.typingDot, styles.typingDot3]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Reply Bar */}
        {replyingTo && (
          <View style={styles.replyBar}>
            <View style={styles.replyBarContent}>
              <View style={styles.replyBarLine} />
              <View style={styles.replyBarText}>
                <Text style={styles.replyBarAuthor}>
                  Replying to {replyingTo.senderName}
                </Text>
                <Text style={styles.replyBarMessage} numberOfLines={1}>
                  {replyingTo.text}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={cancelReply} style={styles.cancelReply}>
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add" size={24} color="#666" />
          </TouchableOpacity>
          
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity style={styles.emojiButton}>
              <Ionicons name="happy-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() ? styles.sendButtonActive : null
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons
              name={inputText.trim() ? "send" : "mic"}
              size={20}
              color={inputText.trim() ? "white" : "#666"}
            />
          </TouchableOpacity>
        </View>
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
    marginRight: 24, // To center the title
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
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    flex: 1,
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
  
  // Chat View Styles (existing styles)
  chatHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    marginRight: 12,
  },
 chatInfoLarge: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a202c',
  },
  chatSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAction: {
    marginLeft: 16,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  messagesContent: {
    paddingVertical: 16,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  ownMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3182ce',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    minHeight: 40,
    justifyContent: 'center',
  },
  ownBubble: {
    backgroundColor: '#3182ce',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
  },
  continuationBubble: {
    marginLeft: 40,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3182ce',
    marginBottom: 4,
  },
  replyContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    opacity: 0.8,
  },
  replyLine: {
    width: 3,
    backgroundColor: '#3182ce',
    borderRadius: 2,
    marginRight: 8,
  },
  replyContent: {
    flex: 1,
  },
  replyAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3182ce',
  },
  replyText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#1a202c',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
  },
  ownTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherTimestamp: {
    color: '#666',
  },
  statusIcon: {
    marginLeft: 4,
  },
  typingIndicator: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  typingBubble: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    marginLeft: 40,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#666',
    marginHorizontal: 2,
  },
  typingDot1: {
    // Animation would be applied here
  },
  typingDot2: {
    // Animation would be applied here
  },
  typingDot3: {
    // Animation would be applied here
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#edf2f7',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  replyBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyBarLine: {
    width: 3,
    height: 32,
    backgroundColor: '#3182ce',
    borderRadius: 2,
    marginRight: 12,
  },
  replyBarText: {
    flex: 1,
  },
  replyBarAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3182ce',
  },
  replyBarMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  cancelReply: {
    padding: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  attachButton: {
    marginRight: 8,
    marginBottom: 4,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f7fafc',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    minHeight: 40,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a202c',
    maxHeight: 100,
    paddingVertical: 4,
  },
  emojiButton: {
    marginLeft: 8,
    marginBottom: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#3182ce',
  },
});

export default ChatScreen;