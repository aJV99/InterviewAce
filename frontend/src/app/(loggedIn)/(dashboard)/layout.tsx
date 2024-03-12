'use client';
import DynamicBreadcrumb from '@/components/Breadcrumb';
import ContentContainer from '@/components/ContentContainer';
import SideNav from '@/components/SideNav';
import { Box } from '@chakra-ui/react';

export default function LayoutPage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SideNav>
        <ContentContainer>
          <Box px={4} py={1}>
            <Box bg={'#f7fafc'} p={3} mx={3} my={5} boxShadow="md" borderRadius="xl">
              <DynamicBreadcrumb />
            </Box>
            {children}
          </Box>
        </ContentContainer>
      </SideNav>
    </>
  );
}
