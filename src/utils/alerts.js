import { Alert, Platform } from "react-native";

// Aviso de erro
export function showError(message) {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.alert(message);
    return;
  }

  Alert.alert("Não foi possível continuar", message, [{ text: "OK" }]);
}
