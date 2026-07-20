import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Text } from "@dynatrace/strato-components/typography";
import { ProgressCircle } from "@dynatrace/strato-components/content";
import { Switch } from "@dynatrace/strato-components-preview/forms";
import { Tooltip } from "@dynatrace/strato-components-preview/overlays";
import { useUserStateContext } from "../context/UserStateContext";
import { useTenantScan } from "../hooks/useTenantScan";

export const DataModeToggle = () => {
  const { userState, setDataMode, saveTenantCapabilities } = useUserStateContext();
  const { scan, scanning } = useTenantScan();

  if (!userState) return null;

  const isLive = userState.dataMode === "live";

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      const caps = await scan();
      await saveTenantCapabilities(caps);
      await setDataMode("live");
    } else {
      await setDataMode("playground");
    }
  };

  return (
    <Flex alignItems="center" gap={8}>
      {scanning && <ProgressCircle size="small" />}
      {scanning && (
        <Text textStyle="small">Scanning your tenant...</Text>
      )}
      <Tooltip text="Switch to your tenant's live data">
        <Flex alignItems="center" gap={4}>
          <Switch
            value={isLive}
            onChange={(checked) => { void handleToggle(checked); }}
            disabled={scanning}
          >
            {isLive ? "Live Mode" : "Playground"}
          </Switch>
        </Flex>
      </Tooltip>
    </Flex>
  );
};
