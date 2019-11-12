//Style Function
function myAccFunc(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
        x.previousElementSibling.className += " w3-green";
    } else {
        x.className = x.className.replace(" w3-show", "");
        x.previousElementSibling.className =
            x.previousElementSibling.className.replace(" w3-green", "");
    }
}


//Global Variable
var parseDate = d3.isoParse;
var color1 = d3.rgb(232, 65, 5);
var color2 = d3.rgb(5, 20, 232);
var selectedOption = "bubbleplot";
var margin = { top: 70, right: 70, bottom: 30, left: 60 },
    width = 560 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg;
var svg1;
var legText1 = "val1";
var legText2 = "val2";

//Init function
function init() {

    svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

            svg1 = d3.select("#legendviz").append("svg")
    //Read the data
    d3.csv("https://raw.githubusercontent.com/salvolap/salvo/master/Plv-Hum30d.csv", type, function (data) {
        legend()
        key= getKey(data);
        console.log(key)

        //Set Axes
        var x = setXaxes(data);
        var y = setYaxes(data);
        var z = setZaxes(data);

        //Create first chart
        bubblePlot(data)

        //Set Event Listener
        d3.select("#bubble").on("click", function () { selectedOption = "bubbleplot"; updateChart() });
        d3.select("#multiple").on("click", function () { selectedOption = "multiplelineplot"; updateChart() });
        d3.select("#box").on("click", function () { selectedOption = "boxplot"; updateChart() });
        d3.selectAll(".slider1").on("input", function () { updateChart(); })
        d3.selectAll(".slider2").on("input", function () { updateChart(); })
        d3.select("#texButton").on("click", function () { updateChart() })

        
        function updateChart() {
            svg1.selectAll(".legCirc").remove()
            svg1.selectAll(".legText").remove()

            if (selectedOption == "bubbleplot") {
                svg.selectAll(".myBubble").remove()
                svg.selectAll(".myMultiple").remove()
                svg.selectAll(".myBoxplot").remove()

                graphType = "bubbleplot"
                bubblePlot(data)
                legend()
            } else if (selectedOption == "multiplelineplot") {
                svg.selectAll(".myBubble").remove()
                svg.selectAll(".myBoxplot").remove()
                graphType = "multiplelineplot"
                multipleLinePlot(data)
                legend()

            } else if (selectedOption == "boxplot") {
                svg.selectAll(".myMultiple").remove()
                svg.selectAll(".myBubble").remove()
                graphType = "boxplot"
                boxPlot(data)
                legend()


            }

        }

        function bubblePlot(d) {
            svg.append('g')
                .selectAll("dot")
                .data(d)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.date); })
                .attr("cy", function (d) { return y(d.plv); })
                .attr("r", function (d) { return z(d.avg); })
                .style("fill", color1)
                .style("opacity", "0.7")
                .attr("stroke", "black")
                .attr("class", "myBubble")
        }
        function multipleLinePlot(d) {
            // Add the line 1
            svg.append("path")
                .datum(d)
                .attr("fill", "none")
                .attr("stroke", color1)
                .attr("stroke-width", 3)
                .attr("d", d3.line()
                    .x(function (d) { return x(d.date) })
                    .y(function (d) { return y(d.plv) })
                )
                .attr("class", "myBubble")
            // Add the line 2
            svg.append("path")
                .datum(d)
                .attr("fill", "none")
                .attr("stroke", color2)
                .attr("stroke-width", 3)
                .attr("d", d3.line()
                    .x(function (d) { return x(d.date) })
                    .y(function (d) { return y(d.avg) })
                )
                .attr("class", "myBubble")
        }
        function boxPlot(d) {

            //Vertical Line
            svg
                .selectAll("vertLines")
                .data(d)
                .enter()
                .append("line")
                .attr("x1", function (d) { return (x(d.date)) })
                .attr("x2", function (d) { return (x(d.date)) })
                .attr("y1", function (d) { return (y(d.min)) })
                .attr("y2", function (d) { return (y(d.max)) })
                .attr("stroke", "black")
                .style("width", 40)
                .attr("class", "myBoxplot")


            // Add dots min
            svg.append('g')
                .selectAll("dot")
                .data(d)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.date); })
                .attr("cy", function (d) { return y(d.min); })
                .attr("r", 7)
                .style("fill", color2)
                .attr("class", "myBoxplot")


            // Add dots max
            svg.append('g')
                .selectAll("dot")
                .data(d)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.date); })
                .attr("cy", function (d) { return y(d.max); })
                .attr("r", 7)
                .style("fill", color2)
                .attr("class", "myBoxplot")




            // Add dots avg
            svg.append('g')
                .selectAll("dot")
                .data(d)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.date); })
                .attr("cy", function (d) { return y(d.avg); })
                .attr("r", 7)
                .style("fill", color1)
                .attr("class", "myBoxplot")


        }
        function legend() {
            var colLegend = [color1, color2];
            var textLeg = [legText1, legText2]
            var dataLeg = [];
            dataLeg={
                "color": colLegend,
                "tex":textLeg
            }
            console.log(dataLeg)
            svg1.append('g')
                .selectAll("dot")
                .data(dataLeg.color)
                .enter()
                .append("circle")
                .attr("cx", 100)
                .attr("cy", function (d, i) { return 100 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("r", 7)
                .style("fill", function(d){ return d})
                .attr("class", "legCirc")
                .exit()
     svg1
     .selectAll("mylabels")
      .data(dataLeg.tex)
      .enter()
      .append("text")
      .attr("x", 120)
      .attr("y", function(d,i){ return 100 + i*25})
      .style("fill", "black")
      .text(function (d) { return d })
      .attr("text-anchor", "left")
      .attr("class", "legText")

      .style("alignment-baseline", "middle")

        }


    });

    function type(d) {
        d.date = parseDate(d.start);
        d.plv = + d.totalPLV;
        d.min = +d.min;
        d.max = +d.max;
        d.avg = +d.avg;
        return d;
    }

}

function setColor1() {
    var r = document.getElementById("red1").value;
    var g = document.getElementById("green1").value;
    var b = document.getElementById("blue1").value;
    color1 = d3.rgb(r, g, b);
    d3.selectAll("#color1").style("background-color", color1)

}

function setColor2() {
    var r = document.getElementById("red2").value;
    var g = document.getElementById("green2").value;
    var b = document.getElementById("blue2").value;
    color2 = d3.rgb(r, g, b);
    d3.selectAll("#color2").style("background-color", color2)

}
function setXaxes(data) {
    var x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d["date"]; }))
        .range([width * 0.1, width]);
    svg.append("g")
        .attr("transform", "translate(0," + (height) + ")")
        .call(d3.axisBottom(x).ticks(12).tickFormat(d3.timeFormat("%m")));
    return x;
}
function setYaxes(data) {
    var y = d3.scaleLinear().range([height, 0])
    y.domain([0, d3.max(data, function (d) { return +d.plv })]);
    var yAxis = d3.axisLeft().scale(y);
    svg.append("g")
        .attr("class", "myYaxis")
        .call(d3.axisLeft(y).tickSizeOuter(10));
    return y;
}
function setZaxes(data) {
    var z = d3.scaleLinear().range([1, 20]);
    z.domain([0, d3.max(data, function (d) { return +d.avg })]);
    var zAxis = d3.axisLeft().scale(z);
    return z
}

function setLegend(col1, col2) {
    legText1 = document.getElementById(col1).value;
    legText2 = document.getElementById(col2).value;

}
function getKey(data){
    var valueKey = data.columns;
    return valueKey;
}


