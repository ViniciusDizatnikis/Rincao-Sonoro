import React from "react";
import { Link } from "react-router-dom"; // Adicionado
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="footer__background">
      <div className="footer__icons">
        <a href="https://www.instagram.com/vinix_dz/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Vinicius">
          <FontAwesomeIcon icon={faInstagram} className="footer__icon" />
        </a>
        <a href="https://www.linkedin.com/in/vinicius-dizatnikis/?trk=opento_sprofile_topcard" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de Vinicius">
          <FontAwesomeIcon icon={faLinkedin} className="footer__icon" />
        </a>
        <a href="https://github.com/ViniciusDizatnikis" target="_blank" rel="noopener noreferrer" aria-label="GitHub de Vinicius">
          <FontAwesomeIcon icon={faGithub} className="footer__icon" />
        </a>
      </div>

      <Link to="/password" className="footer__name">
        <strong>By</strong> <i>Vinicius Dizatnikis</i>
      </Link>
    </footer>
  );
};

export default Footer;
