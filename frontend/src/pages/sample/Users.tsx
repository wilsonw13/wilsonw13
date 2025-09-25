import { useState, useEffect } from "react";
import { useManualApiResource } from "@/hooks/api";
import { cn } from "@/lib/utils";

interface RouteConfig {
  value: string;
  title: string;
  description: string;
  input?: {
    placeholder: string;
    type?: string;
  };
  textarea?: boolean;
  default?: string;
  buttonText?: string;
}

interface AccordionItemProps {
  route: RouteConfig;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ route, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg mb-2">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg flex justify-between items-center font-medium"
      >
        <span>{route.title}</span>
        <svg
          className={cn("w-5 h-5 transition-transform", isOpen && "rotate-180")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <ApiAccordion route={route} />
        </div>
      )}
    </div>
  );
}

function ApiAccordion({ route }: { route: RouteConfig }) {
  const { data, loading, error, fetchNow } = useManualApiResource<any>("");
  const [fieldValue, setFieldValue] = useState<string>(route.textarea ? route.default || "" : "");
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

  const onSend = () => {
    if (route.value === "health") {
      fetchNow("/health");
    } else if (route.value === "getAll") {
      fetchNow("/users");
    } else if (route.value === "getById") {
      if (fieldValue) fetchNow(`/users/${fieldValue}`);
    } else if (route.value === "create") {
      try {
        const body = JSON.parse(fieldValue);
        fetchNow("/users", { method: "POST", body });
      } catch (e) {
        console.error(e);
        alert("Invalid JSON format in the request body.");
      }
    } else if (route.value === "delete") {
      if (fieldValue) fetchNow(`/users/${fieldValue}`, { method: "DELETE" });
    }
  };

  const result = showLoading ? (
    <div className="mt-2 flex items-center gap-2">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-t-2 border-gray-400 border-t-blue-500"></span>
      <span className="text-sm">Loading...</span>
    </div>
  ) : (
    <pre className="mt-2 min-h-[5rem] w-full overflow-x-auto rounded-md bg-slate-100 dark:bg-neutral-800 p-3 text-sm">
      {error
        ? `Error: ${error}`
        : data === null || data === undefined
          ? "API Response Will Appear Here"
          : JSON.stringify(data, null, 2)}
    </pre>
  );

  return (
    <>
      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">{route.description}</p>
      {route.input && (
        <div className="mb-4 flex items-center gap-3">
          <input
            placeholder={route.input.placeholder}
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            type={route.input.type || "text"}
            className="max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && fieldValue) {
                onSend();
              }
            }}
          />
          <button
            onClick={onSend}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {route.buttonText || "Send Request"}
          </button>
        </div>
      )}
      {route.textarea && (
        <div className="mb-4 flex flex-col items-start gap-3">
          <textarea
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            className="w-full h-28 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={onSend}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {route.buttonText || "Send Request"}
          </button>
        </div>
      )}
      {!route.input && !route.textarea && (
        <button
          onClick={onSend}
          className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {route.buttonText || "Send Request"}
        </button>
      )}
      <div className="mt-4">
        <h3 className="text-sm font-semibold mb-2">Response</h3>
        {result}
      </div>
    </>
  );
}

export default function Users() {
  const [openItems, setOpenItems] = useState<string[]>(["health", "getAll"]);

  const routes: RouteConfig[] = [
    {
      value: "health",
      title: "GET /health",
      description: "Checks if the service is running and healthy.",
    },
    {
      value: "getAll",
      title: "GET /users",
      description: "Retrieves a list of all users.",
    },
    {
      value: "getById",
      title: "GET /users/:id",
      description: "Retrieves a single user by their ID.",
      input: { placeholder: "User ID (e.g., 1)", type: "number" },
    },
    {
      value: "create",
      title: "POST /users",
      description: "Creates a new user. The body must be valid JSON.",
      textarea: true,
      default: JSON.stringify({ name: "New User", age: 25, email: "new.user@example.com" }, null, 2),
    },
    {
      value: "delete",
      title: "DELETE /users/:id",
      description: "Deletes a user by their ID.",
      input: { placeholder: "User ID (e.g., 1)", type: "number" },
      buttonText: "Send Request",
    },
  ];

  const toggleItem = (value: string) => {
    setOpenItems(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="p-6 bg-white dark:bg-neutral-900 min-h-screen text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">API Test Page</h1>
        </div>

        <div className="space-y-2">
          {routes.map((route) => (
            <AccordionItem
              key={route.value}
              route={route}
              isOpen={openItems.includes(route.value)}
              onToggle={() => toggleItem(route.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
