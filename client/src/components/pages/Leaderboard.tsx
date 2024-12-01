import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_PREFIX } from "../../api";

type Player = {
  highestOverallScore: number;
  id: string;
  name: string;
};

function Leaderboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${API_PREFIX}/leaderboard`);

        if (!response.ok) {
          return;
        }

        setLeaderboard(
          (
            (await response.json()) as {
              leaderboard: Player[];
              pagination: any;
            }
          ).leaderboard
        );
      } catch (err) {
        console.error(err);
      }
    };

    void fetchLeaderboard();
  }, []);

  return (
    <div className="w-screen h-screen z-40 relative overflow-hidden">
      {/* Logout Confirmation Popup */}
      {showLogoutConfirmation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative flex items-center justify-center pointer-events-auto">
            <img
              className="justify-center"
              src="\src\assets\image\highestscorewood.png"
              alt=""
            />
            <h2 className="absolute flex flex-col items-center pb-36 font-spenbeb text-white">
              <span className="text-4xl">Do you want</span>
              <span className="text-4xl">to logout?</span>
            </h2>

            <div className="flex gap-20 absolute pt-32">
              <div
                className="cursor-pointer hover-effect"
                onClick={handleLogout}
              >
                <img src="\src\assets\image\Yes.png" alt="Yes" />
              </div>

              <div
                className="cursor-pointer hover-effect"
                onClick={() => setShowLogoutConfirmation(false)}
              >
                <img src="\src\assets\image\No.png" alt="No" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex justify-between absolute z-40 w-full p-10 pl-10">
        <img
          className="cursor-pointer hover-effect"
          src="\src\assets\image\homeicon.png"
          alt="Home Icon"
          onClick={() => navigate("/play")}
        />

        <div className="flex items-center gap-5">
          <h2 className="text-white font-spenbeb text-3xl">{user?.username}</h2>

          <div
            className="relative cursor-pointer hover-effect"
            onClick={() => setShowLogoutConfirmation(true)}
          >
            <img
              src="\src\assets\image\user.png"
              alt="User Frame"
              className=""
            />
            {user?.avatar && (
              <img
                src={user.avatar}
                alt="User Avatar"
                className="absolute inset-0 h-14 m-auto rounded-full"
              />
            )}
          </div>
        </div>
      </div>

      {/* Rest of your existing JSX */}
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
        <div className="relative flex items-center justify-center">
          <img
            src="\src\assets\image\highestscorewood.png"
            alt="Highest Score Wood"
          />

          <div className="absolute flex flex-col top-6 ">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="font-spenbeb text-3xl text-white p-2 pr-8 pt-8">
                    Player Name
                  </th>
                  <th className="font-spenbeb text-3xl text-white p-2 pt-8">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((player) => (
                  <tr key={player.id}>
                    <td className="font-spenbeb text-2xl text-white p-2">
                      {player.name}
                    </td>
                    <td className="font-spenbeb text-2xl text-white p-2">
                      {player.highestOverallScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
