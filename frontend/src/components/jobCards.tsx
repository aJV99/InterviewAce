import * as React from 'react';
import { Box, Heading, Text, Button, SimpleGrid, VStack } from '@chakra-ui/react';
import { JobState } from '@/redux/features/jobSlice';
import AnimatedButton from './AnimatedButton';

const JobCards: React.FC<{ cards: JobState }> = ({ cards }) => {
  return (
    <SimpleGrid spacing={4} templateColumns="repeat(auto-fill, minmax(250px, 1fr))">
      {cards.jobs.map((card, index) => {
        // If there's no card title, don't render the card
        if (!card.title) {
          return null;
        }

        return (
          <Box
            key={index}
            boxShadow="md"
            borderRadius="xl"
            p={4}
            display="flex"
            flexDirection="column"
            height="100%"
            backgroundColor={'#fff'}
          >
            <VStack spacing={2} align="stretch" flexGrow={1}>
              <Heading size="md" noOfLines={2} minHeight={'0em'}>
                {card.title}
              </Heading>
              <Heading size="sm" noOfLines={2}>
                {card.company}
              </Heading>
              <Text noOfLines={1}>{card.location}</Text>
            </VStack>
            <br />

            <Button as={AnimatedButton} colorScheme="blue" destination={'/job/' + card.id}>
              Get Practicing
            </Button>
          </Box>
        );
      })}
    </SimpleGrid>
  );
};

export default JobCards;
