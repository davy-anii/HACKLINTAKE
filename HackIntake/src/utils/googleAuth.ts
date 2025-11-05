import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

// Google OAuth Configuration
// Replace these with your actual Google OAuth credentials from Google Cloud Console
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verified_email: boolean;
}

export const googleAuthConfig = {
  clientId: GOOGLE_CLIENT_ID,
  redirectUri: makeRedirectUri({
    scheme: 'hackintake',
  }),
  scopes: ['profile', 'email'],
  responseType: 'code',
};

/**
 * Initiates Google OAuth flow with account picker
 * The 'select_account' prompt forces Google to show all accounts
 */
export const signInWithGoogle = async (): Promise<GoogleUser | null> => {
  try {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
      client_id: googleAuthConfig.clientId,
      redirect_uri: googleAuthConfig.redirectUri,
      response_type: 'code',
      scope: googleAuthConfig.scopes.join(' '),
      // This parameter forces Google to show account picker
      prompt: 'select_account',
      access_type: 'offline',
    }).toString()}`;

    const result = await WebBrowser.openAuthSessionAsync(
      authUrl,
      googleAuthConfig.redirectUri
    );

    if (result.type === 'success' && result.url) {
      const code = extractCodeFromUrl(result.url);
      if (code) {
        // Exchange code for user info
        const userInfo = await fetchGoogleUserInfo(code);
        return userInfo;
      }
    }

    return null;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    return null;
  }
};

/**
 * Extract authorization code from redirect URL
 */
const extractCodeFromUrl = (url: string): string | null => {
  const match = url.match(/code=([^&]+)/);
  return match ? match[1] : null;
};

/**
 * Fetch user info from Google using the authorization code
 * In production, this should be done on your backend server
 */
const fetchGoogleUserInfo = async (code: string): Promise<GoogleUser | null> => {
  try {
    // In production, send this code to your backend
    // Your backend will exchange it for an access token and fetch user info
    // For now, we'll simulate a successful response
    
    // This is a mock response - replace with actual API call to your backend
    const mockUser: GoogleUser = {
      id: Date.now().toString(),
      email: 'user@gmail.com',
      name: 'Google User',
      picture: 'https://via.placeholder.com/150',
      verified_email: true,
    };

    return mockUser;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
};

/**
 * Demo function that simulates Google account picker with multiple accounts
 * Shows a custom picker UI with mock Google accounts
 */
export const mockGoogleAccounts = [
  {
    id: '1',
    email: 'john.doe@gmail.com',
    name: 'John Doe',
    picture: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: '2',
    email: 'jane.smith@gmail.com',
    name: 'Jane Smith',
    picture: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: '3',
    email: 'alex.johnson@gmail.com',
    name: 'Alex Johnson',
    picture: 'https://i.pravatar.cc/150?img=33',
  },
  {
    id: '4',
    email: 'sarah.williams@gmail.com',
    name: 'Sarah Williams',
    picture: 'https://i.pravatar.cc/150?img=47',
  },
];
