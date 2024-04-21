import { Box } from '@chakra-ui/react';

interface ScoreIndicatorProps {
  score: number;
}

const ScoreIndicator: React.FC<ScoreIndicatorProps> = ({ score }) => {
  const pointerPosition = (score / 100) * 100; // Convert score to a percentage of the container width

  return (
    <Box position="relative" textAlign="center">
      <Box
        w="100%"
        h="20px"
        bgGradient="linear(to-r, #E53E3E, #E98445, #ECC94B, #92B55A, #38A169)"
        borderRadius="lg"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          left={`${pointerPosition}%`}
          transform="translateX(-50%)"
          width="2px"
          height="20px"
          bgColor="black"
        />
      </Box>
    </Box>
  );
};

export default ScoreIndicator;
