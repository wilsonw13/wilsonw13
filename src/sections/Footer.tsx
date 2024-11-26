import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="footer">
      <a
        href="https://github.com/wilsonw13"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithub />
      </a>
      <a
        href="https://linkedin.com/in/wwuchen"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaLinkedin />
      </a>
      <p>© Wilson Wuchen {new Date().getFullYear()}</p>
    </footer>
  );
}
