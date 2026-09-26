import type { ComponentProps } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export type BottomBarIconProps = {
  iconName: ComponentProps<typeof MaterialIcons>["name"];
  label: string;
  onPress: () => void;
  disabled?: boolean;
};
