import * as React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { JobState } from "@/redux/features/jobSlice";

const Cards: React.FC<{ cards: JobState }> = ({ cards }) => {
  const router = useRouter();

  const cardData = [
    {
      title: "Customer dashboard",
      description: "View a summary of all your customers over the last month.",
      route: "/path-for-card1", // Replace with your desired route
    },
    {
      title: "Customer dashboard",
      description: "View a summary of all your customers over the last month.",
      route: "/path-for-card2", // Replace with your desired route
    },
    {
      title: "Customer dashboard",
      description: "View a summary of all your customers over the last month.",
      route: "/path-for-card3", // Replace with your desired route
    },
  ];

  return (
    <SimpleGrid
      spacing={4}
      templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
    >
      {cards.jobs.map((card, index) => (
        <Card key={index} boxShadow="md" borderRadius="xl">
          <CardBody>
            <Stack spacing={2}>
              <Heading size="md">{card.title}</Heading>
              <Heading size="sm">{card.company}</Heading>
              <Text>{card.location}</Text>
            </Stack>
            <Button mt={4} onClick={() => router.push(card.title)}>
              Get Practicing
            </Button>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
};

export default Cards;
