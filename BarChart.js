class BarChart extends Plot{
    constructor(file){
        super(file);
        // Use these to prevent repetative data
        // Replace whole equation d=>d[0]
        // Replace part - d => xValue(d)
        this.xValue = d=>d[0];
        this.yValue = d=>d[1];


    }
    setData = () => {
        /***** THIS METHOD CHANGES BASED ON GRAPH TYPE ******/
        let data = [];

        this.file.forEach((val) => {
            // Push the data into the array([val1, val1]), turn them into arrays
            data.push(val.split(','));
        })
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
    setYScale=()=>{
        // Set the xScale using date values, map the domain to the range to fit the page
        this.yScale = d3.scaleLinear()
            // Take the domain 'dates' and map them to the x-axis (method chaining)
            .domain([0, d3.max(this.dataset, d => d[1])]) // (first(earliest) date, last(latest) date)
            .range([this.innerHeight, 0]); // Left screen, right screen
    }


    /***************************** AXES **************************************/

    /************* AXIS LABELS *******************/

    setYAxisLabel = () => {
        this.svg.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "end")
            .attr("y", -this.margin.left/2)
            .attr("x", -this.innerHeight / 1.9)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .style('font-size', this.innerHeight * 0.04 + "")
            .text(`${this.axesTitles[1]}`);
  
    }

    setXAxisLabel=()=>{
        this.svg.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "end")
            .attr("x", this.innerWidth / 1.8)
            .attr("y", this.innerHeight+2*this.margin.bottom-20)
            .style('font-size', this.innerHeight * 0.04 + "")
            .text(`${this.axesTitles[0]}`);
    }

    drawBars=()=>{
        this.axesContainer.selectAll('rect') // Get the set of elements
            .data(this.dataset)
            .enter() // Create thing that creates rectangle for each row of data
            .append('rect')
                .attr('data-country', this.xValue + "") // Needs to match date on x-axis
                .attr('data-gdp', this.yValue + "") // Needs to match gdp of y-axis
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
        this.setXAxisLabel();
        this.setYAxisLabel();
        this.drawBars();

    }



}





