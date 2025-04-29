import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const Layout = () => {
  return (
    <>
      <div className="wrapper">
        <Header />
        <div className="containerLayout">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
