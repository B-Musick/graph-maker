/********************** FILE LOADING *************************/
const inputElement = document.getElementById("fileItem"); // File input
let plotDropdown = document.getElementById('dropdown-list'); // Dropdown list
let plot; // Want to be able to access plot globally

// plotDropdown.addEventListener("change",(e)=>{
//     console.log("changed");
    
// });

inputElement.addEventListener("change", (e) => {
    var file = document.getElementById('fileItem').files[0]; // Get the file input

    var reader = new FileReader(); // Read the file
    reader.readAsText(file); // Read the file as text

    reader.onloadend = function () {
        // Once the file is loaded, then interpret the file
        let split = reader.result.split('\n'); // Split into array

        choosePlot(split);
    }
});

/************** WHEN GRAPH AND FILE INPUT, SHOW THE GRAPH **********************/
let inputsBox = document.getElementById('inputs-container');
let svg = document.querySelector('svg');

inputsBox.addEventListener('change',()=>{
    let currentInstructions = document.querySelector(".visible-instructions");

    if(currentInstructions !=null && currentInstructions.id != plotDropdown.value+"-instructions"){
        // If there are current instructions
        // If the visible instructions arent the same as the one in the dropdown
        svg.style.visibility = 'hidden'; // Hide the svg
        plot.removeTitle(); // Remove the title
        inputElement.value = null; // Clear the file input

        // If there are current visible instructions, remove them so multiple
        // arent shown at once
        currentInstructions.classList.remove("visible-instructions");
        currentInstructions.classList.add("hidden-instructions");

    }
    
    // let newPlotType = removeCurrentInstructions();

    if(plotDropdown.value){
        // If change the dropdown menu, then add the instructions to show how to use graph
        let instructions = document.getElementById(plotDropdown.value+"-instructions");
        instructions.classList.remove('hidden-instructions');
        instructions.classList.add('visible-instructions');
    }

    if(inputElement.value && plotDropdown.value){
        // If file is input, then interpret it and show the associated graph
        inputsBox.style.position = 'unset';
        svg.style.visibility = 'visible';
        console.log(plotDropdown.value);
    }
})

let choosePlot=(split)=>{
        // Depending on which dropdown is selected, create the associated plot
    if(plotDropdown.value ==='boxplot'){
        // Instantiate a new BOXPLOT
        plot = new Boxplot(split);
        plot.createPlot();
        plot.drawBoxPlot();
    }else if(plotDropdown.value ==='bar-graph'){
        plot = new BarChart(split);
        plot.createPlot();
        plot.drawBarChart();
    } else if (plotDropdown.value === 'histogram') {
        plot = new Histogram(split);
        plot.createPlot();
        plot.drawHistogram();
    } else if (plotDropdown.value === 'normal') {
        plot = new NormalCurve(split);
        plot.createPlot();
        plot.drawNormal();
    } else if (plotDropdown.value === 'scatterplot') {
        plot = new Scatterplot(split);
        plot.createPlot();
        plot.drawScatterplot();
        plot.calculations();
    }
}
let removeCurrentInstructions = ()=>{
    let changedToNewInstructions = false;

    if(currentInstructions != null){
        changedToNewInstructions = true;
        svg.style.visibility = 'hidden'; // Hide the svg
        inputElement.value = null; // Clear the file input

        // If there are current visible instructions, remove them so multiple
        // arent shown at once
        currentInstructions.classList.remove("visible-instructions");
        currentInstructions.classList.add("hidden-instructions");
    }
}
