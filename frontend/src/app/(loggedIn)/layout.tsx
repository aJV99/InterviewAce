"use client"
import DynamicBreadcrumb from "@/components/breadcrumb";
import Bubble from "@/components/bubble";
import ContentContainer from "@/components/contentContainer";
import Header from "@/components/header";
import NavBar from "@/components/navbar";
import { Flex, Box, Heading, Text, Grid } from "@chakra-ui/react";

export default function LayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <ContentContainer>
        <Flex 
          direction={{ base: "column", md: "row" }} 
          width="100%"
        >
          <Box 
            flex={{ base: "1", md: "3" }} 
            width={{ base: "100%", md: "75%" }} 
            pl={{ base: 4, md: 4 }} 
            pr={{ base: 4, md: 2 }} 
            py={4}
          >
            <Box bg={"#f7fafc"} p={3} mx={1} my={3} boxShadow="md" borderRadius="xl">
              <DynamicBreadcrumb />
            </Box>
            {children}
          </Box>
          <Box 
            flex={{ base: "1", md: "1" }} 
            width={{ base: "100%", md: "25%" }} 
            pl={{ base: 4, md: 2 }} 
            pr={{ base: 4, md: 4 }} 
            py={4}
          >
            <Box pb={4}>
            <Bubble>
              <Flex 
                direction="column" 
                alignItems="center" 
                justifyContent="center" 
                height="100%"
              >
                <Heading size="2xl" pb='3'>Your Stats</Heading>
                <Text fontSize="lg" as='b'>Total Mock Interviews Conducted:</Text>
                <Text fontSize="4xl" as='b' pb='4'>8</Text>
                <Text fontSize="lg" as='b'>Average Interview Score:</Text>
                <Text fontSize="4xl" as='b' pb='4'>7.5/10</Text>
                <Text fontSize="lg" as='b'>No. of Resources Used:</Text>
                <Text fontSize="4xl" as='b' pb='4'>11</Text>
                <Text fontSize="lg" as='b'>Most Popular Interview Type:</Text>
                <Text fontSize="4xl" as='b' pb='4'>Behavioural</Text>
              </Flex>
            </Bubble>
            </Box>
            <Box>
              <Bubble>
              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <Flex 
          direction="column" 
          // alignItems="center" 
          justifyContent="center" 
          height="100%"
        >
          <Text fontSize="lg" as='b'>Contact Support</Text>
          <Text fontSize="lg" as='b'>FAQs</Text>
          <Text fontSize="lg" as='b'>Terms of Service</Text>
        </Flex>
        <Flex 
          direction="column" 
          // alignItems="center" 
          justifyContent="center" 
          height="100%"
        >
          <Text fontSize="lg" as='b'>Privacy Policy</Text>
          <Text fontSize="lg" as='b'>© Abbas Alibhai 2023</Text>
        </Flex>
      </Grid>
              </Bubble>
            </Box>
          </Box>
        </Flex>
      </ContentContainer>
    </>
  );
}
