document.addEventListener("DOMContentLoaded", async () => {
  const [popesData, mergedData] = await Promise.all([
    d3.csv("popes.csv"),
    d3.csv("merged_data.csv"),
  ]);
  console.log("Popes Data:", popesData);
  console.log("Merged Data:", mergedData);

  popesData.forEach((d) => {
    d.start = new Date(d.start);
    d.end = new Date(d.end);
    d.tenure = +d.tenure;
    d.number = +d.number;
    d.age_start = +d.age_start;
    d.age_end = +d.age_end;
  });

  mergedData.forEach((d) => {
    d.Pontiffnumber = +d.Pontiffnumber;
    d.date_and_place_of_birth = d.Date_and_Place_of_birth;
    d.notes = d.Notes;
    d.Nationality = (function () {
      const nationalityMap = {
        "roman empire": "Italian",
        rome: "Italian",
        italy: "Italian",
        lombardy: "Italian",
        tuscany: "Italian",
        florence: "Italian",
        genoa: "Italian",
        venice: "Italian",
        naples: "Italian",
        sicily: "Italian",
        sardinia: "Italian",
        "papal states": "Italian",
        savoy: "Italian",
        parma: "Italian",
        modena: "Italian",
        urbino: "Italian",
        anagni: "Italian",
        siena: "Italian",
        pisa: "Italian",
        brescia: "Italian",
        bergamo: "Italian",
        treviso: "Italian",
        spoleto: "Italian",
        benevento: "Italian",
        ravenna: "Italian",
        italian: "Italian",

        france: "French",
        gaul: "French",
        avignon: "French",
        lorraine: "French",
        burgundy: "French",
        aquitaine: "French",
        provence: "French",
        tours: "French",
        poitiers: "French",
        lyons: "French",
        french: "French",

        germany: "German",
        "holy roman empire": "German",
        bavaria: "German",
        saxony: "German",
        swabia: "German",
        franconia: "German",
        rhineland: "German",
        westphalia: "German",
        mainz: "German",
        cologne: "German",
        trier: "German",
        german: "German",

        spain: "Spanish",
        hispania: "Spanish",
        aragon: "Spanish",
        castile: "Spanish",
        navarre: "Spanish",
        valencia: "Spanish",
        catalonia: "Spanish",
        toledo: "Spanish",
        spanish: "Spanish",

        greece: "Greek",
        "byzantine empire": "Greek",
        constantinople: "Greek",
        athens: "Greek",
        thrace: "Greek",
        crete: "Greek",
        macedonia: "Greek",
        greek: "Greek",

        poland: "Polish",
        polish: "Polish",
        portugal: "Portuguese",
        portuguese: "Portuguese",
        england: "English",
        english: "English",
        britain: "British",
        british: "British",
        dalmatia: "Croatian",
        croatia: "Croatian",
        croatian: "Croatian",
        hungary: "Hungarian",
        hungarian: "Hungarian",
        netherlands: "Dutch",
        dutch: "Dutch",
        flanders: "Belgian",
        belgium: "Belgian",
        belgian: "Belgian",
        ireland: "Irish",
        irish: "Irish",
        austria: "Austrian",
        austrian: "Austrian",
        bohemia: "Czech",
        czech: "Czech",
        switzerland: "Swiss",
        swiss: "Swiss",

        syria: "Syrian",
        syrian: "Syrian",
        palestine: "Palestinian",
        palestinian: "Palestinian",
        jerusalem: "Palestinian",
        egypt: "Egyptian",
        egyptian: "Egyptian",
        alexandria: "Egyptian",
        africa: "North African",
        carthage: "Tunisian",
        tunisian: "Tunisian",
        numidia: "Algerian",
        algerian: "Algerian",
        argentina: "Argentine",
        argentine: "Argentine",
        "united states": "American",
        american: "American",
        chicago: "American",
        illinois: "American",
        usa: "American",
      };

      const birthPlaceString = d.date_and_place_of_birth;

      if (!birthPlaceString || typeof birthPlaceString !== "string") {
        return "Unknown";
      }
      const lowerBirthPlace = birthPlaceString.toLowerCase();

      for (const keyword in nationalityMap) {
        if (lowerBirthPlace.includes(keyword)) {
          return nationalityMap[keyword];
        }
      }

      return "Unknown";
    })();
  });

  const combinedData = popesData.map((pope) => {
    const additionalInfo = mergedData.find(
      (m) => m.Pontiffnumber === pope.number
    );
    return { ...pope, ...additionalInfo };
  });

  console.log("Combined Data:", combinedData);
  function showSection(sectionValue) {
    document.querySelectorAll(".visualization-section").forEach((section) => {
      section.classList.remove("active");
    });

    const targetSection = document.getElementById(sectionValue + "-section");
    if (targetSection) {
      targetSection.classList.add("active");

      setTimeout(() => {
        switch (sectionValue) {
          case "timeline":
            renderTimeline(getCurrentFilteredData());
            break;
          case "map":
            renderMap(getCurrentFilteredData());
            break;
          case "duration-comparison":
            renderDurationChart(getCurrentFilteredData(), currentSortOrder);
            break;
          case "saints":
            renderSaintsAnalysis(getCurrentFilteredData());
            break;
        }
      }, 100);
    }
  }

  function getCurrentFilteredData() {
    let filteredData = [...combinedData];

    if (currentNationalityFilter !== "all") {
      filteredData = filteredData.filter(
        (d) => d.Nationality === currentNationalityFilter
      );
    }
    if (currentCenturyFilter !== "all") {
      const century = parseInt(currentCenturyFilter);
      filteredData = filteredData.filter((d) => {
        const startCentury = Math.floor(d.start.getFullYear() / 100) + 1;
        return startCentury === century;
      });
    }
    if (currentCanonizationFilter !== "all") {
      if (currentCanonizationFilter === "Saint") {
        filteredData = filteredData.filter(
          (d) =>
            d.canonization && d.canonization.trim().toLowerCase() === "saint"
        );
      } else if (currentCanonizationFilter === "non-Saint") {
        filteredData = filteredData.filter(
          (d) =>
            !d.canonization || d.canonization.trim().toLowerCase() !== "saint"
        );
      }
    }

    if (currentSortOrder === "duration") {
      filteredData.sort((a, b) => b.tenure - a.tenure);
    } else if (currentSortOrder === "alphabetical") {
      filteredData.sort((a, b) => a.name_full.localeCompare(b.name_full));
    } else {
      filteredData.sort((a, b) => a.start - b.start);
    }

    return filteredData;
  }
  document.querySelectorAll('input[name="section"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.checked) {
        showSection(this.value);
        const animationButton = document.getElementById(
          "animate-timeline-button"
        );
        const speedControlGroup = document.getElementById(
          "speed-control-group"
        );
        const sortOrderGroup = document.getElementById("sort-order-group");

        if (this.value === "timeline") {
          animationButton.style.display = "block";
          speedControlGroup.style.display = "block";
          if (sortOrderGroup) sortOrderGroup.style.display = "none";
        } else if (this.value === "duration-comparison") {
          animationButton.style.display = "none";
          speedControlGroup.style.display = "none";
          if (sortOrderGroup) sortOrderGroup.style.display = "block";
        } else {
          animationButton.style.display = "none";
          speedControlGroup.style.display = "none";
          if (sortOrderGroup) sortOrderGroup.style.display = "none";
          if (timelineAnimationInterval) {
            clearInterval(timelineAnimationInterval);
            timelineAnimationInterval = null;
            animationButton.textContent = "Animacija";
          }
        }
      }
    });
  });
  function initializePage() {
    showSection("timeline");

    populateFilters();
    applyFiltersAndSort();
    updateAnimationButtonState();
    const animationButton = document.getElementById("animate-timeline-button");
    const speedControlGroup = document.getElementById("speed-control-group");
    const sortOrderGroup = document.getElementById("sort-order-group");

    animationButton.style.display = "block";
    speedControlGroup.style.display = "block";
    if (sortOrderGroup) sortOrderGroup.style.display = "none";
  }
  function shouldSkipAnimationFrame(currentPopes, previousPopes) {
    if (!previousPopes || previousPopes.length === 0) return false;
    if (currentPopes.length !== previousPopes.length) return false;

    const currentTop10 = currentPopes
      .filter((d) => d.tenure > 0)
      .sort((a, b) => b.tenure - a.tenure)
      .slice(0, 10)
      .map((d) => d.number);

    const previousTop10 = previousPopes
      .filter((d) => d.tenure > 0)
      .sort((a, b) => b.tenure - a.tenure)
      .slice(0, 10)
      .map((d) => d.number);
    return JSON.stringify(currentTop10) === JSON.stringify(previousTop10);
  }

  function getContainerDimensions(containerElement) {
    let containerWidth = 800;
    let containerHeight = 600;

    try {
      const containerRect = containerElement.node().getBoundingClientRect();
      containerWidth = containerRect.width;
      containerHeight = containerRect.height;

      if (containerHeight < 400) {
        const viewportHeight = window.innerHeight;
        const headerHeight =
          document.querySelector("header")?.offsetHeight || 60;
        const contentPadding = 40;
        const controlsHeight = 100;
        containerHeight =
          viewportHeight - headerHeight - contentPadding - controlsHeight;
      }

      containerHeight = Math.max(Math.min(containerHeight, 1000), 500);
    } catch (e) {
      console.warn("Could not get container bounds, using defaults.");
    }

    return { width: containerWidth, height: containerHeight };
  }

  function renderTimeline(data) {
    const timelineContainer = d3.select("#timeline-chart");
    const tooltip = d3.select("#tooltip");
    if (data.length === 0) {
      timelineContainer.html("");
      const tempMargin = { top: 20, right: 30, bottom: 100, left: 70 };
      let tempContainerWidth = 100;
      try {
        tempContainerWidth = timelineContainer
          .node()
          .getBoundingClientRect().width;
      } catch (e) {
        console.warn(
          "Could not get timelineContainer bounds for empty message."
        );
      }
      const tempChartPlotHeight = 500;

      const tempSvg = timelineContainer
        .append("svg")
        .attr("width", tempContainerWidth)
        .attr("height", tempChartPlotHeight)
        .append("g")
        .attr("transform", `translate(${tempMargin.left},${tempMargin.top})`);

      return;
    }
    const validPopes = data.filter((d) => d.tenure > 0);

    if (validPopes.length < 3 && isAnimating) {
      timelineContainer.html("");
      const tempMargin = { top: 20, right: 30, bottom: 100, left: 70 };
      let tempContainerWidth = 100;
      try {
        tempContainerWidth = timelineContainer
          .node()
          .getBoundingClientRect().width;
      } catch (e) {
        console.warn(
          "Could not get timelineContainer bounds for waiting message."
        );
      }
      const tempChartPlotHeight = 500;

      const tempSvg = timelineContainer
        .append("svg")
        .attr("width", tempContainerWidth)
        .attr("height", tempChartPlotHeight)
        .append("g")
        .attr("transform", `translate(${tempMargin.left},${tempMargin.top})`);

      return;
    }

    if (validPopes.length === 0) {
      timelineContainer.html("");
      const tempMargin = { top: 20, right: 30, bottom: 100, left: 70 };
      let tempContainerWidth = 100;
      try {
        tempContainerWidth = timelineContainer
          .node()
          .getBoundingClientRect().width;
      } catch (e) {
        console.warn(
          "Could not get timelineContainer bounds for empty message."
        );
      }
      const tempChartPlotHeight = 500;

      const tempSvg = timelineContainer
        .append("svg")
        .attr("width", tempContainerWidth)
        .attr("height", tempChartPlotHeight)
        .append("g")
        .attr("transform", `translate(${tempMargin.left},${tempMargin.top})`);

      tempSvg
        .append("text")
        .attr(
          "x",
          Math.max(
            0,
            (tempContainerWidth - tempMargin.left - tempMargin.right) / 2
          )
        )
        .attr(
          "y",
          (tempChartPlotHeight - tempMargin.top - tempMargin.bottom) / 2
        )
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Nema podataka za prikaz u ovom vremenskom periodu.");
      return;
    }
    const margin = { top: 80, right: 150, bottom: 50, left: 200 };
    const containerDimensions = getContainerDimensions(timelineContainer);
    const containerWidth = containerDimensions.width;
    const containerHeight = containerDimensions.height;
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;
    const topN = Math.min(10, validPopes.length);

    const sortedData = [...validPopes]
      .sort((a, b) => b.tenure - a.tenure)
      .slice(0, topN);
    let svg = timelineContainer.select("svg");
    if (svg.empty()) {
      svg = timelineContainer
        .append("svg")
        .attr("class", "racing-chart")
        .attr("width", containerWidth)
        .attr("height", containerHeight);
    } else {
      svg.attr("width", containerWidth).attr("height", containerHeight);
    }

    let g = svg.select("g.main-group");
    if (g.empty()) {
      g = svg
        .append("g")
        .attr("class", "main-group")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    }

    const maxTenure = d3.max(sortedData, (d) => d.tenure) || 1;
    const xScale = d3.scaleLinear().domain([0, maxTenure]).range([0, width]);
    const yScale = d3
      .scaleBand()
      .domain(d3.range(sortedData.length))
      .range([0, height])
      .padding(0.05);
    const colorScale = d3
      .scaleOrdinal()
      .domain(sortedData.map((d) => d.Nationality || "Unknown"))
      .range(d3.schemeCategory10);

    let title = svg.select(".chart-title");
    if (title.empty()) {
      title = svg
        .append("text")
        .attr("class", "chart-title")
        .attr("x", containerWidth / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold");
    }
    title.text("Top 10 Najdužih Pontifikata");

    let subtitle = svg.select(".chart-subtitle");
    if (subtitle.empty()) {
      subtitle = svg
        .append("text")
        .attr("class", "chart-subtitle")
        .attr("x", containerWidth / 2)
        .attr("y", 50)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "#666");
    }
    subtitle.text(
      `Prikazano ${sortedData.length} od ukupno ${validPopes.length} papa s poznatim trajanjem pontifikata`
    );

    const bars = g.selectAll(".bar").data(sortedData, (d) => d.number);

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", (d, i) => yScale(i))
      .attr("width", 0)
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => colorScale(d.Nationality || "Unknown"))
      .attr("stroke", "#333")
      .attr("stroke-width", 1)
      .merge(bars)
      .transition()
      .duration(300)
      .attr("y", (d, i) => yScale(i))
      .attr("width", (d) => xScale(d.tenure))
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => colorScale(d.Nationality || "Unknown"));

    bars.exit().transition().duration(300).attr("width", 0).remove();

    const nameLabels = g
      .selectAll(".name-label")
      .data(sortedData, (d) => d.number);

    nameLabels
      .enter()
      .append("text")
      .attr("class", "name-label")
      .attr("x", -20)
      .attr("y", (d, i) => yScale(i) + yScale.bandwidth() / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("opacity", 0)
      .text((d) => d.name_full)
      .merge(nameLabels)
      .transition()
      .duration(300)
      .attr("y", (d, i) => yScale(i) + yScale.bandwidth() / 2)
      .style("opacity", 1);

    nameLabels.exit().transition().duration(300).style("opacity", 0).remove();
    const saintIndicators = g.selectAll(".saint-indicator").data(
      sortedData.filter(
        (d) => d.canonization && d.canonization.trim().toLowerCase() === "saint"
      ),
      (d) => d.number
    );

    saintIndicators
      .enter()
      .append("text")
      .attr("class", "saint-indicator")
      .attr("x", -5)
      .attr("y", (d, i) => {
        const index = sortedData.findIndex((pope) => pope.number === d.number);
        return yScale(index) + yScale.bandwidth() / 2;
      })
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .style("font-size", "14px")
      .style("fill", "#d4af37")
      .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.3)")
      .style("opacity", 0)
      .text("★")
      .merge(saintIndicators)
      .transition()
      .duration(300)
      .attr("y", (d, i) => {
        const index = sortedData.findIndex((pope) => pope.number === d.number);
        return yScale(index) + yScale.bandwidth() / 2;
      })
      .style("opacity", 1);

    saintIndicators
      .exit()
      .transition()
      .duration(300)
      .style("opacity", 0)
      .remove();

    const durationLabels = g
      .selectAll(".duration-label")
      .data(sortedData, (d) => d.number);

    durationLabels
      .enter()
      .append("text")
      .attr("class", "duration-label")
      .attr("x", (d) => xScale(d.tenure) + 5)
      .attr("y", (d, i) => yScale(i) + yScale.bandwidth() / 2)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .style("font-size", "11px")
      .style("fill", "#333")
      .style("opacity", 0)
      .text((d) => `${d.tenure.toFixed(1)} god`)
      .merge(durationLabels)
      .transition()
      .duration(300)
      .attr("x", (d) => xScale(d.tenure) + 5)
      .attr("y", (d, i) => yScale(i) + yScale.bandwidth() / 2)
      .style("opacity", 1)
      .text((d) => `${d.tenure.toFixed(1)} god`);

    durationLabels
      .exit()
      .transition()
      .duration(300)
      .style("opacity", 0)
      .remove();

    const rankLabels = g
      .selectAll(".rank-label")
      .data(sortedData, (d) => d.number);

    rankLabels
      .enter()
      .append("text")
      .attr("class", "rank-label")
      .attr("x", 15)
      .attr("y", (d, i) => yScale(i) + yScale.bandwidth() / 2)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "white")
      .style("opacity", 0)
      .text((d, i) => i + 1)
      .merge(rankLabels)
      .transition()
      .duration(300)
      .attr("y", (d, i) => yScale(i) + yScale.bandwidth() / 2)
      .style("opacity", 1)
      .text((d, i) => i + 1);

    rankLabels.exit().transition().duration(300).style("opacity", 0).remove();
    let xAxis = g.select(".x-axis");
    if (xAxis.empty()) {
      xAxis = g.append("g").attr("class", "x-axis");

      xAxis
        .append("text")
        .attr("class", "x-axis-title")
        .attr("text-anchor", "middle")
        .style("fill", "#333")
        .style("font-size", "13px")
        .style("font-weight", "500")
        .text("Trajanje pontifikata (godine)");
    }

    xAxis.attr("transform", `translate(0,${height})`);

    xAxis
      .select(".x-axis-title")
      .attr("x", width / 2)
      .attr("y", 30);

    xAxis.transition().duration(300).call(d3.axisBottom(xScale).ticks(5));
    if (!isAnimating) {
      g.selectAll(".bar")
        .on("mouseover", (event, d) => {
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(
              `<strong>${d.name_full}</strong><br/>
                         Pontifikat: ${d.start.getFullYear()} - ${d.end.getFullYear()}<br/>
                         Trajanje: ${d.tenure.toFixed(2)} godina<br/>
                         Rođen: ${d.date_and_place_of_birth || "N/A"}<br/>
                         Nacionalnost: ${d.Nationality || "N/A"}${
                d.canonization &&
                d.canonization.trim().toLowerCase() === "saint"
                  ? "<br/>★ Svetac"
                  : ""
              }`
            )
            .style("left", event.pageX + 15 + "px")
            .style("top", event.pageY - 30 + "px");
        })
        .on("mouseout", () => {
          tooltip.transition().duration(500).style("opacity", 0);
        });
    } else {
      g.selectAll(".bar").on("mouseover", null).on("mouseout", null);
    }
    const currentNationalities = [
      ...new Set(sortedData.map((d) => d.Nationality || "Unknown")),
    ];

    let legend = svg.select(".legend");
    if (legend.empty()) {
      legend = svg.append("g").attr("class", "legend");
    }
    const legendWidth = 160;
    const legendHeight = currentNationalities.length * 20 + 20;
    const legendX = Math.max(
      containerWidth - legendWidth - 40,
      width + margin.left - 20
    );
    const legendY = containerHeight - legendHeight - 80;
    legend.attr("transform", `translate(${legendX}, ${legendY})`);
    let legendBg = legend.select(".legend-bg");
    if (legendBg.empty()) {
      legendBg = legend
        .insert("rect", ":first-child")
        .attr("class", "legend-bg");
    }

    legendBg
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("x", -10)
      .attr("y", -10)
      .attr("fill", "rgba(255, 255, 255, 0.9)")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1)
      .attr("rx", 5);
    const legendItems = legend
      .selectAll(".legend-item")
      .data(currentNationalities, (d) => d);
    const enterItems = legendItems
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .style("opacity", 0);

    enterItems.append("rect").attr("width", 15).attr("height", 15);

    enterItems
      .append("text")
      .attr("x", 20)
      .attr("y", 12)
      .style("font-size", "11px");

    const allItems = enterItems.merge(legendItems);

    allItems
      .transition()
      .duration(300)
      .style("opacity", 1)
      .attr("transform", (d, i) => `translate(0, ${i * 20})`)
      .each(function (d) {
        const item = d3.select(this);
        item.select("rect").attr("fill", colorScale(d));
        item.select("text").text(d);
      });

    legendItems.exit().transition().duration(300).style("opacity", 0).remove();
  }
  async function renderMap(data) {
    const mapContainer = d3.select("#map-chart");
    mapContainer.html("");
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const containerWidth = mapContainer.node().getBoundingClientRect().width;
    const width = containerWidth - margin.left - margin.right;
    const height = window.innerHeight - 250;
    const svg = mapContainer
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const mapTooltip = d3.select("#map-tooltip");

    const world = await d3.json(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
    );
    const countries = topojson.feature(world, world.objects.countries);

    const popesByNationality = d3.rollup(
      data.filter((d) => d.Nationality),
      (v) => v.length,
      (d) => d.Nationality
    );

    console.log("Popes by nationality:", popesByNationality);

    const colorScale = d3
      .scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(Array.from(popesByNationality.values())) || 1]);

    const projection = d3.geoMercator().fitSize([width, height], countries);

    const path = d3.geoPath().projection(projection);

    const countryToNationalitiesMap = {
      Italy: ["Italian"],
      "San Marino": ["Italian"],
      "Vatican City": ["Italian"],
      France: ["French"],
      Germany: ["German"],
      Spain: ["Spanish"],
      Greece: ["Greek"],
      Poland: ["Polish"],
      Portugal: ["Portuguese"],
      "United Kingdom": ["British", "English"],
      Ireland: ["Irish"],
      Austria: ["Austrian"],
      Hungary: ["Hungarian"],
      Netherlands: ["Dutch"],
      Belgium: ["Belgian"],
      Switzerland: ["Swiss"],
      Syria: ["Syrian"],
      Egypt: ["Egyptian"],
      Argentina: ["Argentine"],
      Croatia: ["Croatian"],
      Czechia: ["Czech"],
      Tunisia: ["Tunisian"],
      Algeria: ["Algerian"],
      Israel: ["Palestinian"],
      "State of Palestine": ["Palestinian"],
      "West Bank": ["Palestinian"],
      "United States": ["American"],
      "United States of America": ["American"],
      USA: ["American"],
    };

    const countsPerGeoCountry = new Map();
    if (countries && countries.features) {
      const countryNames = countries.features
        .map((f) => f.properties.name)
        .sort();

      const usNames = countryNames.filter(
        (name) =>
          name.toLowerCase().includes("united") ||
          name.toLowerCase().includes("america") ||
          name.toLowerCase().includes("usa") ||
          name.toLowerCase().includes("states")
      );

      countries.features.forEach((feature) => {
        const geoCountryName = feature.properties.name;
        const relevantNationalities = countryToNationalitiesMap[geoCountryName];
        let totalCountForGeoCountry = 0;
        if (relevantNationalities) {
          relevantNationalities.forEach((nat) => {
            totalCountForGeoCountry += popesByNationality.get(nat) || 0;
          });
        }
        if (totalCountForGeoCountry > 0) {
          countsPerGeoCountry.set(geoCountryName, totalCountForGeoCountry);
        }
      });
    }
    colorScale.domain([
      0,
      d3.max(Array.from(countsPerGeoCountry.values())) || 1,
    ]);

    g.selectAll(".country")
      .data(countries.features)
      .join("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("fill", (d) => {
        const count = countsPerGeoCountry.get(d.properties.name) || 0;
        return count ? colorScale(count) : "#ccc";
      })
      .attr("stroke", "#333")
      .attr("stroke-width", 0.5)
      .on("mouseover", (event, d) => {
        const count = countsPerGeoCountry.get(d.properties.name) || 0;
        mapTooltip.transition().duration(200).style("opacity", 0.9);
        mapTooltip
          .html(`${d.properties.name}: ${count} papa`)
          .style("left", event.pageX + 5 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        mapTooltip.transition().duration(500).style("opacity", 0);
      });

    const zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);
  }

  function renderDurationChart(data, sortOrder = "duration") {
    const durationContainer = d3.select("#duration-chart");
    durationContainer.html("");

    const tooltip = d3.select("#tooltip");

    let sortedData = [...data];
    if (sortOrder === "duration") {
      sortedData.sort((a, b) => b.tenure - a.tenure);
    } else if (sortOrder === "alphabetical") {
      sortedData.sort((a, b) => a.name_full.localeCompare(b.name_full));
    }

    const displayData = sortedData;

    if (displayData.length === 0) {
      durationContainer
        .append("p")
        .text("Nema podataka za prikaz prema odabranim filterima.");
      return;
    }
    const margin = { top: 20, right: 20, bottom: 120, left: 50 };

    const minBarWidth = 25;
    const calculatedMinWidth = displayData.length * minBarWidth;
    const containerDimensions = getContainerDimensions(durationContainer);
    const containerWidth = containerDimensions.width;
    const containerHeight = containerDimensions.height;

    const plotAreaWidth = Math.max(
      containerWidth - margin.left - margin.right,
      calculatedMinWidth - margin.left - margin.right
    );
    const height = containerHeight - margin.top - margin.bottom;

    const svg = durationContainer
      .append("svg")
      .attr("width", plotAreaWidth + margin.left + margin.right)
      .attr("height", containerHeight)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleBand()
      .domain(displayData.map((d) => d.name_full))
      .range([0, plotAreaWidth])
      .padding(0.15);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(displayData, (d) => d.tenure) || 1])
      .nice()
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-65)")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em");

    svg.append("g").call(
      d3
        .axisLeft(yScale)
        .ticks(5)
        .tickFormat((d) => d + " god.")
    );

    svg
      .selectAll(".duration-bar")
      .data(displayData, (d) => d.number)
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("class", "duration-bar")
            .attr("x", (d) => xScale(d.name_full))
            .attr("y", (d) => yScale(0))
            .attr("width", xScale.bandwidth())
            .attr("height", 0)
            .attr("fill", "purple")
            .on("mouseover", (event, d) => {
              tooltip.transition().duration(200).style("opacity", 0.9);
              tooltip
                .html(
                  `${d.name_full}<br/>
                             Trajanje: ${d.tenure.toFixed(2)} godina<br/>
                             Nacionalnost: ${d.Nationality || "N/A"}`
                )
                .style("left", event.pageX + 5 + "px")
                .style("top", event.pageY - 28 + "px");
            })
            .on("mouseout", () => {
              tooltip.transition().duration(500).style("opacity", 0);
            })
            .transition()
            .duration(750)
            .attr("y", (d) => yScale(d.tenure))
            .attr("height", (d) => height - yScale(d.tenure)),
        (update) =>
          update
            .transition()
            .duration(750)
            .attr("x", (d) => xScale(d.name_full))
            .attr("y", (d) => yScale(d.tenure))
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => height - yScale(d.tenure)),
        (exit) =>
          exit
            .transition()
            .duration(750)
            .attr("y", (d) => yScale(0))
            .attr("height", 0)
            .remove()
      );
    const saints = displayData.filter(
      (d) => d.canonization && d.canonization.trim().toLowerCase() === "saint"
    );

    svg
      .selectAll(".saint-star")
      .data(saints, (d) => d.number)
      .join(
        (enter) =>
          enter
            .append("text")
            .attr("class", "saint-star")
            .attr("x", (d) => xScale(d.name_full) + xScale.bandwidth() / 2)
            .attr("y", (d) => yScale(d.tenure) - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("fill", "#d4af37")
            .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.3)")
            .style("opacity", 0)
            .text("★")
            .transition()
            .duration(750)
            .delay(750)
            .style("opacity", 1),
        (update) =>
          update
            .transition()
            .duration(750)
            .attr("x", (d) => xScale(d.name_full) + xScale.bandwidth() / 2)
            .attr("y", (d) => yScale(d.tenure) - 10),
        (exit) => exit.transition().duration(750).style("opacity", 0).remove()
      );
  }

  let currentSortOrder = "chronological";
  let currentNationalityFilter = "all";
  let currentCenturyFilter = "all";
  let currentCanonizationFilter = "all";
  function applyFiltersAndSort() {
    const filteredData = getCurrentFilteredData();

    const activeSection = document.querySelector(
      ".visualization-section.active"
    );
    if (activeSection) {
      const sectionId = activeSection.id;
      switch (sectionId) {
        case "timeline-section":
          renderTimeline(filteredData);
          break;
        case "map-section":
          renderMap(filteredData);
          break;
        case "duration-comparison-section":
          renderDurationChart(filteredData, currentSortOrder);
          break;
        case "saints-section":
          renderSaintsAnalysis(filteredData);
          break;
      }
    }
  }

  function populateFilters() {
    const nationalities = [
      ...new Set(combinedData.map((d) => d.Nationality).filter((n) => n)),
    ].sort();
    const nationalitySelect = d3.select("#nationality-filter");
    nationalities.forEach((nat) => {
      nationalitySelect.append("option").attr("value", nat).text(nat);
    });

    const centuries = [
      ...new Set(
        combinedData.map((d) => Math.floor(d.start.getFullYear() / 100) + 1)
      ),
    ].sort((a, b) => a - b);
    const centurySelect = d3.select("#century-filter");
    centuries.forEach((cent) => {
      centurySelect
        .append("option")
        .attr("value", cent)
        .text(cent + ". stoljeće");
    });
  }

  d3.select("#sort-order").on("change", function () {
    currentSortOrder = this.value;
    applyFiltersAndSort();
  });
  function updateAnimationButtonState() {
    const animationButton = document.getElementById("animate-timeline-button");
    const allFiltersDefault =
      currentNationalityFilter === "all" &&
      currentCenturyFilter === "all" &&
      currentCanonizationFilter === "all";

    if (animationButton) {
      animationButton.disabled = !allFiltersDefault;
      if (!allFiltersDefault) {
        animationButton.style.opacity = "0.5";
        animationButton.style.cursor = "not-allowed";
        animationButton.title =
          "Animacija je dostupna samo kada su svi filteri postavljeni na 'sve'";

        if (timelineAnimationInterval) {
          clearInterval(timelineAnimationInterval);
          timelineAnimationInterval = null;
          isAnimating = false;
          animationButton.textContent = "Animacija";

          const timelineContainer = d3.select("#timeline-chart");
          const svg = timelineContainer.select("svg");
          if (!svg.empty()) {
            svg.select(".animation-date").remove();
            svg.select(".animation-progress").remove();
          }
        }
      } else {
        animationButton.style.opacity = "1";
        animationButton.style.cursor = "pointer";
        animationButton.title = "";
      }
    }
  }

  d3.select("#nationality-filter").on("change", function () {
    currentNationalityFilter = this.value;
    updateAnimationButtonState();
    applyFiltersAndSort();
  });
  d3.select("#century-filter").on("change", function () {
    currentCenturyFilter = this.value;
    updateAnimationButtonState();
    applyFiltersAndSort();
  });

  d3.select("#canonization-filter").on("change", function () {
    currentCanonizationFilter = this.value;
    updateAnimationButtonState();
    applyFiltersAndSort();
  });

  let timelineAnimationInterval = null;
  let isAnimating = false;
  let currentAnimationSpeed = 150;
  let animateRacingChart;

  d3.select("#animation-speed").on("input", function () {
    currentAnimationSpeed = +this.value;
    d3.select("#speed-display").text(currentAnimationSpeed + "ms");

    if (isAnimating && timelineAnimationInterval && animateRacingChart) {
      clearInterval(timelineAnimationInterval);
      timelineAnimationInterval = setInterval(
        animateRacingChart,
        currentAnimationSpeed
      );
    }
  });
  d3.select("#animate-timeline-button").on("click", function () {
    if (this.disabled) {
      return;
    }

    if (timelineAnimationInterval) {
      clearInterval(timelineAnimationInterval);
      timelineAnimationInterval = null;
      isAnimating = false;
      this.textContent = "Animacija";

      const timelineContainer = d3.select("#timeline-chart");
      const svg = timelineContainer.select("svg");
      svg.select(".animation-date").remove();
      svg.select(".animation-progress").remove();
    } else {
      this.textContent = "Zaustavi Animaciju";
      isAnimating = true;
      console.log("Racing chart animation started");
      const validPopeData = [...combinedData].filter((d) => d.tenure > 0);
      const allEndDates = [
        ...new Set(validPopeData.map((d) => d.end.getTime())),
      ]
        .sort((a, b) => a - b)
        .map((timestamp) => new Date(timestamp));

      if (allEndDates.length === 0) return;
      let currentDateIndex = 0;
      let previousAnimationData = [];

      animateRacingChart = function () {
        if (currentDateIndex >= allEndDates.length || !isAnimating) {
          clearInterval(timelineAnimationInterval);
          timelineAnimationInterval = null;
          isAnimating = false;
          document.getElementById("animate-timeline-button").textContent =
            "Animacija";

          const timelineContainer = d3.select("#timeline-chart");
          const svg = timelineContainer.select("svg");
          svg.select(".animation-date").remove();
          svg.select(".animation-progress").remove();
          return;
        }

        const currentDate = allEndDates[currentDateIndex];
        const completedPopes = validPopeData.filter(
          (d) => d.end <= currentDate
        );

        if (shouldSkipAnimationFrame(completedPopes, previousAnimationData)) {
          currentDateIndex++;
          return;
        }
        if (completedPopes.length > 0) {
          if (currentDateIndex % 50 === 0) {
            console.log(
              `Animation frame ${currentDateIndex}: ${
                completedPopes.length
              } popes by ${currentDate.getFullYear()}`
            );
          }

          renderTimeline(completedPopes);
          previousAnimationData = [...completedPopes];

          const timelineContainer = d3.select("#timeline-chart");
          const svg = timelineContainer.select("svg");

          let dateDisplay = svg.select(".animation-date");
          if (dateDisplay.empty()) {
            dateDisplay = svg
              .append("text")
              .attr("class", "animation-date")
              .attr("x", 20)
              .attr("y", 25)
              .style("font-size", "16px")
              .style("font-weight", "bold")
              .style("fill", "#333");
          }
          dateDisplay.text(`Godina: ${currentDate.getFullYear()}`);

          let progressDisplay = svg.select(".animation-progress");
          if (progressDisplay.empty()) {
            progressDisplay = svg
              .append("text")
              .attr("class", "animation-progress")
              .attr("x", 20)
              .attr("y", 45)
              .style("font-size", "12px")
              .style("fill", "#666");
          }
          const progress = Math.round(
            (currentDateIndex / allEndDates.length) * 100
          );
          progressDisplay.text(
            `Napredak: ${progress}% (${currentDateIndex + 1}/${
              allEndDates.length
            })`
          );
        }

        currentDateIndex++;
      };
      animateRacingChart();
      timelineAnimationInterval = setInterval(
        animateRacingChart,
        currentAnimationSpeed
      );
    }
  });
  window.addEventListener("resize", () => {
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
      const activeSection = document.querySelector(
        'input[name="section"]:checked'
      )?.value;
      if (activeSection === "timeline" && !isAnimating) {
        applyFiltersAndSort();
      } else if (activeSection === "duration-comparison") {
        renderDurationChart(getCurrentFilteredData(), currentSortOrder);
      } else if (activeSection === "saints") {
        renderSaintsAnalysis(getCurrentFilteredData());
      }
    }, 250);
  });
  function renderSaintsAnalysis(data) {
    const saintsContainer = d3.select("#saints-chart");
    const overviewContainer = d3.select("#saints-overview");

    saintsContainer.html("");
    overviewContainer.html("");

    if (saintsContainer.empty()) {
      console.error("Saints container not found!");
      return;
    }
    const saints = data.filter(
      (d) => d.canonization && d.canonization.trim().toLowerCase() === "saint"
    );
    const nonSaints = data.filter(
      (d) => !d.canonization || d.canonization.trim().toLowerCase() !== "saint"
    );

    const totalPopes = data.length;
    const saintsCount = saints.length;
    const nonSaintsCount = nonSaints.length;
    const saintsPercentage =
      totalPopes > 0 ? ((saintsCount / totalPopes) * 100).toFixed(1) : 0;
    const nonSaintsPercentage =
      totalPopes > 0 ? ((nonSaintsCount / totalPopes) * 100).toFixed(1) : 0;

    const overviewHtml = `
            <div class="saints-stats">
                <div class="stat-card">
                    <h3>Ukupno Papa</h3>
                    <div class="stat-number">${totalPopes}</div>
                </div>
                <div class="stat-card">
                    <h3>Svetci</h3>
                    <div class="stat-number">${saintsCount}</div>
                    <div class="stat-percentage">${saintsPercentage}%</div>
                </div>
                <div class="stat-card">
                    <h3>Nesvetci</h3>
                    <div class="stat-number">${nonSaintsCount}</div>
                    <div class="stat-percentage">${nonSaintsPercentage}%</div>
                </div>
            </div>
        `;

    overviewContainer.html(overviewHtml);
    if (data.length === 0) {
      saintsContainer.html(
        '<p style="text-align: center; padding: 20px;">Nema podataka za prikaz prema odabranim filterima.</p>'
      );
      return;
    }
    const centuryData = d3.rollup(
      data,
      (v) => {
        const saints = v.filter(
          (d) =>
            d.canonization && d.canonization.trim().toLowerCase() === "saint"
        );
        const nonSaints = v.filter(
          (d) =>
            !d.canonization || d.canonization.trim().toLowerCase() !== "saint"
        );
        return {
          total: v.length,
          saints: saints.length,
          nonSaints: nonSaints.length,
          saintsData: saints,
          nonSaintsData: nonSaints,
        };
      },
      (d) => Math.floor(d.start.getFullYear() / 100) + 1
    );
    const timelineData = Array.from(centuryData, ([century, counts]) => ({
      century,
      ...counts,
    })).sort((a, b) => a.century - b.century);
    const baseMargin = { top: 40, right: 20, bottom: 60, left: 80 };
    const containerRect = saintsContainer.node().getBoundingClientRect();
    const availableWidth = Math.max(containerRect.width - 40, 300);

    const margin = {
      top: baseMargin.top,
      right: Math.min(baseMargin.right + 80, availableWidth * 0.15),
      bottom: baseMargin.bottom,
      left: Math.min(baseMargin.left, availableWidth * 0.15),
    };

    const containerWidth = availableWidth;
    const containerHeight = Math.max(
      400,
      Math.min(600, window.innerHeight * 0.6)
    );
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    if (width <= 100 || height <= 100) {
      saintsContainer.html(
        '<p style="color: orange; text-align: center; padding: 20px;">Ekran je premali za prikaz grafikona. Molimo povećajte prozor.</p>'
      );
      return;
    }

    const svg = saintsContainer
      .append("svg")
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    const xScale = d3
      .scaleBand()
      .domain(timelineData.map((d) => d.century + ". st."))
      .range([0, width])
      .padding(
        Math.max(0.1, Math.min(0.4, width / (timelineData.length * 100)))
      );

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(timelineData, (d) => d.total) || 1])
      .nice()
      .range([height, 0]);

    const saintColor = "#d4af37";
    const nonSaintColor = "#6c757d";

    timelineData.forEach((d) => {
      d.stackedData = [
        { type: "nonSaints", value: d.nonSaints, y0: 0, y1: d.nonSaints },
        {
          type: "saints",
          value: d.saints,
          y0: d.nonSaints,
          y1: d.nonSaints + d.saints,
        },
      ];
    });
    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("font-size", Math.max(8, Math.min(12, width / 50)) + "px")
      .attr("transform", width < 500 ? "rotate(-45)" : "rotate(0)")
      .style("text-anchor", width < 500 ? "end" : "middle");

    g.append("g")
      .attr("class", "y-axis")
      .call(
        d3
          .axisLeft(yScale)
          .tickFormat(d3.format("d"))
          .ticks(Math.max(3, Math.min(8, height / 50)))
      )
      .selectAll("text")
      .style("font-size", Math.max(8, Math.min(12, width / 50)) + "px");
    g.append("text")
      .attr("class", "x-axis-label")
      .attr("x", width / 2)
      .attr("y", height + (width < 500 ? 50 : 40))
      .attr("text-anchor", "middle")
      .style("font-size", Math.max(10, Math.min(14, width / 40)) + "px")
      .style("fill", "#333")
      .text("Stoljeće");

    g.append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .attr("text-anchor", "middle")
      .style("font-size", Math.max(10, Math.min(14, width / 40)) + "px")
      .style("fill", "#333")
      .text("Broj Papa");

    svg
      .append("text")
      .attr("class", "chart-title")
      .attr("x", containerWidth / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", Math.max(12, Math.min(18, width / 30)) + "px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .text("Analiza Svetaca kroz Stoljeća");

    const tooltip = d3.select("#tooltip");

    const barGroups = g
      .selectAll(".bar-group")
      .data(timelineData)
      .enter()
      .append("g")
      .attr("class", "bar-group")
      .attr("transform", (d) => `translate(${xScale(d.century + ". st.")},0)`);

    barGroups
      .append("rect")
      .attr("class", "non-saint-bar")
      .attr("x", 0)
      .attr("y", height)
      .attr("width", xScale.bandwidth())
      .attr("height", 0)
      .attr("fill", nonSaintColor)
      .attr("stroke", "#333")
      .attr("stroke-width", 0.5)
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            `
                    <strong>${d.century}. stoljeće</strong><br/>
                    Nesvetci: ${d.nonSaints}<br/>
                    Postotak: ${
                      d.total > 0
                        ? ((d.nonSaints / d.total) * 100).toFixed(1)
                        : 0
                    }%
                `
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      })
      .transition()
      .duration(800)
      .attr("y", (d) => yScale(d.nonSaints))
      .attr("height", (d) => height - yScale(d.nonSaints));

    barGroups
      .append("rect")
      .attr("class", "saint-bar")
      .attr("x", 0)
      .attr("y", height)
      .attr("width", xScale.bandwidth())
      .attr("height", 0)
      .attr("fill", saintColor)
      .attr("stroke", "#333")
      .attr("stroke-width", 0.5)
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            `
                    <strong>${d.century}. stoljeće</strong><br/>
                    Svetci: ${d.saints}<br/>
                    Postotak: ${
                      d.total > 0 ? ((d.saints / d.total) * 100).toFixed(1) : 0
                    }%
                `
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      })
      .transition()
      .duration(800)
      .delay(400)
      .attr("y", (d) => yScale(d.total))
      .attr("height", (d) => yScale(d.nonSaints) - yScale(d.total));

    barGroups
      .selectAll(".bar-label")
      .data((d) => (d.total > 0 ? [d] : []))
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.total) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .style("opacity", 0)
      .text((d) => d.total)
      .transition()
      .duration(800)
      .delay(800)
      .style("opacity", 1);
    const legendX = width < 600 ? 10 : width + 15;
    const legendY = width < 600 ? height + margin.bottom + 10 : 10;

    const legend = svg
      .append("g")
      .attr("class", "chart-legend")
      .attr(
        "transform",
        `translate(${margin.left + legendX}, ${margin.top + legendY})`
      );

    if (width < 600) {
      const newHeight = containerHeight + 60;
      svg
        .attr("height", newHeight)
        .attr("viewBox", `0 0 ${containerWidth} ${newHeight}`);
    }

    const legendData = [
      { label: "Svetci", color: saintColor },
      { label: "Nesvetci", color: nonSaintColor },
    ];
    const legendItems = legend
      .selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) =>
        width < 600 ? `translate(${i * 90}, 0)` : `translate(0, ${i * 20})`
      );

    legendItems
      .append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", (d) => d.color)
      .attr("stroke", "#333")
      .attr("stroke-width", 0.5);

    legendItems
      .append("text")
      .attr("x", 16)
      .attr("y", 10)
      .style("font-size", Math.max(9, Math.min(11, width / 50)) + "px")
      .style("fill", "#333")
      .text((d) => d.label);
  }

  initializePage();
});
function renderDurationChart(data, sortOrder = "duration") {
  const durationContainer = d3.select("#duration-chart");
  durationContainer.html("");

  const tooltip = d3.select("#tooltip");

  let sortedData = [...data];
  if (sortOrder === "duration") {
    sortedData.sort((a, b) => b.tenure - a.tenure);
  } else if (sortOrder === "alphabetical") {
    sortedData.sort((a, b) => a.name_full.localeCompare(b.name_full));
  }

  const displayData = sortedData;

  if (displayData.length === 0) {
    durationContainer
      .append("p")
      .text("Nema podataka za prikaz prema odabranim filterima.");
    return;
  }
  const margin = { top: 20, right: 20, bottom: 120, left: 50 };

  const minBarWidth = 25;
  const calculatedMinWidth = displayData.length * minBarWidth;
  const containerDimensions = getContainerDimensions(durationContainer);
  const containerWidth = containerDimensions.width;
  const containerHeight = containerDimensions.height;

  const plotAreaWidth = Math.max(
    containerWidth - margin.left - margin.right,
    calculatedMinWidth - margin.left - margin.right
  );
  const height = containerHeight - margin.top - margin.bottom;

  const svg = durationContainer
    .append("svg")
    .attr("width", plotAreaWidth + margin.left + margin.right)
    .attr("height", containerHeight)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3
    .scaleBand()
    .domain(displayData.map((d) => d.name_full))
    .range([0, plotAreaWidth])
    .padding(0.15);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(displayData, (d) => d.tenure) || 1])
    .nice()
    .range([height, 0]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "rotate(-65)")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em");

  svg.append("g").call(
    d3
      .axisLeft(yScale)
      .ticks(5)
      .tickFormat((d) => d + " god.")
  );

  svg
    .selectAll(".duration-bar")
    .data(displayData, (d) => d.number)
    .join(
      (enter) =>
        enter
          .append("rect")
          .attr("class", "duration-bar")
          .attr("x", (d) => xScale(d.name_full))
          .attr("y", (d) => yScale(0))
          .attr("width", xScale.bandwidth())
          .attr("height", 0)
          .attr("fill", "purple")
          .on("mouseover", (event, d) => {
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip
              .html(
                `${d.name_full}<br/>
                             Trajanje: ${d.tenure.toFixed(2)} godina<br/>
                             Nacionalnost: ${d.Nationality || "N/A"}`
              )
              .style("left", event.pageX + 5 + "px")
              .style("top", event.pageY - 28 + "px");
          })
          .on("mouseout", () => {
            tooltip.transition().duration(500).style("opacity", 0);
          })
          .transition()
          .duration(750)
          .attr("y", (d) => yScale(d.tenure))
          .attr("height", (d) => height - yScale(d.tenure)),
      (update) =>
        update
          .transition()
          .duration(750)
          .attr("x", (d) => xScale(d.name_full))
          .attr("y", (d) => yScale(d.tenure))
          .attr("width", xScale.bandwidth())
          .attr("height", (d) => height - yScale(d.tenure)),
      (exit) =>
        exit
          .transition()
          .duration(750)
          .attr("y", (d) => yScale(0))
          .attr("height", 0)
          .remove()
    );
}
