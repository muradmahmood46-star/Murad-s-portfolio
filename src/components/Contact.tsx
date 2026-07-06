import { portfolioData } from "../data";
import "./styles/Contact.css";
import { MdCopyright } from "react-icons/md";

const Contact = () => {
  return (
    <section className="contact-section section-container" id="contact">
      <div className="contact-container">
        <div className="contact-card">
          <h3>Email</h3>
          <a href={`mailto:${portfolioData.contact.email}`}>
            {portfolioData.contact.email}
          </a>
        </div>
        <div className="contact-card">
          <h3>Phone</h3>
          <a href={`tel:${portfolioData.contact.phone}`}>
            {portfolioData.contact.phone}
          </a>
        </div>
        <div className="contact-card">
          <h3>Socials</h3>
          <div className="contact-socials">
            <a href={portfolioData.contact.social.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={portfolioData.contact.social.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div className="contact-footer">
        <p className="footer-text-combined">
          {portfolioData.contact.footer.text}
          <MdCopyright style={{ fontSize: "12px", verticalAlign: "middle", marginLeft: "5px" }} />
          {portfolioData.contact.footer.year}
        </p>
      </div>
    </section>
  );
};

export default Contact;
