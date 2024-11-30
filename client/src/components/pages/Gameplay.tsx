import { Link } from "react-router-dom";
import { GameplayConfig } from "../../@types";
import { FC, useEffect, useState } from "react";

type GameplayProps = {
  config: GameplayConfig;
};

type Question = {
  url: string;
  solution: number;
};

const Gameplay: FC<GameplayProps> = ({ config }) => {
  const [lives, setLives] = useState(config.lives);
  const [score, setScore] = useState(config.initialScore);
  const [question, setQuestion] = useState<Question>();
  const [isLoading, setIsLoading] = useState(false);
  const [isGameover, setIsGameover] = useState(false);

  const fetchQuestion = async () => {
    try {
      const response = await fetch("https://marcconrad.com/uob/banana/api.php");

      if (response.ok) {
        const data = await response.json();
        setQuestion({
          url: data.question,
          solution: data.solution,
        });
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.error("Error fetching question:", err);
    }
  };

  const checkTheAnswer = async (answer: number) => {
    if (answer === question?.solution) {
      setScore((prev) => prev + config.reward.score);
      setIsLoading(true);
      await fetchQuestion();
    } else {
      setLives((prev) => prev - 1);

      if (score === 0) {
        alert("Wrong answer!");
        return;
      }

      alert("Wrong answer!");
      setScore((prev) => prev - config.reward.score);
    }
  };

  useEffect(() => {
    void fetchQuestion();
  }, []);

  useEffect(() => {
    if (lives === 0) {
      setIsGameover(true);
    }
  }, [lives]);

  console.log(question);
  console.log(score);

  return (
    <>
      {isGameover && (
        <div className="w-screen absolute z-40 h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative flex items-center justify-center">
            <img
              className="justify-center"
              src="\src\assets\image\highestscorewood.png"
              alt=""
            />
            <h2 className="absolute flex flex-col items-center font-spenbeb text-white">
              <span className="text-6xl">Game Over</span>
              <span>Udith ponnappu</span>
            </h2>
          </div>
        </div>
      )}
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

                <div className="flex gap-1">
                  {Array(lives)
                    .fill(0)
                    .map((data, index) => (
                      <img
                        key={index}
                        className="pt-4"
                        src="\src\assets\image\livelevels.png"
                        alt=""
                      />
                    ))}
                </div>
              </div>
              <div className="absolute top-0 right-0 p-20">
                <div className="relative flex items-center justify-center">
                  <img
                    className=""
                    src="\src\assets\image\score.png"
                    alt="Score"
                  />
                  <h2 className="absolute font-spenbeb text-2xl text-white inline-flex items-center">
                    Score <span className="ml-2 text-4xl">{score}</span>
                  </h2>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center">
              <div className="flex relative items-center justify-center">
                <img
                  className="justify-center"
                  src="\src\assets\image\highestscorewood.png"
                  alt=""
                />
                <div className="absolute p-14">
                  {isLoading ? (
                    <div className="loader loader--style1" title="0">
                      <svg
                        version="1.1"
                        id="loader-1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="40px"
                        height="40px"
                        viewBox="0 0 40 40"
                        enable-background="new 0 0 40 40"
                      >
                        <path
                          opacity="0.2"
                          fill="#000"
                          d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                   s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                   c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
                        />
                        <path
                          fill="#000"
                          d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                   C22.32,8.481,24.301,9.057,26.013,10.047z"
                        >
                          <animateTransform
                            attributeType="xml"
                            attributeName="transform"
                            type="rotate"
                            from="0 20 20"
                            to="360 20 20"
                            dur="0.5s"
                            repeatCount="indefinite"
                          />
                        </path>
                      </svg>
                    </div>
                  ) : (
                    <img
                      className="rounded-3xl"
                      src={question?.url}
                      alt="question"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="absolute z-40 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center space-x-4 mt-72">
              {[...Array(10).keys()].map((num) => {
                return (
                  <div
                    onClick={() => {
                      checkTheAnswer(num);
                    }}
                    className="hover:scale-125 transition-all duration-300 ease-in-out"
                    key={num}
                  >
                    <div className="relative">
                      <img src="\src\assets\image\gameplaybutton.png" alt="" />
                      <div className="absolute inset-0 flex items-center justify-center text-white font-spenbeb text-2xl mb-1">
                        {num}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="absolute bottom-0 pb-10 left-[80rem]">
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
    </>
  );
};

export default Gameplay;
