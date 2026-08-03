"use client";

import type { OperationDefinition } from "@autodosar/adi-core/operations";
import { useEffect, useState } from "react";
import { getOperation } from "@/services/operation.service";

interface UseOperationState {
  operation: OperationDefinition | null;
  loading: boolean;
  error: string | null;
}

export function useOperation(slug: string): UseOperationState {
  const [state, setState] = useState<UseOperationState>({
    operation: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    setState({ operation: null, loading: true, error: null });

    getOperation(slug, controller.signal)
      .then((operation) => setState({ operation, loading: false, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          operation: null,
          loading: false,
          error: error instanceof Error ? error.message : "A apărut o eroare neașteptată.",
        });
      });

    return () => controller.abort();
  }, [slug]);

  return state;
}
