// LOAD DROP DOWN SAMPLE SELECTOR
function init() {
  // Grab a reference to dropdown select element
  var selector = d3.select("#selDataset");

   // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);

    // assign name to array of "names"
    var sampleNames = data.names;

    // loop through the array of names
    sampleNames.forEach((sample) => {
      // append the text and value to the drop down menu
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
         // console.log(sample)
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildMetadata(firstSample)
    buildBarChart(firstSample);
    buildBubbleChart(firstSample);
    buildGaugeChart(firstSample);
})}

// Event Handler on DropDown List
function optionChanged(newSample) {
  console.log(newSample);
  buildMetadata(newSample);
  buildBarChart(newSample);
  buildBubbleChart(newSample);
  buildGaugeChart(newSample);
}

function buildMetadata(sampleId) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sampleId);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    console.log(resultArray)

    PANEL.html("");

    Object.entries(result).forEach(([key, value]) => {PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

    // 2022-11-20 Refactored Coded Above Using For Each in Object
      // PANEL.append("h6").append("label").text("ID: ").append("label").text(result.id)
      // PANEL.append("h6").append("label").text("ETHNICITY: ").append("label").text(result.ethnicity)
      // PANEL.append("h6").append("label").text("GENDER: ").append("label").text(result.gender)
      // PANEL.append("h6").append("label").text("AGE: ").append("label").text(result.age)
      // PANEL.append("h6").append("label").text("LOCATION: ").append("label").text(result.location)
      // PANEL.append("h6").append("label").text("BBTYPE: ").append("label").text(result.bbtype)
      // PANEL.append("h6").append("label").text("WFREQ: ").append("label").text(result.wfreq)

  });
}

// 1. Create the buildCharts function.
function buildBarChart(sampleId) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array.
      var samples = data.samples;

      // console.log("In Build Charts")
      // console.log(samples)

      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var resultArray = samples.filter(s => s.id == sampleId);
      // console.log("in BuildCharts Function");
      // console.log(resultArray)

      //  5. Create a variable that holds the first sample in the array.
      var result = resultArray[0]
      // console.log("in BuildCharts Function");
      // console.log(result)

      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
      // console.log("in BuildCharts Function");
      // console.log(otu_ids)
      // console.log(otu_labels)
      // console.log(sample_values)

      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order
      //  so the otu_ids with the most bacteria are last.
      var yticks = otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();
      // console.log("yticks");
      // console.log(yticks)

      var xticks = sample_values.slice(0,10).reverse()
      // console.log("xticks");
      // console.log(xticks)
      // console.log("otu labels")
      // console.log(otu_labels.slice(0,10).reverse())

    // 8. Create the trace for the bar chart.
      var barData = {
        x: xticks,
        y: yticks,
        type: "bar",
        text: otu_labels.slice(0,10).reverse(),
        orientation: "h"
      };
      // 9. Create the layout for the bar chart.
      var barLayout = {
          title: "<B>Top 10 Bacterial Cultures Found</B>",
          margin: {t: 100, l: 150}
            };

      // 10. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bar",[barData],barLayout);

  });

}

function buildBubbleChart(sampleID) {
    console.log("in buildBubbleChart")
    console.log(sampleID)

    d3.json("samples.json").then (data => {
        var samples = data.samples;
        var resultArray = samples.filter(s => s.id == sampleID);
        var result = resultArray[0]

        // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        var bubbleData = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {size: sample_values,color: otu_ids,
                    colorscale:otu_labels },
            type: 'scatter'
        }

        var bubbleLayout = {
            title: "<B>Bacteria Cultures Per Sample</B>",
            xaxis: {title: "OTU ID"},
            margin: {
                l: 50,
                 r: 50,
                b: 100,
                t: 100,
                pad: 4
            },
        }

        Plotly.newPlot("bubble",[bubbleData], bubbleLayout)
    })
}

function buildGaugeChart(sampleID) {
     d3.json("samples.json").then (data => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(m => m.id == sampleID);
        var result = resultArray[0];

        var wfreq = result.wfreq;

        var gaugeData = {
            value: wfreq ,
            title: {text: "<I>Scrubs per Week</I>"},
            mode: "gauge+number", type: "indicator",
            gauge: {axis: {range: [0,10]},
                    bar:{color: 'black'},
                    steps:[
                        {range: [0,2], color: 'red'},
                        {range: [2,4], color: 'orange'},
                        {range: [4,6], color: 'yellow'},
                        {range: [6,8], color: 'lightgreen'},
                        {range: [8,10], color: 'darkgreen'}
                    ]

                    }
        }

        var gaugeLayout = {
            title: "<B>Belly Button Washing Frequency</B>",
             margin: {t: 100, l: 150}

        }

        Plotly.newPlot('gauge',[gaugeData], gaugeLayout)

     })
}

// Initialize the dashboard
init();