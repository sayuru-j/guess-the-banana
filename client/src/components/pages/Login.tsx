import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { API_PREFIX } from "../../api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login(username, pin);

      if (!response.success) {
        setError(response.message!);
      }
    } catch (err: any) {
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

  useEffect(() => {
    if (user?.token) {
      createPlayer();
      navigate("/level-select");
    }
  }, [user?.token]);

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/src/assets/image/loginpge.jpg')" }}
      />

      {/* Foreground Image */}
      <div className="relative flex flex-col items-center justify-center w-full h-full gap-4">
        <img
          className="max-w-full max-h-full object-contain"
          src="/src/assets/image/logintxt.png"
          alt="login"
        />
        <div className="relative">
          <img
            className=""
            src="/src/assets/image/highestscorewood.png"
            alt="login"
          />

          <form
            onSubmit={handleSubmit}
            className="flex flex-col absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 gap-4 w-64 font-spenbeb text-lg text-black/60"
          >
            {error && (
              <div className="text-red-500 text-sm text-center bg-white/80 rounded-lg p-2">
                {error}
              </div>
            )}

            <input
              className="w-full p-3 rounded-full bg-gray-200 focus:outline-none disabled:opacity-50"
              type="text"
              placeholder="USERNAME"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required
            />
            <input
              className="w-full p-3 rounded-full bg-gray-200 focus:outline-none disabled:opacity-50"
              type="password"
              placeholder="PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              disabled={isLoading}
              required
              minLength={4}
              maxLength={6}
              pattern="\d{4,6}"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="absolute left-1/2 transform -translate-x-1/2 bottom-[-80px] hover-effect disabled:opacity-50"
            >
              <div className="relative flex items-center justify-center">
                <img
                  className="w-32"
                  src="/src/assets/image/score.png"
                  alt="loginBtn"
                />
                <h2 className="absolute font-spenbeb text-xl text-orange-100">
                  {isLoading ? "..." : "Go"}
                </h2>
              </div>
            </button>
          </form>
        </div>
        <div className="flex gap-96 ">
          <Link to="/play">
            <img
              className="max-w-full max-h-full object-contain hover-effect "
              src="\src\assets\image\back.png"
              alt="Back Button"
            />
          </Link>{" "}
          <Link to="/signup">
            <img
              className="max-w-full flex max-h-full object-contain pt-6 hover-effect"
              src="\src\assets\image\signupbutton.png"
              alt="Back Button"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
