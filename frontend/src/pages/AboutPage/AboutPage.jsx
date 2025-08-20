import React, { useRef, useEffect } from "react";
import "./AboutPage.css";
import { 
  IoFastFoodOutline, 
  IoRocketOutline, 
  IoHeartOutline, 
  IoTrophyOutline,
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoTimeOutline,
  IoEyeOutline
} from "react-icons/io5";
import { 
  PiChefHatFill, 
  PiBowlFoodFill,
  PiUsersThreeFill 
} from "react-icons/pi";
import { 
  BiSolidCategory, 
  BiTargetLock 
} from "react-icons/bi";
import { 
  FaLinkedin, 
  FaTwitter, 
  FaInstagram,
  FaGithub 
} from "react-icons/fa";

export default function AboutPage() {
  const observerRef = useRef();

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      bio: "Passionate food enthusiast with 10+ years in tech industry",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Michael Chen",
      role: "Head Chef & Culinary Director",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "Award-winning chef with expertise in global cuisines",
      linkedin: "#",
      instagram: "#"
    },
    {
      name: "Emma Rodriguez",
      role: "Lead Developer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Full-stack developer passionate about food tech innovations",
      linkedin: "#",
      github: "#"
    },
    {
      name: "David Kim",
      role: "UX/UI Designer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "Creating beautiful and intuitive food experiences",
      linkedin: "#",
      instagram: "#"
    }
  ];

  const milestones = [
    { year: "2020", event: "Foodie platform launched", icon: <IoRocketOutline /> },
    { year: "2021", event: "Reached 1K+ active users", icon: <PiUsersThreeFill /> },
    { year: "2022", event: "Introduced restaurant partnerships", icon: <PiChefHatFill /> },
    { year: "2023", event: "Launched mobile app", icon: <IoFastFoodOutline /> },
    { year: "2024", event: "10K+ food items listed", icon: <IoTrophyOutline /> }
  ];

  return (
    <div className="about-container">
      {/* Hero Section */}
      <header className="hero-section animate-on-scroll">
        <div className="hero-content">
          <h1>About Foodie</h1>
          <p>
            Where taste meets technology — explore, list, and manage a world of
            flavors at your fingertips.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Food Items</span>
            </div>
            <div className="stat">
              <span className="stat-number">5K+</span>
              <span className="stat-label">Happy Users</span>
            </div>
            <div className="stat">
              <span className="stat-number">1M+</span>
              <span className="stat-label">Monthly Visits</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mission Section */}
      <section className="section mission-section animate-on-scroll">
        <div className="section-header">
          <h2>Our Mission</h2>
          <div className="section-divider"></div>
        </div>
        <div className="mission-content">
          <div className="mission-icon">
            <BiTargetLock />
          </div>
          <p className="mission-statement">
            "To connect people through the universal language of food, empowering
            everyone to discover, share, and enjoy culinary experiences that bring
            communities together and celebrate the diversity of global cuisine."
          </p>
        </div>
        <div className="mission-cards">
          <div className="mission-card">
            <IoFastFoodOutline className="card-icon" />
            <h3>Food Discovery</h3>
            <p>Explore an ever-growing library of dishes from around the world with intelligent recommendations.</p>
          </div>
          <div className="mission-card">
            <PiChefHatFill className="card-icon" />
            <h3>Creator Platform</h3>
            <p>Empower chefs and home cooks to showcase their culinary masterpieces to a global audience.</p>
          </div>
          <div className="mission-card">
            <BiSolidCategory className="card-icon" />
            <h3>Smart Management</h3>
            <p>Effortlessly organize, categorize, and manage your food inventory with AI-powered tools.</p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="section vision-section animate-on-scroll">
        <div className="vision-content">
          <div className="vision-text">
            <div className="section-header">
              <h2>Our Vision</h2>
              <div className="section-divider"></div>
            </div>
            <div className="vision-icon">
              <IoEyeOutline />
            </div>
            <p className="vision-statement">
              To become the world's most trusted and innovative food platform, where every meal tells a story, 
              every recipe connects cultures, and every food lover finds their perfect culinary match.
            </p>
            <div className="vision-goals">
              <div className="vision-goal">
                <IoHeartOutline className="goal-icon" />
                <span>Building food communities worldwide</span>
              </div>
              <div className="vision-goal">
                <IoRocketOutline className="goal-icon" />
                <span>Innovating food technology solutions</span>
              </div>
              <div className="vision-goal">
                <IoTrophyOutline className="goal-icon" />
                <span>Celebrating culinary excellence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section story-section animate-on-scroll">
        <div className="section-header">
          <h2>Our Story</h2>
          <div className="section-divider"></div>
        </div>
        <div className="story-content">
          <div className="story-text">
            <p className="story-intro">
              Foodie was born from a simple yet powerful idea: what if we could create a digital space 
              where food lovers, chefs, and restaurants could connect, share, and celebrate the art of cooking?
            </p>
            <p>
              Founded in 2020 by a team of food enthusiasts and tech innovators, Foodie started as a small 
              project to help people discover new recipes during the pandemic. What began as a weekend 
              experiment quickly grew into a platform that thousands of people rely on daily.
            </p>
            <p>
              Today, Foodie has evolved into a comprehensive food ecosystem where culinary dreams come to life. 
              Our platform combines cutting-edge technology with the timeless joy of sharing good food, 
              creating experiences that nourish both body and soul.
            </p>
          </div>
          <div className="timeline">
            <h3>Our Journey</h3>
            {milestones.map((milestone, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-icon">{milestone.icon}</div>
                <div className="timeline-content">
                  <span className="timeline-year">{milestone.year}</span>
                  <span className="timeline-event">{milestone.event}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="section team-section animate-on-scroll">
        <div className="section-header">
          <h2>Meet Our Team</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">
            The passionate individuals behind Foodie's success
          </p>
        </div>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <div className="member-image">
                <img src={member.image} alt={member.name} />
                <div className="member-overlay">
                  <div className="social-links">
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                        <FaLinkedin />
                      </a>
                    )}
                    {member.twitter && (
                      <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                        <FaTwitter />
                      </a>
                    )}
                    {member.instagram && (
                      <a href={member.instagram} target="_blank" rel="noopener noreferrer">
                        <FaInstagram />
                      </a>
                    )}
                    {member.github && (
                      <a href={member.github} target="_blank" rel="noopener noreferrer">
                        <FaGithub />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="member-info">
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-bio">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="section achievements-section animate-on-scroll">
        <div className="section-header">
          <h2>Our Impact</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">
            Numbers that tell our story of growth and community building
          </p>
        </div>
        <div className="achievements-grid">
          <div className="achievement-card">
            <div className="achievement-icon">
              <PiBowlFoodFill />
            </div>
            <div className="achievement-number">10K+</div>
            <div className="achievement-label">Food Items Listed</div>
          </div>
          <div className="achievement-card">
            <div className="achievement-icon">
              <PiUsersThreeFill />
            </div>
            <div className="achievement-number">5K+</div>
            <div className="achievement-label">Active Foodies</div>
          </div>
          <div className="achievement-card">
            <div className="achievement-icon">
              <IoRocketOutline />
            </div>
            <div className="achievement-number">1M+</div>
            <div className="achievement-label">Monthly Searches</div>
          </div>
          <div className="achievement-card">
            <div className="achievement-icon">
              <IoTrophyOutline />
            </div>
            <div className="achievement-number">95%</div>
            <div className="achievement-label">Positive Feedback</div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="section contact-section animate-on-scroll">
        <div className="section-header">
          <h2>Get In Touch</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">
            We'd love to hear from you. Reach out to us anytime!
          </p>
        </div>
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">
                <IoLocationOutline />
              </div>
              <div className="contact-details">
                <h3>Visit Us</h3>
                <p>123 Foodie Street<br />Culinary District, FD 12345<br />United States</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <IoCallOutline />
              </div>
              <div className="contact-details">
                <h3>Call Us</h3>
                <p>+1 (555) 123-4567<br />Mon-Fri: 9AM-6PM EST</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <IoMailOutline />
              </div>
              <div className="contact-details">
                <h3>Email Us</h3>
                <p>hello@foodie.com<br />support@foodie.com</p>
              </div>
            </div>
          </div>
          <div className="contact-map">
            <div className="map-placeholder">
              <IoLocationOutline className="map-icon" />
              <h3>Find Us Here</h3>
              <p>Interactive map coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section cta-section animate-on-scroll">
        <div className="cta-content">
          <h2>Join the Foodie Community</h2>
          <p>
            Ready to embark on a culinary adventure? Join thousands of food lovers 
            who have already discovered their passion through Foodie.
          </p>
          <div className="cta-buttons">
            <button className="cta-button primary">Get Started</button>
            <button className="cta-button secondary">Learn More</button>
          </div>
        </div>
      </section>
    </div>
  );
}
