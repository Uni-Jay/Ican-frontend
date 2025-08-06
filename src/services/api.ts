<<<<<<< HEAD
import AsyncStorage from "@react-native-async-storage/async-storage";
=======
import AsyncStorage from '@react-native-async-storage/async-storage';
>>>>>>> feat: update project
import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User,
  CPDModule,
  Event,
  Transaction,
  Poll,
  ChatMessage,
  ChatRoom,
  Notification,
  DashboardStats,
  PaymentRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  PaginatedResponse,
  SearchParams,
<<<<<<< HEAD
} from "../types/api";

const API_BASE_URL = "https://team1-ican-hackathon-api.onrender.com/api";
=======
} from '../types/api';

const API_BASE_URL = 'https://team1-ican-hackathon-api.onrender.com/api';
>>>>>>> feat: update project

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private async loadToken(): Promise<void> {
    try {
<<<<<<< HEAD
      const token = await AsyncStorage.getItem("auth_token");
      this.token = token;
    } catch (error) {
      console.error("Error loading token:", error);
=======
      const token = await AsyncStorage.getItem('auth_token');
      this.token = token;
    } catch (error) {
      console.error('Error loading token:', error);
>>>>>>> feat: update project
    }
  }

  private async saveToken(token: string): Promise<void> {
    try {
<<<<<<< HEAD
      await AsyncStorage.setItem("auth_token", token);
      this.token = token;
    } catch (error) {
      console.error("Error saving token:", error);
=======
      await AsyncStorage.setItem('auth_token', token);
      this.token = token;
    } catch (error) {
      console.error('Error saving token:', error);
>>>>>>> feat: update project
    }
  }

  private async removeToken(): Promise<void> {
    try {
<<<<<<< HEAD
      await AsyncStorage.removeItem("auth_token");
      this.token = null;
    } catch (error) {
      console.error("Error removing token:", error);
=======
      await AsyncStorage.removeItem('auth_token');
      this.token = null;
    } catch (error) {
      console.error('Error removing token:', error);
>>>>>>> feat: update project
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
<<<<<<< HEAD
      "Content-Type": "application/json",
=======
      'Content-Type': 'application/json',
>>>>>>> feat: update project
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
<<<<<<< HEAD
      // Ensure token is loaded before making request
      if (!this.token) {
        await this.loadToken();
      }

      const url = `${this.baseURL}${endpoint}`;
      console.log(`Making API request to: ${url}`);
      console.log(`With token: ${this.token ? "Present" : "Missing"}`);

=======
      const url = `${this.baseURL}${endpoint}`;
>>>>>>> feat: update project
      const config: RequestInit = {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
<<<<<<< HEAD
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
=======
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
>>>>>>> feat: update project
      }

      return data;
    } catch (error) {
<<<<<<< HEAD
      console.error("API request error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
=======
      console.error('API request error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
>>>>>>> feat: update project
      };
    }
  }

  // Authentication APIs
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
<<<<<<< HEAD
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
=======
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
>>>>>>> feat: update project
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      await this.saveToken(response.data.token);
    }

    return response;
  }

<<<<<<< HEAD
  async register(
    userData: RegisterRequest
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
=======
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
>>>>>>> feat: update project
      body: JSON.stringify(userData),
    });

    if (response.success && response.data?.token) {
      await this.saveToken(response.data.token);
    }

    return response;
  }

<<<<<<< HEAD
  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ApiResponse<void>> {
    return this.request("/auth/forgot-password", {
      method: "POST",
=======
  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<void>> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
>>>>>>> feat: update project
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
<<<<<<< HEAD
    return this.request("/auth/reset-password", {
      method: "POST",
=======
    return this.request('/auth/reset-password', {
      method: 'POST',
>>>>>>> feat: update project
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    await this.removeToken();
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
<<<<<<< HEAD
    return this.request<AuthResponse>("/auth/refresh", {
      method: "POST",
=======
    return this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
>>>>>>> feat: update project
    });
  }

  // User APIs
  async getCurrentUser(): Promise<ApiResponse<User>> {
<<<<<<< HEAD
    return this.request<User>("/user/profile");
  }

  // Alias for getUserProfile
  async getUserProfile(): Promise<ApiResponse<{ user: User }>> {
    const response = await this.request<{ user: User }>("/user/profile");
    return response;
  }

  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
    return this.request<User>("/user/profile", {
      method: "PUT",
=======
    return this.request<User>('/user/profile');
  }

  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
    return this.request<User>('/user/profile', {
      method: 'PUT',
>>>>>>> feat: update project
      body: JSON.stringify(data),
    });
  }

<<<<<<< HEAD
  // Alias for updateUserProfile
  async updateUserProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.updateProfile(data as UpdateProfileRequest);
  }

  async changePassword(
    data: ChangePasswordRequest
  ): Promise<ApiResponse<void>> {
    return this.request("/user/change-password", {
      method: "POST",
=======
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>> {
    return this.request('/user/change-password', {
      method: 'POST',
>>>>>>> feat: update project
      body: JSON.stringify(data),
    });
  }

  // Dashboard APIs
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
<<<<<<< HEAD
    return this.request<DashboardStats>("/dashboard/stats");
  }

  async getDashboardNotifications(limit: number = 5): Promise<
    ApiResponse<{
      notifications: Notification[];
      unreadCount: number;
      total: number;
    }>
  > {
    return this.request<{
      notifications: Notification[];
      unreadCount: number;
      total: number;
    }>(`/dashboard/notifications?limit=${limit}`);
  }

  async getNotifications(
    params?: SearchParams
  ): Promise<ApiResponse<PaginatedResponse<Notification>>> {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    return this.request<PaginatedResponse<Notification>>(
      `/notifications${queryString ? `?${queryString}` : ""}`
    );
  }

  async markNotificationAsRead(
    notificationId: string
  ): Promise<ApiResponse<void>> {
    return this.request(`/notifications/${notificationId}/read`, {
      method: "PUT",
=======
    return this.request<DashboardStats>('/dashboard/stats');
  }

  async getNotifications(params?: SearchParams): Promise<ApiResponse<PaginatedResponse<Notification>>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<PaginatedResponse<Notification>>(`/notifications${queryString ? `?${queryString}` : ''}`);
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<void>> {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
>>>>>>> feat: update project
    });
  }

  // CPD APIs
<<<<<<< HEAD
  async getCPDModules(
    params?: SearchParams
  ): Promise<ApiResponse<PaginatedResponse<CPDModule>>> {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    return this.request<PaginatedResponse<CPDModule>>(
      `/cpd/modules${queryString ? `?${queryString}` : ""}`
    );
=======
  async getCPDModules(params?: SearchParams): Promise<ApiResponse<PaginatedResponse<CPDModule>>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<PaginatedResponse<CPDModule>>(`/cpd/modules${queryString ? `?${queryString}` : ''}`);
>>>>>>> feat: update project
  }

  async getCPDModule(moduleId: string): Promise<ApiResponse<CPDModule>> {
    return this.request<CPDModule>(`/cpd/modules/${moduleId}`);
  }

  async enrollInCPDModule(moduleId: string): Promise<ApiResponse<void>> {
    return this.request(`/cpd/modules/${moduleId}/enroll`, {
<<<<<<< HEAD
      method: "POST",
    });
  }

  async updateCPDProgress(
    moduleId: string,
    progress: number
  ): Promise<ApiResponse<void>> {
    return this.request(`/cpd/modules/${moduleId}/progress`, {
      method: "PUT",
=======
      method: 'POST',
    });
  }

  async updateCPDProgress(moduleId: string, progress: number): Promise<ApiResponse<void>> {
    return this.request(`/cpd/modules/${moduleId}/progress`, {
      method: 'PUT',
>>>>>>> feat: update project
      body: JSON.stringify({ progress }),
    });
  }

  // Events APIs
<<<<<<< HEAD
  async getEvents(
    params?: SearchParams
  ): Promise<ApiResponse<PaginatedResponse<Event>>> {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    return this.request<PaginatedResponse<Event>>(
      `/events${queryString ? `?${queryString}` : ""}`
    );
=======
  async getEvents(params?: SearchParams): Promise<ApiResponse<PaginatedResponse<Event>>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<PaginatedResponse<Event>>(`/events${queryString ? `?${queryString}` : ''}`);
>>>>>>> feat: update project
  }

  async getEvent(eventId: string): Promise<ApiResponse<Event>> {
    return this.request<Event>(`/events/${eventId}`);
  }

  async registerForEvent(eventId: string): Promise<ApiResponse<void>> {
    return this.request(`/events/${eventId}/register`, {
<<<<<<< HEAD
      method: "POST",
=======
      method: 'POST',
>>>>>>> feat: update project
    });
  }

  async unregisterFromEvent(eventId: string): Promise<ApiResponse<void>> {
    return this.request(`/events/${eventId}/unregister`, {
<<<<<<< HEAD
      method: "DELETE",
=======
      method: 'DELETE',
>>>>>>> feat: update project
    });
  }

  // Financial APIs
<<<<<<< HEAD
  async getTransactions(
    params?: SearchParams
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    return this.request<PaginatedResponse<Transaction>>(
      `/financial/transactions${queryString ? `?${queryString}` : ""}`
    );
  }

  async makePayment(
    paymentData: PaymentRequest
  ): Promise<ApiResponse<{ paymentUrl: string; reference: string }>> {
    return this.request("/financial/payment", {
      method: "POST",
=======
  async getTransactions(params?: SearchParams): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<PaginatedResponse<Transaction>>(`/financial/transactions${queryString ? `?${queryString}` : ''}`);
  }

  async makePayment(paymentData: PaymentRequest): Promise<ApiResponse<{ paymentUrl: string; reference: string }>> {
    return this.request('/financial/payment', {
      method: 'POST',
>>>>>>> feat: update project
      body: JSON.stringify(paymentData),
    });
  }

  async verifyPayment(reference: string): Promise<ApiResponse<Transaction>> {
    return this.request<Transaction>(`/financial/payment/verify/${reference}`);
  }

  // Voting APIs
<<<<<<< HEAD
  async getPolls(
    params?: SearchParams
  ): Promise<ApiResponse<PaginatedResponse<Poll>>> {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    return this.request<PaginatedResponse<Poll>>(
      `/voting/polls${queryString ? `?${queryString}` : ""}`
    );
=======
  async getPolls(params?: SearchParams): Promise<ApiResponse<PaginatedResponse<Poll>>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<PaginatedResponse<Poll>>(`/voting/polls${queryString ? `?${queryString}` : ''}`);
>>>>>>> feat: update project
  }

  async getPoll(pollId: string): Promise<ApiResponse<Poll>> {
    return this.request<Poll>(`/voting/polls/${pollId}`);
  }

  async vote(pollId: string, optionId: string): Promise<ApiResponse<void>> {
    return this.request(`/voting/polls/${pollId}/vote`, {
<<<<<<< HEAD
      method: "POST",
=======
      method: 'POST',
>>>>>>> feat: update project
      body: JSON.stringify({ optionId }),
    });
  }

  // Chat APIs
  async getChatRooms(): Promise<ApiResponse<ChatRoom[]>> {
<<<<<<< HEAD
    return this.request<ChatRoom[]>("/chat/rooms");
  }

  async getChatMessages(
    roomId: string,
    params?: SearchParams
  ): Promise<ApiResponse<PaginatedResponse<ChatMessage>>> {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    return this.request<PaginatedResponse<ChatMessage>>(
      `/chat/rooms/${roomId}/messages${queryString ? `?${queryString}` : ""}`
    );
  }

  async sendMessage(
    roomId: string,
    message: string
  ): Promise<ApiResponse<ChatMessage>> {
    return this.request<ChatMessage>(`/chat/rooms/${roomId}/messages`, {
      method: "POST",
=======
    return this.request<ChatRoom[]>('/chat/rooms');
  }

  async getChatMessages(roomId: string, params?: SearchParams): Promise<ApiResponse<PaginatedResponse<ChatMessage>>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<PaginatedResponse<ChatMessage>>(`/chat/rooms/${roomId}/messages${queryString ? `?${queryString}` : ''}`);
  }

  async sendMessage(roomId: string, message: string): Promise<ApiResponse<ChatMessage>> {
    return this.request<ChatMessage>(`/chat/rooms/${roomId}/messages`, {
      method: 'POST',
>>>>>>> feat: update project
      body: JSON.stringify({ message }),
    });
  }

  async joinChatRoom(roomId: string): Promise<ApiResponse<void>> {
    return this.request(`/chat/rooms/${roomId}/join`, {
<<<<<<< HEAD
      method: "POST",
=======
      method: 'POST',
>>>>>>> feat: update project
    });
  }

  async leaveChatRoom(roomId: string): Promise<ApiResponse<void>> {
    return this.request(`/chat/rooms/${roomId}/leave`, {
<<<<<<< HEAD
      method: "DELETE",
=======
      method: 'DELETE',
>>>>>>> feat: update project
    });
  }
}

export default new ApiService();
