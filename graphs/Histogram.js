class Histogram extends Plot{
    constructor(file) {
        super(file)
        this.plotType = 'histogram';
        this.categoryAmount = document.getElementById('histogram-input').value;
        
        // Box
        this.rectHeight;
        this.rectX;
        this.rectY;

        // Values set in setData
        this.maxVal;
        this.minVal;

        this.categories = []; // Set in setCategories
        this.barHeights = new Array(parseInt(this.categoryAmount));
        // Use these to prevent repetative data
        // Replace whole equation d=>d[0]
        // Replace part - d => xValue(d)
        this.xValue = d => d[0];
        this.yValue = d => d[1];

        this.dataArray=[];
    }

    setData = () => {
        let data = [];

        // If boxplot, then x-axis is n (n=# of data points)
        this.file.forEach((val) => {
            if (val !== "") // Make sure actual values
                // Push the data into the array([val1, val1]), turn them into arrays
                data.push(parseInt(val));
        });
        this.dataset = data.sort((function (a, b) { return a - b }));
        this.maxVal = d3.max(data);
        this.minVal = d3.min(data);
        this.setCategories();
        
    }

    setCategories=()=>{
        /** This will set the x-axis category divisions based on the data max and min and
         * the categoryAmount input
         */
        // Get the range of values
        let range = (this.maxVal - this.minVal)/this.categoryAmount;
        let val = this.minVal; // Used to incremnet the range values for categories
        let i = 0;
        while(i<=this.categoryAmount){
            this.categories.push(Math.ceil(val));
            val+=range; // Increment the range
            i++;
        }
        this.setCategoryFrequency();
    }

    setCategoryFrequency=()=>{
        let data = this.dataset;
        /* This will set the amounts of the data within each category */
        for(let val = 1; val<=this.categoryAmount; val++){
            
            let valCount=0;
            for(let i=0; i<=data.length;i++){
                
                if(data[i]<=this.categories[val]){
                    valCount++;
                    continue;
                }else{
                    data.splice(0,valCount);
                    this.barHeights[val-1] = valCount;
                    break;
                }
            }
        }
        this.setDataArray();
    }

    setDataArray=()=>{
        let categories= [...this.categories]
        let category = categories.splice(1, this.categoryAmount);
        for(let i=0;i<category.length;i++){
            this.dataArray.push([category[i],this.barHeights[i]])
        }
    }

    /***************************** SCALES  *************************************/
    // Map (parsedDataset[0] to the x axis starting at padding, ending width-padding)
    setXScale = () => {
        this.xScale = d3.scaleBand()
            .domain(this.categories.map(data=>data))
            .range([0, this.innerWidth]);
    }
    setYScale = () => {
        // Set the xScale using date values, map the domain to the range to fit the page
        this.yScale = d3.scaleLinear()
            // Take the domain 'dates' and map them to the x-axis (method chaining)
            .domain([0, d3.max(this.barHeights)]) // (first(earliest) date, last(latest) date)
            .range([this.innerHeight, 0]); // Left screen, right screen
    }

    /***************************** AXES **************************************/

    /************* AXIS LABELS *******************/

    setYAxisLabel = () => {
        this.svg.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "end")
            .attr("y", this.margin.left / 2)
            .attr("x", -this.innerHeight / 1.9)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .style('font-size', this.innerHeight * 0.04 + "")
            .text(`${this.axesTitles[1]}`);

    }

    setXAxisLabel = () => {
        this.svg.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "end")
            .attr("x", this.innerWidth / 1.8)
            .attr("y", this.innerHeight + 2 * this.margin.bottom - 20)
            .style('font-size', this.innerHeight * 0.04 + "")
            .text(`${this.axesTitles[0]}`);
    }


    drawBars = () => {
        this.axesContainer.selectAll('rect') // Get the set of elements
            .data(this.dataArray)
            .enter() // Create thing that creates rectangle for each row of data
            .append('rect')
            .attr('x-axis-category', this.xValue + "") // Needs to match date on x-axis
            .attr('y-axis-value', this.yValue + "") // Needs to match gdp of y-axis
            .attr('width', this.xScale.bandwidth() + "") // Width of bars using xScales band widths
            .attr('height', d => this.innerHeight - this.yScale(this.yValue(d))) // Height is the height - yScale value
            .attr('class', 'bar')
            // X will scale according to its scaling factor
            .attr('x', (d, i) => { return (this.xScale(this.xValue(d))-this.xScale.bandwidth()/2) }) // Location of bars on x-axis
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
                    .html(d[0] + " - " + d[1])
                    .style('left', (x + 150) + 'px')
                    .style('top', y + 'px');
            });;
    }

    drawHistogram=()=>{
        this.setXAxisLabel();
        this.setYAxisLabel();
        this.drawBars();
    }
}

/* Logic to show dropdown for histogram to pick amount of graph bars to use */
let graphDropdown = document.getElementById('dropdown-list');
let histogramDropdown = document.getElementById('histogram-input');

graphDropdown.addEventListener('change',()=>{
    if(graphDropdown.value ==='histogram'){
        histogramDropdown.style.visibility = 'visible';
    }
});