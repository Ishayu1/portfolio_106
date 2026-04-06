import { PROJECTS } from "../constants";
import { motion } from "framer-motion";

const Projects = () => {
    return (
        <div id="projects" className="scroll-mt-24 border-b border-neutral-900 pb-4 sm:scroll-mt-28">
            <motion.h1 
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -100 }}
                transition={{ duration: 1.5 }}
                viewport={{ once: true }}
                className="my-12 text-center text-3xl sm:my-16 sm:text-4xl md:my-20"
            >
                Projects
            </motion.h1>
            <div>
                {PROJECTS.map((project, index) => (
                    <div
                        key={index}
                        className="mb-10 flex flex-col flex-wrap items-center gap-6 sm:mb-12 lg:flex-row lg:items-start lg:justify-center lg:gap-8"
                    >
                        <motion.div
                            whileInView={{ opacity: 1, x: 0 }}
                            initial={{ opacity: 0, x: -100 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }} 
                            className="flex w-full justify-center lg:w-1/4 lg:justify-start"
                        >
                            <img 
                                src={project.image}
                                width={175}
                                height={175}
                                alt={project.title}
                                className="mb-2 h-auto w-full max-w-[140px] rounded object-cover sm:max-w-[160px] lg:mb-0 lg:max-w-[175px]"
                            />
                        </motion.div>
                        <motion.div 
                            whileInView={{ opacity: 1, x: 0 }}
                            initial={{ opacity: 0, x: 24 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }} 
                            className="w-full min-w-0 max-w-xl mx-auto lg:mx-0 lg:w-3/4 lg:pl-4"
                        >
                            <h6 className="mb-2 text-center text-base font-semibold sm:text-lg lg:text-left">{project.title}</h6>
                            <p className="mb-4 text-center text-sm text-neutral-400 sm:text-base lg:text-left">{project.description}</p>
                            <div className="mb-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                                {project.technologies.map((tech, index) => (
                                    <span key={index} className="rounded bg-neutral-900 px-2 py-1 text-xs font-medium sm:text-sm">{tech}</span>
                                ))}
                            </div>
                            {project.link && (
                                <motion.a
                                    whileInView={{ opacity: 1, y: 0 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-center text-sm text-blue-500 hover:underline sm:text-base lg:text-left"
                                >
                                    View Project
                                </motion.a>
                            )}
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projects;
