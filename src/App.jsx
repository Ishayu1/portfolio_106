import Hero from "./components/Hero";
import NavBar from "./components/NavBar";
import Technologies from "./components/Technologies";
import CounterGame from "./components/CounterGame"; 
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Experiences from "./components/Experiences";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

const App = () => {
  return (
    <Router>
      <MainApp />
    </Router>
  );
};

const MainApp = () => {
  return (
    <div className="overflow-x-hidden text-neutral-300 antialiased 
    selection:bg-cyan-300 selection:text-cyan-900">
      <div className="fixed top-0 -z-10 h-full w-full">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <NavBar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Experiences />
              <Projects/>
              <Technologies />
              <div className="py-8 pb-12 text-center sm:py-10 sm:pb-16">
                <Link
                  to="/CounterGame"
                  className="inline-block cursor-pointer text-2xl text-cyan-400 hover:underline sm:text-3xl md:text-4xl"
                >
                  Counter Game
                </Link>
              </div>
            </>
          } />
          <Route path="/CounterGame" element={<CounterGame />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
