document.addEventListener('DOMContentLoaded', async () => {
    const [popesData, mergedData] = await Promise.all([
        d3.csv('popes.csv'),
        d3.csv('merged_data.csv')
    ]);

    console.log('Popes Data:', popesData);
    console.log('Merged Data:', mergedData);

    popesData.forEach(d => {
        d.start = new Date(d.start);
        d.end = new Date(d.end);
        d.tenure = +d.tenure; 
        d.number = +d.number;
        d.age_start = +d.age_start;
        d.age_end = +d.age_end;
    });

    mergedData.forEach(d => {
        d.Pontiffnumber = +d.Pontiffnumber;
        d.date_and_place_of_birth = d.Date_and_Place_of_birth;
        d.notes = d.Notes;
        d.Nationality = (function() {
            const nationalityMap = {
                "roman empire": "Italian", "rome": "Italian", "italy": "Italian", "lombardy": "Italian",
                "tuscany": "Italian", "florence": "Italian", "genoa": "Italian", "venice": "Italian",
                "naples": "Italian", "sicily": "Italian", "sardinia": "Italian", "papal states": "Italian",
                "savoy": "Italian", "parma": "Italian", "modena": "Italian", "urbino": "Italian",
                "anagni": "Italian", "siena": "Italian", "pisa": "Italian", "brescia": "Italian",
                "bergamo": "Italian", "treviso": "Italian", "spoleto": "Italian", "benevento": "Italian",
                "ravenna": "Italian", "italian": "Italian",

                "france": "French", "gaul": "French", "avignon": "French", "lorraine": "French",
                "burgundy": "French", "aquitaine": "French", "provence": "French", "tours": "French",
                "poitiers": "French", "lyons": "French", "french": "French",

                "germany": "German", "holy roman empire": "German", "bavaria": "German",
                "saxony": "German", "swabia": "German", "franconia": "German", "rhineland": "German",
                "westphalia": "German", "mainz": "German", "cologne": "German", "trier": "German", "german": "German",

                "spain": "Spanish", "hispania": "Spanish", "aragon": "Spanish", "castile": "Spanish",
                "navarre": "Spanish", "valencia": "Spanish", "catalonia": "Spanish", "toledo": "Spanish", "spanish": "Spanish",

                "greece": "Greek", "byzantine empire": "Greek", "constantinople": "Greek",
                "athens": "Greek", "thrace": "Greek", "crete": "Greek", "macedonia": "Greek", "greek": "Greek",

                "poland": "Polish", "polish": "Polish",
                "portugal": "Portuguese", "portuguese": "Portuguese",
                "england": "English", "english": "English",
                "britain": "British", "british": "British",
                "dalmatia": "Croatian", "croatia": "Croatian", "croatian": "Croatian",
                "hungary": "Hungarian", "hungarian": "Hungarian",
                "netherlands": "Dutch", "dutch": "Dutch",
                "flanders": "Belgian", 
                "belgium": "Belgian", "belgian": "Belgian",
                "ireland": "Irish", "irish": "Irish",
                "austria": "Austrian", "austrian": "Austrian",
                "bohemia": "Czech", "czech": "Czech",
                "switzerland": "Swiss", "swiss": "Swiss",

                "syria": "Syrian", "syrian": "Syrian",
                "palestine": "Palestinian", "palestinian": "Palestinian",
                "jerusalem": "Palestinian", 
                "egypt": "Egyptian", "egyptian": "Egyptian",
                "alexandria": "Egyptian",
                "africa": "North African", 
                "carthage": "Tunisian", "tunisian": "Tunisian",
                "numidia": "Algerian", "algerian": "Algerian",

                "argentina": "Argentine", "argentine": "Argentine"
            };

            const birthPlaceString = d.date_and_place_of_birth;

            if (!birthPlaceString || typeof birthPlaceString !== 'string') {
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

    const combinedData = popesData.map(pope => {
        const additionalInfo = mergedData.find(m => m.Pontiffnumber === pope.number);
        return { ...pope, ...additionalInfo }; 
    });

    console.log('Combined Data:', combinedData);

    function renderTimeline(data) {
        const timelineContainer = d3.select('#timeline-chart');
        timelineContainer.html('');
        const tooltip = d3.select('#tooltip');

        if (data.length === 0) {
            const tempMargin = { top: 20, right: 30, bottom: 100, left: 70 };
            let tempContainerWidth = 100; 
            try {
                tempContainerWidth = timelineContainer.node().getBoundingClientRect().width;
            } catch (e) {
                console.warn("Could not get timelineContainer bounds for empty message.");
            }
            const tempChartPlotHeight = 500;
            
            const tempSvg = timelineContainer.append('svg')
                .attr('width', tempContainerWidth)
                .attr('height', tempChartPlotHeight)
                .append('g')
                .attr('transform', `translate(${tempMargin.left},${tempMargin.top})`);

            tempSvg.append('text')
               .attr('x', Math.max(0, (tempContainerWidth - tempMargin.left - tempMargin.right) / 2))
               .attr('y', (tempChartPlotHeight - tempMargin.top - tempMargin.bottom) / 2)
               .attr('text-anchor', 'middle')
               .text('Nema podataka za prikaz.');
            return;
        }

        const margin = { top: 20, right: 30, bottom: 100, left: 70 }; 
        
        const minBandwidthForPope = 25; 
        const bandPadding = 0.15;
        const stepWidth = minBandwidthForPope / (1 - bandPadding);
        const contentRequiredPlotWidth = data.length * stepWidth;
        
        let containerWidth = 100; 
        try {
            containerWidth = timelineContainer.node().getBoundingClientRect().width;
        } catch (e) {
            console.warn("Could not get timelineContainer bounds.");
        }
        const availablePlotWidth = Math.max(0, containerWidth - margin.left - margin.right);
        
        const plotAreaWidth = Math.max(availablePlotWidth, contentRequiredPlotWidth);

        const chartPlotHeight = 500; 
        const plotAreaHeight = chartPlotHeight - margin.top - margin.bottom;

        const svg = timelineContainer.append('svg')
            .attr('width', plotAreaWidth + margin.left + margin.right)
            .attr('height', chartPlotHeight)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const minDate = d3.min(data, d => d.start);
        const maxDate = d3.max(data, d => d.end);

        const xScale = d3.scaleBand()
            .domain(data.map(d => d.name_full))
            .range([0, plotAreaWidth])
            .padding(bandPadding);

        const yScale = d3.scaleTime()
            .domain([minDate, maxDate])
            .range([0, plotAreaHeight]); 

        svg.append('g')
            .attr('transform', `translate(0,${plotAreaHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
                .attr('transform', 'rotate(-65)')
                .style('text-anchor', 'end')
                .attr('dx', '-.8em')
                .attr('dy', '.15em');

        svg.append('g')
            .call(d3.axisLeft(yScale));

        const highlightRect = svg.append('rect')
            .attr('class', 'timeline-column-highlight')
            .attr('y', 0)
            .attr('height', plotAreaHeight)
            .attr('fill', 'lightblue')
            .attr('opacity', 0);

        svg.selectAll('.bar')
            .data(data, d => d.number)
            .join(
                enter => enter.append('rect')
                    .attr('class', 'bar')
                    .attr('x', d => xScale(d.name_full))
                    .attr('y', d => yScale(d.start))
                    .attr('width', xScale.bandwidth())
                    .attr('height', d => Math.max(0, yScale(d.end) - yScale(d.start)))
                    .attr('fill', 'steelblue'),
                update => update
                    .transition().duration(750)
                    .attr('x', d => xScale(d.name_full))
                    .attr('y', d => yScale(d.start))
                    .attr('width', xScale.bandwidth())
                    .attr('height', d => Math.max(0, yScale(d.end) - yScale(d.start))),
                exit => exit
                    .transition().duration(750)
                    .attr('height', 0)
                    .attr('y', d => yScale(d.start)) 
                    .remove()
            );
        
        svg.selectAll('.hover-column')
            .data(data, d => d.number)
            .join('rect')
            .attr('class', 'hover-column')
            .attr('x', d => xScale(d.name_full))
            .attr('y', 0)
            .attr('width', xScale.bandwidth())
            .attr('height', plotAreaHeight)
            .attr('fill', 'transparent')
            .on('mouseover', (event, d) => {
                tooltip.transition().duration(200).style('opacity', .9);
                tooltip.html(
                    `Ime: ${d.name_full}<br/>
                     Pontifikat: ${d.start.getFullYear()} - ${d.end.getFullYear()}<br/>
                     Trajanje: ${d.tenure.toFixed(2)} godina<br/>
                     Godina i mjesto rođenja: ${d.date_and_place_of_birth || 'N/A'}<br/>
                     Nacionalnost: ${d.Nationality || 'N/A'}<br/>`
                )
                .style('left', (event.pageX + 15) + 'px')
                .style('top', (event.pageY - 30) + 'px');

                if (xScale(d.name_full) !== undefined) {
                    highlightRect
                        .attr('x', xScale(d.name_full))
                        .attr('width', xScale.bandwidth())
                        .transition().duration(50)
                        .attr('opacity', 0.3);
                }
            })
            .on('mouseout', () => {
                tooltip.transition().duration(500).style('opacity', 0);
                highlightRect
                    .transition().duration(200)
                    .attr('opacity', 0);
            });
    }
    
    async function renderMap(data) {
        

        const mapContainer = d3.select('#map-chart');
        mapContainer.html('');
        const margin = { top: 10, right: 10, bottom: 10, left: 10 };
        const containerWidth = mapContainer.node().getBoundingClientRect().width;
        const width = containerWidth - margin.left - margin.right;
        const height = Math.max(400, containerWidth * 0.6); 
        const svg = mapContainer.append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);
            
        const g = svg.append('g') 
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const mapTooltip = d3.select('#map-tooltip');

        const world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
        const countries = topojson.feature(world, world.objects.countries);

        const popesByNationality = d3.rollup(data.filter(d => d.Nationality), v => v.length, d => d.Nationality);
        
        console.log('Popes by nationality:', popesByNationality);

        const colorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain([0, d3.max(Array.from(popesByNationality.values())) || 1]);

        const projection = d3.geoMercator()
            .fitSize([width, height], countries);

        const path = d3.geoPath().projection(projection);

        const countryToNationalitiesMap = {
            "Italy": ["Italian"],
            "San Marino": ["Italian"],
            "Vatican City": ["Italian"],
            "France": ["French"],
            "Germany": ["German"],
            "Spain": ["Spanish"],
            "Greece": ["Greek"],
            "Poland": ["Polish"],
            "Portugal": ["Portuguese"],
            "United Kingdom": ["British", "English"],
            "Ireland": ["Irish"],
            "Austria": ["Austrian"],
            "Hungary": ["Hungarian"],
            "Netherlands": ["Dutch"],
            "Belgium": ["Belgian"],
            "Switzerland": ["Swiss"],
            "Syria": ["Syrian"], 
            "Egypt": ["Egyptian"],
            "Argentina": ["Argentine"],
            "Croatia": ["Croatian"],
            "Czechia": ["Czech"], 
            "Tunisia": ["Tunisian"],
            "Algeria": ["Algerian"],
            "Israel": ["Palestinian"],
            "State of Palestine": ["Palestinian"],
            "West Bank": ["Palestinian"]
        };


        const countsPerGeoCountry = new Map();
        if (countries && countries.features) {
            countries.features.forEach(feature => {
                const geoCountryName = feature.properties.name;
                const relevantNationalities = countryToNationalitiesMap[geoCountryName];
                let totalCountForGeoCountry = 0;
                if (relevantNationalities) {
                    relevantNationalities.forEach(nat => {
                        totalCountForGeoCountry += (popesByNationality.get(nat) || 0); 
                    });
                }
                if (totalCountForGeoCountry > 0) {
                    countsPerGeoCountry.set(geoCountryName, totalCountForGeoCountry);
                }
            });
        }
        colorScale.domain([0, d3.max(Array.from(countsPerGeoCountry.values())) || 1]);

        g.selectAll('.country') 
            .data(countries.features)
            .join('path')
            .attr('class', 'country')
            .attr('d', path)
            .attr('fill', d => {
                const count = countsPerGeoCountry.get(d.properties.name) || 0;
                return count ? colorScale(count) : '#ccc';
            })
            .attr('stroke', '#333')
            .attr('stroke-width', 0.5)
            .on('mouseover', (event, d) => {
                const count = countsPerGeoCountry.get(d.properties.name) || 0;
                mapTooltip.transition().duration(200).style('opacity', .9);
                mapTooltip.html(`${d.properties.name}: ${count} papa`)
                    .style('left', (event.pageX + 5) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', () => {
                mapTooltip.transition().duration(500).style('opacity', 0);
            });

        const zoom = d3.zoom()
            .scaleExtent([1, 8]) 
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        svg.call(zoom);
    }

    function renderFrequencyChart(data) {
        const freqContainer = d3.select('#frequency-chart');
        freqContainer.html(''); 

        if (currentCenturyFilter !== 'all') {
            freqContainer.style('display', 'none'); 
            return; 
        }
        freqContainer.style('display', 'block'); 


        const margin = { top: 20, right: 30, bottom: 60, left: 60 }; 
        const containerWidth = freqContainer.node().getBoundingClientRect().width;
        const width = containerWidth - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = freqContainer.append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const popesByCentury = d3.rollup(data,
            v => v.length,
            d => Math.floor(d.start.getFullYear() / 100) + 1 
        );
        const centuriesData = Array.from(popesByCentury, ([century, count]) => ({ century, count }))
                                 .sort((a, b) => a.century - b.century);

        console.log('Popes by Century:', centuriesData);

        if (centuriesData.length <= 1 && currentCenturyFilter === 'all') {
            freqContainer.style('display', 'none'); 
            return; 
        }

        const xScale = d3.scaleBand()
            .domain(centuriesData.map(d => d.century + '. st.'))
            .range([0, width])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(centuriesData, d => d.count) || 1])
            .nice()
            .range([height, 0]);

        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');

        svg.append('g')
            .call(d3.axisLeft(yScale));

        const tooltip = d3.select('#tooltip'); 

        svg.selectAll('.freq-bar')
            .data(centuriesData, d => d.century)
            .join(
                enter => enter.append('rect')
                    .attr('class', 'freq-bar')
                    .attr('x', d => xScale(d.century + '. st.'))
                    .attr('y', d => yScale(0)) 
                    .attr('width', xScale.bandwidth())
                    .attr('height', 0) 
                    .attr('fill', 'teal')
                    .on('mouseover', (event, d) => {
                        tooltip.transition().duration(200).style('opacity', .9);
                        tooltip.html(`${d.century}. stoljeće: ${d.count} papa`)
                            .style('left', (event.pageX + 5) + 'px')
                            .style('top', (event.pageY - 28) + 'px');
                    })
                    .on('mouseout', () => {
                        tooltip.transition().duration(500).style('opacity', 0);
                    })
                    .transition().duration(750)
                    .attr('y', d => yScale(d.count))
                    .attr('height', d => height - yScale(d.count)),
                update => update
                    .transition().duration(750)
                    .attr('x', d => xScale(d.century + '. st.'))
                    .attr('y', d => yScale(d.count))
                    .attr('width', xScale.bandwidth())
                    .attr('height', d => height - yScale(d.count)),
                exit => exit
                    .transition().duration(750)
                    .attr('y', d => yScale(0))
                    .attr('height', 0)
                    .remove()
            );
    }

    function renderDurationChart(data, sortOrder = 'duration') {
        const durationContainer = d3.select('#duration-chart');
        durationContainer.html('');

        const tooltip = d3.select('#tooltip');

        let sortedData = [...data]; 
        if (sortOrder === 'duration') {
            sortedData.sort((a, b) => b.tenure - a.tenure);
        } else if (sortOrder === 'alphabetical') {
            sortedData.sort((a, b) => a.name_full.localeCompare(b.name_full));
        }

        const displayData = sortedData;

        if (displayData.length === 0) { 
            durationContainer.append('p').text('Nema podataka za prikaz prema odabranim filterima.');
            return;
        }

        const margin = { top: 20, right: 20, bottom: 120, left: 50 }; 
        
        const minBarWidth = 25; 
        const calculatedMinWidth = displayData.length * minBarWidth; 
        const containerWidth = durationContainer.node().getBoundingClientRect().width;
        
        const plotAreaWidth = Math.max(containerWidth - margin.left - margin.right, calculatedMinWidth - margin.left - margin.right);

        const chartPlotHeight = 300; 
        const height = chartPlotHeight - margin.top - margin.bottom;

        const svg = durationContainer.append('svg')
            .attr('width', plotAreaWidth + margin.left + margin.right) 
            .attr('height', chartPlotHeight) 
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleBand()
            .domain(displayData.map(d => d.name_full))
            .range([0, plotAreaWidth]) 
            .padding(0.15);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(displayData, d => d.tenure) || 1])
            .nice()
            .range([height, 0]); 

        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
                .attr('transform', 'rotate(-65)') 
                .style('text-anchor', 'end')
                .attr('dx', '-.8em')
                .attr('dy', '.15em');

        svg.append('g')
            .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => d + ' god.'));

        svg.selectAll('.duration-bar')
            .data(displayData, d => d.number) 
            .join(
                enter => enter.append('rect')
                    .attr('class', 'duration-bar')
                    .attr('x', d => xScale(d.name_full))
                    .attr('y', d => yScale(0)) 
                    .attr('width', xScale.bandwidth())
                    .attr('height', 0)
                    .attr('fill', 'purple')
                    .on('mouseover', (event, d) => {
                        tooltip.transition().duration(200).style('opacity', .9);
                        tooltip.html(
                            `${d.name_full}<br/>
                             Trajanje: ${d.tenure.toFixed(2)} godina<br/>
                             Nacionalnost: ${d.Nationality || 'N/A'}`
                        )
                        .style('left', (event.pageX + 5) + 'px')
                        .style('top', (event.pageY - 28) + 'px');
                    })
                    .on('mouseout', () => {
                        tooltip.transition().duration(500).style('opacity', 0);
                    })
                    .transition().duration(750)
                    .attr('y', d => yScale(d.tenure))
                    .attr('height', d => height - yScale(d.tenure)),
                update => update
                    .transition().duration(750)
                    .attr('x', d => xScale(d.name_full))
                    .attr('y', d => yScale(d.tenure))
                    .attr('width', xScale.bandwidth())
                    .attr('height', d => height - yScale(d.tenure)),
                exit => exit
                    .transition().duration(750)
                    .attr('y', d => yScale(0))
                    .attr('height', 0)
                    .remove()
            );
    }

    let currentSortOrder = 'chronological';
    let currentNationalityFilter = 'all';
    let currentCenturyFilter = 'all';

    function applyFiltersAndSort() {
        let filteredData = [...combinedData];

        if (currentNationalityFilter !== 'all') {
            filteredData = filteredData.filter(d => d.Nationality === currentNationalityFilter);
        }

        if (currentCenturyFilter !== 'all') {
            const century = parseInt(currentCenturyFilter);
            filteredData = filteredData.filter(d => {
                const startCentury = Math.floor(d.start.getFullYear() / 100) + 1;
                return startCentury === century;
            });
        }

        if (currentSortOrder === 'duration') {
            filteredData.sort((a, b) => b.tenure - a.tenure);
        } else if (currentSortOrder === 'alphabetical') {
            filteredData.sort((a, b) => a.name_full.localeCompare(b.name_full));
        } else { 
            filteredData.sort((a, b) => a.start - b.start);
        }
        
        renderTimeline(filteredData);
        renderMap(filteredData); 
        renderFrequencyChart(filteredData);
        renderDurationChart(filteredData, currentSortOrder); 
    }

    function populateFilters() {
        const nationalities = [...new Set(combinedData.map(d => d.Nationality).filter(n => n))].sort();
        const nationalitySelect = d3.select('#nationality-filter');
        nationalities.forEach(nat => {
            nationalitySelect.append('option').attr('value', nat).text(nat);
        });

        const centuries = [...new Set(combinedData.map(d => Math.floor(d.start.getFullYear() / 100) + 1))].sort((a,b) => a-b);
        const centurySelect = d3.select('#century-filter');
        centuries.forEach(cent => {
            centurySelect.append('option').attr('value', cent).text(cent + '. stoljeće');
        });
    }

    d3.select('#sort-order').on('change', function() {
        currentSortOrder = this.value;
        applyFiltersAndSort();
    });

    d3.select('#nationality-filter').on('change', function() {
        currentNationalityFilter = this.value;
        applyFiltersAndSort();
    });

    d3.select('#century-filter').on('change', function() {
        currentCenturyFilter = this.value;
        applyFiltersAndSort();
    });

    let timelineAnimationInterval = null;
    d3.select('#animate-timeline-button').on('click', function() {
        if (timelineAnimationInterval) {
            clearInterval(timelineAnimationInterval);
            timelineAnimationInterval = null;
            this.textContent = 'Pokreni Animaciju Vremenske Crte';
        } else {
            this.textContent = 'Zaustavi Animaciju Vremenske Crte';
            console.log('Timeline animation started (placeholder)');
            let currentIndex = 0;
            const sortedForAnimation = [...combinedData].sort((a,b) => a.start - b.start);
            
            if (sortedForAnimation.length === 0) return;

            renderTimeline([sortedForAnimation[0]]); 

            timelineAnimationInterval = setInterval(() => {
                currentIndex++;
                if (currentIndex < sortedForAnimation.length) {
                    renderTimeline(sortedForAnimation.slice(0, currentIndex + 1));
                } else {
                    clearInterval(timelineAnimationInterval);
                    timelineAnimationInterval = null;
                    this.textContent = 'Pokreni Animaciju Vremenske Crte';
                    console.log('Timeline animation finished.');
                }
            }, 200); 
        }
    });


    populateFilters();
    applyFiltersAndSort(); 
});