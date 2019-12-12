/********************** FILE LOADING *************************/
const inputElement = document.getElementById("fileItem");
inputElement.addEventListener("change", (e) => {

    var file = document.getElementById('fileItem').files[0]; // Get the file input

    var reader = new FileReader();
    reader.readAsText(file);

    reader.onloadend = function () {
        let split = reader.result.split('\n');
        // Instantiate a new plot
        let plot = new Plot(split);
        plot.createPlot();
    }
});

class Plot{
    constructor(file){
        this.file = file;
        this.svg = d3.select('svg');
        this.title;
        this.axesTitles;
        // dataset will be an array of arrays, the first value being the date, second the gdp
        this.dataset = [];
        this.svgWidth; // Holds percentage integer
        this.svgHeight; // Holds percentage integer
        this.margin = { top: 2, right: 2, bottom: 2, left: 2 }; // This will be margin for axes starts from svg border
        this.innerWidth; // Used to make everything relative to axis
        this.innerHeight; // Used to make everything relative to axis
        this.plotType;

        // Axes variables
        this.xScale;
        this.yScale;

        // Axes Container
        this.axesContainer;

        // Hold the x and y axis scaled to values
        this.xAxis;
        this.yAxis;
    
        


    }

    createPlot = () => {
        console.log(this.file);
        // Remove all the data so when new file loaded it doesnt overlap
        // https://stackoverflow.com/questions/3674265/is-there-an-easy-way-to-clear-an-svg-elements-contents
        this.svg.selectAll("*").remove();
        this.setTitle(); // set the title
        this.getPlotType();
        this.getAxesTitles(); // Get the axes titles
        this.getSVGSize();
        this.setMargins();
        this.setData();
       
        // Set scales
        this.setXScale();
        this.setXScale();

        this.setAxesContainer();

        this.prepareXAxis();
        this.prepareYAxis();

        this.setXAxis();
        this.setYAxis();


        this.setRect();

    }

    setTitle = () =>{
        // Called in createPlot to set the title
        this.title = document.getElementById('title');

        // Remove the first value from the array which is the title
        this.title.textContent = this.file.shift();
    }

    getPlotType=()=>{
        // Get the plot type chosen from the dropdown menu
        let plotDropdown = document.getElementById('dropdown-list');
        this.plotType = plotDropdown.value;
        console.log(plotDropdown.value);
    }

    getAxesTitles = () =>{
        // called in createPlot method
        // Remove the second values from the array which are the [x,y] values
        let axesTitles = this.file.shift().split(',');
        console.log(axesTitles);
    }

    getSVGSize=()=>{
        // Get the percentage number of the width and height
        // Called in this.createPlot()
        
        // Get the width and height in pixels
        let width = this.svg.style('width');
        let height = this.svg.style('height');

        // Remove the 'px' from the values
        let svgWid = parseInt(width.match(/\d/g).join(''));
        let svgHgt = parseInt(height.match(/\d/g).join(''));

        // Get the percentage of the width and height with comparison to screen
        this.svgWidth = (svgWid / (window.innerWidth))*100;
        this.svgHeight = (svgHgt / (window.innerWidth))*100;
    }

    setMargins=()=>{
        // Use to style and set scales and axes (in %)
        // Called in this.createPlot()
        
        this.innerWidth = this.svgWidth - this.margin.left - this.margin.right;
        this.innerHeight = this.svgHeight - this.margin.top - this.margin.bottom;
    }

    setData=()=>{
        let data = [];
        console.log(this.plotType);
        console.log(this.file);
        if(this.plotType ==='boxplot'){
            
            // If boxplot, then x-axis is n (n=# of data points)
            this.file.forEach((val) => {
                if(val!=="") // Make sure actual values
                // Push the data into the array([val1, val1]), turn them into arrays
                data.push(parseInt(val));
            });
            this.dataset = data;
  
        }else if(this.plotType === 'categoryBarChart'){
            this.file.forEach((val) => {
                // Push the data into the array([val1, val1]), turn them into arrays
                data.push(val.split(','));
            })
            // Parse the string values into integers
            let dataset = data.map(arr => {
                return [parseInt(arr[0]), parseInt(arr[1])];
            });
        }
    }

    /***************************** SCALES  *************************************/
    
    setXScale =()=>{
        // Set the x scale for the graph
        if(this.plotType === 'boxplot'){
            // Arent using the x axis except to put in the middle
            this.xScale = d3.scaleBand()
                .domain([0, innerWidth])
                .range([0, innerWidth]);
        }

    } 

    
    setYScale = ()=>{
        // Set the y scale for the graph
        if (this.plotType === 'boxplot') {
            // Set the y scale to match the value of data for the box plot
            this.yScale = d3.scaleLinear()
                // Take the domain 'dates' and map them to the x-axis (method chaining)
                .domain([0, d3.max(this.dataset)]) // 
                .range([this.innerHeight, 0]); // Bottom of screen to top
        }

    }
   


    /*********** AXES COORDINATES  ************/

    setAxesContainer=()=>{
        this.axesContainer = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    }

    // Axis takes scale function, determine what values in scale correspond to what pixels
    prepareXAxis = () => {
        this.xAxis = d3.axisLeft(this.yScale);
    }

    prepareYAxis=()=>{
        this.yAxis = d3.axisBottom(this.xScale);
    }

    setXAxis=()=>{
        // X-AXIS
        this.axesContainer.append('g')
            // Define x,y coordinates translation from the left of screen and from top of screen 
            .attr('transform', `translate(0,${this.innerWidth})`) // translate from svg edge to bottom of screen
            .call(this.xAxis) // Call function x-axis on elements of selection 'g'
            .attr('id', 'x-axis')
     
    }

    setYAxis=()=>{
        // Y-Axis
        this.setAxesContainer.append('g')
            // Translate will define location of y-axis by defining (x,y) translation
            // If didnt add padding to x-coordinate, the y-axis is against the screen
            .attr('transform', "translate(" +(margin.left) + ", 0)") // translate from svg left edge and y coordinate from top of screen
            .call(this.yAxis) // Call function x-axis on elements of selection 'g'
            .attr('id', 'y-axis');
        // Holds value for the bar chart bars width
    }



    
    






        setRect=()=>{

        // Use regex to get the size of the svg, returns array of all digits, join to number
        this.svg.append('rect')
            .attr('x', this.svgWidth/20 + "%")
            .attr('y', '100')
            .attr('width', this.svgWidth/20+"%")
            .attr('height', 100)
            .style('fill', 'black');
    }

    
    
}
