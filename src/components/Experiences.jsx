import { motion } from "framer-motion";
import { EXPERIENCES } from "../constants";

const Experiences = () => {
  return (
    <div className="border-b border-neutral-900 pb-4">
      <motion.h1
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
        className="mb-16 mt-12 text-center text-3xl sm:mb-20 sm:mt-16 sm:text-4xl md:mb-24 md:mt-20"
      >
        Experiences
      </motion.h1>

      <div className="relative mx-auto max-w-5xl">
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-6 right-0 top-6 hidden w-44 lg:block"
        >
          <div className="absolute left-2.5 top-0 h-full w-px bg-gradient-to-b from-cyan-500/35 via-neutral-600 to-neutral-600" />
        </div>

        <div className="flex flex-col gap-16">
          {EXPERIENCES.map((experience) => (
            <div
              key={`${experience.role}-${experience.company}`}
              className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-12"
            >
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65 }}
                viewport={{ once: true }}
                className="min-w-0 flex-1 text-left"
              >
                <p className="mb-3 text-sm font-medium text-cyan-400/90 lg:hidden">
                  {experience.year}
                </p>
                <h2 className="mb-2 text-base font-semibold sm:text-lg">
                  {experience.role}
                  <span className="font-normal text-neutral-500">
                    {" "}
                    — {experience.company}
                  </span>
                </h2>
                <p className="mb-4 text-sm text-neutral-400 sm:text-base">
                  {experience.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {experience.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="rounded bg-neutral-900 px-2 py-1 text-xs font-medium text-purple-300 sm:text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              <div className="hidden w-44 shrink-0 flex-row items-start gap-0 lg:flex">
                <div className="relative flex w-5 shrink-0 justify-center pt-1">
                  <div className="relative z-10 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-cyan-400 bg-neutral-950 shadow-[0_0_14px_rgba(34,211,238,0.35)]" />
                </div>
                <p className="min-w-0 flex-1 pl-3 pt-0.5 text-right text-sm leading-snug text-neutral-400">
                  {experience.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experiences;
