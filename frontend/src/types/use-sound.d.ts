declare module 'use-sound' {
  export default function useSound(
    path: string,
    options?: any,
  ): [() => void, { stop: () => void; isPlaying: boolean }];
}
