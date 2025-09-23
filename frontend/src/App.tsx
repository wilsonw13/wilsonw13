import { useRoutes } from "react-router-dom";
import routes from "./routes";
import Navbar from "./components/Navbar";

function App() {
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

