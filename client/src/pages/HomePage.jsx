import "./HomePage.css";
import { Link } from "react-router-dom";
import { useState } from "react";

const HomePage = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="homepage">
      {/* Header/Navbar */}
      <header>
        <div className="logo-container">
          <div className="logo">Evento</div>
        </div>
        <nav>
          <ul className={`nav-links ${navOpen ? "open" : ""}`}>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
            <li>
              <a href="#more">More</a>
            </li>
          </ul>
          <div className="nav-right">
            <Link to="/login" className="nav-link">
              LogIn/SignUp
            </Link>
          </div>

          <button className="nav-toggle" onClick={() => setNavOpen(!navOpen)}>
            ☰
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>Welcome to Evento</h2>
          <h1>
            Crafting
            <br />
            Unforgettable
            <br />
            Moments for You
          </h1>
          <Link to="/login">
            <button className="cta-button">Explore Our Upcoming Events</button>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <h2>OUR SERVICES</h2>

        <div className="services-grid">
          <div className="service-column">
            <div className="service-image">
              <img src="/api/placeholder/400/250" alt="Corporate Events" />
            </div>
            <h3>Corporate Events</h3>
            <p>
              From product launches to corporate galas, we curate and execute
              memorable corporate events that align with your brand's vision and
              objectives.
            </p>
          </div>

          <div className="service-column">
            <div className="service-image">
              <img src="/api/placeholder/400/250" alt="Social Events" />
            </div>
            <h3>Social Events</h3>
            <p>
              Whether it's a grand wedding or an intimate birthday celebration,
              we specialize in creating unforgettable social events tailored to
              your unique style and preferences.
            </p>
          </div>

          <div className="service-column">
            <div className="service-image">
              <img src="/api/placeholder/400/250" alt="Event Production" />
            </div>
            <h3>Event Production</h3>
            <p>
              Our team of experienced professionals handles every aspect of
              event production, from conceptualization to execution, ensuring a
              seamless and remarkable experience for all attendees.
            </p>
          </div>
        </div>

        <div className="services-grid">
          <div className="service-column">
            <div className="service-image">
              <img src="/api/placeholder/400/250" alt="Catering Services" />
            </div>
            <h3>Catering Services</h3>
            <p>
              Elevate your event with our premium catering options, featuring
              exquisite cuisine and impeccable service.
            </p>
          </div>

          <div className="service-column">
            <div className="service-image">
              <img
                src="/api/placeholder/400/250"
                alt="Entertainment Services"
              />
            </div>
            <h3>Entertainment Services</h3>
            <p>
              From live music to interactive performances, we provide top-tier
              entertainment options to create memorable experiences.
            </p>
          </div>

          <div className="service-column">
            <div className="service-image">
              <img src="/api/placeholder/400/250" alt="Beverage Services" />
            </div>
            <h3>Beverage Services</h3>
            <p>
              Complement your event with our premium beverage services, offering
              delightful and refreshing drinks throughout the event.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>PLANNING YOUR NEXT EVENT?</h2>
        <div className="cta-buttons">
          <Link to="/login">
            <button className="black-button">Get Started</button>
          </Link>
          <button className="outline-button">Explore Our Portfolio</button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <h2>Welcome to Evento</h2>
        <p>
          Evento is an innovative Event Management System (EMS) designed to
          simplify the process of planning and organizing events. With Evento,
          you can effortlessly create, manage, and analyze various types of
          events such as conferences, workshops, concerts, weddings, and
          corporate meetings. Our platform offers a user-friendly interface and
          a wide range of features to ensure a seamless event management
          experience.
        </p>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <h2>GET IN TOUCH</h2>
        <div className="contact-container">
          <h3>Start Planning Your Next Event with Us</h3>

          <div className="contact-info">
            <div className="contact-item">
              <h4>Phone</h4>
              <p>123-456-7890</p>
            </div>

            <div className="contact-item">
              <h4>Address</h4>
              <p>123 Evento Ave, Eventoville, EV 12345</p>
            </div>

            <div className="contact-item">
              <h4>Email</h4>
              <p>hello@evento.com</p>
            </div>
          </div>

          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Your message"
                rows="5"
                required
              />
            </div>

            <button type="submit" className="black-button">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2025 by Q Productions. Powered and secured by Wix.</p>
      </footer>
    </div>
  );
};

export default HomePage;
