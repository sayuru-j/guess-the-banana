import { useNavigate } from "react-router-dom";
import { AudioControls, AudioPlayer, AudioTrack } from "../AudioPlayer";
import { useEffect, useRef, useState } from "react";

function PlayPage() {
  const navigate = useNavigate();
  const audioRef = useRef<AudioControls>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      audioRef.current?.play();
      setIsMuted(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSoundClick = () => {
    audioRef.current?.toggle();
    setIsMuted((prev) => !prev);
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0 hue-rotate-[330deg]"
        autoPlay
        muted
        loop
        playsInline
        controlsList="nodownload"
      >
        <source src="/src/assets/video/play-bg.mp4" type="video/mp4" />
      </video>

      <div className="w-full h-full absolute flex z-10 p-10">
        <div className="w-1/2 relative">
          <img
            className="object-cover h-[80vh]"
            src="src/assets/image/landbanana.png"
            alt=""
          />
          <img
            className="object-cover absolute bottom-0 hover-effect cursor-pointer"
            src={`src/assets/image/sound.png`}
            alt={isMuted ? "Unmute" : "Mute"}
            onClick={handleSoundClick}
          />
          <img
            className="object-cover absolute left-24 pt-8 hover-effect"
            src="/src/assets/image/info.png"
            alt="Info"
            onClick={() => {
              console.log("Button clicked!");
              navigate("/info");
            }}
          />
        </div>
        <div className="w-1/2 relative">
          <img
            className="object-cover absolute right-0 h-[80vh]"
            src="src/assets/image/guesstheban.png"
            alt=""
          />

          <img
            className="object-cover absolute bottom-0 right-0 hover-effect cursor-pointer"
            src="src/assets/image/play.png"
            alt=""
            onClick={() => navigate("/login")}
          />
        </div>
      </div>

      <AudioPlayer
        ref={audioRef}
        autoPlay={true}
        initialTrack={AudioTrack.MAIN_THEME}
      />
    </div>
  );
}

export default PlayPage;
