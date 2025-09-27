import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import { 
  BackHandler, 
  Platform, 
  StyleSheet, 
  View, 
  Text, 
  ActivityIndicator, 
  RefreshControl, 
  ScrollView,
  Alert,
  Dimensions
} from "react-native";
import { webUrl } from "@/constants/constants";
import { useState, useRef, useCallback, useEffect } from "react";

const { width, height } = Dimensions.get('window');

export default function WebWrapper() {
    const [canGoBack, setCanGoBack] = useState(false);
    const webViewRef = useRef<WebView>(null);
    const onAndroidBackPress = useCallback(() => {
      if (canGoBack) {
        webViewRef.current?.goBack();
        return true; // prevent default behavior (exit app)
      }
      return false;
    }, [canGoBack]);

    useEffect(() => {
      if (Platform.OS === "android") {
        const subscription = BackHandler.addEventListener("hardwareBackPress", onAndroidBackPress);
        return () => {
          subscription.remove();
        };
      }
    }, [onAndroidBackPress]);
  return (
    <WebView
      style={styles.container}
      allowsBackForwardNavigationGestures={true}
      allowFileAccess={true}
      allowFileAccessFromFileURLs={true}
      allowUniversalAccessFromFileURLs={true}
      source={{ uri: webUrl }}
      ref={webViewRef}
      onLoadProgress={(event) => {
        setCanGoBack(event.nativeEvent.canGoBack);
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
