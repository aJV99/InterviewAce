import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Progress,
  Spacer,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useBreakpointValue,
} from '@chakra-ui/react';
import Bubble from './Bubble';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { Question } from '@/redux/dto/question.dto';
import ScoreIndicator from './ScoreIndicator';
import { getColorByScore } from '@/app/utils';

interface FeedbackCarouselProps {
  questions: Question[];
}

const FeedbackCarousel: React.FC<FeedbackCarouselProps> = ({ questions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesToShow = useBreakpointValue({ base: 1, md: 2, lg: 3 }) ?? 1;
  const progressValue = (currentIndex / (questions.length - 1)) * 100;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % questions.length);
  }, [questions.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + questions.length) % questions.length);
  }, [questions.length]);

  // Add useEffect hook to listen for keydown events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        nextSlide();
      } else if (event.key === 'ArrowLeft') {
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextSlide, prevSlide]);

  return (
    <Flex direction="column" align="center" justify="center" w="full">
      <Flex w="full" overflow="hidden" pos="relative" mb="4">
        {questions.slice(currentIndex, currentIndex + slidesToShow).map((question, index) => (
          <Bubble key={index} width="full" m={0}>
            <Flex align={'center'} mb={3}>
              <Heading w='88%' fontSize="3xl" mr={20}>
                {question.content}
              </Heading>
              <Spacer />
              <Box
                // minW="20%"
                w='12%'
                justifyContent="center"
                alignContent="center"
                justifyItems="center"
                alignItems="center"
                textAlign="center"
              >
                <Heading fontSize="lg">Your Score</Heading>
                {question.score !== null && (
                  <>
                    <Heading color={getColorByScore(question.score) || 'black'} fontSize="5xl">
                      {question.score}%
                    </Heading>
                    <ScoreIndicator score={question.score} />
                  </>
                )}
              </Box>
            </Flex>
            <Heading fontSize="lg" mb="2" fontWeight="700">
              Your Response:
            </Heading>
            <Text fontStyle="italic" mb="3" borderLeft="1px" borderLeftColor="black" fontSize="md" paddingLeft={4}>
              {question.userResponse}
            </Text>
            {/* <Grid> */}
            <Table variant="simple" mb="5">
              {/* Optional: <TableCaption>Imperial to metric conversion factors</TableCaption> */}
              <Thead>
                <Tr>
                  <Th w="50%">Strengths</Th>
                  <Th>Areas of Improvement</Th>
                </Tr>
              </Thead>
              <Tbody>
                {(() => {
                  const maxLength = Math.max(
                    question.strengths ? Object.entries(question.strengths).length : 0,
                    question.improvements ? Object.entries(question.improvements).length : 0,
                  );
                  const rows = [];
                  for (let i = 0; i < maxLength; i++) {
                    const strengthEntry = question.strengths ? Object.entries(question.strengths)[i] : null;
                    const improvementEntry = question.improvements
                      ? Object.entries(question.improvements)[i]
                      : null;
                    rows.push(
                      <Tr key={i}>
                        <Td>
                          {strengthEntry ? (
                            <div>
                              <Text mb={1} style={{ fontWeight: 'bold' }}>
                                {strengthEntry[0]}
                              </Text>
                              <Text>{strengthEntry[1]}</Text>
                            </div>
                          ) : (
                            <Text>-</Text>
                          )}
                        </Td>
                        <Td>
                          {improvementEntry ? (
                            <>
                              <Text mb={1} style={{ fontWeight: 'bold' }}>
                                {improvementEntry[0]}
                              </Text>
                              <Text>{improvementEntry[1]}</Text>
                            </>
                          ) : (
                            <Text>-</Text>
                          )}
                        </Td>
                      </Tr>,
                    );
                  }
                  return rows;
                })()}
              </Tbody>
              {/* Optional: <Tfoot>... */}
            </Table>
            <Heading fontSize="lg" mb="2" fontWeight="700">
              An example of an exemplary response:
            </Heading>

            {/* Text Content */}
            <Text fontStyle="italic" borderLeft="1px" borderLeftColor="black" fontSize="md" paddingLeft={4}>
              {question.exemplarAnswer}
            </Text>
          </Bubble>
        ))}
      </Flex>
      <Flex justify="space-between" align="center" w="full">
        <Tooltip label={<Text>{'You can also use the arrow "←" "→" keys'}</Text>}>
          <IconButton
            aria-label="Previous slide"
            icon={<FaChevronLeft />}
            onClick={prevSlide}
            borderRadius="xl"
            ml={0.5}
          />
        </Tooltip>
        <Progress value={progressValue} width="85%" borderRadius="xl" />
        <Tooltip label={<Text>{'You can also use the arrow "←" "→" keys'}</Text>}>
          <IconButton
            aria-label="Next slide"
            icon={<FaChevronRight />}
            onClick={nextSlide}
            borderRadius="xl"
            mr={0.5}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default FeedbackCarousel;
