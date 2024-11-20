import { Link } from "react-router-dom";
function Info() {
  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <div className="absolute w-full h-full">
        <div className="">
          <div className="relative display flex justify-between">
            <div className="absolute pl-36 pt-20">
              <img className="" src="\src\assets\image\lives.png" alt="Lives" />

              <img
                className="pt-4"
                src="\src\assets\image\livelevels.png"
                alt=""
              />
            </div>
            <div className="absolute top-0 right-0 p-20">
              <img src="" alt="" />
              <img className="" src="\src\assets\image\score.png" alt="Score" />
            </div>
            
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center">
            <img className="justify-center " src="\src\assets\image\highestscorewood.png" alt="" />
          </div>
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center mt-80 gap-10  ">
            {[...Array(10).keys()].map((num) => (
              <div
                key={num}
                className=""
              >
                <img src="\src\assets\image\9.png" alt="" />
                <div className=" h-full flex items-center justify-center">
                  {num}
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 pb-10 left-[90rem]">
            <img src="\src\assets\image\submit.png" alt="" />
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
      </div>
      <video
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        controlsList="nodownload"
      >
        <source src="\src\assets\video\jungle.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

export default Info;
