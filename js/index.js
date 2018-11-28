const movieSales = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json';

const margin = {top: 50, right: 50, bottom: 150, left: 50};

const width = 1020;
const height = 960;

const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr('transform', `translate(${margin.left},${25})`);

const tooltip = d3.select('body').append('div')
.attr('class', 'tooltip')
.attr('id', 'tooltip')
.style('opacity', 0);

const formatComma = d3.format(",")

const categories = ["Action", "Adventure", "Drama", "Comedy", "Animation", "Biography"];

const colors = d3.scaleOrdinal(d3.schemeCategory10)
  .domain(categories);

const treemap = d3.treemap().size([width,height]).padding(1).round(true);

d3.json(movieSales).then((movies)=>{
  
const root = d3.hierarchy(movies)
             .sum((d)=> d.value)
             .sort((a,b)=> b.height - a.height || b.value - a.value);
treemap(root);
  
   svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .attr("class","text")
        .attr("id", "title")
        .attr("text-anchor", "middle")  
        .style("font-size", "24px") 
        .style("text-decoration", "underline")  
        .text("Best selling movies by categories");  
  
      svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 24 - (margin.top / 2))
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .attr("id", "description")
        .attr("class","text")
        .attr("text-anchor", "middle")  
        .style("font-size", "12px") 
        .text("By box office sales");
  
const cell = svg.selectAll('g')
.data(root.leaves())
.enter()
.append('g')
.attr('transform', `translate(${margin.left},${margin.top + 100})`);
   
  cell
  .append('rect')
  .attr("class", "tile")
  .attr("title", (d) => d.data.name)
  .attr('transform', (d) => `translate(${d.x0},${d.y0})`)
  .style("width", (d) => `${d.x1 - d.x0}px`)
  .style("height", (d) => `${d.y1 - d.y0}px`)
  .attr("data-name", (d) => d.data.name)
  .attr("data-category", (d) => d.data.category)
  .attr("data-value", (d) => d.value)
  .style("fill", (d) => colors(d.data.category))
   .on("mouseover", d => {
    tooltip
    .transition()
    .duration(50)
    .style('opacity', 0.9)
    
  tooltip.attr("data-value", d.value);
    
    tooltip
    .html(`<strong>Category:</strong> ${d.data.category}<br/>
           <strong>Movie:</strong> ${d.data.name}<br/>
            <strong>Box Office:</strong> $${formatComma(d.data.value)}<br/>`)
    .style("left", d3.event.pageX - 75 + "px")
    .style("top", d3.event.pageY - 100 + "px");
    
    
  })
  .on("mouseout", () => {
    tooltip
    .transition()
    .duration(50)
    .style("opacity", 0);
  });
  
  cell.append("text")
  .attr("x",d=>d.x0+5)
  .attr("y",d=>d.y0+15)
  .attr("dy", "0em")
  .attr("class", "cell-text")
  .attr("height", d => d.y1 - d.y0)
  .attr("width", d => d.x1 - d.x0)
  .attr("data-value", d => d.value)
  .text((d)=>d.data.name);
  
  const legend = svg.append("g")
  .attr("id", "legend")
  .attr("x", margin.left)
  .attr("y", 25)
  .attr("height", 1000)
  .attr("width", 1000);

  legend.selectAll('rect')
      .data(categories)
      .enter().append("rect")
  .attr("class", "legend-item")
  .attr("x", margin.left + 5)
  .attr("y", (d, i) => i *  25)
  .attr("width", 15)
  .attr("height", 15)
  .style("fill", d => colors(d));
  
  legend.selectAll('text')
    .data(categories)
      .enter().append("text")
  .attr("x", margin.left + 25 )
  .attr("y", (d, i) => i *  25)
  .attr('transform', (d,i) => `translate(0,${-546.5})`)
  .attr('fill', 'black')
  .attr('dy', '35em')
  .text((d,i) => d);
  
}).catch(e => {
    console.log(e);
});