import { portfolioData } from "../data";
import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/ContactSection.css";

const ContactSection = () => {
  return (
    <section className="contact-section section-container" id="contact">
      <div className="section-heading">
        <p className="section-label">{portfolioData.contact.title}</p>
        <h2>Let's Connect</h2>
      </div>
      <div className="contact-grid">
        <div className="contact-card">
          <h3>Email</h3>
          <a href={`mailto:${portfolioData.contact.email}`}>{portfolioData.contact.email}</a>
        </div>
        <div className="contact-card">
          <h3>Phone</h3>
          <a href={`tel:${portfolioData.contact.phone}`}>{portfolioData.contact.phone}</a>
        </div>
        <div className="contact-card contact-socials">
          <h3>Social</h3>
          <a href={portfolioData.contact.social.github} target="_blank" rel="noreferrer">
            Github <MdArrowOutward />
          </a>
          <a href={portfolioData.contact.social.linkedin} target="_blank" rel="noreferrer">
            Linkedin <MdArrowOutward />
          </a>
        </div>
      </div>
      <footer className="contact-footer">
        <p className="footer-text-combined">
          {portfolioData.contact.footer.text}
          <MdCopyright style={{ fontSize: "12px", verticalAlign: "middle", marginLeft: "5px" }} />
          {portfolioData.contact.footer.year}
        </p>
      </footer>
    </section>
  );
};

export default ContactSection;
