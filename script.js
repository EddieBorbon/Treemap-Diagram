const width = 960;
const height = 600;

const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const tooltip = d3.select("#tooltip");

// Paleta de colores moderna
const color = d3.scaleOrdinal()
    .range(["#00ffcc", "#ff00cc", "#cc00ff", "#00ccff", "#ffcc00"]);

// Cargar los datos
d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json")
    .then(data => {
        // Jerarquizar los datos
        const root = d3.hierarchy(data).sum(d => d.value);

        // Crear el treemap
        d3.treemap()
            .size([width, height])
            .padding(1)(root);

        // Crear los rectángulos (tiles)
        const tile = svg.selectAll("g")
            .data(root.leaves())
            .enter()
            .append("g")
            .attr("transform", d => `translate(${d.x0},${d.y0})`);

        // Añadir rectángulos
        tile.append("rect")
            .attr("class", "tile")
            .attr("data-name", d => d.data.name)
            .attr("data-category", d => d.data.category)
            .attr("data-value", d => d.data.value)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .attr("fill", d => color(d.data.category))
            .on("mouseover", function(event, d) {
                // Mostrar tooltip
                tooltip.style("opacity", 1)
                    .html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`)
                    .attr("data-value", d.data.value)
                    .style("left", `${event.pageX + 5}px`)
                    .style("top", `${event.pageY - 28}px`);
            })
            .on("mouseout", function() {
                // Ocultar tooltip
                tooltip.style("opacity", 0);
            });

        // Añadir texto dentro de los rectángulos
        tile.append("text")
            .attr("x", 5)
            .attr("y", 15)
            .text(d => d.data.name)
            .attr("font-size", "10px")
            .attr("fill", "#00ffcc") // Texto neón
            .attr("stroke", "#009999") // Borde del texto
            .attr("stroke-width", "0.5px");

        // Crear la leyenda
        const legend = d3.select("#legend")
            .append("svg")
            .attr("width", 300)
            .attr("height", 50)
            .selectAll("g")
            .data(root.leaves().map(d => d.data.category).filter((value, index, self) => self.indexOf(value) === index))
            .enter()
            .append("g")
            .attr("transform", (d, i) => `translate(${i * 100}, 0)`);

        // Añadir rectángulos a la leyenda
        legend.append("rect")
            .attr("class", "legend-item")
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", d => color(d));

        // Añadir texto a la leyenda
        legend.append("text")
            .attr("x", 25)
            .attr("y", 15)
            .text(d => d)
            .attr("fill", "#ffffff") // Texto blanco
            .attr("font-size", "12px");
    })
    .catch(error => {
        console.error("Error loading the data", error);
    });