import { Link } from "react-router-dom";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

const NavBar = () => {
  const socialLinks = [
    { icon: <FaLinkedin />, url: "https://www.linkedin.com/in/ishayughosh", label: "LinkedIn" },
    { icon: <FaGithub />, url: "https://github.com/Ishayu1", label: "GitHub" },
    { icon: <FaInstagram />, url: "https://www.instagram.com", label: "Instagram" },
  ];

  return (
    <nav className="mt-4 flex flex-wrap items-center justify-between gap-4 sm:mt-6 md:mt-8">
      <div className="flex min-w-0 flex-shrink-0 items-center gap-6 sm:gap-8">
        <h1 className="text-3xl font-normal tracking-tight sm:text-4xl md:text-5xl">IG</h1>
        <Link
          to="/contact"
          className="text-sm text-cyan-400 transition-colors hover:underline sm:text-base"
        >
          Contact
        </Link>
      </div>
      <div className="flex flex-shrink-0 items-center justify-center gap-3 text-xl sm:gap-4 sm:text-2xl md:m-4 lg:m-8">
        {socialLinks.map(({ icon, url, label }, index) => (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-neutral-300 transition-all duration-300 hover:scale-110 hover:text-cyan-400 hover:shadow-lg hover:shadow-white-500/50"
          >
            {icon}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
