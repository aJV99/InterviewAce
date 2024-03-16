import React, { useState, useEffect, useCallback } from 'react';
import {
  Flex,
  IconButton,
  Link,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  Progress,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import Bubble from './Bubble';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

interface TipsCarouselProps {
  items: { title: string; description: string }[];
}

const TipsCarousel: React.FC<TipsCarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesToShow = useBreakpointValue({ base: 1, md: 2, lg: 3 }) ?? 1;
  const progressValue = (currentIndex / (items.length - 1)) * 100;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  }, [items.length]);

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
        {items.slice(currentIndex, currentIndex + slidesToShow).map((item, index) => (
          <Bubble key={index} width="full" m={0} bg="#284265" height="40">
            <Text fontWeight="bold" fontSize="xl">
              {currentIndex + 1 + '. ' + item.title}
            </Text>
            {currentIndex == 4 ? (
              <>
                <Text mt="2">
                  {item.description}
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <Link onClick={onOpen} textDecoration="underline">
                    here
                  </Link>
                </Text>
              </>
            ) : (
              <Text mt="2">{item.description}</Text>
            )}
          </Bubble>
        ))}
      </Flex>
      <Flex justify="space-between" align="center" w="full">
        <IconButton
          aria-label="Previous slide"
          icon={<FaChevronLeft />}
          onClick={prevSlide}
          borderRadius="xl"
          ml={0.5}
        />
        <Progress value={progressValue} width="80%" borderRadius="xl" />
        <IconButton
          aria-label="Next slide"
          icon={<FaChevronRight />}
          onClick={nextSlide}
          borderRadius="xl"
          mr={0.5}
        />
      </Flex>
      <Modal onClose={onClose} isOpen={isOpen} scrollBehavior={'inside'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Possible Post-interview Questions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <OrderedList>
              <ListItem mb={2}>
                <Text>
                  {
                    "If I'm selected for this role, a year from now, how would you guys know you made the right decision?"
                  }
                </Text>
              </ListItem>
              <ListItem mb={2}>
                <Text>{'How do you see this company and team evolving over the next five years?'}</Text>
              </ListItem>
              <ListItem mb={2}>
                <Text>{'What qualities make for successful employees at {company}?'}</Text>
              </ListItem>
              <ListItem mb={2}>
                <Text>
                  {
                    "Do you have any concerns or reasons you wouldn't hire me right now? Perhaps I can clear some of those up."
                  }
                </Text>
              </ListItem>
              <ListItem>
                <Text>{'What are the next steps for the application/when can i hear from you?'}</Text>
              </ListItem>
            </OrderedList>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default TipsCarousel;
