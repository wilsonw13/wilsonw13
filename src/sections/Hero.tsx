import { FaFileAlt, FaGithub, FaLinkedin } from "react-icons/fa";
import Photo from "../assets/me.jpg";

export default function Hero() {
  return (
    <div id="hero">
      <div className="hero-img-container">
        <img src={Photo} alt="Photo" className="full" />
      </div>
      <div className="hero-content">
        <h1>Hello, I'm Wilson</h1>
        <p>
          ... a junior at Stony Brook University studying computer science. I
          have a passion for building innovative software that optimizes aspects
          of our lives and give us more space to breathe. In my free time, you
          can find me playing badminton, or planning my next hike!
        </p>
        <p>
          Feel free to reach out to me at <b>wwuchen1309@gmail.com</b>
        </p>
        <div className="hero-links">
          <span className="skill-icon" data-tooltip="GitHub">
            <a
              href="https://github.com/wilsonw13"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="full" />
            </a>
          </span>
          <span className="skill-icon" data-tooltip="LinkedIn">
            <a
              href="https://linkedin.com/in/wwuchen"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="full" />
            </a>
          </span>
          <span className="skill-icon" data-tooltip="Resume">
            <a
              href="https://drive.google.com/file/d/1qv1_SMy87W76K70mtNTWnkFHUktVeYtZ/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFileAlt className="full" />
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
