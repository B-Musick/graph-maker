class Boxplot extends Plot {
    constructor(file) {
        super(file)
        this.plotType = 'boxplot';

        // Box
        this.rectWidth = 80; // Width of the box plot rectangle
        this.rectHeight;
        this.rectX;
        this.rectY;

        // Horizontal bars
        this.horLineLength = 40;
        this.lineStroke = 2;

        /********* Five # summary for the box plots *********/
        this.minVal;
        this.firstQuartile;
        this.median;
        this.thirdQuartile;
        this.maxVal;

        this.outliers = [];
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
    }

    setXScale = () => {
        // Arent using the x axis except to put in the middle
        this.xScale = d3.scaleBand()
            .domain(["n=" + this.dataset.length])
            .range([0, this.innerWidth]);
    }

    setYScale = () => {
        // Set the y scale to match the value of data for the box plot
        this.yScale = d3.scaleLinear()
            // Take the domain 'dates' and map them to the x-axis (method chaining)
            .domain([0, d3.max(this.dataset)]) // 
            .range([this.innerHeight, 0]); // Bottom of screen to top  
    }
    setXAxisLabel=()=>{
        // Dont need to set the x-axis label, it just shows how many values there are
    }
    setYAxisLabel=()=>{
        this.svg.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "end")

            .attr("transform", "rotate(-90)")
            .attr("x", -this.innerHeight/1.9)
            .attr("y", this.margin.left/2)
            .style('font-size', this.innerWidth * 0.03 + "")
            .text(`${this.axesTitles[1]}`);
    }

    setMedian = () => {
        let sortedData = this.dataset.sort();
        let dataCount = sortedData.length;
        let middleLength = Math.floor((dataCount / 2));
        let middleVal = sortedData[middleLength];
        let middleNextVal = sortedData[Math.floor(dataCount / 2)];

        // If even then median is mean of two middle values
        this.median = sortedData.length % 2 == 0 ? (Math.floor(middleVal + middleNextVal) / 2) : middleVal;
    }


    getMedian = (arr) => {
        let arrSorted = arr.sort(function (a, b) { return a - b });
        let arrLength = arr.length;
        let halfLength = Math.floor(arrLength / 2);

        // Return the median of an array
        if (arrLength % 2 === 0) {
            // If even amount of data then median is average of center values 
            return (arrSorted[halfLength - 1] + arrSorted[halfLength]) / 2;
        } else {
            // If odd
            return arrSorted[halfLength];
        }
    }

    getIQR = () => {
        // Get the interquartile range
        let iqr = 1.5 * (this.thirdQuartile - this.firstQuartile);
        let lowerThan = this.firstQuartile - iqr;
        let higherThan = this.thirdQuartile + iqr;
        this.dataset.forEach(val => {
            // If the value falls outside the bounds, its an outlier
            if (val < lowerThan || val > higherThan) {
                this.outliers.push(val);
            }
        });
    }

    setMinVal = () => {
        let i = 0;
        while (i < this.dataset.length) {
            if (this.outliers.includes(this.dataset[i])) {
                // If value is an outlier keep incrementing
                i++;
            } else {
                // If not an outlier then set the minimum
                this.minVal = this.dataset[i];
                break;
            }
        }
    }

    setMaxVal = () => {
        let i = this.dataset.length - 1;
        while (i >= 0) {
            if (this.outliers.includes(this.dataset[i])) {
                // If value is an outlier keep incrementing
                i--;
            } else {
                // If not an outlier then set the minimum
                this.maxVal = this.dataset[i];
                break;
            }
        }
    }

    setFiveNumbers = () => {
        this.median = this.getMedian(this.dataset);
        let data = [...this.dataset]; // Make deep copy of array

        // Check if odd or even amount of data points

        if (data.length % 2 == 0) {
            // If dataset is even then divide data in two and get the median
            let lowerHalf = data.splice(0, data.length / 2);
            let upperHalf = data;
            this.firstQuartile = this.getMedian(lowerHalf);
            this.thirdQuartile = this.getMedian(upperHalf);

        }
        else {
            // If data set is odd, remove the center value and  get median of both halves
            let centerIndex = Math.floor(data.length / 2);
            let median = data.splice(centerIndex, 1);
            let lowerHalf = data.splice(0, centerIndex);
            let upperHalf = data;
            this.firstQuartile = this.getMedian(lowerHalf);
            this.thirdQuartile = this.getMedian(upperHalf);
        };


    }

    drawTopRect = () => {
        let x = this.innerWidth / 2 - this.rectWidth / 2;

        // Have to subtract the higher value from lower since on screen in pixels goes top to bottom
        let height = this.yScale(this.median) - this.yScale(this.thirdQuartile);

        // Draw to rectangle for the box plot spanning first to third quartile
        this.axesContainer.append('rect')
            .attr('x', x + "")
            .attr('y', this.yScale(this.thirdQuartile) + "") // Y starts at the third quartile
            .attr('height', height + "")
            .attr('width', this.rectWidth + "")
            .attr('fill', 'rgb(167, 131, 202)')
            .attr('class', 'quartile-range')
            .attr('id', 'upper-quartile')
            .attr('stroke', 'black')
            .attr('stroke-width', '2');
    }

    drawBottomRect = () => {
        let x = this.innerWidth / 2 - this.rectWidth / 2;

        let height = this.yScale(this.firstQuartile) - this.yScale(this.median);

        // Draw to rectangle for the box plot spanning first to third quartile
        this.axesContainer.append('rect')
            .attr('x', x + "")
            .attr('y', this.yScale(this.median) + "") // Y starts at the third quartile
            .attr('height', height + "")
            .attr('width', this.rectWidth + "")
            .attr('fill', 'rgb(167, 131, 202)')
            .attr('stroke', 'black')
            .attr('stroke-width', '2')
            .attr('class', 'quartile-range')
            .attr('id', 'lower-quartile');
    }

    drawHorizontalLines = () => {
        // Draw the top horizontal line
        this.axesContainer.append('rect')
            .attr('width', this.horLineLength)
            .attr('height', 6)
            .attr('x', this.innerWidth / 2 - this.horLineLength / 2)
            .attr('y', this.yScale(this.maxVal))
            .attr('class', 'horizontal-bar')
            .attr('id', 'max-horizontal-bar')

        // Draw the bottom horizontal line
        this.axesContainer.append('rect')
            .attr('width', this.horLineLength)
            .attr('height', 6)
            .attr('x', this.innerWidth / 2 - this.horLineLength / 2)
            .attr('y', this.yScale(this.minVal))
            .attr('class', 'horizontal-bar')
            .attr('id', 'min-horizontal-bar')
    }

    drawMedian = () => {
        // Draw the bottom horizontal line
        this.axesContainer.append('rect')
            .attr('width', this.rectWidth)
            .attr('height', 6)
            .attr('x', this.innerWidth / 2 - this.rectWidth / 2)
            .attr('y', this.yScale(this.median))
            .attr('class', 'horizontal-bar')
            .attr('id', 'median');
    }

    drawVerticalLines = () => {
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

    drawOutliers = () => {
        let x = this.innerWidth / 2 - this.rectWidth / 8;

        this.outliers.forEach(val => {
            let height = 3;
            this.axesContainer.append('rect')
                .attr('x', x + "")
                .attr('y', this.yScale(val) + "") // Y starts at the third quartile
                .attr('height', height + "")
                .attr('width', this.rectWidth / 4 + "")
                .attr('fill', 'black')
                .attr('stroke', 'black')
                .attr('value', val) // Used to access for the tooltip
                .attr('stroke-width', '2')
                .attr('class', 'outliers')
                .attr('id', 'outlier' + val);;
        })
    }

    drawToolTips = (id, text) => {

        let rect = document.getElementById(id);
        let tooltip = document.getElementById('tooltip');

        rect.addEventListener('mouseover', (e) => {
            tooltip.style.visibility = 'visible';
            tooltip.textContent = text;
            this.tooltip
                .style('left', e.clientX + 'px')
                .style('top', e.clientY + 'px');
        });
        rect.addEventListener('mouseout', (e) => {
            tooltip.style.visibility = 'hidden';
        });
    }

    drawOutliersTooltips = () => {

        let outliers = document.querySelectorAll('.outliers');
        let tooltip = document.getElementById('tooltip');

        outliers.forEach(outlier => {
            // Loop through the outliers and print out tooltip if hovered
            outlier.addEventListener('mouseover', (e) => {
                tooltip.style.visibility = 'visible';
                tooltip.textContent = 'This is an outlier at ' + outlier.getAttribute('value');
                this.tooltip
                    .style('left', e.clientX + 'px')
                    .style('top', e.clientY + 'px');
            });
            outlier.addEventListener('mouseout', (e) => {
                tooltip.style.visibility = 'hidden';
            });
        })
    }

    quartileToolTips = () => {
        this.drawToolTips('upper-quartile', 'Upper Quartile Range from Median(' + this.median + ') to Third Quartile(' + this.thirdQuartile + ")");
        this.drawToolTips('lower-quartile', 'Lower Quartile Range from Median(' + this.median + ') to First Quartile(' + this.firstQuartile + ")");
    }

    maxMinMedianToolTips = () => {
        this.drawToolTips('min-horizontal-bar', 'Minimum Value: ' + this.minVal);
        this.drawToolTips('max-horizontal-bar', 'Maximum Value: ' + this.maxVal);
        this.drawToolTips('median', 'Median: ' + this.median);
    }

    drawBoxPlot = () => {
        /************* Called on class instance in index.js **************/

        // Get values from the data
        this.setYAxisLabel();
        this.setMedian();
        this.setFiveNumbers();
        this.getIQR();
        this.setMinVal();
        this.setMaxVal();
        /**** This is called to draw the complete graph *****/
        this.drawTopRect();
        this.drawBottomRect();
        this.drawHorizontalLines();
        this.drawVerticalLines();
        this.drawOutliers();
        this.drawMedian();
        this.quartileToolTips();
        this.maxMinMedianToolTips();
        this.drawOutliersTooltips();
    }
}
