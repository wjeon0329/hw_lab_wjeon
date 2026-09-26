import { SafeAreaView, StyleSheet } from "react-native";
import BrowserView from "./BrowserView";

export default function AppView() {
  return (
    <SafeAreaView style={styles.container}>
      <BrowserView />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
