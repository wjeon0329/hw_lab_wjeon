import { useRef, useState } from "react";
import {
  Alert,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import type { WebViewNavigation } from "react-native-webview/lib/WebViewTypes";
import BottomBarIcon from "../Components/BottomBarIcon";
import type { BottomBarIconProps } from "../types";

const DEFAULT_URL = "https://www.google.com";

function toValidUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return DEFAULT_URL;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export default function BrowserView() {
  const webViewRef = useRef<WebView>(null);
  const [currentUrl, setCurrentUrl] = useState(DEFAULT_URL);
  const [url, setUrl] = useState(DEFAULT_URL);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const handleLoadUrl = () => {
    const nextUrl = toValidUrl(url);
    setUrl(nextUrl);
    setCurrentUrl(nextUrl);
  };

  const handleNavigationChange = (navigation: WebViewNavigation) => {
    setCanGoBack(navigation.canGoBack);
    setCanGoForward(navigation.canGoForward);
    setCurrentUrl(navigation.url);
    setUrl(navigation.url);
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: currentUrl, url: currentUrl });
    } catch {
      Alert.alert("Unable to share", "Please try again.");
    }
  };

  const actions: BottomBarIconProps[] = [
    { iconName: "arrow-back", label: "Back", onPress: () => webViewRef.current?.goBack(), disabled: !canGoBack },
    { iconName: "arrow-forward", label: "Forward", onPress: () => webViewRef.current?.goForward(), disabled: !canGoForward },
    { iconName: "share", label: "Share", onPress: handleShare },
    { iconName: "refresh", label: "Reload", onPress: () => webViewRef.current?.reload() },
    { iconName: "close", label: "Stop", onPress: () => webViewRef.current?.stopLoading() },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.urlBar}>
        <Text style={styles.label}>URL</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          onChangeText={setUrl}
          onSubmitEditing={handleLoadUrl}
          returnKeyType="go"
          selectTextOnFocus
          style={styles.input}
          value={url}
        />
      </View>

      <WebView
        ref={webViewRef}
        source={{ uri: currentUrl }}
        onNavigationStateChange={handleNavigationChange}
        style={styles.webView}
      />

      <View style={styles.bottomBar}>
        {actions.map((action) => (
          <BottomBarIcon key={action.label} {...action} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  urlBar: {
    alignItems: "center",
    backgroundColor: "white",
    elevation: 3,
    flexDirection: "row",
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: { fontSize: 16, fontWeight: "bold", left: 20, position: "absolute", zIndex: 1 },
  input: {
    borderColor: "#bbb",
    borderRadius: 7,
    borderWidth: 1,
    flex: 1,
    fontSize: 16,
    marginRight: 8,
    opacity: 0.8,
    padding: 8,
    paddingLeft: 55,
  },
  webView: { flex: 1 },
  bottomBar: {
    backgroundColor: "white",
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
