declare module 'use-sound' {
  export default function useSound(
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any,
  ): [() => void, { stop: () => void; isPlaying: boolean }];
}
