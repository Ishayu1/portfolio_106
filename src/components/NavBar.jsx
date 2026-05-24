import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaLinkedin, FaGithub, FaInstagram, FaBars, FaTimes, FaMoon, FaSun, FaLaptop } from "react-icons/fa";
import { smoothScrollToElement, smoothScrollToTop } from "../utils/smoothScroll";

const SECTION_LINKS = [
  { id: "experiences", label: "Experiences" },
  { id: "projects", label: "Projects" },
  { id: "technologies", label: "Technologies" },
];

const SOCIAL_LINKS = [
  { icon: <FaLinkedin />, url: "https://www.linkedin.com/in/ishayughosh", label: "LinkedIn" },
  { icon: <FaGithub />, url: "https://github.com/Ishayu1", label: "GitHub" },
  { icon: <FaInstagram />, url: "https://www.instagram.com", label: "Instagram" },
];

const desktopLinkClass =
  "text-sm text-cyan-400 transition-colors hover:underline sm:text-base whitespace-nowrap";

const mobileLinkClass =
  "block w-full px-1 py-3.5 text-left text-base text-[var(--app-fg)] antialiased transition-colors duration-200 hover:bg-cyan-500/[0.07] hover:text-cyan-400 sm:px-0";

const SCROLL_IDLE_MS = 220;

const THEME_STORAGE_KEY = "portfolio_theme";

const getOsTheme = () =>
  window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";

const getInitialThemePref = () => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "auto" || stored === "light" || stored === "dark") {
    return stored;
  }
  return "auto";
};

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navBarHidden, setNavBarHidden] = useState(false);
  const [themePref, setThemePref] = useState(() => getInitialThemePref());
  const navRef = useRef(null);
  const scrollIdleTimerRef = useRef(null);
  const isContactPage = location.pathname === "/contact";

  const effectiveTheme = useMemo(() => (themePref === "auto" ? getOsTheme() : themePref), [themePref]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themePref);
  }, [themePref]);

  useEffect(() => {
    const apply = (next) => {
      document.documentElement.dataset.theme = next;
    };

    if (themePref === "auto") {
      apply(getOsTheme());
      const media = window.matchMedia?.("(prefers-color-scheme: light)");
      if (!media) {
        return;
      }
      const onChange = () => apply(getOsTheme());
      if (typeof media.addEventListener === "function") {
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
      }
      media.addListener(onChange);
      return () => media.removeListener(onChange);
    }

    apply(themePref);
    return;
  }, [themePref]);

  useEffect(() => {
    setMenuOpen(false);
    setNavBarHidden(false);
  }, [location.pathname]);

  useEffect(() => {
    if (menuOpen) {
      setNavBarHidden(false);
    }
  }, [menuOpen]);

  useEffect(() => {
    const clearIdleTimer = () => {
      if (scrollIdleTimerRef.current != null) {
        clearTimeout(scrollIdleTimerRef.current);
        scrollIdleTimerRef.current = null;
      }
    };

    const onScroll = () => {
      if (menuOpen) {
        return;
      }

      if (window.scrollY < 8) {
        setNavBarHidden(false);
        clearIdleTimer();
        return;
      }

      setNavBarHidden(true);
      clearIdleTimer();
      scrollIdleTimerRef.current = setTimeout(() => {
        setNavBarHidden(false);
        scrollIdleTimerRef.current = null;
      }, SCROLL_IDLE_MS);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearIdleTimer();
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const onPointerDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen]);

  const handleSectionClick = (event, id) => {
    event.preventDefault();
    setMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      return;
    }
    requestAnimationFrame(() => smoothScrollToElement(document.getElementById(id)));
  };

  const handleBrandClick = (event) => {
    event.preventDefault();
    setMenuOpen(false);
    const leavingHome = location.pathname !== "/";
    if (leavingHome) {
      navigate("/");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => smoothScrollToTop());
      });
    } else {
      smoothScrollToTop();
    }
  };

  const hideWhileScrolling = navBarHidden && !menuOpen;

  const routeLinkClass = (active) =>
    `${desktopLinkClass} ${active ? "underline underline-offset-4 text-cyan-300" : ""}`;

  const isHomeRoute = location.pathname === "/";
  const isGameRoute = location.pathname === "/CounterGame";
  const isMetaRoute = location.pathname === "/meta";

  return (
    <nav
      ref={navRef}
      className={`z-50 mt-4 transition-[transform,opacity] duration-300 ease-out sm:mt-6 md:mt-8 ${
        hideWhileScrolling
          ? "pointer-events-none -translate-y-full opacity-0"
          : "translate-y-0 opacity-100"
      }`}
      aria-label="Main"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-6 md:flex-initial md:gap-8">
          <Link
            to="/"
            className="text-3xl font-normal tracking-tight sm:text-4xl md:text-5xl"
            onClick={handleBrandClick}
          >
            IG
          </Link>
          {!isContactPage ? (
            <div className="hidden flex-wrap items-center gap-x-4 gap-y-2 md:flex md:gap-x-6 lg:gap-x-8">
              <Link to="/" className={routeLinkClass(isHomeRoute)} aria-current={isHomeRoute ? "page" : undefined}>
                Home
              </Link>
              {SECTION_LINKS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={desktopLinkClass}
                  onClick={(e) => handleSectionClick(e, id)}
                >
                  {label}
                </a>
              ))}
              <Link
                to="/CounterGame"
                className={routeLinkClass(isGameRoute)}
                aria-current={isGameRoute ? "page" : undefined}
              >
                Counter Game
              </Link>
              <Link
                to="/meta"
                className={routeLinkClass(isMetaRoute)}
                aria-current={isMetaRoute ? "page" : undefined}
              >
                Meta
              </Link>
              <Link to="/contact" className={desktopLinkClass}>
                Contact
              </Link>
            </div>
          ) : (
            <div className="hidden flex-wrap items-center gap-x-4 gap-y-2 md:flex md:gap-x-6 lg:gap-x-8">
              <Link to="/" className={routeLinkClass(isHomeRoute)} aria-current={isHomeRoute ? "page" : undefined}>
                Home
              </Link>
              <Link
                to="/contact"
                className={routeLinkClass(isContactPage)}
                aria-current={isContactPage ? "page" : undefined}
              >
                Contact
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          <div
            className={`items-center justify-center gap-3 text-xl sm:gap-4 sm:text-2xl md:m-4 lg:m-8 ${
              isContactPage ? "flex" : "hidden md:flex"
            }`}
          >
            {SOCIAL_LINKS.map(({ icon, url, label }, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-[var(--app-fg)] transition-all duration-300 hover:scale-110 hover:text-cyan-400 hover:shadow-lg hover:shadow-white-500/50"
              >
                {icon}
              </a>
            ))}
          </div>

          <label className="flex items-center gap-2 rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] px-2 py-1 text-sm text-[var(--app-fg)]">
            <span className="sr-only">Theme</span>
            <span aria-hidden className="text-base">
              {themePref === "auto" ? <FaLaptop /> : effectiveTheme === "light" ? <FaSun /> : <FaMoon />}
            </span>
            <select
              className="cursor-pointer bg-transparent text-sm text-[var(--app-fg)] outline-none"
              value={themePref}
              onChange={(e) => setThemePref(e.target.value)}
              aria-label="Theme"
            >
              <option value="auto">Auto</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>

          {!isContactPage ? (
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2.5 text-[var(--app-fg)] transition-colors hover:bg-[var(--app-surface-2)] hover:text-cyan-400 md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <FaTimes className="text-2xl" aria-hidden /> : <FaBars className="text-2xl" aria-hidden />}
            </button>
          ) : null}
        </div>
      </div>

      {menuOpen && !isContactPage ? (
        <div
          id="mobile-nav-menu"
          className="md:hidden mt-4 w-full border-t border-[var(--app-border)] pt-3"
        >
          <div className="relative overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] backdrop-blur-sm">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-40%,rgba(120,119,198,0.18),transparent_55%)]"
              aria-hidden
            />
            <div className="relative">
              <ul className="divide-y divide-[var(--app-border)] px-3 sm:px-4">
                <li>
                  <Link
                    to="/"
                    className={mobileLinkClass}
                    aria-current={isHomeRoute ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                {SECTION_LINKS.map(({ id, label }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className={mobileLinkClass}
                      onClick={(e) => handleSectionClick(e, id)}
                    >
                      {label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link
                    to="/CounterGame"
                    className={mobileLinkClass}
                    aria-current={isGameRoute ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    Counter Game
                  </Link>
                </li>
                <li>
                  <Link
                    to="/meta"
                    className={mobileLinkClass}
                    aria-current={isMetaRoute ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    Meta
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className={mobileLinkClass}
                    aria-current={isContactPage ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
              <div className="flex justify-center gap-8 border-t border-[var(--app-border)] px-4 py-4 text-xl">
                {SOCIAL_LINKS.map(({ icon, url, label }, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-[var(--app-fg)] transition-all duration-300 hover:scale-110 hover:text-cyan-400 hover:shadow-lg hover:shadow-white-500/50"
                    onClick={() => setMenuOpen(false)}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default NavBar;
