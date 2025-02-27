import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Contact from "../pages/Contact";
import Donate from "../pages/Donate";
import NewsPage from "../pages/NewsPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/newspage" element={<NewsPage/>}/>
      <Route path="/donate" element={<Donate />} />
    </Routes>
  );
};

export default AppRoutes;