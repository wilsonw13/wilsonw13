import React from "react";
import { FaJs } from "react-icons/fa";
import { IoLogoFirebase } from "react-icons/io5";
import { SiNuxtdotjs, SiExpress } from "react-icons/si";

interface ProjectProps {
  title: string;
  description: string;
  technologies: React.JSX.Element[];
  projectLink: string;
  sourceLink: string;
  reverse: boolean;
}

function Project({
  title,
  description,
  technologies,
  projectLink,
  sourceLink,
  reverse,
}: ProjectProps) {
  return (
    <div className={`project ${reverse ? "reverse" : ""}`}>
      <div className="media-container">
        <div />
      </div>
      <div className="text-container">
        <div className="title-container">
          <p>{title}</p>
        </div>
        <div>
          <p>{description}</p>
        </div>
        <div className="tech-container">{technologies}</div>
        <div className="view-container">
          <a href={projectLink}>View Project</a>
          <a href={sourceLink}>View Source Code</a>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const projects = [
    {
      title: "uso!mania",
      description:
        "Description: Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga officia adipisci deserunt! Non ex optio ratione fugit quos sunt architecto, obcaecati ipsa, quia vel incidunt, dignissimos accusamus delectus magni maiores?",
      technologies: [
        <FaJs />,
        <SiNuxtdotjs />,
        <SiExpress />,
        <IoLogoFirebase />,
      ],
      projectLink: "#",
      sourceLink: "#",
    },
    {
      title: "uso!mania",
      description:
        "Description: Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga officia adipisci deserunt! Non ex optio ratione fugit quos sunt architecto, obcaecati ipsa, quia vel incidunt, dignissimos accusamus delectus magni maiores?",
      technologies: [
        <FaJs />,
        <SiNuxtdotjs />,
        <SiExpress />,
        <IoLogoFirebase />,
      ],
      projectLink: "#",
      sourceLink: "#",
    },
    {
      title: "uso!mania",
      description:
        "Description: Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga officia adipisci deserunt! Non ex optio ratione fugit quos sunt architecto, obcaecati ipsa, quia vel incidunt, dignissimos accusamus delectus magni maiores?",
      technologies: [
        <FaJs />,
        <SiNuxtdotjs />,
        <SiExpress />,
        <IoLogoFirebase />,
      ],
      projectLink: "#",
      sourceLink: "#",
    },
  ];

  return (
    <div id="projects-section">
      {projects.map((project, index) => (
        <Project
          key={index}
          title={project.title}
          description={project.description}
          technologies={project.technologies}
          projectLink={project.projectLink}
          sourceLink={project.sourceLink}
          reverse={index % 2 !== 0}
        />
      ))}
    </div>
  );
}
