import { Link } from "react-router-dom";
function Info() {
  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <div className="absolute w-full h-full">
        <div className="absolute z-40 hover-effect top-3/4 pt-20 left-20">
          <Link to="/play">
            <img
              className="max-w-full max-h-full object-contain"
              src="\src\assets\image\back.png"
              alt="Back Button"
            />
          </Link>
        </div>
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0 hue-rotate-[330deg]"
          autoPlay
          muted
          loop
          playsInline
          controlsList="nodownload"
        >
          <source src="\src\assets\video\jungle1.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="absolute w-full h-full flex items-center justify-center z-10 pt-52">
        <img
          className="max-w-full max-h-full object-contain"
          src="\src\assets\image\infoinstruct.png"
          alt="Info Instructions"
        />
      </div>

      <div className="absolute w-full h-full flex items-start justify-center z-20 pb-96">
        <img
          className="max-w-full max-h-full object-contain"
          src="\src\assets\image\howtoplay.png"
          alt="How to Play"
        />
      </div>
    </div>
  );
}

export default Info;
