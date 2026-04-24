import { useLayoutEffect } from "react";
import Hero from "./components/Hero";
import NavBar from "./components/NavBar";
import { smoothScrollToElement } from "./utils/smoothScroll";
import Technologies from "./components/Technologies";
import CounterGame from "./components/CounterGame";
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import Experiences from "./components/Experiences";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import LatestProjects from "./components/LatestProjects";
import GitHubStats from "./components/GitHubStats";

const HomeScrollToSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollToId = location.state?.scrollTo;

  useLayoutEffect(() => {
    if (!scrollToId || location.pathname !== "/") {
      return;
    }

    const el = document.getElementById(scrollToId);
    if (el) {
      requestAnimationFrame(() => smoothScrollToElement(el));
    }

    navigate({ pathname: location.pathname, search: location.search }, { replace: true, state: {} });
  }, [location.pathname, location.search, navigate, scrollToId]);

  return null;
};

const App = () => {
  return (
    <Router>
      <MainApp />
    </Router>
  );
};

const MainApp = () => {
  return (
    <div
      className="overflow-x-clip text-[var(--app-fg)] antialiased selection:bg-cyan-300 selection:text-cyan-900"
    >
      <div className="fixed top-0 -z-10 h-full w-full">
        <div className="app-bg-layer absolute top-0 z-[-2] h-screen w-screen" />
      </div>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HomeScrollToSection />
        <NavBar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <GitHubStats />
              <Experiences />
              <LatestProjects />
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
