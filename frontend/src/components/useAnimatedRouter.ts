'use client';
import { useRouter } from 'next/navigation';

// Defined a type for the extended router to include the animatedRoute function
type ExtendedRouter = ReturnType<typeof useRouter> & {
  animatedRoute: (url: string) => void;
};

export default function useAnimatedRouter(): ExtendedRouter {
  const router = useRouter();

  // Implemented the animatedRoute function
  const animatedRoute = (url: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extendedDocument = document as any; // Assume startViewTransition is part of this "any" type
    if (extendedDocument?.startViewTransition) {
      extendedDocument.startViewTransition(() => {
        router.push(url);
      });
    } else {
      // Fallback to standard navigation if startViewTransition is not supported
      router.push(url);
    }
  };

  // Return the original router object with the added animatedRoute method
  return {
    ...router,
    animatedRoute,
  };
}
