import { Platform } from "react-native";

// Cores do app
export const colors = {
  background: "#F6F5F2",
  surface: "#FFFFFF",
  ink: "#252623",
  muted: "#74766F",
  border: "#E5E5DF",
  accent: "#454841",
  soft: "#ECEDE7",
  error: "#A33F36",
};

// Sombra suave
export const shadow = Platform.select({
  web: { boxShadow: "0px 4px 18px rgba(37, 38, 35, 0.05)" },
  default: {
    shadowColor: "#252623",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
});
