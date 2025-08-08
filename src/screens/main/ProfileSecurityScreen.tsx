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
  Switch,
  Image,
  Animated,
  ActionSheetIOS,
  Button,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { MainDrawerParamList } from '../../navigations/MainNavigator';
import { DrawerScreenProps } from '@react-navigation/drawer';


interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipNumber: string;
  profession: string;
  company: string;
  location: string;
  joinDate: string;
  avatar?: string;
  bio: string;
  profileImage?: string | null; // Fixed: Allow null value
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

const mockProfile: UserProfile = {
  id: 'user123',
  name: 'Adebayo Ogundimu',
  email: 'adebayo.ogundimu@email.com',
  phone: '+234 803 123 4567',
  membershipNumber: 'ACA/2015/001234',
  profession: 'Chartered Accountant',
  company: 'PwC Nigeria',
  location: 'Lagos, Nigeria',
  joinDate: '2015-06-15',
  bio: 'Experienced chartered accountant with expertise in audit, tax, and financial advisory services.',
  profileImage: null, // Added this field
};

const mockSecuritySettings: SecuritySettings = {
  twoFactorEnabled: true,
  biometricEnabled: false,
  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: true,
  loginAlerts: true,
  dataSharing: false,
};

type Props = DrawerScreenProps<MainDrawerParamList, 'profile'> & {
  onLogout: () => void;
};

const ProfileSecurityScreen: React.FC<Props> = ({ navigation, route, onLogout,  }) => {
  const [selectedTab, setSelectedTab] = useState<'profile' | 'security' | 'privacy'>('profile');
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(mockSecuritySettings);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [editField, setEditField] = useState<keyof UserProfile | null>(null);
  const [editValue, setEditValue] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const openEditModal = (field: keyof UserProfile): void => {
    setEditField(field);
    setEditValue(profile[field] as string);
    setEditModalVisible(true);
  };

  const saveEdit = (): void => {
    if (editField && editValue.trim()) {
      setProfile(prev => ({
        ...prev,
        [editField]: editValue.trim(),
      }));
      closeEditModal();
      Alert.alert('Success', 'Profile updated successfully!');
    }
  };

  const closeEditModal = (): void => {
    setEditModalVisible(false);
    setEditField(null);
    setEditValue('');
  };

  const changePassword = (): void => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters long.');
      return;
    }

    Alert.alert('Success', 'Password changed successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setChangePasswordVisible(false);
  };

  const toggleSecuritySetting = (setting: keyof SecuritySettings): void => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const deleteAccount = (): void => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
          },
        },
      ]
    );
  };

  const exportData = (): void => {
    Alert.alert('Export Data', 'Your data export has been initiated. You will receive an email with your data within 24 hours.');
  };

  const [profileImage, setProfileImage] = useState<string | null>(profile.profileImage || null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const scaleAnim = new Animated.Value(1);

  // Request permissions for camera and gallery
  const requestPermissions = async (): Promise<boolean> => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || galleryStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Please grant camera and gallery permissions to change your profile photo.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  // Process and compress image
  const processImage = async (imageUri: string): Promise<string | null> => {
    try {
      setImageLoading(true);
      
      // Manipulate image - resize and compress
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          { resize: { width: 300, height: 300 } }, // Resize to 300x300
        ],
        {
          compress: 0.8, // 80% quality
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      return manipResult.uri;
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process the image. Please try again.');
      return null;
    } finally {
      setImageLoading(false);
    }
  };

  // Take photo from camera
  const takePhoto = async (): Promise<void> => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]) {
        const processedImageUri = await processImage(result.assets[0].uri);
        if (processedImageUri) {
          setProfileImage(processedImageUri);
          // Update profile state
          setProfile(prev => ({ ...prev, profileImage: processedImageUri }));
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  // Pick image from gallery
  const pickImage = async (): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]) {
        const processedImageUri = await processImage(result.assets[0].uri);
        if (processedImageUri) {
          setProfileImage(processedImageUri);
          // Update profile state
          setProfile(prev => ({ ...prev, profileImage: processedImageUri }));
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  // Remove profile photo
  const removePhoto = (): void => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove your profile photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setProfileImage(null);
            setProfile(prev => ({ ...prev, profileImage: null }));
          },
        },
      ]
    );
  };

  // Show photo options
  const showPhotoOptions = async (): Promise<void> => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    const options = ['Take Photo', 'Choose from Gallery'];
    if (profileImage) {
      options.push('Remove Photo');
    }
    options.push('Cancel');

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
          destructiveButtonIndex: profileImage ? 2 : undefined,
          title: 'Change Profile Photo',
        },
        (buttonIndex: number) => {
          if (buttonIndex === 0) {
            takePhoto();
          } else if (buttonIndex === 1) {
            pickImage();
          } else if (buttonIndex === 2 && profileImage) {
            removePhoto();
          }
        }
      );
    } else {
      // Android Alert - Fixed button types
      Alert.alert(
        'Change Profile Photo', 
        'Choose an option:', 
        [
          { text: 'Take Photo', onPress: () => takePhoto() },
          { text: 'Choose from Gallery', onPress: () => pickImage() },
          ...(profileImage ? [{ text: 'Remove Photo', onPress: () => removePhoto(), style: 'destructive' as const }] : []),
          { text: 'Cancel', style: 'cancel' as const },
        ]
      );
    }
  };

  // Animation for button press
  const animatePress = (): void => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleChangePhoto = (): void => {
    animatePress();
    showPhotoOptions();
  };

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      {/* Profile Picture Section */}
      <View style={styles.profilePictureSection}>
        <View style={styles.profilePictureContainer}>
          <View style={styles.profilePicture}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Text style={styles.profileInitials}>
                {profile.name.split(' ').map(n => n[0]).join('')}
              </Text>
            )}
            {imageLoading && (
              <View style={styles.loadingOverlay}>
                <View style={styles.loadingSpinner} />
              </View>
            )}
          </View>
          
          {/* Camera icon overlay */}
          <TouchableOpacity
            style={styles.cameraIconContainer}
            onPress={handleChangePhoto}
            activeOpacity={0.8}
          >
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={handleChangePhoto}
            activeOpacity={0.8}
            disabled={imageLoading}
          >
            <View style={styles.buttonContent}>
              <Ionicons 
                name="camera-outline" 
                size={18} 
                color="#007AFF" 
                style={styles.buttonIcon}
              />
              <Text style={styles.changePhotoText}>
                {imageLoading ? 'Processing...' : 'Change Photo'}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Profile Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <TouchableOpacity 
          style={styles.profileItem}
          onPress={() => openEditModal('name')}
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
          onPress={() => openEditModal('email')}
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
          onPress={() => openEditModal('phone')}
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
              <Text style={styles.profileLabel}>Membership Number</Text>
              <Text style={styles.profileValue}>{profile.membershipNumber}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.profileItem}
          onPress={() => openEditModal('company')}
        >
          <View style={styles.profileItemContent}>
            <Ionicons name="business" size={20} color="#666" />
            <View style={styles.profileItemText}>
              <Text style={styles.profileLabel}>Company</Text>
              <Text style={styles.profileValue}>{profile.company}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.profileItem}
          onPress={() => openEditModal('location')}
        >
          <View style={styles.profileItemContent}>
            <Ionicons name="location" size={20} color="#666" />
            <View style={styles.profileItemText}>
              <Text style={styles.profileLabel}>Location</Text>
              <Text style={styles.profileValue}>{profile.location}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>

        <View style={styles.profileItem}>
          <View style={styles.profileItemContent}>
            <Ionicons name="calendar" size={20} color="#666" />
            <View style={styles.profileItemText}>
              <Text style={styles.profileLabel}>Member Since</Text>
              <Text style={styles.profileValue}>{formatDate(profile.joinDate)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bio Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity 
          style={styles.bioContainer}
          onPress={() => openEditModal('bio')}
        >
          <Text style={styles.bioText}>{profile.bio}</Text>
          <Ionicons name="create" size={16} color="#666" style={styles.bioEditIcon} />
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
              <Text style={styles.securityDescription}>Update your account password</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>

        <View style={styles.securityItem}>
          <View style={styles.securityItemContent}>
            <Ionicons name="shield-checkmark" size={20} color="#666" />
            <View style={styles.securityItemText}>
              <Text style={styles.securityLabel}>Two-Factor Authentication</Text>
              <Text style={styles.securityDescription}>
                {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
          </View>
          <Switch
            value={securitySettings.twoFactorEnabled}
            onValueChange={() => toggleSecuritySetting('twoFactorEnabled')}
          />
        </View>

        <View style={styles.securityItem}>
          <View style={styles.securityItemContent}>
            <Ionicons name="finger-print" size={20} color="#666" />
            <View style={styles.securityItemText}>
              <Text style={styles.securityLabel}>Biometric Login</Text>
              <Text style={styles.securityDescription}>Use fingerprint or face ID</Text>
            </View>
          </View>
          <Switch
            value={securitySettings.biometricEnabled}
            onValueChange={() => toggleSecuritySetting('biometricEnabled')}
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
              <Text style={styles.securityDescription}>View recent login sessions</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>

        <View style={styles.securityItem}>
          <View style={styles.securityItemContent}>
            <Ionicons name="notifications" size={20} color="#666" />
            <View style={styles.securityItemText}>
              <Text style={styles.securityLabel}>Login Alerts</Text>
              <Text style={styles.securityDescription}>Get notified of new logins</Text>
            </View>
          </View>
          <Switch
            value={securitySettings.loginAlerts}
            onValueChange={() => toggleSecuritySetting('loginAlerts')}
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
              <Text style={styles.securityDescription}>View and remove connected devices</Text>
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
              <Text style={styles.privacyDescription}>Receive updates via email</Text>
            </View>
          </View>
          <Switch
            value={securitySettings.emailNotifications}
            onValueChange={() => toggleSecuritySetting('emailNotifications')}
          />
        </View>

        <View style={styles.privacyItem}>
          <View style={styles.privacyItemContent}>
            <Ionicons name="chatbubble" size={20} color="#666" />
            <View style={styles.privacyItemText}>
              <Text style={styles.privacyLabel}>SMS Notifications</Text>
              <Text style={styles.privacyDescription}>Receive updates via SMS</Text>
            </View>
          </View>
          <Switch
            value={securitySettings.smsNotifications}
            onValueChange={() => toggleSecuritySetting('smsNotifications')}
          />
        </View>

        <View style={styles.privacyItem}>
          <View style={styles.privacyItemContent}>
            <Ionicons name="notifications" size={20} color="#666" />
            <View style={styles.privacyItemText}>
              <Text style={styles.privacyLabel}>Push Notifications</Text>
              <Text style={styles.privacyDescription}>Receive app notifications</Text>
            </View>
          </View>
          <Switch
            value={securitySettings.pushNotifications}
            onValueChange={() => toggleSecuritySetting('pushNotifications')}
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
              <Text style={styles.privacyDescription}>Share anonymized data for improvements</Text>
            </View>
          </View>
          <Switch
            value={securitySettings.dataSharing}
            onValueChange={() => toggleSecuritySetting('dataSharing')}
          />
        </View>

        <TouchableOpacity style={styles.privacyItem} onPress={exportData}>
          <View style={styles.privacyItemContent}>
            <Ionicons name="download" size={20} color="#666" />
            <View style={styles.privacyItemText}>
              <Text style={styles.privacyLabel}>Export Data</Text>
              <Text style={styles.privacyDescription}>Download your account data</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.privacyItem}>
          <View style={styles.privacyItemContent}>
            <Ionicons name="document-text" size={20} color="#666" />
            <View style={styles.privacyItemText}>
              <Text style={styles.privacyLabel}>Privacy Policy</Text>
              <Text style={styles.privacyDescription}>Read our privacy policy</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, styles.dangerTitle]}>Danger Zone</Text>
        
        <TouchableOpacity style={styles.dangerItem} onPress={deleteAccount}>
          <View style={styles.privacyItemContent}>
            <Ionicons name="trash" size={20} color="#e53e3e" />
            <View style={styles.privacyItemText}>
              <Text style={[styles.privacyLabel, styles.dangerLabel]}>Delete Account</Text>
              <Text style={styles.privacyDescription}>Permanently delete your account</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#e53e3e" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const getFieldLabel = (field: keyof UserProfile) => {
    const labels = {
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      company: 'Company',
      location: 'Location',
      bio: 'Bio',
    };
    return labels[field as keyof typeof labels] || field;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* <Header
          title="Profile & Security"
          showBack
          onBack={() => navigation.navigate('dashboard')}
        /> */}
        {/* <Header
        showBack
        onBack={() => navigation.navigate('dashboard')}/> */}

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'profile' && styles.activeTab]}
            onPress={() => setSelectedTab('profile')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'profile' && styles.activeTabText,
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'security' && styles.activeTab]}
            onPress={() => setSelectedTab('security')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'security' && styles.activeTabText,
              ]}
            >
              Security
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'privacy' && styles.activeTab]}
            onPress={() => setSelectedTab('privacy')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'privacy' && styles.activeTabText,
              ]}
            >
              Privacy
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {selectedTab === 'profile' && renderProfileTab()}
        {selectedTab === 'security' && renderSecurityTab()}
        {selectedTab === 'privacy' && renderPrivacyTab()}

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
                    editField === 'bio' && styles.bioInput,
                  ]}
                  value={editValue}
                  onChangeText={setEditValue}
                  placeholder={`Enter ${editField && getFieldLabel(editField)}`}
                  multiline={editField === 'bio'}
                  numberOfLines={editField === 'bio' ? 4 : 1}
                />
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={closeEditModal}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={saveEdit}
                >
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
                <TouchableOpacity onPress={() => setChangePasswordVisible(false)}>
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
                    setPasswordData(prev => ({ ...prev, currentPassword: text }))
                  }
                />
                <TextInput
                  style={styles.passwordInput}
                  placeholder="New Password"
                  secureTextEntry
                  value={passwordData.newPassword}
                  onChangeText={(text) =>
                    setPasswordData(prev => ({ ...prev, newPassword: text }))
                  }
                />
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm New Password"
                  secureTextEntry
                  value={passwordData.confirmPassword}
                  onChangeText={(text) =>
                    setPasswordData(prev => ({ ...prev, confirmPassword: text }))
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
  tabContent: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3182ce',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  changePhotoButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3182ce',
  },
  changePhotoText: {
    color: '#3182ce',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a202c',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  profileItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemText: {
    marginLeft: 15,
    flex: 1,
  },
  profileLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a202c',
  },
  profileValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  bioContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bioText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    flex: 1,
  },
  bioEditIcon: {
    marginLeft: 10,
    marginTop: 2,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  securityItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  securityItemText: {
    marginLeft: 15,
    flex: 1,
  },
  securityLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a202c',
  },
  securityDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  privacyItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  privacyItemText: {
    marginLeft: 15,
    flex: 1,
  },
  privacyLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a202c',
  },
  privacyDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  dangerTitle: {
    color: '#e53e3e',
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fed7d7',
  },
  dangerLabel: {
    color: '#e53e3e',
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
    maxHeight: '70%',
  },

  // tabContent: {
  //   flex: 1,
  //   padding: 20,
  //   backgroundColor: '#f8f9fa',
  // },
  // profilePictureSection: {
  //   alignItems: 'center',
  //   marginBottom: 30,
  //   paddingVertical: 20,
  // },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  // profilePicture: {
  //   width: 120,
  //   height: 120,
  //   borderRadius: 60,
  //   backgroundColor: '#007AFF',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.15,
  //   shadowRadius: 8,
  //   elevation: 8,
  //   borderWidth: 4,
  //   borderColor: '#fff',
  // },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 56,
  },
  // profileInitials: {
  //   fontSize: 36,
  //   fontWeight: '600',
  //   color: '#fff',
  //   letterSpacing: 1,
  // },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  // changePhotoButton: {
  //   backgroundColor: '#fff',
  //   paddingHorizontal: 24,
  //   paddingVertical: 12,
  //   borderRadius: 25,
  //   shadowColor: '#007AFF',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 8,
  //   elevation: 3,
  //   borderWidth: 1.5,
  //   borderColor: '#007AFF',
  //   minWidth: 140,
  // },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 6,
  },
  // changePhotoText: {
  //   color: '#007AFF',
  //   fontSize: 16,
  //   fontWeight: '600',
  //   letterSpacing: 0.5,
  // },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#fff',
    borderTopColor: 'transparent',
    borderRadius: 12,
    // Add rotation animation here if needed
  },
  // section: {
  //   backgroundColor: '#fff',
  //   borderRadius: 16,
  //   marginBottom: 20,
  //   padding: 20,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 8,
  //   elevation: 2,
  // },
  // sectionTitle: {
  //   fontSize: 18,
  //   fontWeight: '700',
  //   color: '#1a1a1a',
  //   marginBottom: 16,
  //   letterSpacing: 0.3,
  // },
  // profileItem: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   paddingVertical: 12,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#f0f0f0',
  // },
  // profileItemContent: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   flex: 1,
  // },
  // profileItemText: {
  //   marginLeft: 12,
  //   flex: 1,
  // },
  // profileLabel: {
  //   fontSize: 14,
  //   color: '#666',
  //   marginBottom: 2,
  //   fontWeight: '500',
  // },
  // profileValue: {
  //   fontSize: 16,
  //   color: '#1a1a1a',
  //   fontWeight: '600',
  // },
  // bioContainer: {
  //   backgroundColor: '#f8f9fa',
  //   padding: 16,
  //   borderRadius: 12,
  //   borderWidth: 1,
  //   borderColor: '#e9ecef',
  //   position: 'relative',
  // },
  // bioText: {
  //   fontSize: 16,
  //   color: '#333',
  //   lineHeight: 24,
  //   paddingRight: 24,
  // },
  // bioEditIcon: {
  //   position: 'absolute',
  //   top: 12,
  //   right: 12,
  // },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  modalBody: {
    padding: 20,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#1a202c',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#1a202c',
    marginBottom: 15,
  },
  passwordHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3182ce',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileSecurityScreen;