// CommunicationScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Archive, Bell, Check, CheckCheck, Filter, Forward, MessageCircle, MoreVertical, Paperclip, Plus, Reply, Search, Send, Smile, Star, Trash2, Users, X } from 'lucide-react-native';

type User = {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline' | string;
};

type Message = {
  id: number;
  sender: string;
  avatar: string;
  content: string;
  timestamp: string;
  unread: boolean;
  type: 'direct' | 'group' | string;
  status?: 'sent' | 'delivered' | 'read' | string;
  isOwn?: boolean;
  attachments?: string[];
  participants?: string[];
};

type NotificationType = {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  type: string;
  priority: string;
  read: boolean;
  actionRequired?: boolean;
  actions?: { label: string; action: string }[];
};

type Announcement = {
  id: number;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  category: string;
  pinned?: boolean;
  attachments?: string[];
  likes?: number;
  comments?: { author: string; content: string; timestamp: string }[];
  liked?: boolean;
};

const SCREEN_WIDTH = Dimensions.get('window').width;

const CommunicationScreen: React.FC = () => {
  // Tabs + search + compose states
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications' | 'announcements'>('messages');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // message-related
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'Dr. Sarah Johnson',
      avatar: 'SJ',
      content: 'The CPD session tomorrow has been moved to 2 PM. Please confirm attendance.',
      timestamp: '10:30 AM',
      unread: true,
      type: 'direct',
      status: 'delivered',
      attachments: ['session-details.pdf']
    },
    {
      id: 2,
      sender: 'Accounting Team',
      avatar: 'AT',
      content: 'Monthly financial reports are due by Friday. Need any assistance with the new templates?',
      timestamp: 'Yesterday',
      unread: true,
      type: 'group',
      participants: ['John Doe', 'Jane Smith', 'Mike Wilson'],
      status: 'read'
    },
    {
      id: 3,
      sender: 'Professional Development',
      avatar: 'PD',
      content: 'New certification opportunities available for Q3. Check the portal for details and early bird discounts.',
      timestamp: '2 days ago',
      unread: false,
      type: 'group',
      participants: ['All Members'],
      status: 'read'
    },
    {
      id: 4,
      sender: 'You',
      avatar: 'YU',
      content: "Thanks for the update! I'll review the materials and get back to you.",
      timestamp: '2 days ago',
      unread: false,
      type: 'direct',
      isOwn: true,
      status: 'read'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [messageSubject, setMessageSubject] = useState('');
  const [showMessageDetails, setShowMessageDetails] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});

  // notifications + announcements
  const [notifications, setNotifications] = useState<NotificationType[]>([
    {
      id: 1,
      title: 'CPD Seminar Tomorrow',
      message: 'Digital Transformation in Accounting - Room 301, 2:00 PM. Please bring your laptop.',
      timestamp: '2 hours ago',
      type: 'cpd',
      priority: 'high',
      read: false,
      actionRequired: true,
      actions: [
        { label: 'Confirm Attendance', action: 'confirm' },
        { label: 'View Details', action: 'details' }
      ]
    },
    {
      id: 2,
      title: 'Payment Reminder',
      message: 'Annual membership fee due in 5 days. Amount: $250. Auto-renewal is enabled.',
      timestamp: '1 day ago',
      type: 'financial',
      priority: 'medium',
      read: false,
      actionRequired: true,
      actions: [
        { label: 'Pay Now', action: 'pay' },
        { label: 'Update Payment Method', action: 'update' }
      ]
    },
    {
      id: 3,
      title: 'System Maintenance Complete',
      message: 'Platform maintenance completed successfully. All features are now available.',
      timestamp: '3 days ago',
      type: 'system',
      priority: 'low',
      read: true
    },
    {
      id: 4,
      title: 'New Survey Available',
      message: 'Professional Development Needs Assessment 2024. Your input helps shape our programs.',
      timestamp: '1 week ago',
      type: 'survey',
      priority: 'medium',
      read: false,
      actionRequired: true,
      actions: [
        { label: 'Take Survey', action: 'survey' },
        { label: 'Remind Later', action: 'remind' }
      ]
    }
  ]);

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      title: 'New Professional Standards Released',
      content:
        'The Institute has published updated professional standards effective immediately. All members must review and implement these changes by the end of the quarter. Key updates include enhanced data privacy requirements and new audit procedures.',
      author: 'Institute Administration',
      timestamp: '1 day ago',
      category: 'policy',
      pinned: true,
      attachments: ['standards-2024.pdf', 'implementation-guide.pdf'],
      likes: 23,
      comments: [
        { author: 'Dr. Sarah Johnson', content: 'Very comprehensive updates. Thanks for the clear guidelines!', timestamp: '6 hours ago' },
        { author: 'Mike Wilson', content: 'When will the training sessions be scheduled?', timestamp: '4 hours ago' }
      ],
      liked: false
    },
    {
      id: 2,
      title: 'Annual Conference Registration Open',
      content:
        'Register now for the 2025 Annual Professional Conference "Future of Accounting in Digital Age". Early bird pricing available until March 15th. Featured speakers include industry leaders from top firms.',
      author: 'Events Team',
      timestamp: '3 days ago',
      category: 'events',
      pinned: false,
      attachments: ['conference-brochure.pdf', 'registration-form.pdf', 'speaker-lineup.pdf'],
      likes: 45,
      comments: [{ author: 'Jane Smith', content: "Can't wait! The speaker lineup looks amazing.", timestamp: '2 days ago' }],
      liked: true
    },
    {
      id: 3,
      title: 'Monthly CPD Webinar Series',
      content: 'Join us for our monthly CPD webinar series covering emerging trends in accounting technology, regulatory changes, and best practices. Next session: "AI in Audit Processes" on March 20th.',
      author: 'CPD Committee',
      timestamp: '1 week ago',
      category: 'cpd',
      pinned: false,
      likes: 18,
      comments: [],
      liked: false
    }
  ]);

  // users list + online user calculation
  const users: User[] = [
    { id: 1, name: 'Dr. Sarah Johnson', avatar: 'SJ', status: 'online' },
    { id: 2, name: 'Mike Wilson', avatar: 'MW', status: 'online' },
    { id: 3, name: 'Jane Smith', avatar: 'JS', status: 'away' },
    { id: 4, name: 'Professional Development', avatar: 'PD', status: 'online' },
    { id: 5, name: 'Accounting Team', avatar: 'AT', status: 'online' }
  ];

  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  // refs
  const scrollRef = useRef<ScrollView | null>(null);

  // derived values
  const unreadCount = notifications.filter(n => !n.read).length;
  const unreadMessages = messages.filter(m => m.unread && !m.isOwn).length;

  // emojis
  const emojis = ['😀', '😂', '😍', '👍', '👎', '❤️', '🎉', '🤔', '😢', '😡'];

  // lifecycle
  useEffect(() => {
    setOnlineUsers(users.filter(u => u.status === 'online'));

    // simulate occasional new notification
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        const newNotif: NotificationType = {
          id: Date.now(),
          title: 'New Update Available',
          message: 'System update available with bug fixes and improvements.',
          timestamp: 'Just now',
          type: 'system',
          priority: 'low',
          read: false
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // scroll to top of messages list (we store newest first) / or bottom - we'll scroll to top when messages changed
  useEffect(() => {
    // allow some time for layout
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, 200);
    return () => clearTimeout(t);
  }, [messages]);

  // filters
  const filteredMessages = messages.filter(msg =>
    searchQuery === '' ||
    msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNotifications = notifications.filter(notif =>
    (filterType === 'all' || notif.type === filterType) &&
    (searchQuery === '' ||
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredAnnouncements = announcements.filter(ann =>
    (filterType === 'all' || ann.category === filterType) &&
    (searchQuery === '' ||
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // helper actions
  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markMessageAsRead = (id: number) => {
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, unread: false } : m)));
  };

  const handleNotificationAction = (notificationId: number, action: string) => {
    markAsRead(notificationId);

    // simulated actions
    const actions: { [k: string]: () => void } = {
      confirm: () => Alert.alert('Attendance confirmed!'),
      details: () => Alert.alert('Opening session details...'),
      pay: () => Alert.alert('Redirecting to payment portal...'),
      update: () => Alert.alert('Opening payment settings...'),
      survey: () => Alert.alert('Opening survey...'),
      remind: () => Alert.alert('Reminder set for later!')
    };

    if (actions[action]) actions[action]();
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedRecipient) {
      const message: Message = {
        id: Date.now(),
        sender: 'You',
        avatar: 'YU',
        content: newMessage,
        timestamp: 'Just now',
        unread: false,
        type: selectedRecipient.includes('Team') || selectedRecipient.includes('Group') ? 'group' : 'direct',
        isOwn: true,
        status: 'sent'
      };

      setMessages(prev => [message, ...prev]);
      setNewMessage('');
      setSelectedRecipient('');
      setMessageSubject('');
      setShowCompose(false);

      // simulate delivered
      setTimeout(() => {
        setMessages(prev => prev.map(m => (m.id === message.id ? { ...m, status: 'delivered' } : m)));
      }, 1000);

      // simulate auto-reply if recipient is Sarah
      if (selectedRecipient === 'Dr. Sarah Johnson') {
        setTimeout(() => {
          const reply: Message = {
            id: Date.now() + 1,
            sender: 'Dr. Sarah Johnson',
            avatar: 'SJ',
            content: "Thanks for your message! I'll get back to you shortly.",
            timestamp: 'Just now',
            unread: true,
            type: 'direct',
            status: 'delivered'
          };
          setMessages(prev => [reply, ...prev]);
        }, 3000);
      }
    } else {
      Alert.alert('Please write a message and select recipient.');
    }
  };

  const sendReply = () => {
    if (replyMessage.trim() && selectedMessage) {
      const reply: Message = {
        id: Date.now(),
        sender: 'You',
        avatar: 'YU',
        content: replyMessage,
        timestamp: 'Just now',
        unread: false,
        type: 'direct',
        isOwn: true,
        status: 'sent'
      };
      setMessages(prev => [reply, ...prev]);
      setReplyMessage('');
    }
  };

  const toggleLike = (id: number) => {
    setAnnouncements(prev =>
      prev.map(ann =>
        ann.id === id
          ? {
              ...ann,
              liked: !ann.liked,
              likes: ann.liked ? (ann.likes || 0) - 1 : (ann.likes || 0) + 1
            }
          : ann
      )
    );
  };

  const addComment = (id: number, comment: string) => {
    if (comment.trim()) {
      const newCommentObj = {
        author: 'You',
        content: comment,
        timestamp: 'Just now'
      };

      setAnnouncements(prev =>
        prev.map(ann =>
          ann.id === id
            ? {
                ...ann,
                comments: [...(ann.comments || []), newCommentObj]
              }
            : ann
        )
      );

      setNewComment(prev => ({ ...prev, [id]: '' }));
    }
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const archiveMessage = (id: number) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    setSelectedMessage(null);
    setShowMessageDetails(false);
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return { color: '#b91c1c', backgroundColor: '#fef2f2', borderColor: '#fecaca' };
      case 'medium':
        return { color: '#c2410c', backgroundColor: '#fff7ed', borderColor: '#fcd34d' };
      case 'low':
        return { color: '#1e3a8a', backgroundColor: '#eff6ff', borderColor: '#bfdbfe' };
      default:
        return { color: '#374151', backgroundColor: '#f8fafc', borderColor: '#e5e7eb' };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cpd':
        return '📚';
      case 'financial':
        return '💰';
      case 'survey':
        return '📊';
      case 'system':
        return '⚙️';
      case 'urgent':
        return '🚨';
      default:
        return '📢';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'sent':
        return <Check width={14} height={14} color="#9CA3AF" />;
      case 'delivered':
        return <CheckCheck width={14} height={14} color="#9CA3AF" />;
      case 'read':
        return <CheckCheck width={14} height={14} color="#3B82F6" />;
      default:
        return null;
    }
  };

  // Small UI building blocks
  const Header = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Communication Hub</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.iconWrap}>
          <Bell width={20} height={20} color="#374151" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.composeButton} onPress={() => setShowCompose(true)}>
          <Plus width={14} height={14} color="#fff" />
          <Text style={styles.composeText}>Compose</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const Tabs = () => {
    const tabs = [
      { id: 'messages', label: 'Messages', icon: MessageCircle, count: unreadMessages },
      { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadCount },
      { id: 'announcements', label: 'Announcements', icon: Users, count: 0 }
    ];
    return (
      <View style={styles.tabs}>
        {tabs.map(tab => {
          const IconComp = tab.icon as any;
          const active = activeTab === (tab.id as any);
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, active && styles.tabButtonActive]}
              onPress={() => {
                setActiveTab(tab.id as any);
                setSearchQuery('');
                setFilterType('all');
              }}
            >
              <IconComp width={16} height={16} color={active ? '#2563eb' : '#6b7280'} />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
              {tab.count > 0 && (
                <View style={styles.tabCount}>
                  <Text style={styles.tabCountText}>{tab.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // Renderers for list items
  const MessageCard: React.FC<{ item: Message }> = ({ item }) => {
    const highlight = item.unread && !item.isOwn;
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedMessage(item);
          setShowMessageDetails(true);
          if (item.unread) markMessageAsRead(item.id);
        }}
        style={[
          styles.card,
          highlight ? styles.cardUnread : undefined
        ]}
      >
        <View style={styles.row}>
          <View style={[styles.avatar, { backgroundColor: item.isOwn ? '#10B981' : '#2563eb' }]}>
            <Text style={styles.avatarText}>{item.avatar}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={[styles.row, { justifyContent: 'space-between' }]}>
              <Text style={[styles.cardTitle, highlight && styles.cardTitleUnread]}>{item.sender}</Text>
              <View style={styles.row}>
                <Text style={styles.metaText}>{item.timestamp}</Text>
                {item.type === 'group' && <Users width={14} height={14} color="#9ca3af" style={{ marginLeft: 8 }} />}
                <View style={{ marginLeft: 6 }}>{getStatusIcon(item.status)}</View>
              </View>
            </View>
            <Text style={styles.cardBody} numberOfLines={2}>
              {item.content}
            </Text>
            {item.attachments && (
              <View style={[styles.row, { marginTop: 6, alignItems: 'center' }]}>
                <Paperclip width={14} height={14} color="#9ca3af" />
                <Text style={[styles.metaText, { marginLeft: 6 }]}>{item.attachments.length} attachment(s)</Text>
              </View>
            )}
            {item.participants && (
              <Text style={[styles.metaText, { marginTop: 4 }]}>Participants: {item.participants.join(', ')}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const NotificationCard: React.FC<{ item: NotificationType }> = ({ item }) => {
    const priorityStyle = getPriorityStyle(item.priority);
    return (
      <View style={[styles.card, !item.read && styles.cardUnread]}>
        <View style={[styles.row, { alignItems: 'flex-start', justifyContent: 'space-between' }]}>
          <View style={{ flex: 1 }}>
            <View style={[styles.row, { alignItems: 'center', marginBottom: 6 }]}>
              <Text style={{ fontSize: 18 }}>{getTypeIcon(item.type)}</Text>
              <View style={{ marginLeft: 8, flex: 1 }}>
                <View style={[styles.row, { alignItems: 'center', justifyContent: 'space-between' }]}>
                  <Text style={[styles.cardTitle, !item.read && styles.cardTitleUnread]}>{item.title}</Text>
                  <Text style={[styles.priorityBadge, { color: (priorityStyle as any).color, backgroundColor: (priorityStyle as any).backgroundColor, borderColor: (priorityStyle as any).borderColor }]}>
                    {item.priority.toUpperCase()}
                  </Text>
                </View>
                {item.actionRequired && (
                  <Text style={styles.actionRequired}>ACTION REQUIRED</Text>
                )}
              </View>
            </View>

            <Text style={styles.cardBody}>{item.message}</Text>
            <Text style={[styles.metaText, { marginTop: 6 }]}>{item.timestamp}</Text>

            {item.actions && (
              <View style={{ marginTop: 8, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {item.actions.map((a, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.actionBtn}
                    onPress={() => handleNotificationAction(item.id, a.action)}
                  >
                    <Text style={styles.actionBtnText}>{a.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={{ marginLeft: 8, alignItems: 'flex-end' }}>
            {!item.read && (
              <TouchableOpacity onPress={() => markAsRead(item.id)}>
                <Text style={[styles.markReadText]}>Mark read</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => deleteNotification(item.id)} style={{ marginTop: 8 }}>
              <Trash2 width={18} height={18} color="#dc2626" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const AnnouncementCard: React.FC<{ item: Announcement }> = ({ item }) => {
    return (
      <View style={[styles.card, item.pinned ? styles.pinnedCard : undefined]}>
        <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 6 }]}>
          <View style={styles.row}>
            {item.pinned && <Star width={16} height={16} color="#f59e0b" />}
            <Text style={[styles.announcementTitle, { marginLeft: item.pinned ? 8 : 0 }]}>{item.title}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{item.category.toUpperCase()}</Text>
            </View>
          </View>
          <MoreVertical width={18} height={18} color="#9ca3af" />
        </View>

        <Text style={styles.cardBody}>{item.content}</Text>

        {item.attachments && item.attachments.length > 0 && (
          <View style={{ marginTop: 8 }}>
            <Text style={[styles.metaText, { marginBottom: 6 }]}>Attachments:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {item.attachments.map((att, idx) => (
                <View key={idx} style={styles.attachmentChip}>
                  <Paperclip width={12} height={12} color="#2563eb" />
                  <Text style={[styles.attachmentText, { marginLeft: 6 }]}>{att}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={[styles.row, { justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 10, marginTop: 10 }]}>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.likeBtn, item.liked ? styles.likeBtnActive : undefined]}
              onPress={() => toggleLike(item.id)}
            >
              <Text style={{ marginRight: 6 }}>{item.liked ? '❤️' : '🤍'}</Text>
              <Text>{item.likes}</Text>
            </TouchableOpacity>
            <View style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
              <MessageCircle width={16} height={16} color="#6b7280" />
              <Text style={[styles.metaText, { marginLeft: 6 }]}>{item.comments?.length || 0} comments</Text>
            </View>
          </View>
        </View>

        {item.comments && item.comments.length > 0 && (
          <View style={{ marginTop: 12 }}>
            {item.comments.map((c, i) => (
              <View key={i} style={styles.commentCard}>
                <View style={[styles.row, { justifyContent: 'space-between' }]}>
                  <Text style={{ fontWeight: '600' }}>{c.author}</Text>
                  <Text style={styles.metaText}>{c.timestamp}</Text>
                </View>
                <Text style={{ marginTop: 6 }}>{c.content}</Text>
              </View>
            ))}

            <View style={{ marginTop: 8 }}>
              <View style={[styles.row, { alignItems: 'center' }]}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  value={newComment[item.id] || ''}
                  onChangeText={(text) => setNewComment(prev => ({ ...prev, [item.id]: text }))}
                  onSubmitEditing={() => addComment(item.id, newComment[item.id] || '')}
                  returnKeyType="send"
                />
                <TouchableOpacity onPress={() => addComment(item.id, newComment[item.id] || '')} style={styles.sendCommentBtn}>
                  <Send width={18} height={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  // Compose modal and MessageDetails modal components
  const ComposeModal = () => (
    <Modal visible={showCompose} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalContentWrap}>
          <View style={styles.modalContent}>
            <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
              <Text style={{ fontSize: 18, fontWeight: '700' }}>Compose Message</Text>
              <TouchableOpacity onPress={() => setShowCompose(false)}><X width={18} height={18} color="#6b7280" /></TouchableOpacity>
            </View>

            <View style={{ marginTop: 12 }}>
              <Text style={styles.fieldLabel}>To</Text>
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={selectedRecipient}
                  onValueChange={(v: any) => setSelectedRecipient(String(v))}
                  style={{ width: '100%' }}
                >
                  <Picker.Item label="Select recipient..." value="" />
                  {users.map(u => <Picker.Item key={u.id} label={u.name} value={u.name} />)}
                </Picker>
              </View>
            </View>

            <View style={{ marginTop: 12 }}>
              <Text style={styles.fieldLabel}>Subject</Text>
              <TextInput
                value={messageSubject}
                onChangeText={setMessageSubject}
                placeholder="Enter subject..."
                style={styles.input}
              />
            </View>

            <View style={{ marginTop: 12 }}>
              <Text style={styles.fieldLabel}>Message</Text>
              <View>
                <TextInput
                  multiline
                  value={newMessage}
                  onChangeText={setNewMessage}
                  placeholder="Type your message here..."
                  style={[styles.input, { minHeight: 120, textAlignVertical: 'top' }]}
                />
                <View style={styles.messageTools}>
                  <TouchableOpacity>
                    <Paperclip width={18} height={18} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowEmojiPicker(prev => !prev)}>
                    <Smile width={18} height={18} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                {showEmojiPicker && (
                  <View style={styles.emojiGrid}>
                    {emojis.map((e, i) => (
                      <TouchableOpacity key={i} onPress={() => { setNewMessage(prev => prev + e); setShowEmojiPicker(false); }} style={styles.emojiBtn}>
                        <Text style={{ fontSize: 20 }}>{e}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View style={[styles.row, { justifyContent: 'flex-end', marginTop: 14 }]}>
              <TouchableOpacity onPress={() => setShowCompose(false)} style={styles.cancelBtn}>
                <Text style={{ color: '#374151' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={sendMessage} style={[styles.sendBtn, (!newMessage.trim() || !selectedRecipient) && { opacity: 0.5 }]}>
                <Send width={16} height={16} color="#fff" />
                <Text style={styles.sendBtnText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );

  const MessageDetailsModal = () => (
    <Modal visible={showMessageDetails && !!selectedMessage} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalContentWrap}>
          <View style={[styles.modalContent, { maxHeight: '90%' }]}>
            <View style={[styles.row, { justifyContent: 'space-between' }]}>
              <Text style={{ fontSize: 18, fontWeight: '700' }}>Message Details</Text>
              <TouchableOpacity onPress={() => { setShowMessageDetails(false); setSelectedMessage(null); }}><X width={18} height={18} color="#6b7280" /></TouchableOpacity>
            </View>

            {selectedMessage && (
              <ScrollView style={{ marginTop: 12 }}>
                <View style={[styles.row, { marginBottom: 12 }]}>
                  <View style={[styles.avatar, { width: 48, height: 48, borderRadius: 24, backgroundColor: selectedMessage.isOwn ? '#10B981' : '#2563eb' }]}>
                    <Text style={styles.avatarText}>{selectedMessage.avatar}</Text>
                  </View>
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <View style={[styles.row, { justifyContent: 'space-between' }]}>
                      <Text style={{ fontSize: 16, fontWeight: '700' }}>{selectedMessage.sender}</Text>
                      <Text style={styles.metaText}>{selectedMessage.timestamp}</Text>
                    </View>
                    <View style={{ marginTop: 8, backgroundColor: '#f3f4f6', padding: 10, borderRadius: 8 }}>
                      <Text style={{ color: '#111' }}>{selectedMessage.content}</Text>
                    </View>

                    {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                      <View style={{ marginTop: 12 }}>
                        <Text style={[styles.metaText, { marginBottom: 8 }]}>Attachments:</Text>
                        {selectedMessage.attachments.map((a, idx) => (
                          <View key={idx} style={[styles.row, { backgroundColor: '#eff6ff', padding: 8, borderRadius: 8, marginBottom: 6 }]}>
                            <Paperclip width={16} height={16} color="#2563eb" />
                            <Text style={{ color: '#2563eb', marginLeft: 8 }}>{a}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    <View style={[styles.row, { marginTop: 12 }]}>
                      <TouchableOpacity style={styles.actionTextBtn}><Reply width={16} height={16} color="#2563eb" /><Text style={styles.actionText}>Reply</Text></TouchableOpacity>
                      <TouchableOpacity style={[styles.actionTextBtn, { marginLeft: 12 }]}><Forward width={16} height={16} color="#10B981" /><Text style={styles.actionText}>Forward</Text></TouchableOpacity>
                      <TouchableOpacity style={[styles.actionTextBtn, { marginLeft: 12 }]} onPress={() => archiveMessage(selectedMessage.id)}><Archive width={16} height={16} color="#6b7280" /><Text style={styles.actionText}>Archive</Text></TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Reply input */}
                <View style={{ borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 12 }}>
                  <View style={[styles.row, { alignItems: 'flex-start' }]}>
                    <View style={[styles.avatar, { backgroundColor: '#10B981', width: 36, height: 36, borderRadius: 18 }]}>
                      <Text style={styles.avatarText}>YU</Text>
                    </View>
                    <View style={{ marginLeft: 10, flex: 1 }}>
                      <TextInput
                        multiline
                        value={replyMessage}
                        onChangeText={setReplyMessage}
                        placeholder="Type your reply..."
                        style={[styles.input, { minHeight: 60, textAlignVertical: 'top' }]}
                      />
                      <View style={[styles.row, { justifyContent: 'flex-end', marginTop: 8 }]}>
                        <TouchableOpacity onPress={sendReply} style={[styles.sendBtn, !replyMessage.trim() && { opacity: 0.5 }]}>
                          <Send width={16} height={16} color="#fff" />
                          <Text style={styles.sendBtnText}>Reply</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );

  // main render
  return (
    <SafeAreaView style={styles.safe}>
      <Header />
      <Tabs />

      {/* Search & filter */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search width={16} height={16} color="#9ca3af" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={`Search ${activeTab}...`}
            style={styles.searchInput}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X width={16} height={16} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterWrap}>
          <Filter width={18} height={18} color="#9ca3af" />
          <View style={{ width: 150, marginLeft: 8 }}>
            <Picker selectedValue={filterType} onValueChange={(v: any) => setFilterType(String(v))}>
              <Picker.Item label="All" value="all" />
              {activeTab === 'notifications' && (
                <>
                  <Picker.Item label="CPD" value="cpd" />
                  <Picker.Item label="Financial" value="financial" />
                  <Picker.Item label="System" value="system" />
                  <Picker.Item label="Urgent" value="urgent" />
                  <Picker.Item label="Survey" value="survey" />
                </>
              )}
              {activeTab === 'announcements' && (
                <>
                  <Picker.Item label="General" value="general" />
                  <Picker.Item label="CPD" value="cpd" />
                  <Picker.Item label="Events" value="events" />
                  <Picker.Item label="Policy" value="policy" />
                </>
              )}
            </Picker>
          </View>
        </View>
      </View>

      {/* Content area */}
      <View style={styles.container}>
        <View style={styles.contentWrap}>
          <View style={styles.mainColumn}>
            <ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: 40 }}>
              {/* Messages */}
              {activeTab === 'messages' && (
                <View style={{ padding: 12 }}>
                  {filteredMessages.length === 0 ? (
                    <View style={styles.emptyState}>
                      <MessageCircle width={48} height={48} color="#e5e7eb" />
                      <Text style={styles.emptyText}>No messages found</Text>
                    </View>
                  ) : (
                    filteredMessages.map(m => <MessageCard key={m.id} item={m} />)
                  )}
                </View>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <View style={{ padding: 12 }}>
                  {filteredNotifications.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Bell width={48} height={48} color="#e5e7eb" />
                      <Text style={styles.emptyText}>No notifications found</Text>
                    </View>
                  ) : (
                    filteredNotifications.map(n => <NotificationCard key={n.id} item={n} />)
                  )}
                </View>
              )}

              {/* Announcements */}
              {activeTab === 'announcements' && (
                <View style={{ padding: 12 }}>
                  {filteredAnnouncements.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Users width={48} height={48} color="#e5e7eb" />
                      <Text style={styles.emptyText}>No announcements found</Text>
                    </View>
                  ) : (
                    filteredAnnouncements.map(a => <AnnouncementCard key={a.id} item={a} />)
                  )}
                </View>
              )}
            </ScrollView>
          </View>

          {/* Sidebar */}
          <View style={styles.sidebar}>
            <View style={styles.sideCard}>
              <View style={[styles.row, { alignItems: 'center', marginBottom: 8 }]}>
                <Users width={16} height={16} color="#374151" />
                <Text style={[styles.sideTitle, { marginLeft: 8 }]}>Online ({onlineUsers.length})</Text>
              </View>
              <View>
                {onlineUsers.map(u => (
                  <View key={u.id} style={[styles.row, { marginBottom: 8, alignItems: 'center' }]}>
                    <View style={[styles.smallAvatar, { backgroundColor: u.status === 'online' ? '#10B981' : u.status === 'away' ? '#f59e0b' : '#9ca3af' }]}>
                      <Text style={styles.smallAvatarText}>{u.avatar}</Text>
                    </View>
                    <View style={{ marginLeft: 8 }}>
                      <Text style={{ fontWeight: '600' }}>{u.name}</Text>
                      <View style={[styles.row, { alignItems: 'center' }]}>
                        <View style={[styles.statusDot, { backgroundColor: u.status === 'online' ? '#34D399' : u.status === 'away' ? '#FBBF24' : '#9CA3AF' }]} />
                        <Text style={[styles.metaText, { marginLeft: 6, textTransform: 'capitalize' }]}>{u.status}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.sideCard}>
              <Text style={[styles.sideTitle, { marginBottom: 8 }]}>Quick Stats</Text>
              <View>
                <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 8 }]}>
                  <Text style={styles.metaText}>Unread Messages</Text>
                  <Text style={[styles.statValue]}>{unreadMessages}</Text>
                </View>
                <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 8 }]}>
                  <Text style={styles.metaText}>Pending Notifications</Text>
                  <Text style={[styles.statValue, { color: '#f97316' }]}>{unreadCount}</Text>
                </View>
                <View style={[styles.row, { justifyContent: 'space-between' }]}>
                  <Text style={styles.metaText}>New Announcements</Text>
                  <Text style={[styles.statValue, { color: '#10b981' }]}>{announcements.filter(a => a.timestamp.includes('day')).length}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Compose modal */}
      <ComposeModal />

      {/* Message details modal */}
      <MessageDetailsModal />
    </SafeAreaView>
  );
};

export default CommunicationScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconWrap: { marginRight: 12 },
  badge: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: 'absolute',
    right: -6,
    top: -6,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  composeButton: { backgroundColor: '#2563eb', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  composeText: { color: '#fff', marginLeft: 8, fontWeight: '700' },

  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomColor: '#e5e7eb', borderBottomWidth: 1 },
  tabButton: { paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 8 },
  tabButtonActive: { borderBottomColor: '#2563eb', borderBottomWidth: 2 },
  tabLabel: { color: '#6b7280', marginLeft: 6, fontWeight: '600' },
  tabLabelActive: { color: '#2563eb' },
  tabCount: { backgroundColor: '#ef4444', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 8 },
  tabCountText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  searchRow: { flexDirection: 'row', padding: 12, alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', padding: 8, borderRadius: 8, gap: 8 },
  searchInput: { flex: 1, paddingVertical: 6, paddingHorizontal: 4 },
  filterWrap: { flexDirection: 'row', alignItems: 'center', marginLeft: 12 },

  container: { flex: 1 },
  contentWrap: { flexDirection: 'row', padding: 12 },
  mainColumn: { flex: 2, marginRight: 12 },
  sidebar: { width: Math.min(340, SCREEN_WIDTH * 0.38) },

  card: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#e6e9ee' },
  cardUnread: { borderLeftWidth: 4, borderLeftColor: '#2563eb', backgroundColor: '#eff6ff' },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  cardTitleUnread: { color: '#0f172a' },
  cardBody: { color: '#374151', marginTop: 6 },
  metaText: { color: '#6b7280', fontSize: 12 },

  priorityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, fontWeight: '700', textAlign: 'center' },
  actionRequired: { color: '#92400e', backgroundColor: '#fff7ed', padding: 6, borderRadius: 6, marginTop: 6, fontWeight: '700' },
  actionBtn: { backgroundColor: '#2563eb', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, marginRight: 8, marginTop: 8 },
  actionBtnText: { color: '#fff' },
  markReadText: { color: '#2563eb', fontWeight: '700' },

  announcementTitle: { fontSize: 16, fontWeight: '700' },
  categoryBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, marginLeft: 8 },
  categoryBadgeText: { color: '#1e3a8a', fontWeight: '700', fontSize: 12 },

  pinnedCard: { borderColor: '#fbbf24', backgroundColor: '#fffbeb', shadowColor: '#fbbf24', shadowOpacity: 0.1, shadowRadius: 8 },

  likeBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: '#f3f4f6' },
  likeBtnActive: { backgroundColor: '#fee2e2' },

  attachmentChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, marginRight: 8, marginBottom: 8 },
  attachmentText: { color: '#374151' },

  commentCard: { backgroundColor: '#f8fafc', padding: 10, borderRadius: 8, marginBottom: 8 },
  commentInput: { flex: 1, padding: 8, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  sendCommentBtn: { backgroundColor: '#2563eb', padding: 10, borderRadius: 8, marginLeft: 8 },

  sideCard: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#e6e9ee' },
  sideTitle: { fontWeight: '800', fontSize: 14 },

  smallAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  smallAvatarText: { color: '#fff', fontWeight: '700' },
  statusDot: { width: 8, height: 8, borderRadius: 4 },

  statValue: { fontWeight: '700', color: '#2563eb' },

  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: '#6b7280', marginTop: 12 },

  // modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  modalContentWrap: { width: '100%', paddingHorizontal: 12 },
  modalContent: { backgroundColor: '#fff', width: '100%', borderRadius: 12, padding: 16, maxWidth: 900 },
  fieldLabel: { fontWeight: '700', marginBottom: 6, color: '#374151' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', padding: 10, borderRadius: 8 },
  messageTools: { position: 'absolute', right: 12, bottom: 12, flexDirection: 'row', gap: 8 },
  emojiGrid: { backgroundColor: '#fff', padding: 8, borderRadius: 8, elevation: 6, marginTop: 8, flexDirection: 'row', flexWrap: 'wrap' },
  emojiBtn: { padding: 6 },
  cancelBtn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, marginRight: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  sendBtn: { backgroundColor: '#2563eb', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  sendBtnText: { color: '#fff', fontWeight: '700' },

  messageToolsRight: { flexDirection: 'row', alignItems: 'center' },
  actionTextBtn: { flexDirection: 'row', alignItems: 'center' },
  actionText: { marginLeft: 6, color: '#2563eb', fontWeight: '700' },
  priorityText: { fontWeight: '700' },

  pickerWrap: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, overflow: 'hidden' },
});
