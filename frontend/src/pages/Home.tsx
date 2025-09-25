import { useState, useEffect } from "react";
import { useManualApiResource } from "@/hooks/api";
import viteLogo from "/vite.svg";

const Home = () => {
  const { data, loading, error, fetchNow } = useManualApiResource<any>("/health");
  const [showLoading, setShowLoading] = useState<boolean>(false);

  // Delay loading indicator to prevent flicker
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => setShowLoading(true), 200);
    } else {
      setShowLoading(false);
    }
    return () => timer && clearTimeout(timer);
  }, [loading]);

  const handleHealthCheck = async () => {
    await fetchNow();
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
          {showLoading ? (
            <div className="flex items-center gap-2 p-4">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-t-2 border-gray-400 border-t-blue-500"></span>
              <span className="text-sm">Loading...</span>
            </div>
          ) : (
            <code
              className={`block whitespace-pre text-left font-mono text-base rounded bg-gray-100 p-4 ${error
                ? "text-red-600"
                : data
                  ? "text-green-700"
                  : "text-gray-400"
                }`}
            >
              {error
                ? `Error: ${error}`
                : data
                  ? JSON.stringify(data, null, 2)
                  : "Send the network request"}
            </code>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
