import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Paragraph } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";

interface ErrorRetryProps {
  message: string;
  onRetry: () => void;
}

export const ErrorRetry = ({ message, onRetry }: ErrorRetryProps) => {
  return (
    <Flex flexDirection="column" gap={12} alignItems="center" padding={24}>
      <Paragraph>{message}</Paragraph>
      <Button variant="emphasized" onClick={onRetry}>
        Retry
      </Button>
    </Flex>
  );
};
