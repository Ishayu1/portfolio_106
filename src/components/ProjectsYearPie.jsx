/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";

function normalizeYear(y) {
  const n = Number(y);
  return Number.isFinite(n) && n > 0 ? n : null;
}

const ProjectsYearPie = ({ projects, selectedYear, onSelectYear }) => {
  const svgRef = useRef(null);
  const legendRef = useRef(null);

  const data = useMemo(() => {
    const rolled = d3.rollups(
      projects,
      (v) => v.length,
      (d) => normalizeYear(d.year) ?? "Unknown"
    );

    return rolled
      .map(([year, count]) => ({
        label: year === "Unknown" ? "Unknown" : String(year),
        yearValue: year === "Unknown" ? null : Number(year),
        value: count,
      }))
      .sort((a, b) => (b.yearValue ?? -1) - (a.yearValue ?? -1));
  }, [projects]);

  useEffect(() => {
    const svgEl = svgRef.current;
    const legendEl = legendRef.current;
    if (!svgEl || !legendEl) {
      return;
    }

    const svg = d3.select(svgEl);
    const legend = d3.select(legendEl);

    svg.selectAll("*").remove();
    legend.selectAll("*").remove();

    const radius = 50;
    const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
    const sliceGenerator = d3.pie().value((d) => d.value);
    const arcData = sliceGenerator(data);
    const colors = d3.scaleOrdinal(d3.schemeTableau10);

    const selectedKey = selectedYear == null ? null : String(selectedYear);

    const wedges = svg
      .attr("viewBox", "-50 -50 100 100")
      .attr("role", "img")
      .attr("aria-label", "Projects per year pie chart")
      .selectAll("path")
      .data(arcData)
      .join("path")
      .attr("d", (d) => arcGenerator(d))
      .attr("fill", (_, i) => colors(i))
      .attr("data-label", (d) => d.data.label)
      .attr("class", (d) => (d.data.label === selectedKey ? "selected" : null))
      .attr("tabindex", 0)
      .attr("aria-label", (d) => `${d.data.label}: ${d.data.value} projects`)
      .on("click", (_, d) => {
        const clicked = d.data.label === selectedKey ? null : d.data.yearValue ?? null;
        onSelectYear(clicked);
      })
      .on("keydown", (event, d) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          const clicked = d.data.label === selectedKey ? null : d.data.yearValue ?? null;
          onSelectYear(clicked);
        }
      });

    wedges.append("title").text((d) => `${d.data.label}: ${d.data.value}`);

    const items = legend
      .selectAll("li")
      .data(arcData)
      .join("li")
      .attr("style", (_, i) => `--color: ${colors(i)}`)
      .attr("class", (d) => (d.data.label === selectedKey ? "selected" : "legend-item"))
      .attr("data-label", (d) => d.data.label);

    const buttons = items
      .append("button")
      .attr("type", "button")
      .attr("class", "legend-button")
      .attr("aria-pressed", (d) => (d.data.label === selectedKey ? "true" : "false"))
      .on("click", (_, d) => {
        const clicked = d.data.label === selectedKey ? null : d.data.yearValue ?? null;
        onSelectYear(clicked);
      });

    buttons
      .append("span")
      .attr("class", "swatch")
      .attr("aria-hidden", "true");

    buttons
      .append("span")
      .attr("class", "legend-text")
      .text((d) => `${d.data.label} (${d.data.value})`);
  }, [data, onSelectYear, selectedYear]);

  return (
    <div className="projects-pie-layout">
      <svg ref={svgRef} id="projects-pie-plot" />
      <ul ref={legendRef} className="legend" aria-label="Projects per year legend" />
    </div>
  );
};

export default ProjectsYearPie;

