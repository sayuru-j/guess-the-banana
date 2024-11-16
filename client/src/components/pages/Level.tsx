import { Link } from "react-router-dom";
function LevelSelect() {
  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <div className="absolute w-full h-full">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0 hue-rotate-[330deg]"
          autoPlay
          muted
          loop
          playsInline
          controlsList="nodownload"
        >
          <source src="\src\assets\video\jungle12_1.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="absolute  w-full h-full pt-40 items-start justify-items-center">
        <img
          className="max-w-full max-h-full object-contain"
          src="\src\assets\image\gamemode.png"
          alt="How to Play"
        />
      </div>
      <div className="absolute w-full h-full justify-center pt-96 gap-9  justify-items-center">
        <img
          className="max-w-full max-h-full pb-5 object-contain hover-effect"
          src="\src\assets\image\beginner.png"
          alt="Info Instructions"
        />
        <img
          className="max-w-full max-h-full pb-5 object-contain hover-effect"
          src="\src\assets\image\inter.png"
          alt="Info Instructions"
        />
        <img
          className="max-w-full max-h-full object-contain hover-effect"
          src="\src\assets\image\advance.png"
          alt="Info Instructions"
        />
      </div>
      <div className="absolute z-40 hover-effect top-3/4 pt-20 left-20">
        <Link to="/play">
          <img
            className="max-w-full max-h-full object-contain"
            src="\src\assets\image\back.png"
            alt="Back Button"
          />
        </Link>
      </div>
    </div>
  );
}

export default LevelSelect;
