var data = [{
                "name": "Female",
                "value": 287,
        },
            {
                "name": "Male",
                "value": 284,
                }];

var color = d3.scale.ordinal().range(['pink','blue']);
     var tmargin=15; 
        var rmargin=45;
        var bmargin=15;
        var lmargin=90;

        var width = 800 - lmargin - rmargin,
            height = 200 - tmargin - bmargin;

        var svg = d3.select("#chartSex").append("svg")
            .attr("width", width + lmargin + rmargin)
            .attr("height", height + tmargin + bmargin)
            .append("g")
            .attr("transform", "translate(" + lmargin + "," + tmargin + ")")

        var x = d3.scale.linear()
            .range([0, width])
            .domain([0, d3.max(data, function (d) {
                return d.value;
            })]);

        var y = d3.scale.ordinal()
            .rangeRoundBands([height, 0], .1)
            .domain(data.map(function (d) {
                return d.name;

            }));


  
        var yAxis = d3.svg.axis()
            .scale(y)
            .tickSize(2)
            .orient("left");

        var gy = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            
        var xAxis = d3.svg.axis()
            .scale(x)
            .tickSize(2)
            .orient("top");

        var gy = svg.append("g")
            .attr("class", "x axis")
            .call(xAxis)


        var bars = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("g");
            

   
        bars.append("rect")
            .attr("class", "bar")
            .attr("y", function (d) {
                return y(d.name);
            })
            .attr("height", y.rangeBand())
            .attr("x", 0)
            .attr("width", function (d) {
                return x(d.value);
            })
            .style("fill", function(d, i) {return color(i)});

 
        bars.append("text")
            .attr("class", "label")

            .attr("y", function (d) {
                return y(d.name) + y.rangeBand() / 2 + 5;

            })
            //x position is 3 pixels to the right of the bar
            .attr("x", function (d) {
                return x(d.value) -380;
            })
            .text(function (d) {
                return d.value;
            });