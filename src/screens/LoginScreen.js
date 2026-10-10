import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage, isCanceled, login } from "../services/api";
import { colors } from "../theme";
import { showError } from "../utils/alerts";

export default function LoginScreen() {
  // Dados do formulário
  const { signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const passwordInput = useRef(null);
  const request = useRef(null);
  const active = useRef(true);

  // Cancela ao sair da tela
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      request.current?.abort();
    };
  }, []);

  // Login
  async function handleLogin() {
    if (request.current) {
      return;
    }

    if (!username.trim() || !password) {
      const message = "Preencha o usuário e a senha para entrar.";
      setError(message);
      showError(message);
      return;
    }

    const controller = new AbortController();
    request.current = controller;
    setSubmitting(true);
    setError(null);

    try {
      const session = await login(username.trim(), password, controller.signal);
      if (active.current) {
        signIn(session);
      }
    } catch (reason) {
      if (active.current && !isCanceled(reason)) {
        const message = getErrorMessage(reason);
        setError(message);
        showError(message);
      }
    } finally {
      request.current = null;
      if (active.current) {
        setSubmitting(false);
      }
    }
  }

  // Consulta das contas
  async function openUsers() {
    try {
      await Linking.openURL("https://fakestoreapi.com/users");
    } catch {
      showError("Não foi possível abrir a lista de usuários. Tente novamente.");
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View style={styles.brand}>
            <View style={styles.mark}>
              <Text style={styles.markText}>f.</Text>
            </View>
            <Text style={styles.brandName}>FORMA</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.eyebrow}>MENOS EXCESSO. MAIS ESCOLHAS.</Text>
            <Text accessibilityRole="header" style={styles.title}>
              Bem-vindo{"\n"}à Forma.
            </Text>
            <Text style={styles.subtitle}>
              Encontre o que combina com você.{"\n"}Entre para explorar nossos
              produtos.
            </Text>

            <View style={styles.fields}>
              <View style={styles.field}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  accessibilityLabel="Username"
                  placeholder="Seu nome de usuário"
                  placeholderTextColor={colors.muted}
                  style={styles.input}
                  value={username}
                  onChangeText={(value) => {
                    setUsername(value);
                    setError(null);
                  }}
                  editable={!submitting}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="username"
                  textContentType="username"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordInput.current?.focus()}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordField}>
                  <TextInput
                    ref={passwordInput}
                    accessibilityLabel="Password"
                    placeholder="Sua senha"
                    placeholderTextColor={colors.muted}
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={(value) => {
                      setPassword(value);
                      setError(null);
                    }}
                    editable={!submitting}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="current-password"
                    textContentType="password"
                    secureTextEntry={!visiblePassword}
                    returnKeyType="go"
                    onSubmitEditing={handleLogin}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      visiblePassword ? "Ocultar senha" : "Mostrar senha"
                    }
                    disabled={submitting}
                    onPress={() => setVisiblePassword((value) => !value)}
                    style={styles.visibilityButton}
                  >
                    <Text style={styles.visibilityText}>
                      {visiblePassword ? "Ocultar" : "Mostrar"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {error && (
              <Text
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
                style={styles.error}
              >
                {error}
              </Text>
            )}

            <Button
              label="Entrar"
              onPress={handleLogin}
              loading={submitting}
              style={styles.submit}
            />
            {submitting && (
              <Text accessibilityLiveRegion="polite" style={styles.loadingText}>
                Verificando sua conta...
              </Text>
            )}

            <View style={styles.help}>
              <Text style={styles.helpText}>
                Use uma conta existente na Fake Store API.
              </Text>
              <Pressable
                accessibilityRole="link"
                onPress={openUsers}
                style={styles.usersButton}
              >
                <Text style={styles.usersLink}>
                  Consultar usuários disponíveis ↗
                </Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.footer}>FORMA · FAKE STORE API</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Estilos
const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    padding: 28,
    maxWidth: 480,
    width: "100%",
    alignSelf: "center",
    justifyContent: "space-between",
    gap: 40,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 12 },
  mark: {
    width: 40,
    height: 40,
    backgroundColor: colors.ink,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  markText: {
    color: colors.surface,
    fontSize: 27,
    fontWeight: "700",
    letterSpacing: -2,
  },
  brandName: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 3,
    color: colors.ink,
  },
  form: { paddingVertical: 12 },
  eyebrow: {
    color: colors.muted,
    fontSize: 10,
    letterSpacing: 1.4,
    fontWeight: "600",
    marginBottom: 18,
  },
  title: {
    color: colors.ink,
    fontSize: 42,
    lineHeight: 48,
    letterSpacing: -1.8,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 18,
  },
  fields: { marginTop: 34, gap: 20 },
  field: { gap: 9 },
  label: { color: colors.ink, fontSize: 13, fontWeight: "600" },
  input: {
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.ink,
    fontSize: 15,
    paddingHorizontal: 16,
  },
  passwordField: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  passwordInput: {
    flex: 1,
    height: 54,
    paddingHorizontal: 16,
    color: colors.ink,
    fontSize: 15,
  },
  visibilityButton: {
    minHeight: 48,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  visibilityText: { color: colors.muted, fontSize: 12, fontWeight: "500" },
  submit: { marginTop: 24 },
  error: { color: colors.error, fontSize: 13, lineHeight: 20, marginTop: 16 },
  loadingText: {
    color: colors.muted,
    textAlign: "center",
    fontSize: 12,
    marginTop: 12,
  },
  help: { alignItems: "center", marginTop: 24 },
  helpText: {
    color: colors.muted,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 20,
  },
  usersButton: { minHeight: 44, justifyContent: "center" },
  usersLink: { color: colors.ink, fontSize: 12, fontWeight: "600" },
  footer: {
    color: colors.muted,
    fontSize: 10,
    letterSpacing: 2,
    textAlign: "center",
    paddingTop: 16,
  },
});
