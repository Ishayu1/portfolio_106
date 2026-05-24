import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import scrollama from "scrollama";

const LOC_CSV_URL = `${import.meta.env.BASE_URL}meta/loc.csv`;
const COMMIT_URL_BASE = "https://github.com/Ishayu1/portfolio_106/commit/";

const CHART_WIDTH = 1000;
const CHART_HEIGHT = 600;
const CHART_MARGIN = { top: 10, right: 10, bottom: 30, left: 44 };

async function loadLocCsv() {
  return d3.csv(LOC_CSV_URL, (row) => ({
    ...row,
    line: Number(row.line),
    depth: Number(row.depth),
    length: Number(row.length),
    datetime: new Date(row.datetime),
  }));
}

function processCommits(data) {
  return d3
    .groups(data, (d) => d.commit)
    .map(([commit, lines]) => {
      const first = lines[0];
      const { author, date, time, timezone, datetime } = first;
      const ret = {
        id: commit,
        url: `${COMMIT_URL_BASE}${commit}`,
        author,
        date,
        time,
        timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
      };
      Object.defineProperty(ret, "lines", {
        value: lines,
        enumerable: false,
        configurable: true,
        writable: false,
      });
      return ret;
    })
    .sort((a, b) => a.datetime - b.datetime);
}

function renderTooltipContent(commit) {
  const link = document.getElementById("commit-link");
  const date = document.getElementById("commit-date");
  const time = document.getElementById("commit-time-tooltip");
  const author = document.getElementById("commit-author");
  const linesEl = document.getElementById("commit-lines");
  if (!link || !date || !commit || Object.keys(commit).length === 0) {
    return;
  }
  link.href = commit.url;
  link.textContent = commit.id;
  date.textContent = commit.datetime?.toLocaleString("en", {
    dateStyle: "full",
  });
  if (time) {
    time.textContent = commit.datetime?.toLocaleString("en", {
      timeStyle: "short",
    });
  }
  if (author) {
    author.textContent = commit.author ?? "";
  }
  if (linesEl) {
    linesEl.textContent = String(commit.totalLines ?? "");
  }
}

function updateTooltipVisibility(isVisible) {
  const tooltip = document.getElementById("commit-tooltip");
  if (tooltip) {
    tooltip.hidden = !isVisible;
  }
}

function updateTooltipPosition(event) {
  const tooltip = document.getElementById("commit-tooltip");
  if (!tooltip) {
    return;
  }
  const pad = 12;
  tooltip.style.left = `${event.clientX + pad}px`;
  tooltip.style.top = `${event.clientY + pad}px`;
}

function isCommitSelected(selection, commit, xScale, yScale) {
  if (!selection) {
    return false;
  }
  const [[bx0, by0], [bx1, by1]] = selection;
  const x0 = Math.min(bx0, bx1);
  const x1 = Math.max(bx0, bx1);
  const y0 = Math.min(by0, by1);
  const y1 = Math.max(by0, by1);
  const cx = xScale(commit.datetime);
  const cy = yScale(commit.hourFrac);
  return cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1;
}

function renderSelectionCount(selection, commits, xScale, yScale) {
  const selectedCommits = selection
    ? commits.filter((d) => isCommitSelected(selection, d, xScale, yScale))
    : [];
  const countElement = document.querySelector("#selection-count");
  if (countElement) {
    countElement.textContent =
      selectedCommits.length === 0
        ? "No commits selected"
        : `${selectedCommits.length} commit${
            selectedCommits.length === 1 ? "" : "s"
          } selected`;
  }
  return selectedCommits;
}

function renderLanguageBreakdown(selection, commits, xScale, yScale) {
  const selectedCommits = selection
    ? commits.filter((d) => isCommitSelected(selection, d, xScale, yScale))
    : [];
  const container = document.getElementById("language-breakdown");
  if (!container) {
    return;
  }
  if (selectedCommits.length === 0) {
    container.innerHTML = "";
    return;
  }
  const lines = selectedCommits.flatMap((d) => d.lines);
  const breakdown = d3.rollup(
    lines,
    (v) => v.length,
    (d) => d.type,
  );
  container.innerHTML = "";
  for (const [language, count] of breakdown) {
    const proportion = count / lines.length;
    const formatted = d3.format(".1~%")(proportion);
    container.innerHTML += `
<dt>${language}</dt>
<dd>${count} lines (${formatted})</dd>`;
  }
}

function computeStats(data, filteredCommits) {
  const lines = filteredCommits.flatMap((d) => d.lines);
  const numFiles = d3.group(lines, (d) => d.file).size;
  const numAuthors = d3.group(filteredCommits, (d) => d.author).size;
  const maxDepth = d3.max(lines, (d) => d.depth) ?? 0;
  const avgLineLength = d3.mean(lines, (d) => d.length) ?? 0;
  const fileLineCounts = d3.rollups(
    lines,
    (v) => v.length,
    (d) => d.file,
  );
  const avgFileLength = d3.mean(fileLineCounts, (d) => d[1]) ?? 0;
  const workByPeriod = d3.rollups(
    lines,
    (v) => v.length,
    (d) =>
      d.datetime.toLocaleString("en", {
        dayPeriod: "short",
      }),
  );
  const busiestPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0] ?? "—";

  return {
    totalLoc: lines.length,
    totalCommits: filteredCommits.length,
    numFiles,
    numAuthors,
    maxDepth,
    avgLineLength,
    avgFileLength,
    busiestPeriod,
    totalLocAll: data.length,
    totalCommitsAll: d3.group(data, (d) => d.commit).size,
  };
}

function commitStepHtml(d, i) {
  const fileCount = d3.rollups(
    d.lines,
    (v) => v.length,
    (line) => line.file,
  ).length;
  return `
On ${d.datetime.toLocaleString("en", {
    dateStyle: "full",
    timeStyle: "short",
  })},
I made <a href="${d.url}" target="_blank" rel="noopener noreferrer">${
    i > 0 ? "another glorious commit" : "my first commit, and it was glorious"
  }</a>.
I edited ${d.totalLines} lines across ${fileCount} files.
Then I looked over all I had made, and I saw that it was very good.
`;
}

function updateFileDisplay(filteredCommits, filesEl) {
  if (!filesEl) {
    return;
  }
  const lines = filteredCommits.flatMap((d) => d.lines);
  const files = d3
    .groups(lines, (d) => d.file)
    .map(([name, fileLines]) => ({ name, lines: fileLines }))
    .sort((a, b) => b.lines.length - a.lines.length);

  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  const container = d3.select(filesEl);

  const filesContainer = container
    .selectAll("div.file-row")
    .data(files, (d) => d.name)
    .join((enter) =>
      enter.append("div").attr("class", "file-row").call((div) => {
        div.append("dt");
        div.append("dd");
      }),
    );

  filesContainer
    .select("dt")
    .html(
      (d) =>
        `<code>${d.name}</code><small>${d.lines.length} lines</small>`,
    );

  filesContainer
    .select("dd")
    .selectAll("div.loc")
    .data((d) => d.lines, (line) => `${line.file}:${line.line}`)
    .join("div")
    .attr("class", "loc")
    .attr("style", (d) => `--color: ${colors(d.type)}`);
}

const Meta = () => {
  const [data, setData] = useState(null);
  const [commits, setCommits] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [displayStats, setDisplayStats] = useState(null);

  const chartRef = useRef(null);
  const storyRef = useRef(null);
  const filesRef = useRef(null);
  const chartStateRef = useRef(null);
  const applyFilterRef = useRef(null);
  const scrollerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await loadLocCsv();
        if (cancelled) {
          return;
        }
        const processed = processCommits(rows);
        setData(rows);
        setCommits(processed);
      } catch (e) {
        if (!cancelled) {
          setLoadError(e);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const applyFilter = useCallback(
    (commitMaxTime) => {
      if (!data || !commits?.length || !chartStateRef.current) {
        return;
      }

      const filteredCommits = commits.filter(
        (d) => d.datetime <= commitMaxTime,
      );

      setDisplayStats(computeStats(data, filteredCommits));

      updateScatterPlot(filteredCommits);
      updateFileDisplay(filteredCommits, filesRef.current);
    },
    [commits, data],
  );

  applyFilterRef.current = applyFilter;

  function updateScatterPlot(filteredCommits) {
    const state = chartStateRef.current;
    if (!state) {
      return;
    }

    const { svg, yScale } = state;
    const visible =
      filteredCommits.length > 0 ? filteredCommits : state.commits;

    state.xScale.domain(d3.extent(visible, (d) => d.datetime)).nice();
    const [minLines, maxLines] = d3.extent(visible, (d) => d.totalLines);
    state.rScale
      .domain([minLines ?? 0, maxLines ?? minLines + 1])
      .range([2, 28]);

    const xAxis = d3.axisBottom(state.xScale);
    svg.select("g.x-axis").call(xAxis);

    const sortedCommits = d3.sort(visible, (d) => -d.totalLines);

    svg
      .select("g.meta-dots")
      .selectAll("circle")
      .data(sortedCommits, (d) => d.id)
      .join("circle")
      .attr("class", "meta-commit-dot")
      .attr("cx", (d) => state.xScale(d.datetime))
      .attr("cy", (d) => yScale(d.hourFrac))
      .attr("r", (d) => state.rScale(d.totalLines))
      .attr("fill", "steelblue")
      .style("--r", (d) => `${state.rScale(d.totalLines)}px`)
      .style("fill-opacity", 0.7)
      .style("cursor", "crosshair")
      .on("mouseenter", (event, commit) => {
        d3.select(event.currentTarget).style("fill-opacity", 1);
        renderTooltipContent(commit);
        updateTooltipVisibility(true);
        updateTooltipPosition(event);
      })
      .on("mousemove", (event) => {
        updateTooltipPosition(event);
      })
      .on("mouseleave", (event) => {
        d3.select(event.currentTarget).style("fill-opacity", 0.7);
        updateTooltipVisibility(false);
      });

    state.filteredCommits = visible;
  }

  useEffect(() => {
    if (!commits?.length || !data || !chartRef.current) {
      return;
    }

    const container = chartRef.current;
    const el = d3.select(container);
    el.selectAll("*").remove();

    const usableArea = {
      top: CHART_MARGIN.top,
      right: CHART_WIDTH - CHART_MARGIN.right,
      bottom: CHART_HEIGHT - CHART_MARGIN.bottom,
      left: CHART_MARGIN.left,
      width: CHART_WIDTH - CHART_MARGIN.left - CHART_MARGIN.right,
      height: CHART_HEIGHT - CHART_MARGIN.top - CHART_MARGIN.bottom,
    };

    let [minDate, maxDate] = d3.extent(commits, (d) => d.datetime);
    if (minDate == null || maxDate == null) {
      const now = new Date();
      minDate = now;
      maxDate = now;
    }
    if (minDate.getTime() === maxDate.getTime()) {
      maxDate = d3.timeDay.offset(maxDate, 1);
    }

    const xScale = d3
      .scaleTime()
      .domain([minDate, maxDate])
      .range([usableArea.left, usableArea.right])
      .nice();

    const yScale = d3
      .scaleLinear()
      .domain([0, 24])
      .range([usableArea.bottom, usableArea.top]);

    const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);
    const rScale = d3
      .scaleSqrt()
      .domain([minLines ?? 0, maxLines ?? minLines + 1])
      .range([2, 28]);

    const svg = el
      .append("svg")
      .attr("viewBox", `0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`)
      .attr("class", "meta-chart-svg")
      .style("overflow", "visible")
      .style("max-width", "100%")
      .style("height", "auto");

    svg
      .append("g")
      .attr("class", "meta-gridlines")
      .attr("transform", `translate(${usableArea.left}, 0)`)
      .call(
        d3
          .axisLeft(yScale)
          .tickFormat("")
          .tickSize(-usableArea.width),
      );

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((d) => String(d % 24).padStart(2, "0") + ":00");

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${usableArea.bottom})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${usableArea.left}, 0)`)
      .call(yAxis);

    svg.append("g").attr("class", "meta-dots");

    chartStateRef.current = {
      svg,
      xScale,
      yScale,
      rScale,
      usableArea,
      commits,
      data,
      filteredCommits: commits,
    };

    function brushed(event) {
      const state = chartStateRef.current;
      if (!state) {
        return;
      }
      const selection = event.selection;
      const visible = state.filteredCommits ?? state.commits;
      svg
        .selectAll("circle.meta-commit-dot")
        .classed("selected", (d) =>
          isCommitSelected(selection, d, state.xScale, state.yScale),
        );
      renderSelectionCount(selection, visible, state.xScale, state.yScale);
      renderLanguageBreakdown(selection, visible, state.xScale, state.yScale);
    }

    svg.call(
      d3
        .brush()
        .extent([
          [usableArea.left, usableArea.top],
          [usableArea.right, usableArea.bottom],
        ])
        .on("start brush end", brushed),
    );

    svg.select(".meta-dots").raise();

    const maxTime = maxDate;
    applyFilterRef.current?.(maxTime);

    return () => {
      el.selectAll("*").remove();
      chartStateRef.current = null;
    };
  }, [commits, data]);

  useEffect(() => {
    if (!commits?.length || !storyRef.current) {
      return;
    }

    d3.select(storyRef.current)
      .selectAll(".step")
      .data(commits)
      .join("div")
      .attr("class", "step meta-step")
      .html((d, i) => commitStepHtml(d, i));

    const scroller = scrollama();
    scrollerRef.current = scroller;

    const setupTimer = window.setTimeout(() => {
      scroller
        .setup({
          step: "#scrolly-1 .step",
          offset: 0.5,
        })
        .onStepEnter((response) => {
          const commit = response.element.__data__;
          if (commit?.datetime) {
            applyFilterRef.current?.(commit.datetime);
          }
        });
      scroller.resize();
    }, 0);

    const onResize = () => scroller.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(setupTimer);
      window.removeEventListener("resize", onResize);
      scroller.destroy();
      scrollerRef.current = null;
    };
  }, [commits]);

  const baselineStats = useMemo(() => {
    if (!data || !commits) {
      return null;
    }
    return computeStats(data, commits);
  }, [data, commits]);

  const stats = displayStats ?? baselineStats;

  if (loadError) {
    return (
      <div className="meta-page py-10">
        <h1 className="mb-4 text-2xl font-semibold sm:text-3xl">Code meta-analysis</h1>
        <p className="text-[var(--app-muted)]">
          Could not load <code className="text-cyan-400">meta/loc.csv</code>. Run{" "}
          <code className="text-cyan-400">npm run analyze:loc</code> and refresh.
        </p>
      </div>
    );
  }

  if (!data || !commits || !stats) {
    return (
      <div className="meta-page py-10">
        <h1 className="mb-4 text-2xl font-semibold sm:text-3xl">Code meta-analysis</h1>
        <p className="text-[var(--app-muted)]">Loading repository stats…</p>
      </div>
    );
  }

  return (
    <div className="meta-page py-8 sm:py-12">
      <h1 className="mb-2 text-2xl font-semibold sm:text-3xl">Code meta-analysis</h1>
      <p className="mb-8 max-w-3xl text-sm text-[var(--app-muted)] sm:text-base">
        An interactive narrative of how this portfolio&apos;s{" "}
        <code className="text-cyan-400">src/</code> codebase evolved over time.
        Scroll the story to animate the scatterplot as commits appear over time.
      </p>

      <dl className="meta-stats stats mb-10">
        <dt>
          Total <abbr title="Lines of code">LOC</abbr>
        </dt>
        <dd>
          {stats.totalLoc}
          {stats.totalLoc !== stats.totalLocAll ? (
            <span className="text-[var(--app-muted)]"> / {stats.totalLocAll}</span>
          ) : null}
        </dd>
        <dt>Total commits</dt>
        <dd>
          {stats.totalCommits}
          {stats.totalCommits !== stats.totalCommitsAll ? (
            <span className="text-[var(--app-muted)]"> / {stats.totalCommitsAll}</span>
          ) : null}
        </dd>
        <dt>Files</dt>
        <dd>{stats.numFiles}</dd>
        <dt>Authors</dt>
        <dd>{stats.numAuthors}</dd>
        <dt>Max indent depth</dt>
        <dd>{stats.maxDepth}</dd>
        <dt>Avg line length (chars)</dt>
        <dd>{stats.avgLineLength.toFixed(1)}</dd>
        <dt>Avg file length (lines)</dt>
        <dd>{stats.avgFileLength.toFixed(1)}</dd>
        <dt>Busiest day period</dt>
        <dd>{stats.busiestPeriod}</dd>
      </dl>

      <div id="scrolly-1" className="meta-scrolly">
        <div id="scatter-story" ref={storyRef} className="meta-scatter-story" />
        <div id="scatter-plot" className="meta-scatter-sticky">
          <h2 className="mb-4 text-xl font-semibold sm:text-2xl">Commits by time of day</h2>
          <div ref={chartRef} id="meta-chart" className="meta-chart-root w-full overflow-x-auto" />
          <p id="selection-count" className="mt-4 text-sm text-[var(--app-muted)]">
            No commits selected
          </p>
          <h3 className="mt-4 text-lg font-medium">Language breakdown (selection)</h3>
          <dl id="language-breakdown" className="meta-stats stats mt-2" />
        </div>
      </div>

      <h2 className="mb-4 mt-12 text-xl font-semibold sm:text-2xl">
        The race for the biggest file!
      </h2>
      <dl id="files" ref={filesRef} className="meta-files" />

      <dl id="commit-tooltip" className="meta-tooltip info tooltip" hidden>
        <dt>Commit</dt>
        <dd>
          <a href="#" id="commit-link" target="_blank" rel="noopener noreferrer" />
        </dd>
        <dt>Date</dt>
        <dd id="commit-date" />
        <dt>Time</dt>
        <dd id="commit-time-tooltip" />
        <dt>Author</dt>
        <dd id="commit-author" />
        <dt>Lines edited</dt>
        <dd id="commit-lines" />
      </dl>
    </div>
  );
};

export default Meta;
