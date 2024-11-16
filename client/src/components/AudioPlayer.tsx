import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

export enum AudioTrack {
  MAIN_THEME = "main-theme",
}

const AUDIO_SOURCES: Record<AudioTrack, string> = {
  [AudioTrack.MAIN_THEME]: "src/assets/audio/play-bg.mp3",
};

interface AudioPlayerProps {
  autoPlay?: boolean;
  initialTrack?: AudioTrack;
  initialVolume?: number;
  onError?: (error: Error) => void;
  onTrackEnd?: () => void;
}

export interface AudioControls {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setTrack: (track: AudioTrack) => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unmute: () => void;
  toggleMute: () => void;
  getCurrentTrack: () => AudioTrack;
  isPlaying: () => boolean;
  getVolume: () => number;
  isMuted: () => boolean;
}

export const AudioPlayer = forwardRef<AudioControls, AudioPlayerProps>(
  (
    {
      autoPlay = false,
      initialTrack = AudioTrack.MAIN_THEME,
      initialVolume = 1,
      onError,
      onTrackEnd,
    },
    ref
  ) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentTrack, setCurrentTrack] = useState<AudioTrack>(initialTrack);
    const [isPlaying, setIsPlaying] = useState(false); // Start not playing
    const [volume, setVolume] = useState(initialVolume);
    const [isMuted, setIsMuted] = useState(true); // Start muted
    const [hasInteracted, setHasInteracted] = useState(false);

    // Initialize audio element
    useEffect(() => {
      const audio = new Audio(AUDIO_SOURCES[currentTrack]);
      audio.volume = volume;
      audio.muted = true; // Always start muted
      audioRef.current = audio;

      return () => {
        audio.pause();
        audio.src = "";
      };
    }, []);

    // Listen for first interaction
    useEffect(() => {
      const handleInteraction = () => {
        setHasInteracted(true);
        if (autoPlay) {
          setIsPlaying(true);
          setIsMuted(false);
        }
        // Remove listeners after first interaction
        window.removeEventListener("click", handleInteraction);
        window.removeEventListener("touchstart", handleInteraction);
      };

      window.addEventListener("click", handleInteraction);
      window.addEventListener("touchstart", handleInteraction);

      return () => {
        window.removeEventListener("click", handleInteraction);
        window.removeEventListener("touchstart", handleInteraction);
      };
    }, [autoPlay]);

    // Handle play state
    useEffect(() => {
      if (!audioRef.current || !hasInteracted) return;

      if (isPlaying && !isMuted) {
        audioRef.current.play().catch((error) => {
          console.warn("Playback failed:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }, [isPlaying, isMuted, hasInteracted]);

    // Handle mute state
    useEffect(() => {
      if (!audioRef.current) return;
      audioRef.current.muted = isMuted;
    }, [isMuted]);

    // Handle volume
    useEffect(() => {
      if (!audioRef.current) return;
      audioRef.current.volume = volume;
    }, [volume]);

    // Handle track changes
    useEffect(() => {
      if (!audioRef.current) return;
      audioRef.current.src = AUDIO_SOURCES[currentTrack];
      if (isPlaying && !isMuted && hasInteracted) {
        audioRef.current.play().catch((error) => {
          onError?.(error);
        });
      }
    }, [currentTrack]);

    // Set up event listeners
    useEffect(() => {
      const audio = audioRef.current;
      if (audio) {
        const handleEnded = () => {
          onTrackEnd?.();
        };

        const handleError = (e: ErrorEvent) => {
          onError?.(new Error(`Audio playback error: ${e.message}`));
        };

        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("error", handleError);

        return () => {
          audio.removeEventListener("ended", handleEnded);
          audio.removeEventListener("error", handleError);
        };
      }
    }, [onTrackEnd, onError]);

    const toggleAudio = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
      setIsMuted((prev) => !prev);
      setIsPlaying(true);
    };

    useImperativeHandle(ref, () => ({
      play: () => {
        if (hasInteracted) {
          setIsPlaying(true);
          setIsMuted(false);
        }
      },
      pause: () => {
        setIsPlaying(false);
      },
      toggle: toggleAudio,
      setTrack: (track: AudioTrack) => setCurrentTrack(track),
      setVolume: (newVolume: number) =>
        setVolume(Math.max(0, Math.min(1, newVolume))),
      mute: () => setIsMuted(true),
      unmute: () => setIsMuted(false),
      toggleMute: () => setIsMuted((prev) => !prev),
      getCurrentTrack: () => currentTrack,
      isPlaying: () => isPlaying,
      getVolume: () => volume,
      isMuted: () => isMuted,
    }));

    return null;
  }
);
