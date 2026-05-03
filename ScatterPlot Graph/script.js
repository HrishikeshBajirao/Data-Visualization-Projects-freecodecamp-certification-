function minsToDateObj(d){
  const mins = d.Time.slice(0, 2);
  const secs = d.Time.slice(3);
  const date = new Date();
  date.setMinutes(mins, secs);
  return date;
}

document.addEventListener("DOMContentLoaded", () =>{
  fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then(res => res.json())
    .then(dataset => {
    const w = 800;
    const h = 600;
    
    const tooltip = document.getElementById("tooltip");
    
    const svg = d3
      .select("#graph")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    const padding = 40;
    
//Scales    
    const xScale = d3.scaleTime()
      .domain([d3.min(dataset, d => new Date(d.Year-1, 0)), d3.max(dataset, d => new Date(d.Year+1, 0))])
      .range([padding, w - padding]);
    
    const yScale = d3.scaleTime()
      .domain([d3.min(dataset, d => minsToDateObj(d)), d3.max(dataset, d => minsToDateObj(d))])
      .range([padding, h - padding]);
    
//Axes of the graph    
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d3.timeFormat("%M:%S"));
    
    svg
      .append('g')
      .attr('transform', 'translate(0, ' + (h - padding) + ')')
      .call(xAxis)
      .attr('id', 'x-axis');
    
    svg
      .append('g')
      .attr('transform', 'translate(' + (padding) + ', 0)')
      .call(yAxis)
      .attr('id', 'y-axis');
    
//scatterplot circles
    svg
      .selectAll('circle')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('cx', (d, i) => xScale(new Date(d.Year, 0)))
      .attr('cy', (d, i) => yScale(minsToDateObj(d)))
      .attr('r', 7)
      .attr('data-xvalue', d => d.Year)
      .attr('data-yvalue', d => minsToDateObj(d))
      .attr('class', 'dot')
      .attr('fill', d => {
        if(d.Doping == "")  return "orange";
        else  return "blue"
      })
      .attr('fill-opacity', 0.6)
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .on("mouseenter", (e, d) => {  //Tooltip
          tooltip.style.opacity = 0.9;
          tooltip.innerHTML =`<p id="name-country">${d.Name}: ${d.Nationality}</p><p id="data-year">Year: ${d.Year} Time: ${d.Time}</p><br><p id="doping">${d.Doping}</p>`;
          tooltip.style.top = (e.offsetY + 30) + "px";
          tooltip.style.left = (e.offsetX + 30) + "px";
          tooltip.dataset.year = d.Year;
      })
      .on("mouseleave", (e, d) => {
          tooltip.style.opacity = 0;
          tooltip.innerHTML = "";
      })
    
    
//legend    
    const legend = svg.append("g")
      .attr("id", "legend")
      .attr("transform", "translate(560, 120)");

    legend.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "orange");

    legend.append("text")
      .attr("x", 22)
      .attr("y", 12)
      .text("No doping allegations");

    legend.append("rect")
      .attr("x", 0)
      .attr("y", 28)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "blue");

    legend.append("text")
      .attr("x", 22)
      .attr("y", 40)
      .text("Riders with doping allegations");
    
  })
})