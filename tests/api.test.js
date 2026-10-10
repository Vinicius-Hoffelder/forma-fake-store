import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { AxiosError, CanceledError } from "axios";
import {
  api,
  getCategories,
  getErrorMessage,
  getProduct,
  getProducts,
  getUsers,
  isCanceled,
  login,
} from "../src/services/api.js";

const originalAdapter = api.defaults.adapter;
const user = { id: 1, username: "aluno", password: "senha-de-teste" };
const product = {
  id: 1,
  title: "Produto de teste",
  price: 199.9,
  category: "electronics",
  description: "Descrição do produto de teste.",
  image: "https://example.com/produto.png",
};

let requests;
let respond;

function response(config, data, status = 200) {
  return { config, data, status, statusText: "OK", headers: {} };
}

beforeEach(() => {
  requests = [];
  respond = (config) => response(config, [product]);
  api.defaults.adapter = async (config) => {
    requests.push(config);
    return respond(config);
  };
});

afterEach(() => {
  api.defaults.adapter = originalAdapter;
});

// Login
test("login consulta usuários antes de autenticar e devolve a sessão", async () => {
  respond = (config) => {
    if (config.url === "/users") {
      return response(config, [user]);
    }

    return response(config, { token: "token-de-teste" });
  };

  assert.deepEqual(await login(user.username, user.password), {
    username: user.username,
    token: "token-de-teste",
  });
  assert.deepEqual(
    requests.map(({ method, url }) => ({ method, url })),
    [
      { method: "get", url: "/users" },
      { method: "post", url: "/auth/login" },
    ],
  );
  assert.deepEqual(JSON.parse(requests[1].data), {
    username: user.username,
    password: user.password,
  });
});

test("credenciais que não pertencem a um usuário existente não fazem POST", async () => {
  respond = (config) => response(config, [user]);

  await assert.rejects(login(user.username, "senha-incorreta"), (error) => {
    assert.equal(error.code, "INVALID_CREDENTIALS");
    assert.match(getErrorMessage(error), /Usuário ou senha inválidos/);
    return true;
  });
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, "/users");
});

test("autenticação sem token não concede uma sessão", async () => {
  respond = (config) => response(config, config.url === "/users" ? [user] : {});

  await assert.rejects(login(user.username, user.password), {
    code: "INVALID_RESPONSE",
  });
});

test("falha na consulta de usuários interrompe a autenticação", async () => {
  respond = (config) => {
    throw new AxiosError("Network Error", "ERR_NETWORK", config);
  };

  await assert.rejects(login(user.username, user.password), {
    code: "ERR_NETWORK",
  });
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, "/users");
});

test("lista de usuários inválida é rejeitada antes de autenticar", async () => {
  respond = (config) => response(config, [{ username: user.username }]);

  await assert.rejects(getUsers(), { code: "INVALID_RESPONSE" });
});

// Filtro e detalhes
test("categoria é codificada na URL e limpar o filtro retorna a todos os produtos", async () => {
  assert.deepEqual(await getProducts("women's clothing"), [product]);
  assert.deepEqual(await getProducts(""), [product]);
  assert.deepEqual(
    requests.map(({ url }) => url),
    ["/products/category/women's%20clothing", "/products"],
  );
});

test("detalhes são consultados pelo ID informado", async () => {
  respond = (config) => response(config, product);

  assert.deepEqual(await getProduct("1"), product);
  assert.equal(requests[0].url, "/products/1");
});

test("ID inválido não provoca requisição e produto de outro ID é rejeitado", async () => {
  await assert.rejects(getProduct("../users"), { code: "INVALID_PRODUCT_ID" });
  assert.equal(requests.length, 0);

  respond = (config) => response(config, { ...product, id: 2 });
  await assert.rejects(getProduct(1), { code: "INVALID_RESPONSE" });
});

// Erros de conexão
test("falha HTTP nos produtos preserva o erro e oferece uma mensagem útil", async () => {
  respond = (config) => {
    throw new AxiosError(
      "Request failed with status code 503",
      "ERR_BAD_RESPONSE",
      config,
      undefined,
      response(config, {}, 503),
    );
  };

  await assert.rejects(getProducts(), (error) => {
    assert.equal(error.response.status, 503);
    assert.match(getErrorMessage(error), /serviço está indisponível/i);
    return true;
  });
});

test("acesso bloqueado não é apresentado como senha inválida", async () => {
  respond = (config) => {
    throw new AxiosError(
      "Request failed with status code 403",
      "ERR_BAD_REQUEST",
      config,
      undefined,
      response(config, {}, 403),
    );
  };

  await assert.rejects(getProducts(), (error) => {
    assert.match(getErrorMessage(error), /acesso.*bloqueado/i);
    assert.doesNotMatch(getErrorMessage(error), /senha/i);
    return true;
  });
});

test("falha de rede nos produtos orienta a conferir a conexão", async () => {
  respond = (config) => {
    throw new AxiosError("Network Error", "ERR_NETWORK", config);
  };

  await assert.rejects(getProducts(), (error) => {
    assert.match(getErrorMessage(error), /conexão/i);
    assert.equal(isCanceled(error), false);
    return true;
  });
});

test("timeout nos produtos é distinguido de credenciais inválidas", async () => {
  respond = (config) => {
    throw new AxiosError("timeout exceeded", "ECONNABORTED", config);
  };

  await assert.rejects(getProducts(), (error) => {
    assert.match(getErrorMessage(error), /demorou demais/i);
    assert.doesNotMatch(getErrorMessage(error), /senha/i);
    return true;
  });
});

test("cancelar uma requisição em andamento sinaliza cancelamento", async () => {
  const controller = new AbortController();
  respond = (config) =>
    new Promise((resolve, reject) => {
      config.signal.addEventListener(
        "abort",
        () => reject(new CanceledError("Request canceled", config)),
        { once: true },
      );
    });

  const pending = getProducts("", controller.signal);
  controller.abort();

  await assert.rejects(pending, (error) => {
    assert.equal(isCanceled(error), true);
    return true;
  });
});

test("requisição já cancelada não chega ao adaptador", async () => {
  const controller = new AbortController();
  controller.abort();

  await assert.rejects(getProducts("", controller.signal), (error) =>
    isCanceled(error),
  );
  assert.equal(requests.length, 0);
});

test("consulta de categorias usa o endpoint disponível na API", async () => {
  respond = (config) => response(config, ["electronics", "jewelery"]);

  assert.deepEqual(await getCategories(), ["electronics", "jewelery"]);
  assert.equal(requests[0].url, "/products/categories");
});
