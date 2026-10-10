import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ProductCard } from "../components/ProductCard";
import { Button, ErrorState, LoadingState, Screen } from "../components/ui";
import { categories } from "../data/categories";
import { useApiResource } from "../hooks/useApiResource";
import { getProducts } from "../services/api";
import { colors } from "../theme";

export default function HomeScreen({ navigation }) {
  // Filtro e produtos
  const [category, setCategory] = useState("");
  const loadProducts = useCallback(
    (signal) => getProducts(category, signal),
    [category],
  );
  const {
    data: products,
    loading,
    error,
    retry,
  } = useApiResource(loadProducts);

  // Filtro inicial
  useFocusEffect(
    useCallback(() => {
      setCategory("");
    }, []),
  );

  return (
    <Screen>
      <View style={styles.intro}>
        <Text style={styles.eyebrow}>CATÁLOGO FORMA</Text>
        <Text accessibilityRole="header" style={styles.title}>
          Boas escolhas.{"\n"}Todos os dias.
        </Text>
        <Text style={styles.subtitle}>
          Explore os produtos e encontre o seu favorito.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filters}
        contentContainerStyle={styles.filterContent}
      >
        {[{ value: "", label: "Todos" }, ...categories].map((item) => {
          const selected = item.value === category;
          return (
            <Pressable
              key={item.value || "all"}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setCategory(item.value)}
              style={({ pressed }) => [
                styles.chip,
                selected && styles.selectedChip,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[styles.chipText, selected && styles.selectedChipText]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.listHeading}>
        <Text accessibilityLiveRegion="polite" style={styles.count}>
          {loading
            ? "Buscando produtos..."
            : String(products?.length ?? 0) + " produtos"}
        </Text>
        {!!category && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Limpar filtro de categoria"
            onPress={() => setCategory("")}
            style={styles.clearButton}
          >
            <Text style={styles.clearText}>Limpar filtro ×</Text>
          </Pressable>
        )}
      </View>

      {loading ? (
        <LoadingState label="Carregando produtos..." />
      ) : error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : (
        <FlatList
          data={products ?? []}
          keyExtractor={(product) => String(product.id)}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() =>
                navigation.navigate("ProductDetails", { id: item.id })
              }
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Nenhum produto por aqui.</Text>
              <Text style={styles.emptyText}>
                Tente outra categoria ou explore todos os produtos.
              </Text>
              <Button
                label="Mostrar todos"
                variant="secondary"
                onPress={() => (category ? setCategory("") : retry())}
              />
            </View>
          }
        />
      )}
    </Screen>
  );
}

// Estilos
const styles = StyleSheet.create({
  intro: { paddingHorizontal: 24, paddingTop: 26 },
  eyebrow: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2,
    color: colors.muted,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700",
    letterSpacing: -1.1,
    color: colors.ink,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 21,
    color: colors.muted,
    marginTop: 12,
  },
  filters: { flexGrow: 0, flexShrink: 0, marginTop: 24, maxHeight: 44 },
  filterContent: { gap: 8, paddingHorizontal: 24, alignItems: "center" },
  chip: {
    minHeight: 42,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    justifyContent: "center",
  },
  selectedChip: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { fontSize: 12, fontWeight: "500", color: colors.muted },
  selectedChipText: { color: colors.surface },
  pressed: { opacity: 0.65 },
  listHeading: {
    paddingHorizontal: 24,
    height: 58,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  count: { color: colors.muted, fontSize: 11 },
  clearButton: { minHeight: 44, justifyContent: "center" },
  clearText: { color: colors.ink, fontSize: 11, fontWeight: "500" },
  list: { paddingHorizontal: 24, paddingBottom: 24, gap: 14, flexGrow: 1 },
  row: { gap: 14 },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
    gap: 16,
  },
  emptyTitle: { color: colors.ink, fontSize: 18, fontWeight: "600" },
  emptyText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 21,
    textAlign: "center",
  },
});
