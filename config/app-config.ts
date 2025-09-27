export interface AppConfig {
  // Website Configuration
  website: {
    url: string;
    fallbackUrl?: string;
    userAgent?: string;
    allowsBackForwardNavigationGestures: boolean;
  };

  // App Information
  app: {
    name: string;
    version: string;
    description: string;
    author: string;
    supportEmail?: string;
    website?: string;
  };

  // WebView Settings
  webview: {
    javaScriptEnabled: boolean;
    domStorageEnabled: boolean;
    allowFileAccess: boolean;
    allowFileAccessFromFileURLs: boolean;
    allowUniversalAccessFromFileURLs: boolean;
    cacheEnabled: boolean;
    pullToRefreshEnabled: boolean;
    scalesPageToFit: boolean;
    bounces: boolean;
    showsHorizontalScrollIndicator: boolean;
    showsVerticalScrollIndicator: boolean;
  };

  // UI Customization
  ui: {
    theme: 'light' | 'dark' | 'auto';
    statusBarStyle: 'auto' | 'light' | 'dark';
    hideNavigationBar: boolean;
    showProgressBar: boolean;
    progressBarColor: string;
    loadingBackgroundColor: string;
    errorBackgroundColor: string;
  };

  // Features
  features: {
    enableOfflineSupport: boolean;
    enablePushNotifications: boolean;
    enableDeepLinking: boolean;
    enableShare: boolean;
    enableExternalBrowser: boolean;
    enableDownloads: boolean;
  };

  // Navigation
  navigation: {
    enableTabs: boolean;
    enableDrawer: boolean;
    showSettingsButton: boolean;
    showAboutButton: boolean;
    showRefreshButton: boolean;
    showBackButton: boolean;
    showForwardButton: boolean;
  };

  // Security
  security: {
    allowedDomains: string[];
    blockedDomains: string[];
    enableSSLValidation: boolean;
  };
}

// Default configuration
export const defaultConfig: AppConfig = {
  website: {
    url: 'https://tachera.ekilie.com',
    allowsBackForwardNavigationGestures: true,
  },

  app: {
    name: 'Web Wrapper App',
    version: '1.0.0',
    description: 'A React Native web wrapper application',
    author: 'Your Name',
    supportEmail: 'support@example.com',
  },

  webview: {
    javaScriptEnabled: true,
    domStorageEnabled: true,
    allowFileAccess: true,
    allowFileAccessFromFileURLs: true,
    allowUniversalAccessFromFileURLs: true,
    cacheEnabled: true,
    pullToRefreshEnabled: true,
    scalesPageToFit: true,
    bounces: true,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: true,
  },

  ui: {
    theme: 'auto',
    statusBarStyle: 'auto',
    hideNavigationBar: false,
    showProgressBar: true,
    progressBarColor: '#007AFF',
    loadingBackgroundColor: 'rgba(255, 255, 255, 0.9)',
    errorBackgroundColor: '#f5f5f5',
  },

  features: {
    enableOfflineSupport: true,
    enablePushNotifications: false,
    enableDeepLinking: true,
    enableShare: true,
    enableExternalBrowser: true,
    enableDownloads: false,
  },

  navigation: {
    enableTabs: false,
    enableDrawer: false,
    showSettingsButton: true,
    showAboutButton: true,
    showRefreshButton: true,
    showBackButton: true,
    showForwardButton: true,
  },

  security: {
    allowedDomains: [],
    blockedDomains: [],
    enableSSLValidation: true,
  },
};

export const appConfig: AppConfig = {
  ...defaultConfig,
  website: {
    ...defaultConfig.website,
    url: 'https://tachera.ekilie.com',
  },

  app: {
    ...defaultConfig.app,
    name: 'Expo Web Wrapper',
    description: 'A Expo React Native web wrapper application',
    author: 'Tachera Sasi',
    supportEmail: 'support@ekilie.com',
  },
  ui: {
    ...defaultConfig.ui,
    theme: 'auto',
    progressBarColor: '#55585cff',
  },
};