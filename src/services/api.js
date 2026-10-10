import axios from "axios";

export const API_URL = "https://fakestoreapi.com";

// Conexão com a API
export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

function createError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function invalidResponse() {
  return createError(
    "INVALID_RESPONSE",
    "O serviço retornou dados inválidos. Tente novamente.",
  );
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidProduct(product) {
  return (
    product !== null &&
    typeof product === "object" &&
    Number.isSafeInteger(product.id) &&
    product.id > 0 &&
    isNonEmptyString(product.title) &&
    isNonEmptyString(product.category) &&
    isNonEmptyString(product.description) &&
    isNonEmptyString(product.image) &&
    typeof product.price === "number" &&
    Number.isFinite(product.price) &&
    product.price >= 0
  );
}

export async function getUsers(signal) {
  const { data } = await api.get("/users", { signal });

  if (
    !Array.isArray(data) ||
    !data.every(
      (user) =>
        user !== null &&
        typeof user === "object" &&
        isNonEmptyString(user.username) &&
        isNonEmptyString(user.password),
    )
  ) {
    throw invalidResponse();
  }

  return data;
}

// Login com os usuários da API
export async function login(username, password, signal) {
  const users = await getUsers(signal);
  const user = users.find(
    (availableUser) =>
      availableUser.username === username &&
      availableUser.password === password,
  );

  if (!user) {
    throw createError(
      "INVALID_CREDENTIALS",
      "Usuário ou senha inválidos. Confira os dados e tente novamente.",
    );
  }

  const { data } = await api.post(
    "/auth/login",
    { username, password },
    { signal },
  );

  if (!data || !isNonEmptyString(data.token)) {
    throw invalidResponse();
  }

  return { token: data.token, username: user.username };
}

// Produtos e filtro por categoria
export async function getProducts(category = "", signal) {
  if (typeof category !== "string") {
    throw createError("INVALID_CATEGORY", "Selecione uma categoria válida.");
  }

  const endpoint = category
    ? `/products/category/${encodeURIComponent(category)}`
    : "/products";
  const { data } = await api.get(endpoint, { signal });

  if (!Array.isArray(data) || !data.every(isValidProduct)) {
    throw invalidResponse();
  }

  return data;
}

export async function getProduct(id, signal) {
  const validInput =
    typeof id === "number" || (typeof id === "string" && /^\d+$/.test(id));
  const productId = Number(id);

  if (!validInput || !Number.isSafeInteger(productId) || productId <= 0) {
    throw createError(
      "INVALID_PRODUCT_ID",
      "Este produto não está disponível.",
    );
  }

  const { data } = await api.get(`/products/${productId}`, { signal });

  if (!isValidProduct(data) || data.id !== productId) {
    throw invalidResponse();
  }

  return data;
}

export async function getCategories(signal) {
  const { data } = await api.get("/products/categories", { signal });

  if (!Array.isArray(data) || !data.every(isNonEmptyString)) {
    throw invalidResponse();
  }

  return [...new Set(data)];
}

export function isCanceled(error) {
  return axios.isCancel(error) || error?.code === "ERR_CANCELED";
}

// Mensagens de erro
export function getErrorMessage(error) {
  if (
    [
      "INVALID_CREDENTIALS",
      "INVALID_RESPONSE",
      "INVALID_PRODUCT_ID",
      "INVALID_CATEGORY",
    ].includes(error?.code)
  ) {
    return error.message;
  }

  if (error?.response?.status === 401) {
    return "Usuário ou senha inválidos. Confira os dados e tente novamente.";
  }

  if (error?.response?.status === 403) {
    return "O acesso ao serviço foi bloqueado. Tente novamente mais tarde.";
  }

  if (error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT") {
    return "A solicitação demorou demais. Confira sua conexão e tente novamente.";
  }

  if (
    error?.code === "ERR_NETWORK" ||
    (axios.isAxiosError(error) && !error.response)
  ) {
    return "Não foi possível conectar ao serviço. Confira sua conexão e tente novamente.";
  }

  if (error?.response?.status === 404) {
    return "Os dados solicitados não foram encontrados. Tente novamente.";
  }

  if (error?.response?.status >= 500) {
    return "O serviço está indisponível. Tente novamente em instantes.";
  }

  return "Não foi possível concluir a solicitação. Tente novamente.";
}
