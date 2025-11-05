import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';

// Keys for storage
const STORAGE_KEYS = {
  USER_DATA: 'hackintake_user_data',
  USER_CREDENTIALS: 'hackintake_credentials',
  USER_PROFILE_IMAGE: 'hackintake_profile_image',
  USER_SETTINGS: 'hackintake_user_settings',
};

/**
 * Secure Storage for sensitive credentials (email, password)
 * Uses expo-secure-store which encrypts data
 */
export const SecureStorage = {
  // Save user credentials securely
  async saveCredentials(email: string, password: string): Promise<void> {
    try {
      const credentials = JSON.stringify({ email, password });
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_CREDENTIALS, credentials);
    } catch (error) {
      console.error('Error saving credentials:', error);
      throw error;
    }
  },

  // Get saved credentials
  async getCredentials(): Promise<{ email: string; password: string } | null> {
    try {
      const credentials = await SecureStore.getItemAsync(STORAGE_KEYS.USER_CREDENTIALS);
      return credentials ? JSON.parse(credentials) : null;
    } catch (error) {
      console.error('Error getting credentials:', error);
      return null;
    }
  },

  // Delete credentials (on logout)
  async deleteCredentials(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_CREDENTIALS);
    } catch (error) {
      console.error('Error deleting credentials:', error);
    }
  },
};

/**
 * Regular Storage for non-sensitive user data
 * Uses AsyncStorage for better performance
 */
export const UserStorage = {
  // Save complete user data
  async saveUser(user: User): Promise<void> {
    try {
      const userData = JSON.stringify(user);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, userData);
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  },

  // Get saved user data
  async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Update user data (merge with existing)
  async updateUser(updates: Partial<User>): Promise<void> {
    try {
      const existingUser = await this.getUser();
      if (existingUser) {
        const updatedUser = { ...existingUser, ...updates };
        await this.saveUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  },

  // Save profile image separately for better performance
  async saveProfileImage(imageUri: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE_IMAGE, imageUri);
    } catch (error) {
      console.error('Error saving profile image:', error);
    }
  },

  // Get profile image
  async getProfileImage(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE_IMAGE);
    } catch (error) {
      console.error('Error getting profile image:', error);
      return null;
    }
  },

  // Save user settings (preferences, etc.)
  async saveSettings(settings: any): Promise<void> {
    try {
      const settingsData = JSON.stringify(settings);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_SETTINGS, settingsData);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  // Get user settings
  async getSettings(): Promise<any | null> {
    try {
      const settingsData = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      return settingsData ? JSON.parse(settingsData) : null;
    } catch (error) {
      console.error('Error getting settings:', error);
      return null;
    }
  },

  // Clear all user data (on logout)
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.USER_PROFILE_IMAGE,
        STORAGE_KEYS.USER_SETTINGS,
      ]);
      await SecureStorage.deleteCredentials();
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  },

  // Check if user is logged in (has saved data)
  async isLoggedIn(): Promise<boolean> {
    try {
      const user = await this.getUser();
      return user !== null;
    } catch (error) {
      return false;
    }
  },
};

/**
 * Auto-login functionality
 */
export const AutoLogin = {
  // Check and perform auto-login
  async attemptAutoLogin(): Promise<User | null> {
    try {
      const user = await UserStorage.getUser();
      const credentials = await SecureStorage.getCredentials();
      
      if (user && credentials) {
        // User data exists, can auto-login
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error during auto-login:', error);
      return null;
    }
  },

  // Save complete session (user + credentials)
  async saveSession(user: User, email: string, password: string): Promise<void> {
    try {
      await Promise.all([
        UserStorage.saveUser(user),
        SecureStorage.saveCredentials(email, password),
      ]);
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  },

  // Clear complete session (logout)
  async clearSession(): Promise<void> {
    try {
      await UserStorage.clearAll();
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  },
};
