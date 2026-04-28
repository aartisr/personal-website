"use client";

import { useEffect, useState } from "react";

export type DynamicMetricValue = {
  value?: string | number;
  prefix?: string;
  suffix?: string;
  label?: string;
};

export type DynamicMetricMap = Record<string, DynamicMetricValue>;

type DynamicMetricsResponse = {
  metrics?: DynamicMetricMap;
};

type IdleWindow = typeof window & {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

const DEFAULT_TIMEOUT_MS = 3500;
const metricsCache = new Map<
  string,
  { promise?: Promise<DynamicMetricMap>; value?: DynamicMetricMap }
>();

function normalizeEndpoint(endpoint?: string): string {
  const value = endpoint?.trim();
  return value || "";
}

function normalizeMetricMap(value: unknown): DynamicMetricMap {
  if (!value || typeof value !== "object") {
    return {};
  }

  const entries: Array<[string, DynamicMetricValue]> = [];

  for (const [key, metric] of Object.entries(value as Record<string, unknown>)) {
    if (!key || !metric || typeof metric !== "object") {
      continue;
    }

    const raw = metric as DynamicMetricValue;
    entries.push([
      key,
      {
        value:
          typeof raw.value === "number" || typeof raw.value === "string"
            ? raw.value
            : undefined,
        prefix: typeof raw.prefix === "string" ? raw.prefix : undefined,
        suffix: typeof raw.suffix === "string" ? raw.suffix : undefined,
        label: typeof raw.label === "string" ? raw.label : undefined,
      },
    ]);
  }

  return Object.fromEntries(entries);
}

async function fetchMetrics(endpoint: string): Promise<DynamicMetricMap> {
  const cached = metricsCache.get(endpoint);
  if (cached?.value) {
    return cached.value;
  }

  if (cached?.promise) {
    return cached.promise;
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(
    () => controller.abort(),
    DEFAULT_TIMEOUT_MS
  );

  const promise = fetch(endpoint, {
    headers: { Accept: "application/json" },
    signal: controller.signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        return {};
      }

      const payload = (await response.json()) as DynamicMetricsResponse;
      return normalizeMetricMap(payload.metrics);
    })
    .then((metrics) => {
      metricsCache.set(endpoint, { value: metrics });
      return metrics;
    })
    .catch(() => ({}))
    .finally(() => {
      window.clearTimeout(timeout);
      const current = metricsCache.get(endpoint);
      if (current?.promise && !current.value) {
        metricsCache.delete(endpoint);
      }
    });

  metricsCache.set(endpoint, { promise });
  return promise;
}

export function useDynamicMetrics(
  endpoint?: string,
  enabled = true
): DynamicMetricMap | null {
  const normalizedEndpoint = normalizeEndpoint(endpoint);
  const [metrics, setMetrics] = useState<DynamicMetricMap | null>(null);

  useEffect(() => {
    if (!enabled || !normalizedEndpoint) {
      return;
    }

    let cancelled = false;
    const idleWindow = window as IdleWindow;

    const load = () => {
      void fetchMetrics(normalizedEndpoint).then((value) => {
        if (!cancelled && Object.keys(value).length > 0) {
          setMetrics(value);
        }
      });
    };

    const handle =
      typeof idleWindow.requestIdleCallback === "function"
        ? idleWindow.requestIdleCallback(load, { timeout: 1600 })
        : window.setTimeout(load, 900);

    return () => {
      cancelled = true;
      if (typeof idleWindow.cancelIdleCallback === "function") {
        idleWindow.cancelIdleCallback(handle);
      } else {
        window.clearTimeout(handle);
      }
    };
  }, [enabled, normalizedEndpoint]);

  return metrics;
}

export function resolveDynamicMetric(
  metrics: DynamicMetricMap | null,
  metricKey?: string
): DynamicMetricValue | null {
  const key = metricKey?.trim();
  if (!key || !metrics) {
    return null;
  }

  return metrics[key] ?? null;
}
