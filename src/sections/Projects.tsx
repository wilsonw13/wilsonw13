import React from "react";
import { FaJs, FaReact, FaPython } from "react-icons/fa";
import { IoLogoFirebase } from "react-icons/io5";
import { SiNuxtdotjs, SiExpress, SiGooglesheets } from "react-icons/si";
import { TbScript } from "react-icons/tb";

import VisualizationImage from "../assets/project-visualization.png";
import CreditsSpreadsheetImage from "../assets/project-credits-spreadsheet.png";
import UsoImage from "../assets/project-uso.png";

interface ProjectProps {
  title: string;
  description: string;
  technologies: { icon: React.JSX.Element; name: string }[];
  projectLink?: string;
  sourceLink?: string;
  reverse: boolean;
  imgSrc?: string;
}

function Project({
  title,
  description,
  technologies,
  projectLink,
  sourceLink,
  reverse,
  imgSrc,
}: ProjectProps) {
  return (
    <div className={`project ${reverse ? "reverse" : ""}`}>
      <div className="media-container">
        {/* <div /> */}
        {imgSrc && <img src={imgSrc} alt={title} />}
      </div>
      <div className="text-container">
        <div className="title-container">
          <p>{title}</p>
        </div>
        <div>
          <p>{description}</p>
        </div>
        <div className="tech-container">
          {technologies.map((tech, i) => (
            <span key={i} className="skill-icon" data-tooltip={tech.name}>
              {tech.icon}
            </span>
          ))}
        </div>
        <div className="view-container">
          {projectLink && (
            <a href={projectLink} target="_blank">
              View Project
            </a>
          )}
          {sourceLink && (
            <a href={sourceLink} target="_blank">
              View Source Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

const projects = [
  {
    title: "Course Prerequisites Visualizer",
    description:
      "A research project providing students with a 3D force graph visualization of SBU courses and their prerequisite relationships",
    technologies: [
      { icon: <FaPython />, name: "Python" },
      { icon: <FaReact />, name: "React" },
    ],
    projectLink: undefined,
    sourceLink: "https://github.com/wilsonw13/course-prerequisites",
    imgSrc: VisualizationImage,
  },
  {
    title: "Credits Tracker Spreadsheet",
    description:
      "A spreadsheet that allows you to track courses taken at SBU and contains a complete and searchable course catalog",
    technologies: [
      { icon: <SiGooglesheets />, name: "Google Sheets" },
      { icon: <TbScript />, name: "Google App Script" },
    ],
    projectLink:
      "https://docs.google.com/spreadsheets/d/11R2h3JkJOgnFYkjlXksdVYgTTySieEq-VQQ8u4CWDAk/edit?usp=sharing",
    sourceLink: undefined,
    imgSrc: CreditsSpreadsheetImage,
  },
  {
    title: "uso!mania",
    description:
      "A full-stack web game similar to Guitar Hero with many playable levels that implements a leaderboard with a database",
    technologies: [
      { icon: <FaJs />, name: "JavaScript" },
      { icon: <SiNuxtdotjs />, name: "Nuxt.js" },
      { icon: <SiExpress />, name: "Express" },
      { icon: <IoLogoFirebase />, name: "Firebase" },
    ],
    projectLink: "https://uso-mania.netlify.app/",
    sourceLink: "https://github.com/wilsonw13/uso-mania-frontend",
    imgSrc: UsoImage,
  },
];

export default function Projects() {
  return (
    <div id="projects-section">
      {projects.map((project, i) => (
        <Project
          key={i}
          title={project.title}
          description={project.description}
          technologies={project.technologies}
          projectLink={project.projectLink}
          sourceLink={project.sourceLink}
          reverse={i % 2 !== 0}
          imgSrc={project.imgSrc}
        />
      ))}
    </div>
  );
}
