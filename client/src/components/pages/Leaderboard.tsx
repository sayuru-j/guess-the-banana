import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Leaderboard() {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const randomSeed = Math.random().toString(36).substring(7);
    const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
    setAvatarUrl(url);
  }, []);

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Header Section */}
      <div className="flex justify-between absolute z-40 w-full p-10 pl-4">
        <img
          className="cursor-pointer hover-effect"
          src="\src\assets\image\homeicon.png"
          alt="Home Icon"
          onClick={() => navigate("/play")}
        />

        <div className="flex items-center gap-5">
          <img src="\src\assets\image\USERtxt.png" alt="User Text" />

          <div className="relative">
            <img
              src="\src\assets\image\user.png"
              alt="User Frame"
              className=""
            />
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt="User Avatar"
                className="absolute inset-0 h-14 m-auto rounded-full"
              />
            )}
          </div>
        </div>
      </div>

      {/* Rest of your component remains the same */}
      <div className="absolute z-40 left-20 top-3/4">
        <img
          className="cursor-pointer hover-effect"
          src="\src\assets\image\back.png"
          alt="Back Button"
          onClick={() => navigate("/play")}
        />
      </div>

      <video
        className="absolute inset-0 w-full h-full object-cover z-0 hue-rotate-[330deg]"
        autoPlay
        muted
        loop
        playsInline
        controlsList="nodownload"
      >
        <source src="\src\assets\video\leaderboardpage.mp4" type="video/mp4" />
      </video>

      <div className="absolute w-full pt-10 flex justify-center z-20">
        <img src="\src\assets\image\highestscoretit.png" alt="Highest Score" />
      </div>

      <div className="absolute inset-0 flex justify-center items-center z-30">
        <img
          src="\src\assets\image\highestscorewood.png"
          alt="Highest Score Wood"
        />
      </div>
    </div>
  );
}

export default Leaderboard;
