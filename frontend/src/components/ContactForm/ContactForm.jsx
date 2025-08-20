import React, { useState, useEffect } from "react";
import "./ContactForm.css";
import { FaWhatsapp, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const savedFormData = JSON.parse(localStorage.getItem("contactForm"));
    if (savedFormData) {
      setFormData(savedFormData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("contactForm", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! We will get back to you soon.");
    console.log("Form submitted:", formData);
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    localStorage.removeItem("contactForm");
  };

  return (
    <div className="contact-container">
      <div className="contact-details">
        <h3 className="subtitle">Let's Talk Food!</h3>
        <h2 className="title">We'd Love to Hear From You</h2>
        <p className="description">
          Whether you’re craving a delicious meal, planning a special event, or just want to say hi — we’re all ears!
          Reach out with any questions or feedback and let’s make your foodie dreams come true.
        </p>
        <ul className="contact-info-list">
          <li><FaMapMarkerAlt className="icon" /> <strong>Address:</strong> ABC Restaurant, Haryana</li>
          <li><FaPhoneAlt className="icon" /> <strong>Phone:</strong> +262 697 570 970</li>
          <li><FaEnvelope className="icon" /> <strong>Email:</strong> Contact@foodie.com</li>
          <li><FaClock className="icon" /> <strong>Hours:</strong> Open 08:00 AM to 10:00 PM</li>
        </ul>
        <div className="social-icons">
          <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <FaWhatsapp size={28} color="#25D366" />
          </a>
          <a href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram size={28} color="#E1306C" />
          </a>
          <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter size={28} color="#1DA1F2" />
          </a>
        </div>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <h3 className="form-title">Send Us a Message</h3>
        <input
          type="text"
          name="name"
          placeholder="Your Name "
          value={formData.name}
          onChange={handleChange}
          required
          autoComplete="name"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email Address "
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject (Optional)"
          value={formData.subject}
          onChange={handleChange}
        />
        <textarea
          name="message"
          placeholder="Your Comments or Questions "
          value={formData.message}
          onChange={handleChange}
          required
          rows="5"
        ></textarea>
        <button type="submit" className="submit-button">Send Message</button>
      </form>
    </div>
  );
};

export default ContactForm;
