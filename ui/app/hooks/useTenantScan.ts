import { useState, useCallback } from "react";
import {
  problemsClient,
  metricsClient,
  logsClient,
} from "@dynatrace-sdk/client-classic-environment-v2";
import type { TenantCapabilities } from "../types/UserState";

export function useTenantScan(): {
  scan: () => Promise<TenantCapabilities>;
  scanning: boolean;
} {
  const [scanning, setScanning] = useState(false);

  const scan = useCallback(async (): Promise<TenantCapabilities> => {
    setScanning(true);
    try {
      const [problemsRes, metricsRes, logsRes] = await Promise.allSettled([
        problemsClient.getProblems({ pageSize: 1 }),
        metricsClient.allMetrics({ pageSize: 1, acceptType: "application/json; charset=utf-8" }),
        logsClient.getLogRecords({ limit: 1 }),
      ]);

      console.log('[scan] problems:', problemsRes);
      console.log('[scan] metrics:', metricsRes);
      console.log('[scan] logs:', logsRes);

      return {
        hasProblems: problemsRes.status === "fulfilled" && (problemsRes.value.totalCount ?? 0) > 0,
        hasLogs: logsRes.status === "fulfilled",
        hasMetrics: metricsRes.status === "fulfilled" && (metricsRes.value.totalCount ?? 0) > 0,
        hasTraces: true,
        hasSLOs: true,
        hasKubernetes: true,
        hasBizevents: true,
        scannedAt: new Date().toISOString(),
      };
    } finally {
      setScanning(false);
    }
  }, []);

  return { scan, scanning };
}