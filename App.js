import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Topbar from "./topbar";
import TempConverter from "./tempConverter";

export default function App() {
  return (
    <View>
      <StatusBar hidden />
      <Topbar title="TempConverter" />
      <TempConverter />
    </View>
  );
}