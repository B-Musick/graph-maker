class BarChart extends Plot{
    constructor(file){
        super(file);
        this.plotType = 'bar-graph';
    }

    setData = () => {
        /***** THIS METHOD CHANGES BASED ON GRAPH TYPE ******/
        let data = super.setData();
        // Parse the string values into integers
        this.dataset = data.map(arr => {
            return [arr[0], parseInt(arr[1])];
        });
        
    }

    /***************************** SCALES  *************************************/
    // Map (parsedDataset[0] to the x axis starting at padding, ending width-padding)
    setXScale=()=>{
        this.xScale = d3.scaleBand()
            .domain(this.dataset.map(data => data[0]))
            .range([0, this.innerWidth]);
    }


    drawBars=()=>{
        this.axesContainer.selectAll('rect') // Get the set of elements
            .data(this.dataset)
            .enter() // Create thing that creates rectangle for each row of data
            .append('rect')
                .attr('x-axis-category', this.xValue + "") // Needs to match date on x-axis
                .attr('y-axis-value', this.yValue + "") // Needs to match gdp of y-axis
                .attr('width', this.xScale.bandwidth() - 10 + "") // Width of bars using xScales band widths
                .attr('height', d => this.innerHeight - this.yScale(this.yValue(d))) // Height is the height - yScale value
                .attr('class', 'bar')
                // X will scale according to its scaling factor
                .attr('x', (d, i) => { return 5 + this.xScale(this.xValue(d)) }) // Location of bars on x-axis
                // Need to subtract the yScaled value from height since scaled it this way
                .attr('y', d => (this.yScale(this.yValue(d))) + "") // Makes sure bars arent above x-axis

                .style('fill', '#4aa89c')
                .style('margin', '2')
                .on("mouseout", function () {
                    // When mouse stops hovering a specific bar
                    d3.select(this)
                        .transition()
                        .duration(400)
                        .style("fill", "#4aa89c");
                   
                    d3.select('#tooltip')
                        .style("visibility", "hidden")
                        .style("opacity", 0);
                })
                .on("mouseover", function (d) {
                    let x = d3.mouse(this)[0];
                    let y = d3.mouse(this)[1];

                    
                    d3.select(this).style("fill", "a8eddf");
                    d3.select('#tooltip').style("visibility", "visible")
                        .style('opacity', 1)
                        .html(d[0] + " - " + d[1] )
                            .style('left', (x+150)+ 'px')
                            .style('top', y+ 'px');
                });;
    }

    drawBarChart = () => {
        this.drawBars();
        
    }



}





