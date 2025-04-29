// src/routes/AppRoutes.jsx
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../components/admin/AdminDashboard"; // Новий імпорт
import AdminEvents from "../components/admin/AdminEvents"; // Новий імпорт
import AdminNews from "../components/admin/AdminNews"; // Новий імпорт
import Layout from "../components/layout/Layout";
import PrivateRoute from "../components/PrivateRoute"; // Сторінка без прав доступу
import About from "../pages/About";
import AdminPanel from "../pages/AdminPanel"; // Новий імпорт
import Contact from "../pages/Contact";
import Donate from "../pages/Donate";
import EventsPage from "../pages/EventsPage";
import Home from "../pages/Home";
import NewsDetails from "../pages/NewsDetails";
import NewsPage from "../pages/NewsPage";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Unauthorized from "../pages/Unauthorized"; // Сторінка без прав доступу

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/newspage" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetails />} />
        <Route path="/donate" element={<Donate />} />
        
        {/* Адмін-панель */}
        <Route 
          path="admin" 
          element={
            <PrivateRoute allowedRoles={["Administrator"]}>
              <AdminPanel />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="events" element={<AdminEvents />} />
        </Route>
                <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        {/* Сторінка без прав доступу */}
        <Route path="unauthorized" element={<Unauthorized />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;