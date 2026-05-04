document.addEventListener("DOMContentLoaded", () => {
  fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
  .then(res => res.json())
  .then(rawData => {
    const baseTemp = rawData.baseTemperature;
    const dataset = rawData.monthlyVariance;
    const tooltip = document.getElementById("tooltip");    
    console.log(dataset)
    
    
    const w = 1250;
    const h = 450;
    
    const svg = d3
      .select("#heatmap")
      .append("svg")
      .attr("width", w+50)
      .attr("height", h+70);
    
    const padding = 20;
    const barWidth = (w - 2*padding) / (d3.max(dataset, d => d.year) - d3.min(dataset, d => d.year));
    const barHeight = (h - 2*padding) / 12;
//Scales    
    const xScale = d3.scaleTime()
      .domain([d3.min(dataset, d => new Date(d.year, 0)), d3.max(dataset, d => new Date(d.year, 0))])
      .range([padding+50, w - padding]);
    
    const yScale = d3.scaleBand()
      .domain(d3.range(0, 12))
      .range([padding, h - padding]);
//Axes
    const xAxis = d3.axisBottom(xScale)
      .tickSize(10);
    
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d => months[d])
      .tickSize(10);
    
    svg
      .append("g")
      .attr('transform', 'translate(0, ' + (h - padding) + ')')
      .call(xAxis)
      .attr("id", "x-axis");
    svg
      .append("g")
      .attr('transform', 'translate(' + (padding + 50) + ', 0)')
      .call(yAxis)
      .attr("id", "y-axis");

   
//Heat Bars
    
    svg
      .selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('width', barWidth)
      .attr('height', barHeight)
      .attr('x', d => xScale(new Date(d.year, 0)))
      .attr('y', d => yScale(d.month - 1))
      .attr('class', 'cell')
      .attr("data-month", d => d.month - 1)
      .attr("data-year", d => d.year)
      .attr("data-temp", d => baseTemp + d.variance)
      .attr('fill', d => {
        const temp = baseTemp + d.variance;
        if(temp <= 12.8 && temp > 11.7) return "#D73027";
        else if(temp > 10.6)  return "#F46D43";
        else if(temp > 9.5) return "#FDAE61";
        else if(temp > 8.3) return "#FEE090";
        else if(temp > 7.2) return "#FFFFBF";
        else if(temp > 6.1) return "#E0F3F8";
        else if(temp > 5.0) return "#ABD9E9";
        else if(temp > 3.9) return "#74ADD1";
        else return "#4575B4";
      })
      .on("mouseenter", (e, d) => {
        tooltip.style.opacity = 0.7;
        tooltip.innerHTML = `<p>${d.year} - ${months[d.month - 1]}</p><p></p>${(baseTemp + d.variance).toFixed(1)}<p>${d.variance.toFixed(1)}</p>`;
        tooltip.style.top = (e.offsetY + 30) + "px";
        tooltip.style.left = (e.offsetX + 30) + "px";
        tooltip.dataset.year = d.year;
      })
      .on("mouseleave", (e, d) => {
         tooltip.style.opacity = 0;
         tooltip.innerHTML = '';
      })
    
//legend
      
    const legend = svg
      .append("g")
      .attr("id", "legend")
      .attr("transform", `translate(200, ${h + 20})`);
      
    
    const colors = [
      [2.8, "#4575B4"],
      [3.9, "#74ADD1"],
      [5.0, "#ABD9E9"],
      [6.1, "#E0F3F8"],
      [7.2, "#FFFFBF"],
      [8.3, "#FEE090"],
      [9.5, "#FDAE61"],
      [10.6, "#F46D43"],
      [11.7, "#D73027"]
     ]
    
    const ticks = ['', 2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8, '']
    
    legend
      .selectAll("rect")
      .data(colors)
      .enter()
      .append("rect")
      .attr("width", 30)
      .attr("height", 25)
      .attr("x", (d, i) => i*30)
      .attr("fill", (d, i) => d[1])
      .attr("stroke", "black")
      .attr("stroke-width", 1);
    
    const xScaleLegend = d3.scaleLinear()
      .domain([0, 11])
      .range([0, 330]);
    
    const xAxisLegend = d3.axisBottom(xScaleLegend)
      .tickSize(12)
      .tickFormat(d => ticks[d]);
    
    legend
      .append("g")
      .attr('transform', 'translate(-30, 25)')
      .call(xAxisLegend)
      
    
    svg.append("text")
    .attr("x", w / 2)
    .attr("y", h + 30)
    .style("font-size", "14px")
    .text("Years");
    
    svg.append("text")
    .attr('transform', 'rotate(-90)')
    .attr("x", - h / 2)
    .attr("y", 20)
    .style("font-size", "14px")
    .text("Months");
    
  })
})