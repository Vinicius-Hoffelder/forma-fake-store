import assert from "node:assert/strict";
import { test } from "node:test";
import { formatPrice } from "../src/utils/currency.js";

function normalizeSpaces(value) {
  return value.replace(/\u00a0|\u202f/g, " ");
}

test("preços usam reais, vírgula decimal e duas casas decimais", () => {
  assert.equal(normalizeSpaces(formatPrice(199.9)), "R$ 199,90");
  assert.equal(normalizeSpaces(formatPrice(0)), "R$ 0,00");
});

test("preços altos usam o separador de milhares brasileiro", () => {
  assert.equal(normalizeSpaces(formatPrice(12345.67)), "R$ 12.345,67");
});
