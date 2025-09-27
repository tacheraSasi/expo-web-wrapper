import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import { StyleSheet } from "react-native";
import { webUrl } from "@/constants/constants";

export default function WebWrapper() {
  return (
    <WebView style={styles.container} source={{ uri: webUrl }} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
