import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Hero() {
  return (
    <div id="hero">
      <div className="hero-img-container">
        <div className="full" />
      </div>
      <div className="hero-content">
        <h1>Hello, I'm Wilson</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae,
          accusamus architecto? Provident expedita iste, reiciendis error vero
          quis qui. Sequi corporis dicta quam. Placeat qui voluptate
          consequuntur, ad obcaecati ipsum.
        </p>
        <p>Contact me at wwuchen1309@gmail.com</p>
        <div className="hero-links">
          <a href="">
            <FaGithub className="full" />
          </a>
          <a href="">
            <FaLinkedin className="full" />
          </a>
        </div>
      </div>
    </div>
  );
}
