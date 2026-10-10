import { useCallback, useEffect, useState } from "react";
import { getErrorMessage, isCanceled } from "../services/api";
import { showError } from "../utils/alerts";

// Carregamento e nova tentativa
export function useApiResource(load) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setData(null);
    setError(null);
    setLoading(true);

    Promise.resolve()
      .then(() => load(controller.signal))
      .then((result) => {
        if (active) {
          setData(result);
        }
      })
      .catch((reason) => {
        if (active && !isCanceled(reason)) {
          const message = getErrorMessage(reason);
          setError(message);
          showError(message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    // Cancela a busca anterior
    return () => {
      active = false;
      controller.abort();
    };
  }, [load, attempt]);

  return { data, loading, error, retry };
}
