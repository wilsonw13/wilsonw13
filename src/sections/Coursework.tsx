import { FaWifi, FaExternalLinkAlt } from "react-icons/fa";
import { MdOutlineScience } from "react-icons/md";
import { SiCyberdefenders } from "react-icons/si";

const courseworkItems = [
  {
    icon: <FaWifi />,
    title: "Technical Instructions: Connecting to WiFi",
    link: "https://drive.google.com/file/d/1ErJi46-zC8C-5c5jBnDsMCHdTI2kcKY7/view?usp=sharing",
  },
  {
    icon: <MdOutlineScience />,
    title: "Press Release: 2024 SASE National Convention",
    link: "https://drive.google.com/file/d/17gPht35e3-SSmuBWxtK83W5LUBLfAn_T/view?usp=sharing",
  },
  {
    icon: <SiCyberdefenders />,
    title: "Literature Review: Cybersecurity Training",
    link: "https://drive.google.com/file/d/1Ka18-cH09QCXUWPO-twGIZUeuqX6_rbP/view?usp=sharing",
  },
  // Add more items as needed
];

export default function Coursework() {
  return (
    <div id="coursework-section">
      {courseworkItems.map((item, index) => (
        <div key={index} className="item">
          <div className="icon">{item.icon}</div>
          <div className="title">{item.title}</div>
          <a href={item.link} className="link" target="_blank">
            <FaExternalLinkAlt />
          </a>
        </div>
      ))}
    </div>
  );
}
