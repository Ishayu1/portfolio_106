import profilePic from "../assets/batman.webp"
import { motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react";
import { HERO_CONTENT } from "../constants";

const container = (delay) => ({
  hidden: { x: -40, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5, delay } },
});

const Hero = () => {
  const labs = useMemo(() => ["Problem Solver", "Builder", "Engineer"], []);

  const [labIdx, setLabIdx] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const TYPE_SPEED = 80;
  const DELETE_SPEED = 50;
  const PAUSE_AT_FULL = 900;
  const PAUSE_AT_EMPTY = 1500;

  useEffect(() => {
    const full = labs[labIdx];
    let timeout = TYPE_SPEED;

    if (!isDeleting && text === full) {
      timeout = PAUSE_AT_FULL;
    } else if (isDeleting && text === "") {
      timeout = PAUSE_AT_EMPTY;
    } else {
      timeout = isDeleting ? DELETE_SPEED : TYPE_SPEED;
    }

    const id = setTimeout(() => {
      if (!isDeleting) {
        if (text === full) {
          setIsDeleting(true);
        } else {
          setText(full.slice(0, text.length + 1));
        }
      } else {
        if (text === "") {
          setIsDeleting(false);
          setLabIdx((i) => (i + 1) % labs.length);
        } else {
          setText(full.slice(0, text.length - 1));
        }
      }
    }, timeout);

    return () => clearTimeout(id);
  }, [text, isDeleting, labIdx, labs]);

  return (
    <div className="flex min-h-screen items-center border-b border-neutral-900 pb-6 sm:pb-8 lg:pb-4">
      <div className="flex w-full flex-wrap">
        <div className="w-full lg:w-1/2">
          <div className="flex min-w-0 flex-col items-center px-4 sm:px-6 lg:items-start lg:px-10">
            <motion.h1
              variants={container(0.125)}
              initial="hidden"
              animate="visible"
              className="pb-8 text-center text-4xl font-thin tracking-tight sm:pb-12 sm:text-5xl md:text-6xl lg:mt-16 lg:pb-16 lg:text-left lg:text-7xl xl:text-8xl"
            >
              Ishayu Ghosh
            </motion.h1>

            <div className="flex w-full max-w-full flex-row flex-wrap justify-center lg:justify-start">
              <motion.span
                variants={container(0.25)}
                initial="hidden"
                animate="visible"
                className="bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-center text-lg tracking-tight text-transparent sm:text-2xl md:text-3xl lg:text-left lg:text-4xl"
              >
                I am a {text}
                <span className="animate-pulse">|</span>
              </motion.span>
            </div>

            <motion.p
              variants={container(0.5)}
              initial="hidden"
              animate="visible"
              className="my-2 max-w-full py-4 text-center text-sm font-light tracking-tighter text-neutral-300 sm:py-6 sm:text-base lg:max-w-xl lg:text-left"
            >
              {HERO_CONTENT}
            </motion.p>
          </div>
        </div>

        <div className="mt-8 w-full px-4 sm:mt-10 lg:mt-0 lg:w-1/2 lg:p-8">
          <div className="flex flex-col items-center">
            <motion.img
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              src={profilePic}
              alt="Ishayu Ghosh"
              className="h-auto w-full max-w-[240px] rounded-lg sm:max-w-xs md:max-w-sm lg:max-w-md lg:translate-x-4 xl:translate-x-10"
            />
            <motion.p
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-3 max-w-xs text-center text-sm text-neutral-200 sm:text-base lg:translate-x-4 xl:translate-x-10"
            >
              Yes this is an accurate photo of me
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
