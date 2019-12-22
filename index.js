/********************** FILE LOADING *************************/
const inputElement = document.getElementById("fileItem");
let plotDropdown = document.getElementById('dropdown-list');
inputElement.addEventListener("change", (e) => {

    var file = document.getElementById('fileItem').files[0]; // Get the file input

    var reader = new FileReader();
    reader.readAsText(file);

    reader.onloadend = function () {
        let split = reader.result.split('\n');

        if(plotDropdown.value ==='boxplot'){
            // Instantiate a new BOXPLOT
            let plot = new Boxplot(split);
            plot.createPlot();
            plot.drawBoxPlot();
        }else if(plotDropdown.value ==='bar-graph'){
            let plot = new BarChart(split);
            plot.createPlot();
            plot.drawBarChart();
        } else if (plotDropdown.value === 'histogram') {
            let plot = new Histogram(split);
            plot.createPlot();
            plot.drawHistogram();
        } else if (plotDropdown.value === 'normal') {
            let plot = new NormalCurve(split);
            plot.createPlot();
            plot.drawNormal();
        } else if (plotDropdown.value === 'scatterplot') {
            let plot = new Scatterplot(split);
            plot.createPlot();
            // plot.drawNormal();
        }

        
    }
});


let inputsBox = document.getElementById('inputs-container');
let svg = document.querySelector('svg');

inputsBox.addEventListener('change',()=>{
    if(inputElement.value && plotDropdown.value){
        inputsBox.style.position = 'unset';
        svg.style.visibility = 'visible';
    }
})
