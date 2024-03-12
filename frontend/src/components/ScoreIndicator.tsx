import { Box } from '@chakra-ui/react';

interface ScoreIndicatorProps {
  score: number; // Expect a score out of 100
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
        {/* Pointer */}
        <Box
          position="absolute"
          // bottom="-10px" // Half outside the box to appear as a pointer on the bottom
          left={`${pointerPosition}%`}
          transform="translateX(-50%)" // Ensure it's centered based on the percentage
          width="2px"
          height="20px"
          bgColor="black" // Pointer color
                  // overflow="hidden"

        />
      </Box>
    </Box>
  );
};

export default ScoreIndicator;
