class BarChart extends Plot{
    constructor(file){
        super(file)

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





}