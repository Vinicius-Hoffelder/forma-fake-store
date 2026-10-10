import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme";

// Área da tela
export function Screen({ children }) {
  return (
    <SafeAreaView edges={["bottom"]} style={styles.screen}>
      <View style={styles.page}>{children}</View>
    </SafeAreaView>
  );
}

// Botão
export function Button({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
}) {
  const secondary = variant === "secondary";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondaryButton,
        (pressed || loading || disabled) && styles.dimmed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? colors.ink : colors.surface} />
      ) : (
        <Text
          style={[styles.buttonText, secondary && styles.secondaryButtonText]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

// Carregamento
export function LoadingState({ label = "Carregando..." }) {
  return (
    <View accessibilityLiveRegion="polite" style={styles.state}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={styles.stateMessage}>{label}</Text>
    </View>
  );
}

// Erro
export function ErrorState({ message, onRetry }) {
  return (
    <View accessibilityLiveRegion="polite" style={styles.state}>
      <View style={styles.errorIcon}>
        <Text style={styles.errorIconText}>!</Text>
      </View>
      <Text style={styles.stateTitle}>Algo deu errado.</Text>
      <Text style={styles.stateMessage}>{message}</Text>
      <Button label="Tentar novamente" variant="secondary" onPress={onRetry} />
    </View>
  );
}

// Imagem do produto
export function ProductImage({ uri, title, size = 220, style }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [uri]);

  return (
    <View style={[styles.imageFrame, { height: size }, style]}>
      {failed ? (
        <Text style={styles.imagePlaceholder}>Imagem indisponível</Text>
      ) : (
        <Image
          source={{ uri }}
          accessibilityLabel={title}
          resizeMode="contain"
          style={styles.image}
          onError={() => setFailed(true)}
        />
      )}
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  page: { flex: 1, width: "100%", maxWidth: 800, alignSelf: "center" },
  button: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: colors.ink,
    paddingHorizontal: 22,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: colors.surface, fontSize: 15, fontWeight: "600" },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: { color: colors.ink },
  dimmed: { opacity: 0.65 },
  state: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 28,
    minHeight: 240,
  },
  stateTitle: { fontSize: 21, fontWeight: "600", color: colors.ink },
  stateMessage: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    color: colors.muted,
    maxWidth: 360,
  },
  errorIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.soft,
    justifyContent: "center",
    alignItems: "center",
  },
  errorIconText: { color: colors.ink, fontSize: 24, fontWeight: "600" },
  imageFrame: {
    width: "100%",
    backgroundColor: colors.surface,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: { color: colors.muted, fontSize: 12, textAlign: "center" },
});
