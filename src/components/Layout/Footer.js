// src/components/Layout/Footer.js
import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>© {new Date().getFullYear()} Gestion Evenement. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;