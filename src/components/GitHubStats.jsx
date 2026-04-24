import { useEffect, useState } from "react";
import { fetchGitHubData } from "../utils/fetchGitHubData";

const USERNAME = "Ishayu1";

const GitHubStats = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError(null);
        const githubData = await fetchGitHubData(USERNAME);
        if (!cancelled) {
          setData(githubData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="my-8 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 sm:my-10 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
          GitHub stats
        </h2>
        <a
          className="text-sm text-cyan-400 hover:underline"
          href={`https://github.com/${USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          @{USERNAME}
        </a>
      </div>

      <div id="profile-stats" className="mt-4">
        {error ? (
          <p className="text-sm text-[var(--app-muted)]">
            Couldn’t load GitHub stats right now.
          </p>
        ) : !data ? (
          <p className="text-sm text-[var(--app-muted)]">Loading…</p>
        ) : (
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] p-3">
              <dt className="text-xs text-[var(--app-muted)]">Public repos</dt>
              <dd className="mt-1 text-lg font-semibold">{data.public_repos}</dd>
            </div>
            <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] p-3">
              <dt className="text-xs text-[var(--app-muted)]">Public gists</dt>
              <dd className="mt-1 text-lg font-semibold">{data.public_gists}</dd>
            </div>
            <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] p-3">
              <dt className="text-xs text-[var(--app-muted)]">Followers</dt>
              <dd className="mt-1 text-lg font-semibold">{data.followers}</dd>
            </div>
            <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] p-3">
              <dt className="text-xs text-[var(--app-muted)]">Following</dt>
              <dd className="mt-1 text-lg font-semibold">{data.following}</dd>
            </div>
          </dl>
        )}
      </div>
    </section>
  );
};

export default GitHubStats;

