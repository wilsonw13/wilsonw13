import {
  FaPython,
  FaJs,
  FaJava,
  FaReact,
  FaVuejs,
  FaGitAlt,
  FaDocker,
} from "react-icons/fa";
import {
  SiTypescript,
  SiCsharp,
  SiPostgresql,
  SiExpress,
  SiNuxtdotjs,
  SiPostman,
  SiMysql,
  SiMongodb,
  SiPrisma,
} from "react-icons/si";
import { RiNextjsLine, RiTailwindCssFill } from "react-icons/ri";
import { IoLogoFirebase } from "react-icons/io5";

export default function Skills() {
  const languages = [
    { icon: <FaJs />, name: "JavaScript" },
    { icon: <SiTypescript />, name: "TypeScript" },
    { icon: <FaPython />, name: "Python" },
    { icon: <FaJava />, name: "Java" },
    { icon: <SiCsharp />, name: "C#" },
  ];

  const frameworks = [
    { icon: <FaReact />, name: "React" },
    { icon: <FaVuejs />, name: "Vue.js" },
    { icon: <RiNextjsLine />, name: "Next.js" },
    { icon: <SiNuxtdotjs />, name: "Nuxt.js" },
    { icon: <SiExpress />, name: "Express" },
    { icon: <RiTailwindCssFill />, name: "Tailwind CSS" },
  ];

  const tools = [
    { icon: <FaGitAlt />, name: "Git" },
    { icon: <FaDocker />, name: "Docker" },
    { icon: <SiPostgresql />, name: "PostgreSQL" },
    { icon: <SiMysql />, name: "MySQL" },
    { icon: <SiMongodb />, name: "MongoDB" },
    { icon: <SiPrisma />, name: "Prisma" },
    { icon: <IoLogoFirebase />, name: "Firebase" },
    { icon: <SiPostman />, name: "Postman" },
  ];

  return (
    <div id="skills-section">
      <p>Languages</p>
      <div className="skills-container">
        {languages.map((s, index) => (
          <span key={index} className="skill-icon" data-tooltip={s.name}>
            {s.icon}
          </span>
        ))}
      </div>
      <p>Frameworks</p>
      <div className="skills-container">
        {frameworks.map((s, index) => (
          <span key={index} className="skill-icon" data-tooltip={s.name}>
            {s.icon}
          </span>
        ))}
      </div>
      <p>Tools</p>
      <div className="skills-container">
        {tools.map((s, index) => (
          <span key={index} className="skill-icon" data-tooltip={s.name}>
            {s.icon}
          </span>
        ))}
      </div>
    </div>
  );
}
