import { useState, useCallback } from "react";
import { queryExecutionClient } from "@dynatrace-sdk/client-query";
import type { TenantCapabilities } from "../types/UserState";

const SCAN_QUERIES: Record<keyof Omit<TenantCapabilities, "scannedAt">, string> = {
  hasProblems: `fetch events | filter event.type == "DAVIS_PROBLEM" AND davis.status == "OPEN" | limit 1 | fields timestamp`,
  hasLogs: `fetch logs | limit 1 | fields timestamp`,
  hasMetrics: `timeseries avg(dt.host.cpu.usage), by:{dt.entity.host} | limit 1`,
  hasTraces: `fetch spans | limit 1 | fields timestamp`,
  hasSLOs: `fetch events | filter event.type == "SERVICE_LEVEL_OBJECTIVE" | limit 1 | fields timestamp`,
  hasKubernetes: `fetch dt.entity.cloud_application | limit 1 | fields entity.name`,
  hasBizevents: `fetch bizevents | limit 1 | fields timestamp`,
};

type CapabilityKey = keyof Omit<TenantCapabilities, "scannedAt">;

async function runScanQuery(query: string): Promise<boolean> {
  try {
    const result = await queryExecutionClient.queryExecute({
      body: { query, requestTimeoutMilliseconds: 10000 },
    });
    const records = result.result?.records;
    return Array.isArray(records) && records.length > 0;
  } catch {
    return false;
  }
}

export function useTenantScan(): {
  scan: () => Promise<TenantCapabilities>;
  scanning: boolean;
} {
  const [scanning, setScanning] = useState(false);

  const scan = useCallback(async (): Promise<TenantCapabilities> => {
    setScanning(true);
    try {
      const keys = Object.keys(SCAN_QUERIES) as CapabilityKey[];
      const results = await Promise.all(
        keys.map((key) => runScanQuery(SCAN_QUERIES[key]))
      );

      const caps: TenantCapabilities = {
        hasProblems: false,
        hasLogs: false,
        hasMetrics: false,
        hasTraces: false,
        hasSLOs: false,
        hasKubernetes: false,
        hasBizevents: false,
        scannedAt: new Date().toISOString(),
      };

      keys.forEach((key, i) => {
        caps[key] = results[i];
      });

      return caps;
    } finally {
      setScanning(false);
    }
  }, []);

  return { scan, scanning };
}
