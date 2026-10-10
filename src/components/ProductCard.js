import { Pressable, StyleSheet, Text, View } from "react-native";
import { categoryLabel } from "../data/categories";
import { colors } from "../theme";
import { formatPrice } from "../utils/currency";
import { ProductImage } from "./ui";

// Card do produto
export function ProductCard({ product, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        product.title + ", " + formatPrice(product.price) + ". Ver detalhes"
      }
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <ProductImage uri={product.image} title={product.title} size={160} />
      <View style={styles.details}>
        <Text numberOfLines={1} style={styles.category}>
          {categoryLabel(product.category)}
        </Text>
        <Text numberOfLines={2} style={styles.title}>
          {product.title}
        </Text>
        <View style={styles.bottom}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Text
            accessibilityElementsHidden
            importantForAccessibility="no"
            style={styles.arrow}
          >
            ↗
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

// Estilos
const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 18,
    padding: 5,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: "49%",
  },
  pressed: { opacity: 0.65 },
  details: { paddingHorizontal: 10, paddingTop: 8, paddingBottom: 12, gap: 8 },
  category: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  title: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 19,
    minHeight: 38,
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 3,
  },
  price: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  arrow: { color: colors.muted, fontSize: 18 },
});
