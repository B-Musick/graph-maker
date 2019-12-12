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
        this.svgWidth = 960; // Holds percentage integer
        this.svgHeight = 700; // Holds percentage integer
        this.margin = { top: 60, right: 60, bottom: 60, left: 60 }; // This will be margin for axes starts from svg border
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

        /********* Five # summary for the box plots *********/
        this.minVal;
        this.firstQuartile;
        this.median;
        this.thirdQuartile;
        this.maxVal;

        // Box
        this.rectWidth = 80; // Width of the box plot rectangle
        this.rectHeight;
        this.rectX;
        this.rectY;

        // Horizontal bars
        this.horLineLength = 40;
        this.lineStroke = 2;
    }

    createPlot = () => {
        console.log(this.file);
        // Remove all the data so when new file loaded it doesnt overlap
        // https://stackoverflow.com/questions/3674265/is-there-an-easy-way-to-clear-an-svg-elements-contents
        this.svg.selectAll("*").remove();
        this.setTitle(); // set the title
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

        this.setFiveNumbers();

        this.drawBoxPlot();
        this.drawHorizontalLines();
        this.drawVerticalLines();

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


    setMargins=()=>{
        // Use to style and set scales and axes (in %)
        // Called in this.createPlot()
        
        this.innerWidth = this.svgWidth - this.margin.left - this.margin.right;
        this.innerHeight = this.svgHeight - this.margin.top - this.margin.bottom;
    }

    setData=()=>{
        let data = [];

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
            this.xScale = d3.scaleLinear()
                .domain([0, this.innerWidth])
                .range([0, this.innerWidth]);
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
        this.xAxis = d3.axisBottom(this.xScale);
    }

    prepareYAxis=()=>{
        this.yAxis = d3.axisLeft(this.yScale);
    }

    setXAxis=()=>{
        // X-AXIS
        this.axesContainer.append('g')
            // Define x,y coordinates translation from the left of screen and from top of screen 
            .attr('transform', `translate(0,${this.innerHeight})`) // translate from svg edge to bottom of screen
            .call(this.xAxis) // Call function x-axis on elements of selection 'g'
            .attr('id', 'x-axis')
     
    }

    setYAxis=()=>{
        // Y-Axis
        this.axesContainer.append('g')
            // Translate will define location of y-axis by defining (x,y) translation
            // If didnt add padding to x-coordinate, the y-axis is against the screen
            // .attr('transform', "translate(" +(this.margin.left) + ", 0)") // translate from svg left edge and y coordinate from top of screen
            .call(this.yAxis) // Call function x-axis on elements of selection 'g'
            .attr('id', 'y-axis');
        // Holds value for the bar chart bars width
    }

    setFiveNumbers=()=>{
        let sortedData = this.dataset.sort();
        console.log(sortedData);
        let arrLength = sortedData.length;
        let middleLength = Math.floor((arrLength / 2));
        let middleVal = sortedData[middleLength];
        let middleNextVal = sortedData[Math.floor(arrLength / 2)];
        console.log((arrLength / 2) - 1);

        this.minVal = d3.min(sortedData);
        this.firstQuartile =sortedData[Math.floor(middleLength/2)];
        // If even then median is mean of two middle values
        this.median = sortedData.length%2==0 ? (Math.floor(middleVal+middleNextVal)/2) : middleVal;
        this.thirdQuartile = sortedData[Math.floor((middleLength)+middleLength/2)];
        this.maxVal = d3.max(sortedData);

        console.log(this.minVal);
        console.log(this.firstQuartile);
        console.log(this.median);
        console.log(this.thirdQuartile);
        console.log(this.maxVal);
    }

    drawTopRect=()=>{
        let x = this.innerWidth/2 - this.rectWidth/2;
        let rectX = x;
        
        // Have to subtract the higher value from lower since on screen in pixels goes top to bottom
        let height = this.yScale(this.median) - this.yScale(this.thirdQuartile);
        
        // Draw to rectangle for the box plot spanning first to third quartile
        this.axesContainer.append('rect')
            .attr('x', x+"")
            .attr('y', this.yScale(this.thirdQuartile)+"") // Y starts at the third quartile
            .attr('height',height+"")
            .attr('width',this.rectWidth+"")
            .attr('fill','red')
            .attr('stroke','black')
            .attr('stroke-width', '2');
            
    }

    drawBottomRect=()=>{
        let x = this.innerWidth / 2 - this.rectWidth / 2;
        let rectX = x;

        let height = this.yScale(this.firstQuartile)-this.yScale(this.median);
        console.log(height);
        // Draw to rectangle for the box plot spanning first to third quartile
        this.axesContainer.append('rect')
            .attr('x', x + "")
            .attr('y', this.yScale(this.median) + "") // Y starts at the third quartile
            .attr('height', height + "")
            .attr('width', this.rectWidth + "")
            .attr('fill', 'red')
            .attr('stroke', 'black')
            .attr('stroke-width', '2');
    }

    drawHorizontalLines=()=>{
        // Draw the top horizontal line
        this.axesContainer.append('line')
            .attr('x1',this.innerWidth/2-this.horLineLength/2)
            .attr('y1', this.yScale(this.maxVal))
            .attr('x2', this.innerWidth / 2 + this.horLineLength / 2)
            .attr('y2', this.yScale(this.maxVal))
            .style('stroke-width',this.lineStroke)
            .style('stroke', 'black');

        // Draw the bottom horizontal line
        this.axesContainer.append('line')
            .attr('x1', this.innerWidth / 2 - this.horLineLength / 2)
            .attr('y1', this.yScale(this.minVal))
            .attr('x2', this.innerWidth / 2 + this.horLineLength / 2)
            .attr('y2', this.yScale(this.minVal))
            .style('stroke-width', this.lineStroke)
            .style('stroke', 'black');

    }
    drawVerticalLines=()=>{
        // Draw the top line from max value to third quartile
        this.axesContainer.append('line')
            .attr('x1', this.innerWidth / 2)
            .attr('y1', this.yScale(this.maxVal))
            .attr('x2', this.innerWidth / 2)
            .attr('y2', this.yScale(this.thirdQuartile))
            .style('stroke-width', this.lineStroke)
            .style('stroke', 'black');

        // Draw the bottom line from max value to third quartile
        this.axesContainer.append('line')
            .attr('x1', this.innerWidth / 2)
            .attr('y1', this.yScale(this.firstQuartile))
            .attr('x2', this.innerWidth / 2)
            .attr('y2', this.yScale(this.minVal))
            .style('stroke-width', this.lineStroke)
            .style('stroke', 'black');
    }
    drawBoxPlot=()=>{
        this.drawTopRect();
        this.drawBottomRect();

    }

    
}
