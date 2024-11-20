import { Link } from "react-router-dom";
function Info() {
  return (
    <div className="w-screen h-screen relative overflow-hidden">
       
      <div className="absolute w-full h-full">
        <div className="">
          <div className="relative display flex justify-between">
            <div className="absolute pl-36 pt-20">
              <img
                className=""
                src="\src\assets\image\lives.png"
                alt="Lives"
              />
              
              <img className="pt-4" src="\src\assets\image\livelevels.png" alt="" />
         
            </div>
            <div className="absolute top-0 right-0 p-20">
              <img src="" alt="" />
              <img
                className=""
                src="\src\assets\image\score.png"
                alt="Score"
              />
            </div>
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
      <img
          src="\src\assets\image\infopage.jpg"
          alt="Background"
          className= " w-full h-full object-cover"
        />

      <div className="absolute w-full h-full flex items-center justify-center z-10 pt-52">
        <img
          className="max-w-full max-h-full object-contain pb-[300px]"
          src="\src\assets\image\highestscorewood.png"
          alt="Info Instructions"
        />
      </div>
      {/* <div className="flex absolute flex items-center justify-center space-x-10">
        <img src="\src\assets\image\9.png" alt="" />

      </div> */}
    </div>
  );
}

export default Info;