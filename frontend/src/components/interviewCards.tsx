import * as React from "react";
import { Box, Heading, Text, SimpleGrid, VStack } from "@chakra-ui/react";
import { Interview } from "@/redux/dto/interview.dto";
import AnimatedButton from "./AnimatedButton";

const InterviewCards: React.FC<{ cards: Interview[] | undefined }> = ({ cards }) => {
  return (
    <SimpleGrid spacing={4} templateColumns="repeat(auto-fill, minmax(250px, 1fr))">
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
            <Text noOfLines={1}>
              {card.overallScore !== null ? `Score: ${card.overallScore}` : "No attempt yet"}
            </Text>
          </VStack>
          <br />

          <AnimatedButton colorScheme="blue" destination={"/interview/" + card.jobId + "/" + card.id}>
            Get Practicing
          </AnimatedButton>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default InterviewCards;
