import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useProjects } from "../hooks/useProjects";
import ProjectsYearPie from "./ProjectsYearPie";

const Projects = () => {
    const { projects, count, loading, error } = useProjects();
    const [query, setQuery] = useState("");
    const [selectedYear, setSelectedYear] = useState(null);

    const queryFilteredProjects = useMemo(() => {
        const q = query.trim().toLowerCase();

        return projects
            .filter((p) => {
                if (!q) {
                    return true;
                }

                const blob = [
                    p.title,
                    p.description,
                    p.link,
                    p.year,
                    Array.isArray(p.technologies) ? p.technologies.join("\n") : "",
                ]
                    .filter(Boolean)
                    .join("\n")
                    .toLowerCase();

                return blob.includes(q);
            })
            .sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
    }, [projects, query]);

    const visibleProjects = useMemo(() => {
        if (selectedYear == null) {
            return queryFilteredProjects;
        }
        return queryFilteredProjects.filter(
            (p) => Number(p.year) === Number(selectedYear)
        );
    }, [queryFilteredProjects, selectedYear]);

    return (
        <div id="projects" className="scroll-mt-24 border-b border-[var(--app-border)] pb-4 sm:scroll-mt-28">
            <motion.h1 
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -100 }}
                transition={{ duration: 1.5 }}
                viewport={{ once: true }}
                className="my-12 text-center text-3xl sm:my-16 sm:text-4xl md:my-20"
            >
                Projects{" "}
                <span className="text-base font-normal text-[var(--app-muted)] sm:text-lg">
                    ({count})
                </span>
            </motion.h1>
            <div>
                {loading ? (
                    <p className="mx-auto max-w-2xl text-center text-sm text-[var(--app-muted)] sm:text-base">
                        Loading projects…
                    </p>
                ) : error ? (
                    <p className="mx-auto max-w-2xl text-center text-sm text-[var(--app-muted)] sm:text-base">
                        Couldn’t load projects right now.
                    </p>
                ) : projects.length === 0 ? (
                    <p className="mx-auto max-w-2xl text-center text-sm text-[var(--app-muted)] sm:text-base">
                        No projects found.
                    </p>
                ) : (
                    <>
                        <div className="mx-auto mb-10 max-w-5xl">
                            <ProjectsYearPie
                                projects={queryFilteredProjects}
                                selectedYear={selectedYear}
                                onSelectYear={setSelectedYear}
                            />

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <label className="flex w-full flex-col gap-2 text-sm text-[var(--app-fg)] sm:max-w-md">
                                    <span className="text-xs text-[var(--app-muted)]">
                                        Search projects
                                    </span>
                                    <input
                                        className="min-h-10 w-full rounded border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-[var(--app-fg)] placeholder:text-[var(--app-muted-2)]"
                                        type="search"
                                        aria-label="Search projects"
                                        placeholder="Search projects…"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                    />
                                </label>

                                <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--app-muted)]">
                                    {selectedYear != null ? (
                                        <button
                                            type="button"
                                            className="rounded border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-[var(--app-fg)] hover:bg-[var(--app-surface-2)]"
                                            onClick={() => setSelectedYear(null)}
                                        >
                                            Clear year filter ({selectedYear})
                                        </button>
                                    ) : null}
                                    <span>
                                        Showing{" "}
                                        <span className="text-[var(--app-fg)]">
                                            {visibleProjects.length}
                                        </span>{" "}
                                        of{" "}
                                        <span className="text-[var(--app-fg)]">{count}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {visibleProjects.length === 0 ? (
                            <p className="mx-auto max-w-2xl text-center text-sm text-[var(--app-muted)] sm:text-base">
                                No projects match your filters.
                            </p>
                        ) : (
                            visibleProjects.map((project, index) => (
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
                            <h6 className="mb-2 text-center text-base font-semibold sm:text-lg lg:text-left">
                                {project.title}{" "}
                                {project.year ? (
                                    <span className="font-normal text-[var(--app-muted)]">
                                        ({project.year})
                                    </span>
                                ) : null}
                            </h6>
                            <p className="mb-4 text-center text-sm text-[var(--app-muted)] sm:text-base lg:text-left">{project.description}</p>
                            <div className="mb-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                                {project.technologies?.map((tech, index) => (
                                    <span key={index} className="rounded bg-[var(--app-surface-2)] px-2 py-1 text-xs font-medium text-[var(--app-fg)] sm:text-sm">{tech}</span>
                                ))}
                            </div>
                            {project.link ? (
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
                            ) : null}
                        </motion.div>
                    </div>
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Projects;
