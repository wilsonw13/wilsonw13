import "./styles/App.css";

import Row from "./components/Row";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Coursework from "./sections/Coursework";
import Awards from "./sections/Awards";

function App() {
  return (
    <>
      <div id="content" className="center">
        <Row sticky>
          <Navbar />
        </Row>

        <Row id="home">
          <Hero />
        </Row>

        <Row id="skills">
          <div className="section-title-container">
            <div>
              <p className="section-title">Skills</p>
            </div>
            <div>
              <p>
                {/* Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis,
                dolorum reprehenderit labore minima est beatae reiciendis
                ratione quidem eaque libero provident itaque nihil temporibus
                aliquam repudiandae rerum sequi qui fugiat. */}
              </p>
            </div>
          </div>

          <Skills />
          <div />
        </Row>

        <Row id="projects">
          <div className="section-title-container">
            <div>
              <p className="section-title">Projects</p>
            </div>
            <div>
              <p>
                {/* Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis,
                dolorum reprehenderit labore minima est beatae reiciendis
                ratione quidem eaque libero provident itaque nihil temporibus
                aliquam repudiandae rerum sequi qui fugiat. */}
              </p>
            </div>
          </div>

          <Projects />
          <div />
        </Row>

        <Row id="coursework">
          <div className="section-title-container">
            <div>
              <p className="section-title">Coursework</p>
            </div>
            <div>
              <p>
                {/* Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis,
                dolorum reprehenderit labore minima est beatae reiciendis
                ratione quidem eaque libero provident itaque nihil temporibus
                aliquam repudiandae rerum sequi qui fugiat. */}
              </p>
            </div>
          </div>

          <Coursework />
          <div />
        </Row>

        <Row id="awards">
          <div className="section-title-container">
            <div>
              <p className="section-title">Awards</p>
            </div>
            <div>
              <p>
                {/* Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis,
                dolorum reprehenderit labore minima est beatae reiciendis
                ratione quidem eaque libero provident itaque nihil temporibus
                aliquam repudiandae rerum sequi qui fugiat. */}
              </p>
            </div>
          </div>

          <Awards />
          <div />
        </Row>
      </div>
    </>
  );
}

export default App;
