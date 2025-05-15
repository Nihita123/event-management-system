import "./HomePage.css";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  Award,
  MapPin,
  Mail,
  Phone,
  Menu,
} from "lucide-react";
import { useState } from "react";

const HomePage = () => {
  const [navOpen, setNavOpen] = useState(false);

  const upcomingEvents = [
    { title: "Startup Expo", date: "2025-05-20", location: "Hyderabad" },
    {
      title: "Tech Talk: Future of AI",
      date: "2025-06-05",
      location: "Bangalore",
    },
    { title: "Networking Night", date: "2025-06-12", location: "Mumbai" },
  ];

  const testimonials = [
    {
      name: "Aarav Patel",
      feedback:
        "This platform revolutionized how we manage our college events. Incredibly intuitive!",
    },
    {
      name: "Diya Sharma",
      feedback:
        "Seamless event organization. The user experience is top-notch and makes planning a breeze.",
    },
    {
      name: "Kabir Singh",
      feedback:
        "A game-changer for student groups and clubs. Highly recommend for event management!",
    },
  ];

  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">EventManager</div>
        <button className="nav-toggle" onClick={() => setNavOpen(!navOpen)}>
          <Menu size={24} />
        </button>
        <ul className={`nav-links ${navOpen ? "open" : ""}`}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup" className="highlighted">
              Sign Up
            </Link>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <h1>Let's Make Your Event Memorable!</h1>
        <p>
          Simplify event planning, boost engagement, and create unforgettable
          experiences.
        </p>
        <div className="hero-buttons">
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
          <Link to="/signup">
            <button className="signup-btn">Sign Up Free!</button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        <div>
          <p className="stat-number">10,000+</p>
          <p>Events Hosted</p>
        </div>
        <div>
          <p className="stat-number">50,000+</p>
          <p>Happy Users</p>
        </div>
        <div>
          <p className="stat-number">98%</p>
          <p>Satisfaction Rate</p>
        </div>
      </section>

      {/* About */}
      <section className="about-section">
        <h2>About Us</h2>
        <p>
          We are a dedicated team passionate about simplifying event management
          for organizations, clubs, and individuals. Our platform streamlines
          the entire event lifecycle from planning to execution.
        </p>
        <img src="/event-about.jpg" alt="About Event Management" />
      </section>

      {/* Features */}
      <section className="features-section">
        <h2>Our Features</h2>
        <div className="features-grid">
          <div className="feature">
            <Calendar size={32} />
            <h3>Event Scheduling</h3>
            <p>
              Effortlessly create and manage event timelines with our intuitive
              scheduling tools.
            </p>
          </div>
          <div className="feature">
            <Users size={32} />
            <h3>Attendee Management</h3>
            <p>
              Track RSVPs, send notifications, and engage with your attendees
              seamlessly.
            </p>
          </div>
          <div className="feature">
            <Award size={32} />
            <h3>Club Recognition</h3>
            <p>
              Showcase your events and gain visibility within your community.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="events-section">
        <h2>Upcoming Events</h2>
        <ul className="events-list">
          {upcomingEvents.map((event, index) => (
            <li key={index}>
              <MapPin size={18} /> <strong>{event.title}</strong> - {event.date}{" "}
              ({event.location})
            </li>
          ))}
        </ul>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonials">
          {testimonials.map((t, index) => (
            <blockquote key={index} className="testimonial">
              <p>"{t.feedback}"</p>
              <footer>- {t.name}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to Elevate Your Event Management?</h2>
        <p>
          Join thousands of satisfied users and transform how you plan events!
        </p>
        <Link to="/signup">
          <button className="cta-btn">Get Started Now</button>
        </Link>
      </section>

      {/* Contact */}
      <section className="contact-section">
        <h2>Contact Us</h2>
        <p>
          <Mail size={18} /> support@eventmanager.com
        </p>
        <p>
          <Phone size={18} /> +91 98765 43210
        </p>
      </section>
    </div>
  );
};

export default HomePage;
