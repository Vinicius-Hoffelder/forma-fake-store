import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme";

// Cabeçalho
export function AppHeader({ title, left, right }) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.side}>
          {left && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={left.label}
              onPress={left.onPress}
              hitSlop={8}
              style={({ pressed }) => [
                styles.action,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.actionText}>{left.label}</Text>
            </Pressable>
          )}
        </View>
        <Text
          numberOfLines={2}
          accessibilityRole="header"
          style={[styles.title, !right && styles.longTitle]}
        >
          {title}
        </Text>
        <View style={[styles.side, styles.right]}>
          {right && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={right.label}
              onPress={right.onPress}
              hitSlop={8}
              style={({ pressed }) => [
                styles.action,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.actionText}>{right.label}</Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 64,
    paddingVertical: 8,
    paddingHorizontal: 20,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  side: { width: 86 },
  right: { alignItems: "flex-end" },
  title: {
    flex: 1,
    textAlign: "center",
    color: colors.ink,
    fontSize: 17,
    fontWeight: "600",
  },
  longTitle: { fontSize: 14 },
  action: { minHeight: 44, justifyContent: "center" },
  actionText: { color: colors.muted, fontSize: 12, fontWeight: "500" },
  pressed: { opacity: 0.5 },
});
