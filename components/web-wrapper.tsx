import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import { BackHandler, Platform, StyleSheet } from "react-native";
import { webUrl } from "@/constants/constants";
import { useState, useRef, useCallback, useEffect } from "react";

export default function WebWrapper() {

    const [canGoBack, setCanGoBack] = useState(false);
    const webViewRef = useRef(null);
    const onAndroidBackPress = useCallback(() => {
      if (canGoBack) {
        webViewRef.current?.goBack();
        return true; // prevent default behavior (exit app)
      }
      return false;
    }, [canGoBack]);

    useEffect(() => {
      if (Platform.OS === "android") {
        BackHandler.addEventListener("hardwareBackPress", onAndroidBackPress);
        return () => {
          BackHandler.removeEventListener(
            "hardwareBackPress",
            onAndroidBackPress
          );
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
