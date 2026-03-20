import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Paragraph } from "@dynatrace/strato-components/typography";

interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <Flex justifyContent="center" padding={24}>
      <Paragraph>{message}</Paragraph>
    </Flex>
  );
};
