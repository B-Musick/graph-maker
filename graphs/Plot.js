class Plot {
    constructor(file) {
        this.file = file;
        this.svg = d3.select('svg');
        this.title;
        this.axesTitles;
        // dataset will be an array of arrays, the first value being the date, second the gdp
        this.dataset = []; // Holds the data
        this.svgWidth = 960; // Holds percentage integer
        this.svgHeight = 700; // Holds percentage integer
        this.margin = { top: 80, right: 80, bottom: 80, left: 120 }; // This will be margin for axes starts from svg border
        this.innerWidth; // Used to make everything relative to axis
        this.innerHeight; // Used to make everything relative to axis
        this.plotType; // Holds the plot type

        // Axes variables
        this.xScale;
        this.yScale;

        // Axes Container
        this.axesContainer;

        // Hold the x and y axis scaled to values
        this.xAxis;
        this.yAxis;

        this.tooltip = d3.select('body')
            .append("div")
            .attr("id", "tooltip")
            .style('visiblity', 'hidden');

        // Use these to prevent repetative data
        // Replace whole equation d=>d[0]
        // Replace part - d => xValue(d)
        this.xValue = d => d[0];
        this.yValue = d => d[1];

        this.xMean = null;
        this.yMean = null;
        this.varianceValX;
        this.varianceValY;
        this.xStandardDeviation;
        this.yStandardDeviation;

    }

    createPlot = () => {
        // Remove all the data so when new file loaded it doesnt overlap
        // https://stackoverflow.com/questions/3674265/is-there-an-easy-way-to-clear-an-svg-elements-contents
        this.removePreviousData();
        this.setTitle(); 
        this.getPlotType(); // Retrieve plot type from dropdown (REMOVE)
        this.getAxesTitles(); // Get the axes titles

        // Define the innerWidth/ innerHeight of the graph 
        this.setMargins();

        // Retrieve the data from this.file and add to an array
        this.setData();
        
        // Set scales depending on data (domain -> range)
        this.setXScale();
        this.setYScale();

        // Holds the x and y axis translation from svg edges
        this.setAxesContainer();

        // Set axis ticks based on the x and y scales
        this.prepareXAxis();
        this.prepareYAxis();

        this.setXAxis();
        this.setYAxis();

        // Axis Labels
        this.setXAxisLabel();
        this.setYAxisLabel();
        
        // Set Distribution Calculations
        this.mean();
        this.variance();
        this.standardDeviation();
    }

    removePreviousData=()=>{
        // Remove all the data so when new file loaded it doesnt overlap
        // https://stackoverflow.com/questions/3674265/is-there-an-easy-way-to-clear-an-svg-elements-contents
        this.svg.selectAll("*").remove();
        
    }

    setTitle = () => {
        // Called in createPlot to set the title
        this.title = document.getElementById('title');

        // Remove the first value from the array which is the title
        this.title.textContent = this.file.shift();
    }

    getPlotType = () => {
        // Get the plot type chosen from the dropdown menu
        let plotDropdown = document.getElementById('dropdown-list');
        this.plotType = plotDropdown.value;
    }

    getAxesTitles = () => {
        // called in createPlot method
        // Remove the second values from the array which are the [x,y] values
        this.axesTitles = this.file.shift().split(',');
    }

    setMargins = () => {
        // Use to style and set scales and axes (in %)
        // Called in this.createPlot()
        this.innerWidth = this.svgWidth - this.margin.left - this.margin.right;
        this.innerHeight = this.svgHeight - this.margin.top - this.margin.bottom;
    }

    setData() {
        /***** THIS METHOD CHANGES BASED ON GRAPH TYPE ******/
        let data = [];

        this.file.forEach((val) => {
            // Push the data into the array([val1, val1]), turn them into arrays
            data.push(val.split(','));
        });
        return data;
    }

    /***************************** SCALES  ************************************
     * CHANGE DEPENDING ON TYPE OF PLOT
    */

    setXScale = () => { }

    setYScale = () => { 
        // Set the xScale using date values, map the domain to the range to fit the page
        this.yScale = d3.scaleLinear()
            // Take the domain 'dates' and map them to the x-axis (method chaining)
            .domain([0, d3.max(this.dataset, d => d[1])]) // (first(earliest) date, last(latest) date)
            .range([this.innerHeight, 0]); // Left screen, right screen
    }

    /*********** AXES COORDINATES  ************/

    setAxesContainer = () => {
        this.axesContainer = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
    }

    // Axis takes scale function, determine what values in scale correspond to what pixels
    prepareXAxis = () => {
        this.xAxis = d3.axisBottom(this.xScale);
    }

    prepareYAxis = () => {
        this.yAxis = d3.axisLeft(this.yScale);
    }

    setXAxis = () => {
        // X-AXIS
        this.axesContainer.append('g')
            // Define x,y coordinates translation from the left of screen and from top of screen 
            .attr('transform', `translate(0,${this.innerHeight})`) // translate from svg edge to bottom of screen
            .call(this.xAxis) // Call function x-axis on elements of selection 'g'
            .attr('id', 'x-axis')
    }

    setYAxis = () => {
        // Y-Axis
        this.axesContainer.append('g')
            // Translate will define location of y-axis by defining (x,y) translation
            // If didnt add padding to x-coordinate, the y-axis is against the screen
            // .attr('transform', "translate(" +(this.margin.left) + ", 0)") // translate from svg left edge and y coordinate from top of screen
            .call(this.yAxis) // Call function x-axis on elements of selection 'g'
            .attr('id', 'y-axis');
        // Holds value for the bar chart bars width
    }

    /***************************** AXES **************************************/

    /************* AXIS LABELS *******************/

    setYAxisLabel = () => {
        this.svg.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "end")
            .attr("y", this.margin.left / 6)
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

    /************************** CALCULATIONS *******************************/
    mean=()=>{
        if(parseInt(this.dataset[0]) ){
            // If x index of data is a number
            let total = this.dataset.reduce((acc, cur ) => {
                return acc += cur[0];
            },0);
            let length = this.dataset.length;
            this.xMean = total / length;
        }
        if (parseInt(this.dataset[1]) ){
            // If y axis data are numbers
            let total = this.dataset.reduce((acc, cur) => {
                return acc += cur[1];
            },0);
            let length = this.dataset.length;
            this.yMean = total / length;
            
        }
    }

    
    variance=()=>{
        if (parseInt(this.dataset[0])) {
            // If x index of data is a number
            let sumOfDeviations = this.dataset.reduce((acc, cur) => {
                return acc += ((cur[0] - this.xMean) ** 2);
            }, 0);
            let degreesOfFreedom = this.dataset.length - 1;
            this.varianceValX = sumOfDeviations / degreesOfFreedom;

        }
        if (parseInt(this.dataset[1])) {
            // If y axis data are numbers
            let sumOfDeviations = this.dataset.reduce((acc, cur) => {
                return acc += ((cur[1] - this.yMean) ** 2);
            }, 0);
            let degreesOfFreedom = this.dataset.length - 1;
            this.varianceValY = sumOfDeviations / degreesOfFreedom;


        }

    }
    standardDeviation=()=>{
        if (parseInt(this.dataset[0])) {
            // If x index of data is a number
            this.xStandardDeviation = Math.sqrt(this.varianceValX);
        }
        if (parseInt(this.dataset[1])) {
            // If y axis data are numbers
            this.yStandardDeviation = Math.sqrt(this.varianceValY);
        }
    }

    zScore=(x, mean,stdDev)=>{
        // Used to calculate z score (standardize the distance from mean into units
        // of standard deviations)
        return (x-mean)/stdDev;
    }
}