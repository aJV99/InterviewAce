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
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const Cards: React.FC = () => {
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
      {cardData.map((card, index) => (
        <Card key={index} boxShadow="md" borderRadius="xl">
          <CardHeader>
            <Heading size="md">{card.title}</Heading>
          </CardHeader>
          <CardBody>
            <Text>{card.description}</Text>
          </CardBody>
          <CardFooter>
            <Button onClick={() => router.push(card.route)}>View here</Button>
          </CardFooter>
        </Card>
      ))}
    </SimpleGrid>
  );
};

export default Cards;
