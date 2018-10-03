    var data = [{
                "name": "0-10",
                "val": 143,
        },
            {
                "name": "11-20",
                "val": 48,
        },
            {
                "name": "21-40",
                "val": 58,
        },
            {
                "name": "41-60",
                "val": 57,
        },
            {
                "name": "61-80",
                "val": 91,
        },
            {
                "name": ">80",
                "val": 174,

        }];
var color = d3.scale.ordinal().range(['#ffffb2','#fed976','#feb24c','#fd8d3c','#f03b20','#bd0026']);
        var tmargin=15; 
        var rmargin=45;
        var bmargin=15;
        var lmargin=90;
        var width = 800 - lmargin - rmargin
            height = 200- tmargin -tmargin;

        var svg = d3.select("#chartAge").append("svg")
            .attr("width", width + lmargin + rmargin)
            .attr("height", height + tmargin +tmargin)
            .append("g")
            .attr("transform", "translate(" + lmargin + "," + tmargin + ")")
            
              

        var x = d3.scale.linear()
            .range([0, width])
            .domain([0, d3.max(data, function (d) {
                return d.val;
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
                return x(d.val);
            })
            .style("fill", function(d, i) {return color(i)});

        bars.append("text")
            .attr("class", "label")
            .attr("y", function (d) {
                return y(d.name) + y.rangeBand() / 2 + 5;

            })

            .attr("x", function (d) {
                return x(d.val) -35;
            })
            .text(function (d) {
                return d.val;
            });
            
            
            
