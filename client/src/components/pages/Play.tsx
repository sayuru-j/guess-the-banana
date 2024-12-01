import { useNavigate } from "react-router-dom";
import { AudioControls, AudioPlayer, AudioTrack } from "../AudioPlayer";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_PREFIX } from "../../api";

function PlayPage() {
  const navigate = useNavigate();
  const audioRef = useRef<AudioControls>(null);
  const [isMuted, setIsMuted] = useState(true);
  const { user } = useAuth();

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

  const createPlayer = async () => {
    try {
      const body = {
        name: user?.username,
      };

      const response = await fetch(`${API_PREFIX}/players`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      localStorage.setItem("playerCreated", JSON.stringify(true));

      console.log(await response.json());
    } catch (err) {
      console.error(err);
    }
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
        <source src="/src/assets/video/play-bg1.mp4" type="video/mp4" />
      </video>

      <div className="w-full h-full absolute flex z-10 p-10">
        <div className="w-1/2 relative">
          <div>
            <img
              className="object-cover h-[80vh]"
              src="src/assets/image/landbanana.png"
              alt=""
            />
            <div className="flex items-center gap-6 absolute bottom-0">
              <img
                className="hover-effect cursor-pointer"
                src={`src/assets/image/sound.png`}
                alt={isMuted ? "Unmute" : "Mute"}
                onClick={handleSoundClick}
              />
              <img
                className="hover-effect cursor-pointer"
                src="/src/assets/image/info.png"
                alt="Info"
                onClick={() => {
                  console.log("Button clicked!");
                  navigate("/info");
                }}
              />
              <img
                src="\src\assets\image\LeaderBoard.png"
                alt="Leader Board"
                className="hover-effect cursor-pointer"
                onClick={() => navigate("/leaderboard")}
              />
            </div>
          </div>
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
            onClick={async () => {
              if (user) {
                await createPlayer();
              }
              navigate("/login");
            }}
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
