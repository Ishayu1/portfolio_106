import { useEffect, useMemo, useState } from "react";
import { fetchJSON } from "../utils/fetchJSON";

const PROJECTS_URL = `${import.meta.env.BASE_URL}lib/projects.json`;

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchJSON(PROJECTS_URL);
        if (!cancelled) {
          setProjects(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
          setProjects([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const count = useMemo(() => projects.length, [projects]);

  return { projects, count, loading, error };
}

