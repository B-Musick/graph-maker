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
        this.margin = { top: 80, right: 80, bottom: 80, left: 80 }; // This will be margin for axes starts from svg border
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

       
    }

    createPlot = () => {
        // Remove all the data so when new file loaded it doesnt overlap
        // https://stackoverflow.com/questions/3674265/is-there-an-easy-way-to-clear-an-svg-elements-contents
        this.removePreviousData();
        this.setTitle(); 
        this.getPlotType();
        this.getAxesTitles(); // Get the axes titles

        this.setMargins();

        this.setData();
        
        // Set scales
        this.setXScale();
        this.setYScale();

        this.setAxesContainer();

        this.prepareXAxis();
        this.prepareYAxis();

        this.setXAxis();
        this.setYAxis();

        
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

    /***** THIS METHOD CHANGES BASED ON GRAPH TYPE ******/
    setData = () => {}

    /***************************** SCALES  ************************************
     * CHANGE DEPENDING ON TYPE OF PLOT
    */

    setXScale = () => { }

    setYScale = () => { }

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
}