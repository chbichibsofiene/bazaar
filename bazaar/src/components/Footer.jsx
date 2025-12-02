import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Send } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        // Handle newsletter subscription
        console.log('Newsletter subscription:', email);
        setEmail('');
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div className="footer-section brand-section">
                        <h3 className="footer-brand">Bazaar</h3>
                        <p className="footer-description">
                            Your one-stop marketplace for quality products.
                            Shop with confidence and enjoy amazing deals every day.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link" aria-label="Facebook">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="social-link" aria-label="Twitter">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="social-link" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="social-link" aria-label="LinkedIn">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4 className="footer-title">Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/products">Shop</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="footer-section">
                        <h4 className="footer-title">Customer Service</h4>
                        <ul className="footer-links">
                            <li><Link to="/help">Help Center</Link></li>
                            <li><Link to="/shipping">Shipping Info</Link></li>
                            <li><Link to="/returns">Returns</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="footer-section newsletter-section">
                        <h4 className="footer-title">Stay Updated</h4>
                        <p className="newsletter-description">
                            Subscribe to get special offers and updates
                        </p>
                        <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                            <div className="newsletter-input-wrapper">
                                <Mail className="newsletter-icon" size={18} />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="newsletter-input"
                                    required
                                />
                            </div>
                            <button type="submit" className="newsletter-btn">
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <p className="copyright">
                        © {new Date().getFullYear()} Bazaar. All rights reserved.
                    </p>
                    <div className="footer-bottom-links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <span className="separator">•</span>
                        <Link to="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
