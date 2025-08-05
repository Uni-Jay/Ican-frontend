import React, { useState, useEffect } from "react";
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
  Switch,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import { MainDrawerParamList } from "../../navigations/MainNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/api";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  membershipId?: string;
  membershipLevel: string;
  balance: number;
  cpdPoints: number;
  profileImage?: string;
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
  isActive: boolean;
  memberSince: string;
  accountAge: number;
  isProfileComplete: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  loginAlerts: boolean;
  dataSharing: boolean;
}

// Default security settings
const defaultSecuritySettings: SecuritySettings = {
  twoFactorEnabled: false,
  biometricEnabled: false,
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  loginAlerts: true,
  dataSharing: false,
};

type Props = DrawerScreenProps<MainDrawerParamList, "profile"> & {
  onLogout: () => void;
};

const ProfileSecurityScreen: React.FC<Props> = ({
  navigation,
  route,
  onLogout,
}) => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<
    "profile" | "security" | "privacy"
  >("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(
    defaultSecuritySettings
  );
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [editField, setEditField] = useState<keyof UserProfile | null>(null);
  const [editValue, setEditValue] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch user profile data
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getUserProfile();

      if (response.success && response.data.user) {
        setProfile(response.data.user);

        // Update security settings from user preferences
        if (response.data.user.preferences?.notifications) {
          setSecuritySettings((prev) => ({
            ...prev,
            emailNotifications:
              response.data.user.preferences.notifications.email,
            smsNotifications: response.data.user.preferences.notifications.sms,
            pushNotifications:
              response.data.user.preferences.notifications.push,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
      Alert.alert("Error", "Failed to load profile data. Please try again.", [
        { text: "Retry", onPress: fetchProfileData },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const openEditModal = (field: keyof UserProfile) => {
    if (!profile) return;

    setEditField(field);
    let value = "";

    // Handle nested fields
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      value = (profile as any)[parent]?.[child] || "";
    } else {
      value = (profile as any)[field] || "";
    }

    setEditValue(String(value));
    setEditModalVisible(true);
  };

  const saveEdit = async () => {
    if (!editField || !editValue.trim() || !profile) return;

    try {
      setIsUpdating(true);

      // Prepare update data
      const updateData: any = {};

      // Handle nested fields (like address.city)
      if (editField.includes(".")) {
        const [parent, child] = editField.split(".");
        updateData[parent] = {
          ...profile.address,
          [child]: editValue.trim(),
        };
      } else {
        updateData[editField] = editValue.trim();
      }

      const response = await apiService.updateUserProfile(updateData);

      if (response.success) {
        // Update local state
        setProfile(response.data);
        closeEditModal();
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        Alert.alert("Error", response.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditField(null);
    setEditValue("");
  };

  const changePassword = () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      Alert.alert("Error", "Please fill in all password fields.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      Alert.alert("Error", "New password must be at least 8 characters long.");
      return;
    }

    Alert.alert("Success", "Password changed successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setChangePasswordVisible(false);
  };

  const toggleSecuritySetting = (setting: keyof SecuritySettings) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const deleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Account Deleted",
              "Your account has been deleted successfully."
            );
          },
        },
      ]
    );
  };

  const exportData = () => {
    Alert.alert(
      "Export Data",
      "Your data export has been initiated. You will receive an email with your data within 24 hours."
    );
  };

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      {/* Profile Picture */}
      <View style={styles.profilePictureSection}>
        <View style={styles.profilePicture}>
          <Text style={styles.profileInitials}>
            {profile.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </Text>
        </View>
        <TouchableOpacity style={styles.changePhotoButton}>
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <TouchableOpacity
          style={styles.profileItem}
          onPress={() => openEditModal("name")}
        >
          <View style={styles.profileItemContent}>
            <Ionicons name="person" size={20} color="#666" />
            <View style={styles.profileItemText}>
              <Text style={styles.profileLabel}>Full Name</Text>
              <Text style={styles.profileValue}>{profile.name}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileItem}
          onPress={() => openEditModal("email")}
        >
          <View style={styles.profileItemContent}>
            <Ionicons name="mail" size={20} color="#666" />
            <View style={styles.profileItemText}>
              <Text style={styles.profileLabel}>Email</Text>
              <Text style={styles.profileValue}>{profile.email}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileItem}
          onPress={() => openEditModal("phone")}
        >
          <View style={styles.profileItemContent}>
            <Ionicons name="call" size={20} color="#666" />
            <View style={styles.profileItemText}>
              <Text style={styles.profileLabel}>Phone Number</Text>
              <Text style={styles.profileValue}>{profile.phone}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Professional Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professional Details</Text>

        <View style={styles.profileItem}>
          <View style={styles.profileItemContent}>
            <Ionicons name="card" size={20} color="#666" />
            <View style={styles.profileItemText}>
              <Text style={styles.profileLabel}>Membership ID</Text>
              <Text style={styles.profileValue}>
                {profile.membershipId || "Not assigned"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.profileItem}>
          <View style={styles.profileItemContent}>
            <Ionicons name="star" size={20} color="#666" />
            <View style={styles.profileItemText}>
              <Text style={styles.profileLabel}>Membership Level</Text>
              <Text style={styles.profileValue}>{profile.membershipLevel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.profileItem}>
          <View style={styles.profileItemContent}>
            <Ionicons name="wallet" size={20} color="#666" />
            <View style={styles.profileItemText}>
              <Text style={styles.profileLabel}>Account Balance</Text>
              <Text style={styles.profileValue}>
                ₦{profile.balance.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.profileItem}>
          <View style={styles.profileItemContent}>
            <Ionicons name="school" size={20} color="#666" />
            <View style={styles.profileItemText}>
              <Text style={styles.profileLabel}>CPD Points</Text>
              <Text style={styles.profileValue}>
                {profile.cpdPoints} points
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.profileItem}
          onPress={() => openEditModal("address.city")}
        >
          <View style={styles.profileItemContent}>
            <Ionicons name="location" size={20} color="#666" />
            <View style={styles.profileItemText}>
              <Text style={styles.profileLabel}>City</Text>
              <Text style={styles.profileValue}>
                {profile.address?.city || "Not specified"}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileItem}
          onPress={() => openEditModal("address.state")}
        >
          <View style={styles.profileItemContent}>
            <Ionicons name="map" size={20} color="#666" />
            <View style={styles.profileItemText}>
              <Text style={styles.profileLabel}>State</Text>
              <Text style={styles.profileValue}>
                {profile.address?.state || "Not specified"}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>

        <View style={styles.profileItem}>
          <View style={styles.profileItemContent}>
            <Ionicons name="calendar" size={20} color="#666" />
            <View style={styles.profileItemText}>
              <Text style={styles.profileLabel}>Member Since</Text>
              <Text style={styles.profileValue}>
                {formatDate(profile.memberSince)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bio Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity
          style={styles.bioContainer}
          onPress={() => openEditModal("bio")}
        >
          <Text style={styles.bioText}>{profile.bio}</Text>
          <Ionicons
            name="create"
            size={16}
            color="#666"
            style={styles.bioEditIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSecurityTab = () => (
    <View style={styles.tabContent}>
      {/* Password Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Password & Authentication</Text>

        <TouchableOpacity
          style={styles.securityItem}
          onPress={() => setChangePasswordVisible(true)}
        >
          <View style={styles.securityItemContent}>
            <Ionicons name="key" size={20} color="#666" />
            <View style={styles.securityItemText}>
              <Text style={styles.securityLabel}>Change Password</Text>
              <Text style={styles.securityDescription}>
                Update your account password
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>

        <View style={styles.securityItem}>
          <View style={styles.securityItemContent}>
            <Ionicons name="shield-checkmark" size={20} color="#666" />
            <View style={styles.securityItemText}>
              <Text style={styles.securityLabel}>
                Two-Factor Authentication
              </Text>
              <Text style={styles.securityDescription}>
                {securitySettings.twoFactorEnabled ? "Enabled" : "Disabled"}
              </Text>
            </View>
          </View>
          <Switch
            value={securitySettings.twoFactorEnabled}
            onValueChange={() => toggleSecuritySetting("twoFactorEnabled")}
          />
        </View>

        <View style={styles.securityItem}>
          <View style={styles.securityItemContent}>
            <Ionicons name="finger-print" size={20} color="#666" />
            <View style={styles.securityItemText}>
              <Text style={styles.securityLabel}>Biometric Login</Text>
              <Text style={styles.securityDescription}>
                Use fingerprint or face ID
              </Text>
            </View>
          </View>
          <Switch
            value={securitySettings.biometricEnabled}
            onValueChange={() => toggleSecuritySetting("biometricEnabled")}
          />
        </View>
      </View>

      {/* Login Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Login Activity</Text>

        <TouchableOpacity style={styles.securityItem}>
          <View style={styles.securityItemContent}>
            <Ionicons name="time" size={20} color="#666" />
            <View style={styles.securityItemText}>
              <Text style={styles.securityLabel}>Recent Activity</Text>
              <Text style={styles.securityDescription}>
                View recent login sessions
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>

        <View style={styles.securityItem}>
          <View style={styles.securityItemContent}>
            <Ionicons name="notifications" size={20} color="#666" />
            <View style={styles.securityItemText}>
              <Text style={styles.securityLabel}>Login Alerts</Text>
              <Text style={styles.securityDescription}>
                Get notified of new logins
              </Text>
            </View>
          </View>
          <Switch
            value={securitySettings.loginAlerts}
            onValueChange={() => toggleSecuritySetting("loginAlerts")}
          />
        </View>
      </View>

      {/* Connected Devices */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connected Devices</Text>

        <TouchableOpacity style={styles.securityItem}>
          <View style={styles.securityItemContent}>
            <Ionicons name="phone-portrait" size={20} color="#666" />
            <View style={styles.securityItemText}>
              <Text style={styles.securityLabel}>Manage Devices</Text>
              <Text style={styles.securityDescription}>
                View and remove connected devices
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPrivacyTab = () => (
    <View style={styles.tabContent}>
      {/* Notification Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Preferences</Text>

        <View style={styles.privacyItem}>
          <View style={styles.privacyItemContent}>
            <Ionicons name="mail" size={20} color="#666" />
            <View style={styles.privacyItemText}>
              <Text style={styles.privacyLabel}>Email Notifications</Text>
              <Text style={styles.privacyDescription}>
                Receive updates via email
              </Text>
            </View>
          </View>
          <Switch
            value={securitySettings.emailNotifications}
            onValueChange={() => toggleSecuritySetting("emailNotifications")}
          />
        </View>

        <View style={styles.privacyItem}>
          <View style={styles.privacyItemContent}>
            <Ionicons name="chatbubble" size={20} color="#666" />
            <View style={styles.privacyItemText}>
              <Text style={styles.privacyLabel}>SMS Notifications</Text>
              <Text style={styles.privacyDescription}>
                Receive updates via SMS
              </Text>
            </View>
          </View>
          <Switch
            value={securitySettings.smsNotifications}
            onValueChange={() => toggleSecuritySetting("smsNotifications")}
          />
        </View>

        <View style={styles.privacyItem}>
          <View style={styles.privacyItemContent}>
            <Ionicons name="notifications" size={20} color="#666" />
            <View style={styles.privacyItemText}>
              <Text style={styles.privacyLabel}>Push Notifications</Text>
              <Text style={styles.privacyDescription}>
                Receive app notifications
              </Text>
            </View>
          </View>
          <Switch
            value={securitySettings.pushNotifications}
            onValueChange={() => toggleSecuritySetting("pushNotifications")}
          />
        </View>
      </View>

      {/* Data & Privacy */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Privacy</Text>

        <View style={styles.privacyItem}>
          <View style={styles.privacyItemContent}>
            <Ionicons name="share" size={20} color="#666" />
            <View style={styles.privacyItemText}>
              <Text style={styles.privacyLabel}>Data Sharing</Text>
              <Text style={styles.privacyDescription}>
                Share anonymized data for improvements
              </Text>
            </View>
          </View>
          <Switch
            value={securitySettings.dataSharing}
            onValueChange={() => toggleSecuritySetting("dataSharing")}
          />
        </View>

        <TouchableOpacity style={styles.privacyItem} onPress={exportData}>
          <View style={styles.privacyItemContent}>
            <Ionicons name="download" size={20} color="#666" />
            <View style={styles.privacyItemText}>
              <Text style={styles.privacyLabel}>Export Data</Text>
              <Text style={styles.privacyDescription}>
                Download your account data
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.privacyItem}>
          <View style={styles.privacyItemContent}>
            <Ionicons name="document-text" size={20} color="#666" />
            <View style={styles.privacyItemText}>
              <Text style={styles.privacyLabel}>Privacy Policy</Text>
              <Text style={styles.privacyDescription}>
                Read our privacy policy
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, styles.dangerTitle]}>
          Danger Zone
        </Text>

        <TouchableOpacity style={styles.dangerItem} onPress={deleteAccount}>
          <View style={styles.privacyItemContent}>
            <Ionicons name="trash" size={20} color="#e53e3e" />
            <View style={styles.privacyItemText}>
              <Text style={[styles.privacyLabel, styles.dangerLabel]}>
                Delete Account
              </Text>
              <Text style={styles.privacyDescription}>
                Permanently delete your account
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#e53e3e" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const getFieldLabel = (field: keyof UserProfile) => {
    const labels = {
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      company: "Company",
      location: "Location",
      bio: "Bio",
    };
    return labels[field as keyof typeof labels] || field;
  };

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Profile & Security"
          showBack
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3182ce" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state if no profile data
  if (!profile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Profile & Security"
          showBack
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#e53e3e" />
          <Text style={styles.errorTitle}>Unable to Load Profile</Text>
          <Text style={styles.errorMessage}>
            There was an error loading your profile data.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchProfileData}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Header
          title="Profile & Security"
          showBack
          onBack={() => navigation.navigate("dashboard")}
        />

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "profile" && styles.activeTab]}
            onPress={() => setSelectedTab("profile")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "profile" && styles.activeTabText,
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "security" && styles.activeTab]}
            onPress={() => setSelectedTab("security")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "security" && styles.activeTabText,
              ]}
            >
              Security
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "privacy" && styles.activeTab]}
            onPress={() => setSelectedTab("privacy")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "privacy" && styles.activeTabText,
              ]}
            >
              Privacy
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {selectedTab === "profile" && renderProfileTab()}
        {selectedTab === "security" && renderSecurityTab()}
        {selectedTab === "privacy" && renderPrivacyTab()}

        {/* Edit Profile Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={closeEditModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Edit {editField && getFieldLabel(editField)}
                </Text>
                <TouchableOpacity onPress={closeEditModal}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <TextInput
                  style={[
                    styles.editInput,
                    editField === "bio" && styles.bioInput,
                  ]}
                  value={editValue}
                  onChangeText={setEditValue}
                  placeholder={`Enter ${editField && getFieldLabel(editField)}`}
                  multiline={editField === "bio"}
                  numberOfLines={editField === "bio" ? 4 : 1}
                />
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={closeEditModal}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Change Password Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={changePasswordVisible}
          onRequestClose={() => setChangePasswordVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Change Password</Text>
                <TouchableOpacity
                  onPress={() => setChangePasswordVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Current Password"
                  secureTextEntry
                  value={passwordData.currentPassword}
                  onChangeText={(text) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: text,
                    }))
                  }
                />
                <TextInput
                  style={styles.passwordInput}
                  placeholder="New Password"
                  secureTextEntry
                  value={passwordData.newPassword}
                  onChangeText={(text) =>
                    setPasswordData((prev) => ({ ...prev, newPassword: text }))
                  }
                />
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm New Password"
                  secureTextEntry
                  value={passwordData.confirmPassword}
                  onChangeText={(text) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: text,
                    }))
                  }
                />
                <Text style={styles.passwordHint}>
                  Password must be at least 8 characters long
                </Text>
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setChangePasswordVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={changePassword}
                >
                  <Text style={styles.saveButtonText}>Change Password</Text>
                </TouchableOpacity>
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
    backgroundColor: "#f7fafc",
  },
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  tabContainer: {
    flexDirection: "row",
    margin: 20,
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#3182ce",
  },
  tabContent: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  profilePictureSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#3182ce",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
  changePhotoButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3182ce",
  },
  changePhotoText: {
    color: "#3182ce",
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a202c",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  profileItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileItemText: {
    marginLeft: 15,
    flex: 1,
  },
  profileLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a202c",
  },
  profileValue: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  bioContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bioText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    flex: 1,
  },
  bioEditIcon: {
    marginLeft: 10,
    marginTop: 2,
  },
  securityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  securityItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  securityItemText: {
    marginLeft: 15,
    flex: 1,
  },
  securityLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a202c",
  },
  securityDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  privacyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  privacyItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  privacyItemText: {
    marginLeft: 15,
    flex: 1,
  },
  privacyLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a202c",
  },
  privacyDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  dangerTitle: {
    color: "#e53e3e",
  },
  dangerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fed7d7",
  },
  dangerLabel: {
    color: "#e53e3e",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a202c",
  },
  modalBody: {
    padding: 20,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: "#1a202c",
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: "#1a202c",
    marginBottom: 15,
  },
  passwordHint: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#3182ce",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e53e3e",
    marginTop: 15,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#3182ce",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileSecurityScreen;
