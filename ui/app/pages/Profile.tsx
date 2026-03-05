import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Surface } from "@dynatrace/strato-components/layouts";
import { Heading, Text } from "@dynatrace/strato-components/typography";

export const Profile = () => {
  return (
    <Flex flexDirection="column" gap={32} padding={32}>
      <Text textStyle="base-emphasized">// PLAYER PROFILE</Text>
      <Surface>
        <Flex flexDirection="column" padding={48} gap={16} alignItems="center">
          <Heading level={2}>CLASSIFICATION: PENDING</Heading>
          <Text>
            Your operator dossier is being compiled. Profile functionality will
            be available in a future update.
          </Text>
        </Flex>
      </Surface>
    </Flex>
  );
};
