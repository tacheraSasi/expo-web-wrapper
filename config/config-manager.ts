import { appConfig, AppConfig } from './app-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CONFIG_STORAGE_KEY = 'app_config';

class ConfigManager {
  private config: AppConfig = appConfig;
  
  /**
   * Get current configuration
   */
  getConfig(): AppConfig {
    return this.config;
  }

  /**
   * Update configuration (persisted to storage)
   */
  async updateConfig(updates: Partial<AppConfig>): Promise<void> {
    this.config = {
      ...this.config,
      ...updates,
    };
    
    try {
      await AsyncStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.config));
    } catch (error) {
      console.warn('Failed to save config to storage:', error);
    }
  }

  /**
   * Load configuration from storage
   */
  async loadConfig(): Promise<void> {
    try {
      const storedConfig = await AsyncStorage.getItem(CONFIG_STORAGE_KEY);
      if (storedConfig) {
        const parsed = JSON.parse(storedConfig);
        this.config = {
          ...appConfig, // Start with defaults
          ...parsed,    // Override with stored values
        };
      }
    } catch (error) {
      console.warn('Failed to load config from storage, using defaults:', error);
    }
  }

  /**
   * Reset configuration to defaults
   */
  async resetConfig(): Promise<void> {
    this.config = appConfig;
    try {
      await AsyncStorage.removeItem(CONFIG_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to reset config in storage:', error);
    }
  }

  /**
   * Get a specific config value by path
   */
  getConfigValue<T>(path: string): T | undefined {
    return path.split('.').reduce((obj: any, key: string) => obj?.[key], this.config);
  }

  /**
   * Update a specific config value by path
   */
  async setConfigValue(path: string, value: any): Promise<void> {
    const keys = path.split('.');
    const lastKey = keys.pop();
    
    if (!lastKey) return;
    
    const target = keys.reduce((obj: any, key: string) => {
      if (!obj[key]) obj[key] = {};
      return obj[key];
    }, this.config);
    
    target[lastKey] = value;
    
    try {
      await AsyncStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.config));
    } catch (error) {
      console.warn('Failed to save config to storage:', error);
    }
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.config.features[feature];
  }

  /**
   * Check if a domain is allowed
   */
  isDomainAllowed(domain: string): boolean {
    const { allowedDomains, blockedDomains } = this.config.security;
    
    // If domain is explicitly blocked, deny
    if (blockedDomains.some(blocked => domain.includes(blocked))) {
      return false;
    }
    
    // If no allowed domains specified, allow all (except blocked)
    if (allowedDomains.length === 0) {
      return true;
    }
    
    // Check if domain is in allowed list
    return allowedDomains.some(allowed => domain.includes(allowed));
  }

  /**
   * Get user agent string
   */
  getUserAgent(): string | undefined {
    return this.config.website.userAgent;
  }

  /**
   * Get theme configuration
   */
  getThemeConfig() {
    return {
      theme: this.config.ui.theme,
      statusBarStyle: this.config.ui.statusBarStyle,
      progressBarColor: this.config.ui.progressBarColor,
      loadingBackgroundColor: this.config.ui.loadingBackgroundColor,
      errorBackgroundColor: this.config.ui.errorBackgroundColor,
    };
  }
}

export const configManager = new ConfigManager();
export default configManager;