class Scatterplot extends Plot{
    constructor(file){
        super(file);
        this.plotType = 'scatterplot';

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
            return [parseInt(arr[0]), parseInt(arr[1])];
        });

    }

    /***************************** SCALES  *************************************/
    // Map (parsedDataset[0] to the x axis starting at padding, ending width-padding)
    setXScale = () => {
        this.xScale = d3.scaleLinear()
            .domain([0, d3.max(this.dataset, d => d[0])])
            .range([0, this.innerWidth]);
    }
    setYScale = () => {
        // Set the xScale using date values, map the domain to the range to fit the page
        this.yScale = d3.scaleLinear()
            // Take the domain 'dates' and map them to the x-axis (method chaining)
            .domain([0, d3.max(this.dataset, d => d[1])]) // (first(earliest) date, last(latest) date)
            .range([this.innerHeight, 0]); // Left screen, right screen
    }

    /***************************** AXES **************************************/

    /************* AXIS LABELS *******************/
    setXAxisLabel = () => {
        this.svg.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "end")
            .attr("x", this.innerWidth / 1.8)
            .attr("y", this.innerHeight + 2 * this.margin.bottom - 20)
            .style('font-size', this.innerHeight * 0.04 + "")
            .text(`${this.axesTitles[0]}`);
    }

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




}
/***
 * SCATTERPLOTS
 * Display relationship between two quantitative variables, with the explanatory variable
 * (independent variable) on the x-axis and other on y-axis
 * 
 * EXAMINE
 * Form, direction and strenght of relationship
 * Look for outliers
 * FORM - Linear relationships, Curved
 * DIRECTION - Positive (high values occur together)
 *          - Negative (one variable high, other low)
 * STRENGTH - How close points line to a form (such as a line)
 * 
 * ***************** Log Transformations ****************************
 * Can only be used for variables with positive values
 * • Natural to have base logs to 10 since it’s our number system
• log101000 = 3    (103 = 1000) “The logarithm of 1000 is 3”
• y = log10a, the log of a number a is the power we have to raise 10 to get a
→ y = log10a is equivalent to 10y = a
- The log of the product of two numbers is the sum of their logarithms
• log10xy = log10x + log10y (think of exponents... if x = 10m and y = 10n and xy = 10m+n then 10m • 10n = 10m+n)
→ 10x•10y >>> log10z = x + y
• log10(x/y) = log10x - log10y (log of a quotient) – think because 10m/10n = 10m-n
• log10xy = ylog10x (log of a power)
• logbA = logcA/logcB where c can be the base 10 (Change of base formula)
- Logs of sums and differences can't be altered like log10(10m + 10n) or log10(a + b)
- The bases of the logs need to be the same when combining
- In regression analysis: If you expect a predictor variable to follow a power/exponential law, take the corresponding logarithm to linearize the relationship.
So if you have any power relationship between x and y, take the log to turn it into a linear relationship
- Think about it, if you had to map 1000 and 1000000 on the same scale you would have an enormous graph, but if you used logs (log1000 = 3, log1000000 = 6) this is more graphable

y=ax^n      log⁡(y)=n log⁡(x)+log⁡(a)

- We see in the log equation above it is similar to the equation of a line y = mx + b where n is the slope in this case
    - “n is said to be the logarithm of y”
    
Restrictions on the Variables
1. base > 0 because in an exponential the base always has to be positive
2. a > 0 → logba = c (logarithmic form) means that bc = a (exponential form). Because the positive number raised to any power is positive, meaning bc > 0, it follows that a > 0. “log base b of x”
3. b ≠ 1  because 1 to any power always has to be 1 and cant be anything else

Properties of Logarithms
1) log_b⁡〖1=0〗
2) log_b⁡〖b=1〗
3) log_b⁡〖b^x 〗=x
4) b^log_b⁡〖x 〗 =x → b^log_b⁡f(x) =f(x)

 * 
 ******************** CATEGORICAL VARIABLES IN SCATTERPLOTS ****************
- To add a categorical variable to a scatterplot, use a different plot color or
symbol for each category.

SMOOTHING
- Can use algorithms to smmooth a scatterplot
 
***************************** CORRELATION ***********************************

*/