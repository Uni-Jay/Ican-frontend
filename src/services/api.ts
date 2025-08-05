import AsyncStorage from "@react-native-async-storage/async-storage";
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
} from "../types/api";

const API_BASE_URL = "https://team1-ican-hackathon-api.onrender.com/api";

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private async loadToken(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      this.token = token;
    } catch (error) {
      console.error("Error loading token:", error);
    }
  }

  private async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem("auth_token", token);
      this.token = token;
    } catch (error) {
      console.error("Error saving token:", error);
    }
  }

  private async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem("auth_token");
      this.token = null;
    } catch (error) {
      console.error("Error removing token:", error);
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
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
      const url = `${this.baseURL}${endpoint}`;
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
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("API request error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Authentication APIs
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      await this.saveToken(response.data.token);
    }

    return response;
  }

  async register(
    userData: RegisterRequest
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.success && response.data?.token) {
      await this.saveToken(response.data.token);
    }

    return response;
  }

  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ApiResponse<void>> {
    return this.request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
    return this.request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    await this.removeToken();
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>("/auth/refresh", {
      method: "POST",
    });
  }

  // User APIs
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>("/user/profile");
  }

  // Alias for getUserProfile
  async getUserProfile(): Promise<ApiResponse<{ user: User }>> {
    const response = await this.request<User>("/user/profile");
    if (response.success) {
      return {
        ...response,
        data: { user: response.data },
      } as ApiResponse<{ user: User }>;
    }
    return response as ApiResponse<{ user: User }>;
  }

  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
    return this.request<User>("/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Alias for updateUserProfile
  async updateUserProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.updateProfile(data as UpdateProfileRequest);
  }

  async changePassword(
    data: ChangePasswordRequest
  ): Promise<ApiResponse<void>> {
    return this.request("/user/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Dashboard APIs
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request<DashboardStats>("/dashboard/stats");
  }

  async getDashboardNotifications(
    limit: number = 5
  ): Promise<
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
    });
  }

  // CPD APIs
  async getCPDModules(
    params?: SearchParams
  ): Promise<ApiResponse<PaginatedResponse<CPDModule>>> {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    return this.request<PaginatedResponse<CPDModule>>(
      `/cpd/modules${queryString ? `?${queryString}` : ""}`
    );
  }

  async getCPDModule(moduleId: string): Promise<ApiResponse<CPDModule>> {
    return this.request<CPDModule>(`/cpd/modules/${moduleId}`);
  }

  async enrollInCPDModule(moduleId: string): Promise<ApiResponse<void>> {
    return this.request(`/cpd/modules/${moduleId}/enroll`, {
      method: "POST",
    });
  }

  async updateCPDProgress(
    moduleId: string,
    progress: number
  ): Promise<ApiResponse<void>> {
    return this.request(`/cpd/modules/${moduleId}/progress`, {
      method: "PUT",
      body: JSON.stringify({ progress }),
    });
  }

  // Events APIs
  async getEvents(
    params?: SearchParams
  ): Promise<ApiResponse<PaginatedResponse<Event>>> {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    return this.request<PaginatedResponse<Event>>(
      `/events${queryString ? `?${queryString}` : ""}`
    );
  }

  async getEvent(eventId: string): Promise<ApiResponse<Event>> {
    return this.request<Event>(`/events/${eventId}`);
  }

  async registerForEvent(eventId: string): Promise<ApiResponse<void>> {
    return this.request(`/events/${eventId}/register`, {
      method: "POST",
    });
  }

  async unregisterFromEvent(eventId: string): Promise<ApiResponse<void>> {
    return this.request(`/events/${eventId}/unregister`, {
      method: "DELETE",
    });
  }

  // Financial APIs
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
      body: JSON.stringify(paymentData),
    });
  }

  async verifyPayment(reference: string): Promise<ApiResponse<Transaction>> {
    return this.request<Transaction>(`/financial/payment/verify/${reference}`);
  }

  // Voting APIs
  async getPolls(
    params?: SearchParams
  ): Promise<ApiResponse<PaginatedResponse<Poll>>> {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    return this.request<PaginatedResponse<Poll>>(
      `/voting/polls${queryString ? `?${queryString}` : ""}`
    );
  }

  async getPoll(pollId: string): Promise<ApiResponse<Poll>> {
    return this.request<Poll>(`/voting/polls/${pollId}`);
  }

  async vote(pollId: string, optionId: string): Promise<ApiResponse<void>> {
    return this.request(`/voting/polls/${pollId}/vote`, {
      method: "POST",
      body: JSON.stringify({ optionId }),
    });
  }

  // Chat APIs
  async getChatRooms(): Promise<ApiResponse<ChatRoom[]>> {
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
      body: JSON.stringify({ message }),
    });
  }

  async joinChatRoom(roomId: string): Promise<ApiResponse<void>> {
    return this.request(`/chat/rooms/${roomId}/join`, {
      method: "POST",
    });
  }

  async leaveChatRoom(roomId: string): Promise<ApiResponse<void>> {
    return this.request(`/chat/rooms/${roomId}/leave`, {
      method: "DELETE",
    });
  }
}

export default new ApiService();
