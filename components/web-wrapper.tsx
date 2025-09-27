import { webUrl } from "@/constants/constants";
import Constants from "expo-constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { 
  BackHandler, 
  Dimensions, 
  Platform, 
  StyleSheet, 
  View, 
  Text, 
  ActivityIndicator, 
  RefreshControl, 
  ScrollView, 
  Alert 
} from "react-native";
import { WebView } from "react-native-webview";

const { width, height } = Dimensions.get("window");

interface WebWrapperState {
  canGoBack: boolean;
  canGoForward: boolean;
  loading: boolean;
  progress: number;
  error: boolean;
  refreshing: boolean;
  currentUrl: string;
}

export default function WebWrapper() {
  const [state, setState] = useState<WebWrapperState>({
    canGoBack: false,
    canGoForward: false,
    loading: true,
    progress: 0,
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
      const subscription = BackHandler.addEventListener("hardwareBackPress", onAndroidBackPress);
      return () => {
        subscription.remove();
      };
    }
  }, [onAndroidBackPress]);

  const handleRefresh = useCallback(() => {
    setState(prev => ({ ...prev, refreshing: true }));
    webViewRef.current?.reload();
    // Reset refreshing state after a delay
    setTimeout(() => {
      setState(prev => ({ ...prev, refreshing: false }));
    }, 1000);
  }, []);

  const handleError = useCallback(() => {
    setState(prev => ({ ...prev, error: true, loading: false }));
    Alert.alert(
      "Connection Error",
      "Unable to load the website. Please check your internet connection and try again.",
      [
        {
          text: "Retry",
          onPress: () => {
            setState(prev => ({ ...prev, error: false, loading: true }));
            webViewRef.current?.reload();
          }
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  }, []);

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Loading...</Text>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${state.progress * 100}%` }]} />
      </View>
    </View>
  );

  const renderError = () => (
    <ScrollView
      style={styles.errorContainer}
      refreshControl={
        <RefreshControl refreshing={state.refreshing} onRefresh={handleRefresh} />
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
        ref={webViewRef}
        style={[styles.webview, { opacity: state.loading ? 0 : 1 }]}
        source={{ uri: state.currentUrl }}
        allowsBackForwardNavigationGestures={true}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        bounces={true}
        decelerationRate="normal"
        javaScriptEnabled={true}
        domStorageEnabled={true}
        cacheEnabled={true}
        pullToRefreshEnabled={true}
        onLoadStart={() => {
          setState(prev => ({ ...prev, loading: true, error: false }));
        }}
        onLoadEnd={() => {
          setState(prev => ({ ...prev, loading: false }));
        }}
        onLoadProgress={(event) => {
          const { canGoBack, canGoForward, progress, url } = event.nativeEvent;
          setState(prev => ({
            ...prev,
            canGoBack,
            canGoForward,
            progress,
            currentUrl: url,
          }));
        }}
        onError={handleError}
        onHttpError={handleError}
        renderLoading={() => <View />} // Prevent default loading
        injectedJavaScript={`
          // Add custom JavaScript here if needed
          // Example: Analytics, custom styling, etc.
          true;
        `}
        onMessage={(event) => {
          // Handle messages from injected JavaScript
          console.log('Message from WebView:', event.nativeEvent.data);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  progressContainer: {
    width: width * 0.7,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: height * 0.6,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
