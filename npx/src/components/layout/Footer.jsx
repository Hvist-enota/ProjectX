import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-3">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">Our Church</h5>
            <p>Join us for worship every Sunday at 10:00 AM</p>
          </div>
          
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/about" className="text-white text-decoration-none">About Us</Link></li>
              <li><Link to="/events" className="text-white text-decoration-none">Events</Link></li>
              <li><Link to="/contact" className="text-white text-decoration-none">Contact</Link></li>
              <li><Link to="/donate" className="text-white text-decoration-none">Donate</Link></li>
            </ul>
          </div>
          
          <div className="col-md-4">
            <h5 className="fw-bold">Follow Us</h5>
            <div className="d-flex gap-3">
              <a href="#" className="text-white h4"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-white h4"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-white h4"><i className="bi bi-youtube"></i></a>
            </div>
          </div>
        </div>
        
        <hr className="text-white my-3" />
        
        <div className="text-center">
          <p className="mb-0">&copy; 2025 Our Church. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;