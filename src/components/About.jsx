import aboutimg from "../assets/about.jpg";
import { motion } from "framer-motion";

const About = () => { 
  return (
    <div className="flex min-h-screen flex-col items-center justify-center border-b border-[var(--app-border)] px-4 pb-8 sm:px-6 sm:pb-12 lg:pb-4">
      <motion.h2 
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
        className="my-12 text-center text-3xl sm:my-16 sm:text-4xl md:my-20">
          About
          <span className="text-[var(--app-muted-2)]"> Me</span>
      </motion.h2>

      <div className="flex w-full flex-wrap">
        <div className="w-full lg:w-1/2 lg:p-8">
          <motion.div 
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center justify-center">
            <img 
              className="h-auto w-full max-w-md rounded-2xl object-cover sm:max-w-lg" src={aboutimg} alt="about">
            </img>
          </motion.div>
        </div>

        <div className="w-full min-w-0 lg:w-1/2">
          <motion.div 
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}   
            viewport={{ once: true }}
            className="flex justify-center px-2 lg:justify-start lg:px-0">
            <p className="my-2 max-w-xl py-4 text-center text-sm leading-relaxed sm:py-6 sm:text-base lg:text-left">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta omnis eaque architecto in tempore magni ut dignissimos, commodi optio iusto explicabo vero doloremque similique, sed natus perspiciatis eligendi voluptatem. Fugit.
            </p>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

export default About;
