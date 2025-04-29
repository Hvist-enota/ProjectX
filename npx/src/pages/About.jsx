import { useEffect, useState } from 'react';
import { getAboutImages } from '../services/aboutService';
import apiClient from "../api/axiosConfig";

export default function About() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    getAboutImages().then(setImages);
  }, []);

  return (
    <div className="about-section container py-4">
      <h2 className="display-6">Про нас</h2>
      <p className="text-muted">Церква - місце, де люди можуть знайти спокій, силу, натхнення, допомогу, спілкування, радість, мир і багато іншого.</p>
      <div className="row">
        {images.map(img => (
          <div key={img.id} className="col-12 col-sm-4 col-md-3 mb-3">
            <div className="card">
              <img src={apiClient.defaults.baseURL + "images/aboutUsImages/" + img?.filePath} className="card-img-top img-fluid" alt={img.name} />
              <div className="card-body text-center">
                <p className="card-text">{img.name}</p>
                <p className="card-text">{img.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

