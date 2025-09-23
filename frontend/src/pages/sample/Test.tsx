import { useLocation, useParams, useSearchParams } from "react-router-dom";

const Test = () => {
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();

  // Get all query params as an object
  const query: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return (
    <div className="w-full mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Test Page</h1>
      <div className="mb-2 flex text-left">
        <span className="font-semibold min-w-[140px]">Current Path:</span>
        <code className="text-blue-600 bg-blue-50 px-1 rounded">{location.pathname}</code>
      </div>
      <div className="mb-2 flex text-left">
        <span className="font-semibold min-w-[140px]">Path Params:</span>
        <code className="text-green-700 bg-green-50 px-1 rounded">{JSON.stringify(params, null, 2)}</code>
      </div>
      <div className="flex text-left">
        <span className="font-semibold min-w-[140px]">Query Params:</span>
        <code className="text-purple-700 bg-purple-50 px-1 rounded">{JSON.stringify(query, null, 2)}</code>
      </div>
      <div className="mt-4 text-left">
        <span>
          Try changing the route after <code className="text-pink-700 bg-pink-50 px-1 rounded">/test/</code>
        </span>
      </div>
    </div>
  );
};

export default Test;
