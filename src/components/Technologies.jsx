import { RiReactjsLine } from "react-icons/ri"
import { FaJava, FaPython } from "react-icons/fa";
import { FaDatabase } from "react-icons/fa";
import { DiJavascript1 } from "react-icons/di";
import {motion} from "framer-motion"

const iconVariants = (duration) => ({
    inital: {y:-10},
    animate: {
      y: [10, -10],
      transition: {
        duration: duration,
        ease: "linear",
        repeat: Infinity,
        repeatType: "mirror"
      }
    }
  })

const Technologies = () => {
    const techIcons = [
        { icon: <RiReactjsLine className="text-5xl sm:text-6xl md:text-7xl" />, label: "React" ,duration:1.25},
        { icon: <FaPython className="text-5xl text-green-500 sm:text-6xl md:text-7xl" />, label: "Python" ,duration:1.5},
        { icon: <FaDatabase className="text-5xl text-red-700 sm:text-6xl md:text-7xl" />, label: "Database" ,duration:3},
        { icon: <DiJavascript1 className="text-5xl text-sky-700 sm:text-6xl md:text-7xl" />, label: "JavaScript" ,duration:2},
        { icon: <FaJava className="text-5xl text-sky-700 sm:text-6xl md:text-7xl" />, label: "Java" ,duration:1.75},
      ];
  return (
    <div className="border-b border-neutral-800 pb-12 sm:pb-16 md:pb-24">
        <motion.h1 
            whileInView={{opacity:1,y:0}}
            initial={{opacity:0,y:-100}}
            transition={{duration:1.5}}
            viewport={{ once: true }}
            className="my-12 text-center text-3xl sm:my-16 sm:text-4xl md:my-20">Technologies</motion.h1>
        <motion.div 
            whileInView={{opacity:1, x: 0}} 
            initial={{opacity:0,x:-100}}
            transition={{duration:1.5}}
            className="flex flex-wrap items-center justify-center gap-3 px-2 sm:gap-4 sm:px-0">
        {techIcons.map((tech, index) => (
          <motion.div 
            variants={iconVariants(tech.duration)}
            initial="initial"
            animate="animate"
            key={index} className="rounded-xl border-2 border-neutral-800 p-3 sm:rounded-2xl sm:border-4 sm:p-4">
            {tech.icon}
          </motion.div>
        ))}
        </motion.div>
    </div>
  )
}

export default Technologies