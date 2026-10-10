import { useCallback } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  ErrorState,
  LoadingState,
  ProductImage,
  Screen,
} from "../components/ui";
import { useApiResource } from "../hooks/useApiResource";
import { getProduct } from "../services/api";
import { colors, shadow } from "../theme";
import { formatPrice } from "../utils/currency";

const categoryLabels = {
  electronics: "Eletrônicos",
  jewelery: "Joias",
  "men's clothing": "Moda masculina",
  "women's clothing": "Moda feminina",
};

export default function ProductDetailsScreen({ route }) {
  // Detalhes do produto
  const id = route.params?.id;
  const loadProduct = useCallback((signal) => getProduct(id, signal), [id]);
  const { data: product, loading, error, retry } = useApiResource(loadProduct);

  // Carregamento
  if (loading) {
    return (
      <Screen>
        <LoadingState label="Carregando produto..." />
      </Screen>
    );
  }

  if (error || !product) {
    return (
      <Screen>
        <ErrorState
          message={error || "Não foi possível encontrar este produto."}
          onRetry={retry}
        />
      </Screen>
    );
  }

  const hasRating =
    Number.isFinite(product.rating?.rate) &&
    Number.isFinite(product.rating?.count);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageCard}>
          <ProductImage uri={product.image} title={product.title} size={280} />
        </View>
        <View style={styles.information}>
          <View style={styles.categoryBadge}>
            <Text style={styles.category}>
              {categoryLabels[product.category] || product.category}
            </Text>
          </View>
          <Text accessibilityRole="header" style={styles.title}>
            {product.title}
          </Text>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          {hasRating && (
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>
                ★ {product.rating.rate.toFixed(1).replace(".", ",")}
              </Text>
              <Text style={styles.ratingCount}>
                {product.rating.count} avaliações
              </Text>
            </View>
          )}
          <View style={styles.divider} />
          <Text accessibilityRole="header" style={styles.descriptionTitle}>
            Sobre o produto
          </Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

// Estilos
const styles = StyleSheet.create({
  content: {
    padding: 24,
    paddingBottom: 40,
    gap: 28,
  },
  imageCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 28,
    ...shadow,
  },
  information: {
    gap: 16,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.soft,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  category: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  title: {
    color: colors.ink,
    fontSize: 25,
    fontWeight: "600",
    lineHeight: 33,
    letterSpacing: -0.5,
  },
  price: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.8,
  },
  ratingRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12,
  },
  rating: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "600",
  },
  ratingCount: {
    color: colors.muted,
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 6,
  },
  descriptionTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "600",
  },
  description: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 25,
  },
});
