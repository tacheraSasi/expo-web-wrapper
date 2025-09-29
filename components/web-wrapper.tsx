import { ThemedText } from "@/components/themed-text";
import { config, webUrl } from "@/constants/constants";
import Constants from "expo-constants";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

// Helper function to safely convert values to numbers
const safeNumber = (value: any, defaultValue: number = 0): number => {
  try {
    if (typeof value === "number" && !isNaN(value)) return value;
    if (typeof value === "string") {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
  } catch (error) {
    console.warn("safeNumber conversion error:", error, "value:", value);
    return defaultValue;
  }
};

const windowDimensions = Dimensions.get("window");
const height = safeNumber(windowDimensions.height, 667);

interface WebWrapperState {
  canGoBack: boolean;
  canGoForward: boolean;
  loading: boolean;
  error: boolean;
  refreshing: boolean;
  currentUrl: string;
}

export default function WebWrapper() {
  const [state, setState] = useState<WebWrapperState>({
    canGoBack: false,
    canGoForward: false,
    loading: true,
    error: false,
    refreshing: false,
    currentUrl: webUrl,
  });

  const webViewRef = useRef<WebView>(null);

  const onAndroidBackPress = useCallback(() => {
    if (state.canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return true; // prevent default behavior (exit app)
    }
    return false;
  }, [state.canGoBack]);

  useEffect(() => {
    if (Platform.OS === "android") {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onAndroidBackPress
      );
      return () => {
        subscription.remove();
      };
    }
  }, [onAndroidBackPress]);

  const handleRefresh = useCallback(() => {
    setState((prev) => ({ ...prev, refreshing: true }));
    webViewRef.current?.reload();
    // Reset refreshing state after a delay
    setTimeout(() => {
      setState((prev) => ({ ...prev, refreshing: false }));
    }, 1000);
  }, []);

  const handleError = useCallback(() => {
    setState((prev) => ({ ...prev, error: true, loading: false }));
    Alert.alert(
      "Connection Error",
      "Unable to load the website. Please check your internet connection and try again.",
      [
        {
          text: "Retry",
          onPress: () => {
            setState((prev) => ({ ...prev, error: false, loading: true }));
            webViewRef.current?.reload();
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  }, []);

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <ThemedText style={styles.loadingText}>Loading...</ThemedText>
    </View>
  );

  const renderError = () => (
    <ScrollView
      style={styles.errorContainer}
      refreshControl={
        <RefreshControl
          refreshing={state.refreshing}
          onRefresh={handleRefresh}
        />
      }
    >
      <View style={styles.errorContent}>
        <Text style={styles.errorTitle}>Connection Error</Text>
        <Text style={styles.errorMessage}>
          Unable to load the website. Please check your internet connection.
        </Text>
      </View>
    </ScrollView>
  );

  if (state.error) {
    return renderError();
  }

  return (
    <View style={styles.container}>
      {state.loading && renderLoading()}
      <WebView
        source={{ uri: state.currentUrl }}
        javaScriptEnabled={config.webview.javaScriptEnabled}
        domStorageEnabled={config.webview.domStorageEnabled}
        allowFileAccess={config.webview.allowFileAccess}
        allowFileAccessFromFileURLs={config.webview.allowFileAccessFromFileURLs}
        allowUniversalAccessFromFileURLs={
          config.webview.allowUniversalAccessFromFileURLs
        }
        cacheEnabled={config.webview.cacheEnabled}
        pullToRefreshEnabled={config.webview.pullToRefreshEnabled}
        showsHorizontalScrollIndicator={
          config.webview.showsHorizontalScrollIndicator
        }
        showsVerticalScrollIndicator={
          config.webview.showsVerticalScrollIndicator
        }
        startInLoadingState={true}
        onLoadStart={() =>
          setState((prev) => ({ ...prev, loading: true, error: false }))
        }
        onLoadEnd={() => setState((prev) => ({ ...prev, loading: false }))}
        onError={handleError}
        onHttpError={handleError}
        renderLoading={() => <View />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: safeNumber(Constants.statusBarHeight, 0),
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: config.ui.loadingBackgroundColor,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: config.ui.errorBackgroundColor,
  },
  errorContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    minHeight: height * 0.6,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
});
