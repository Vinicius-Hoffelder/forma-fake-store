import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppHeader } from "./src/components/AppHeader";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import GroupInfoScreen from "./src/screens/GroupInfoScreen";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import ProductDetailsScreen from "./src/screens/ProductDetailsScreen";
import { colors } from "./src/theme";

const Stack = createNativeStackNavigator();
// Cores da navegação
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.ink,
    background: colors.background,
    card: colors.background,
    text: colors.ink,
    border: colors.border,
  },
};

// Navegação e logout
function AppNavigator() {
  const { session, signOut } = useAuth();

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          animation: "slide_from_right",
        }}
      >
        {session ? (
          <Stack.Group navigationKey="authenticated">
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={({ navigation }) => ({
                title: "Produtos",
                header: () => (
                  <AppHeader
                    title="Produtos"
                    left={{ label: "Logout", onPress: signOut }}
                    right={{
                      label: "Informações",
                      onPress: () => navigation.navigate("GroupInfo"),
                    }}
                  />
                ),
              })}
            />
            <Stack.Screen
              name="ProductDetails"
              component={ProductDetailsScreen}
              options={({ navigation }) => ({
                title: "Detalhes do Produto",
                header: () => (
                  <AppHeader
                    title="Detalhes do Produto"
                    left={{
                      label: "← Voltar",
                      onPress: () => navigation.goBack(),
                    }}
                  />
                ),
              })}
            />
            <Stack.Screen
              name="GroupInfo"
              component={GroupInfoScreen}
              options={({ navigation }) => ({
                title: "Informações do Grupo",
                header: () => (
                  <AppHeader
                    title="Informações do Grupo"
                    left={{
                      label: "← Voltar",
                      onPress: () => navigation.goBack(),
                    }}
                  />
                ),
              })}
            />
          </Stack.Group>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Início do app
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
