import * as React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  VStack,
  useBreakpointValue,
  Spacer,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { JobState } from "@/redux/features/jobSlice";
import { Interview } from "@/redux/dto/interview.dto";

const InterviewCards: React.FC<{ cards: Interview[] | undefined }> = ({ cards }) => {
  const router = useRouter();

  // Decide the height of the title based on the breakpoint
  // const titleHeight = useBreakpointValue({ base: '0em', md: '0em' }); // Adjust these values as needed for responsiveness

  return (
    <SimpleGrid
      spacing={4}
      templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
    >
      {cards?.map((card, index) => (
        <Box
          key={index}
          boxShadow="md"
          borderRadius="xl"
          p={4}
          display="flex"
          flexDirection="column"
          height="100%"
          backgroundColor={"#fff"}
        >
          <VStack spacing={2} align="stretch" flexGrow={1}>
            <Heading size="md" noOfLines={2} minHeight={"0em"}>
              {card.title}
            </Heading>
            <Heading size="sm" noOfLines={2}>
              {card.customType ? `Other - ${card.customType}` : card.type}
            </Heading>
            <Text noOfLines={1}>{card.overallScore !== null ? `Score: ${card.overallScore}` : "No attempt yet"}</Text>
          </VStack>
          <br />

          <Button
            colorScheme="blue"
            onClick={() => router.push("interview/" + card.id)}
          >
            Get Practicing
          </Button>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default InterviewCards;
