import { Pressable, StyleSheet, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { BottomBarIconProps } from "../types";

export default function BottomBarIcon({
  iconName,
  label,
  onPress,
  disabled = false,
}: BottomBarIconProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && !disabled && styles.pressed]}
    >
      <View style={styles.iconWrap}>
        <MaterialIcons
          name={iconName}
          size={26}
          color={disabled ? "#b7bcc5" : "#1d3557"}
        />
        <Text style={[styles.label, disabled && styles.disabledLabel]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { borderRadius: 8, padding: 4 },
  pressed: { backgroundColor: "#e8eef7" },
  iconWrap: { alignItems: "center", minWidth: 48 },
  label: { color: "#1d3557", fontSize: 11, marginTop: 2 },
  disabledLabel: { color: "#b7bcc5" },
});
