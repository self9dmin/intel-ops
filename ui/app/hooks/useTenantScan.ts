import { useState, useCallback } from "react";
import { queryExecutionClient } from "@dynatrace-sdk/client-query";
import type { TenantCapabilities } from "../types/UserState";

const SCAN_QUERIES: Record<keyof Omit<TenantCapabilities, "scannedAt">, string> = {
  hasProblems: `fetch events | filter event.type == "DAVIS_PROBLEM" AND davis.status == "OPEN" | limit 1 | fields timestamp`,
  hasLogs: `fetch logs | limit 1 | fields timestamp`,
  hasMetrics: `fetch metrics | limit 1 | fields timestamp`,
  hasTraces: `fetch spans | limit 1 | fields timestamp`,
  hasSLOs: `fetch events | filter event.type == "SERVICE_LEVEL_OBJECTIVE" | limit 1 | fields timestamp`,
  hasKubernetes: `fetch dt.entity.cloud_application | limit 1 | fields entity.name`,
  hasBizevents: `fetch bizevents | limit 1 | fields timestamp`,
};

export function useTenantScan(): {
  scan: () => Promise<TenantCapabilities>;
  scanning: boolean;
} {
  const [scanning, setScanning] = useState(false);

  const scan = useCallback(async (): Promise<TenantCapabilities> => {
    setScanning(true);
    try {
      const entries = Object.entries(SCAN_QUERIES) as [
        keyof Omit<TenantCapabilities, "scannedAt">,
        string
      ][];

      const results = await Promise.allSettled(
        entries.map(([, query]) =>
          queryExecutionClient.queryExecute({
            body: { query, requestTimeoutMilliseconds: 5000 },
          })
        )
      );

      const capabilities = {} as Omit<TenantCapabilities, "scannedAt">;
      entries.forEach(([key], i) => {
        const result = results[i];
        capabilities[key] =
          result.status === "fulfilled" &&
          (result.value.result?.records?.length ?? 0) > 0;
      });

      return {
        ...capabilities,
        scannedAt: new Date().toISOString(),
      };
    } finally {
      setScanning(false);
    }
  }, []);

  return { scan, scanning };
}
