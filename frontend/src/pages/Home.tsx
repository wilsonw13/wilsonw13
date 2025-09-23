import { useState } from "react";
import { healthCheck } from "../api";
import viteLogo from "/vite.svg";

const Home = () => {
  const [healthResult, setHealthResult] = useState<string | null>("");

  const handleHealthCheck = async () => {
    try {
      setHealthResult(JSON.stringify(await healthCheck(), null, 2));
    } catch (err) {
      setHealthResult(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex gap-4 mb-6 justify-center">
        <a href="#" className="group">
          <img
            src={viteLogo}
            className="h-24 transition-filter duration-300 group-hover:drop-shadow-[0_0_2em_#646cffaa]"
            alt="Vite logo"
          />
        </a>
      </div>
      <h1 className="text-3xl font-bold mb-4 text-center">Vite + React</h1>
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-lg flex flex-col gap-4 mx-auto">
        <div className="flex justify-center">
          <button
            onClick={handleHealthCheck}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition"
          >
            Click To Ping The Backend
          </button>
        </div>
        <div className="min-h-[48px]">
          <code
            className={`block whitespace-pre text-left font-mono text-base rounded bg-gray-100 p-4 ${
              healthResult ? (healthResult.startsWith("Error") ? "text-red-600" : "text-green-700") : "text-gray-400"
            }`}
          >
            {healthResult || "Send the network request"}
          </code>
        </div>
      </div>
    </div>
  );
};

export default Home;
