class NormalCurve extends Plot{
    constructor(file) {
        super(file)
        this.plotType = 'normal';

        // Box
        this.rectHeight;
        this.rectX;
        this.rectY;

        // Values set in setData
        this.maxVal;
        this.minVal;

        this.categories = []; // Set in setCategories

        // Use these to prevent repetative data
        // Replace whole equation d=>d[0]
        // Replace part - d => xValue(d)
        this.xValue = d => d[0];
        this.yValue = d => d[1];

        this.dataArray = [];
        this.density;
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
    }

    /***************************** SCALES  *************************************/
    // Map (parsedDataset[0] to the x axis starting at padding, ending width-padding)
    setXScale = () => {
        this.xScale = d3.scaleLinear()
            .domain([0,d3.max(this.dataset)])
            .range([0, this.innerWidth]);
    }

    setYScale = () => {
        // Set the xScale using date values, map the domain to the range to fit the page
        this.yScale = d3.scaleLinear()
            // Take the domain 'dates' and map them to the x-axis (method chaining)
            .domain([0, 0.01]) // (first(earliest) date, last(latest) date)
            .range([this.innerHeight, 0]); // Left screen, right screen
    }

    /***************************** AXES **************************************/

    /************* AXIS LABELS *******************/

    setYAxisLabel = () => {
        this.svg.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "end")
            .attr("y", -this.margin.left / 2)
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

    /************************** COMPUTE DENSITY ****************************/
    kernelDensityEstimator = (kernel, X) => {
        return function (V) {
            return X.map(function (x) {
                return [x, d3.mean(V, function (v) { return kernel(x - v); })];
            });
        };
    }

    kernelEpanechnikov = (k) => {
        return function (v) {
            return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
        };
    }
    
    computeKernal=()=>{
        var kde = this.kernelDensityEstimator(this.kernelEpanechnikov(7), this.xScale.ticks(20));
        this.density = kde(this.dataset.map(function (d) { return d; }));
        
    }

    /*************************** PLOT GRAPH ***************************/
    plotArea=()=>{
        console.log(this.density)
        this.svg.append("path")
            .attr("class", "mypath")
            .datum(this.density)
            .attr("fill", "#69b3a2")
            .attr("opacity", ".8")
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("stroke-linejoin", "round")
            .attr("d", d3.line()
                .curve(d3.curveBasis)
                .x(d=>this.margin.left+this.xScale(d[0]))
                .y(d => this.margin.top+this.yScale(d[1]))
            );

    }

    drawNormal = () => {
        this.setXAxisLabel();
        this.setYAxisLabel();
        this.computeKernal();
        this.plotArea();
    }
}

/******************* THINGS TO ADD 
 * Interquartile values
 * remove the outliers
 * allow them to set the ticks (in computeKernal) since it will affect how many values
 * are used to computed the density curve 
 * 
 * TEST DATA
 * https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv
 * 
 * HOW I MADE IT
 * https://www.d3-graph-gallery.com/graph/density_basic.html
*/