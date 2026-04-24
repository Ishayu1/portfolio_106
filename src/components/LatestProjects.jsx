import { motion } from "framer-motion";
import { useProjects } from "../hooks/useProjects";

const LatestProjects = () => {
  const { projects, loading, error } = useProjects();
  const latest = [...projects]
    .sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0))
    .slice(0, 3);

  return (
    <section className="border-b border-[var(--app-border)] py-10 sm:py-14">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.9 }}
        viewport={{ once: true }}
        className="mb-6 text-center text-2xl sm:text-3xl"
      >
        Latest Projects
      </motion.h2>

      {loading ? (
        <p className="mx-auto max-w-2xl text-center text-sm text-[var(--app-muted)] sm:text-base">
          Loading…
        </p>
      ) : error ? (
        <p className="mx-auto max-w-2xl text-center text-sm text-[var(--app-muted)] sm:text-base">
          Couldn’t load projects right now.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((p) => (
            <article
              key={`${p.title}-${p.year ?? "na"}`}
              className="overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)]"
            >
              <div className="aspect-[16/10] w-full bg-[var(--app-surface-2)]">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="text-base font-semibold">
                  {p.title}{" "}
                  {p.year ? (
                    <span className="font-normal text-[var(--app-muted)]">
                      ({p.year})
                    </span>
                  ) : null}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-[var(--app-muted)]">
                  {p.description}
                </p>
                {p.link ? (
                  <a
                    className="mt-3 inline-block text-sm text-cyan-400 hover:underline"
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default LatestProjects;

