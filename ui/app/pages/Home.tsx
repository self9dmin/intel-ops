import React from "react";
import { useNavigate } from "react-router-dom";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Surface } from "@dynatrace/strato-components/layouts";
import {
  Heading,
  Paragraph,
  Text,
} from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";
import { Chip } from "@dynatrace/strato-components-preview/content";
import {
  DataTable,
  type DataTableColumnDef,
} from "@dynatrace/strato-components-preview/tables";

type LeaderboardRow = {
  rank: string;
  player: string;
  mission: string;
  score: string;
  time: string;
};

const leaderboardColumns: DataTableColumnDef[] = [
  { accessor: "rank", header: "Rank" },
  { accessor: "player", header: "Player" },
  { accessor: "mission", header: "Mission" },
  { accessor: "score", header: "Score" },
  { accessor: "time", header: "Time" },
];

const emptyLeaderboardData: LeaderboardRow[] = [];

export const Home = () => {
  const navigate = useNavigate();
  return (
    <Flex flexDirection="column" gap={32} padding={32}>
      {/* Title Section */}
      <Flex flexDirection="column" alignItems="center" gap={8}>
        <Heading level={1}>INTEL OPS</Heading>
        <Paragraph>
          Gamified Observability Training — Learn by Doing. Compete to Win.
        </Paragraph>
      </Flex>

      {/* Stats Bar */}
      <Flex justifyContent="center" gap={48}>
        <Surface>
          <Flex
            flexDirection="column"
            alignItems="center"
            padding={16}
            gap={4}
          >
            <Heading level={3}>0</Heading>
            <Text>Missions Completed</Text>
          </Flex>
        </Surface>
        <Surface>
          <Flex
            flexDirection="column"
            alignItems="center"
            padding={16}
            gap={4}
          >
            <Heading level={3}>0</Heading>
            <Text>Points Earned</Text>
          </Flex>
        </Surface>
        <Surface>
          <Flex
            flexDirection="column"
            alignItems="center"
            padding={16}
            gap={4}
          >
            <Heading level={3}>Unranked</Heading>
            <Text>Rank</Text>
          </Flex>
        </Surface>
      </Flex>

      {/* Available Missions */}
      <Flex flexDirection="column" gap={16}>
        <Heading level={2}>Available Missions</Heading>
        <Surface>
          <Flex flexDirection="column" padding={24} gap={16}>
            <Heading level={3}>Operation: 3am Database Spike</Heading>
            <Flex gap={8}>
              <Chip color="primary" variant="emphasized">Incident Commander</Chip>
              <Chip color="success" variant="emphasized">Rookie</Chip>
            </Flex>
            <Paragraph>
              Production database is spiking. Find the root cause before the
              business wakes up.
            </Paragraph>
            <Flex>
              <Button variant="emphasized" onClick={() => navigate("/mission")}>
                Start Mission
              </Button>
            </Flex>
          </Flex>
        </Surface>
      </Flex>

      {/* Leaderboard */}
      <Flex flexDirection="column" gap={16}>
        <Heading level={2}>Leaderboard</Heading>
        {emptyLeaderboardData.length === 0 ? (
          <Surface>
            <Flex justifyContent="center" padding={32}>
              <Paragraph>No scores yet</Paragraph>
            </Flex>
          </Surface>
        ) : (
          <DataTable
            columns={leaderboardColumns}
            data={emptyLeaderboardData}
          />
        )}
      </Flex>

      {/* Footer */}
      <Flex justifyContent="center" padding={16}>
        <Text>More missions coming soon</Text>
      </Flex>
    </Flex>
  );
};
