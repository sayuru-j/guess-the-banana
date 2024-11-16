import { Link } from "react-router-dom";
function Info() {
  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <div className="absolute w-full h-full">
        <div className="absolute z-40 ">
          <div>
            <img className="p-10" src="\src\assets\image\lives.png" alt="" />
          </div>
          <div className="pl-10 ">
            <img src="\src\assets\image\livelevels.png" alt="" />
          </div>
          <div className="top-3/4 relative pl-24 bottom: -614px; bottom-[-614px]">
            <Link to="/play">
              <img
                className="hover-effect max-w-full max-h-full "
                src="\src\assets\image\back.png"
                alt="Back Button"
              />
            </Link>
          </div>
        </div>
        <img
          src="\src\assets\image\infopage.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute w-full h-full flex items-center justify-center z-10 pt-52">
        <img
          className="max-w-full max-h-full object-contain"
          src="\src\assets\image\highestscorewood.png"
          alt="Info Instructions"
        />
      </div>
    </div>
  );
}

export default Info;
