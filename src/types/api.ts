// API Types for ICAN App

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  membershipId?: string;
  membershipLevel: string;
  profileImage?: string;
  balance: number;
  cpdPoints: number;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  preferences?: {
    notifications?: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    language?: string;
    timezone?: string;
  };
  dateJoined: string;
  createdAt?: string;
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  membershipId?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface CPDModule {
  id: string;
  title: string;
  description: string;
  duration: number | string; // Allow both for flexibility
  points: number;
  category?: string;
  status?: "available" | "in_progress" | "completed";
  progress?: number;
  completed?: boolean; // For backward compatibility
  completedAt?: string;
  imageUrl?: string;
  videoUrl?: string;
  documentsUrl?: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "seminar" | "workshop" | "conference" | "webinar";
  cpdPoints: number;
  fee: number;
  isRegistered: boolean;
  capacity: number;
  registeredCount: number;
  imageUrl?: string;
  organizer: string;
}

export interface Transaction {
  id: string;
  type: "payment" | "refund" | "fee" | "dues";
  amount: number;
  description: string;
  date: string;
  status: "pending" | "completed" | "failed";
  reference: string;
  paymentMethod?: string;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  endDate: string;
  hasVoted: boolean;
  totalVotes: number;
  createdAt: string;
  category: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  type: "text" | "image" | "file";
  fileUrl?: string;
  fileName?: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  type: "general" | "cpd" | "regional" | "private";
  memberCount: number;
  lastMessage?: ChatMessage;
  isJoined: boolean;
}

export interface Notification {
  _id?: string;
  id?: string;
  title: string;
  message: string;
  type:
    | "cpd"
    | "financial"
    | "event"
    | "general"
    | "chat"
    | "survey"
    | "system";
  priority?: "low" | "medium" | "high";
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  actionText?: string;
  time?: string;
}

export interface DashboardStats {
  totalMembers: number;
  upcomingEvents: number;
  activeCPDModules: number;
  pendingPayments: number;
  unreadNotifications: number;
  cpdPoints: number;
  requiredPoints: number;
  completedModules: number;
  balance: number;
  attendedEvents: number;
  totalTransactions: number;
  userStats?: {
    cpdPoints: number;
    balance: number;
    membershipLevel: string;
    memberSince: string;
    completedCPDModules: number;
    attendedEvents: number;
    totalTransactions: number;
  };
}

export interface PaymentRequest {
  type: "dues" | "event" | "cpd";
  amount: number;
  description: string;
  eventId?: string;
  cpdModuleId?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search and Filter types
export interface SearchParams {
  query?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}
