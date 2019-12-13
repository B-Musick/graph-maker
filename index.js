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
        }

        
    }
});



