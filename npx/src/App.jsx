import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header";
import AppRoutes from "./routes/routes";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;