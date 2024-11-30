import { Link } from "react-router-dom";

function Leaderboard() {
  return (
    <div>
      <div className="w-screen h-screen relative overflow-hidden">
        <div className="flex justify-between absolute z-20 w-full">
          {/* Container with gap between items */}
          {/* Home Icon */}
          <div className="flex justify-start  pl-20 hover-effect z-auto p-10 w-full">
            <Link to="/play">
              <img
                className="max-w-full max-h-full object-contain"
                src="\src\assets\image\homeicon.png"
                alt="Home Icon"
              />
            </Link>
          </div>
          <div>
            <div className="flex justify-center items-center gap-5 p-10">
              <img src="\src\assets\image\USERtxt.png" alt="User Text" />
              <img src="\src\assets\image\user.png" alt="User Icon" />
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="absolute z-40 hover-effect top-3/4 pt-20 left-20">
          <Link to="/play">
            <img
              className="max-w-full max-h-full object-contain"
              src="\src\assets\image\back.png"
              alt="Back Button"
            />
          </Link>
        </div>

        {/* Background Video */}
        <div className="absolute w-full h-full">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover z-0 hue-rotate-[330deg]"
            autoPlay
            muted
            loop
            playsInline
            controlsList="nodownload"
          >
            <source
              src="\src\assets\video\leaderboardpage.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* Highest Score Text */}
        <div className="absolute w-full h-full flex items-start pt-10 justify-center z-20 pb-96">
          <img
            className="max-w-full max-h-full object-contain"
            src="\src\assets\image\highestscoretit.png"
            alt="Highest Score"
          />
        </div>

        {/* Center the Highest Score Wood Image */}
        <div className="absolute inset-0 flex justify-center items-center z-30">
          <img
            className="max-w-full max-h-full object-contain"
            src="\src\assets\image\highestscorewood.png"
            alt="Highest Score Wood"
          />
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
