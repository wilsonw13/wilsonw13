import { useRoutes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import routes from "@/routes";
import Navbar from "@/components/Navbar";

function useMatomo() {
  const location = useLocation();

  useEffect(() => {
    if (!window._paq) {
      window._paq = [];
    }
    const _paq = window._paq;
    _paq.push(["enableLinkTracking"]);
    _paq.push(["setTrackerUrl", "//analytics.willcontact.me/matomo.php"]);
    _paq.push(["setSiteId", "1"]);

    // Only inject script once
    if (!document.getElementById("matomo-script")) {
      const g = document.createElement("script");
      g.async = true;
      g.src = "//analytics.willcontact.me/matomo.js";
      g.id = "matomo-script";
      const s = document.getElementsByTagName("script")[0];
      if (s && s.parentNode) {
        s.parentNode.insertBefore(g, s);
      } else {
        document.head.appendChild(g);
      }
    }
    // Track initial page view
    _paq.push(["trackPageView"]);
  }, []);

  useEffect(() => {
    if (window._paq) {
      window._paq.push(["setCustomUrl", window.location.pathname + window.location.search]);
      window._paq.push(["trackPageView"]);
    }
  }, [location]);
}

function App() {
  useMatomo();
  const element = useRoutes(routes);
  return (
    <div className="min-h-screen w-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 flex justify-center items-center p-8">
        <div className="w-full max-w-2xl">{element}</div>
      </main>
    </div>
  );
}

export default App;
