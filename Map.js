
 var mapbox = d3.select("#map").append("svg")
                                    .attr("width", 900)
                                    .attr("height", 800)
                                    .attr("id","pathsvg");
                   
function map(){
var pathgenerater = d3.svg.line()
.interpolate("linear")
.x(function(d) { return d.x*(40);})
.y(function(d) { return d.y*(-40)+10.0153532*40*2;});
mapbox.selectAll(".street")
.data(streets)
.enter()
.append("path")
.attr("stroke", "black")
.attr("stroke-width", 2)
.attr("vector-effect","non-scaling-stroke")
.attr("fill", "none")
.attr("class","street")
.attr("d",function(data){
return pathgenerater(data);
});
}
d3.json("DataSet/streets.json",function(error,d){
if (error) { 
console.log(error); 
} else {
console.log(d); 
}
streets = d;
map(); 
});     



d3.csv("DataSet/pumps.csv", function(data) {
for (i=0;i<data.length;i++){
var circles = mapbox.selectAll("circle")
                          .data(data)
                          .enter()
                          .append("circle");
var circleAttributes = circles
                       .attr("cx", function (d) { return d.x*40; })
                       .attr("cy", function (d) { return d.y*(-40)+10.0153532*40*2; })
                       .attr("r", function (d) { return 10 })
                       .style("fill", function(d) { return "rgba(0, 0, 255,0.5)"; });


                       }
                     

  });
  
  
var circles = mapbox.selectAll("circle")
                          .data(data)
                          .enter()
                          .append("circle");
var circleAttributes = circles
                       .attr("cx", function (d) { return 15.5*40; })
                       .attr("cy", function (d) { return 10.5(-40)+10.0153532*40*2; })
                       .attr("r", function (d) { return 30 })
                       .style("fill", function(d) { return "rgba(0, 0, 255,1)"; });


                        
var rectangles = mapbox.selectAll("rect")
	                          .data(data)
	                          .enter()
	                          .append("rect");

                        
var recAttributes = rectangles
					  .attr("x", function (d) { return 11*40;})
                      .attr("y", function (d) { return 13.5*(-40)+10.0153532*40*2; })
                      .attr("width",  function (d) { return 70;})
       			      .attr("height",  function (d) { return 40;} )
                      .style("fill", function(d) { return "rgba(0, 255, 0,0.4)"; });



/*  
d3.csv("data/BRW.csv", function(data) {


for (i=1;i<=data.length;i++){

var rectangles = mapbox.selectAll("rect")
	                          .data(data)
	                          .enter()
	                          .append("rect");

                        
var recAttributes = rectangles
					  .attr("x", function (d) { return d.x*40;})
                      .attr("y", function (d) { return d.y*(-40)+10.0153532*40*2; })
                      .attr("width",  function (d) { return i*20;})
       			      .attr("height",  function (d) { return i*20;} )
                      .style("fill", function(d) { return "rgba(0, i*255, 255,0.4)"; });


                       }
                     

  });
  
*/
   

d3.csv("DataSet/day-age-sex-loc.csv", function(dataDeathDay) {
var slider = createD3RangeSlider(0, 41, "#slider");
slider.onChange(function(x){
var startdate=x.begin+1;
var enddate=x.end+1;
var windowsize=enddate-startdate+1;
var Datedata=["19-Aug","20-Aug","21-Aug","22-Aug","23-Aug","24-Aug","25-Aug","26-Aug","27-Aug","28-Aug","29-Aug","30-Aug","31-Aug","1-Sep","2-Sep","3-Sep","4-Sep","5-Sep","6-Sep","7-Sep","8-Sep","9-Sep","10-Sep","11-Sep","12-Sep","13-Sep","14-Sep","15-Sep","16-Sep","17-Sep","18-Sep","19-Sep","20-Sep","21-Sep","22-Sep","23-Sep","24-Sep","25-Sep","26-Sep","27-Sep","28-Sep","29-Sep"];
d3.select("#T-period").html("Time Period : "+ (Datedata[startdate-1]) + " to " + (Datedata[enddate-1]));
d3.select("#T-period2").html("Time Window : "+windowsize+" days" );
                update(startdate,enddate);
                            });

slider.range(0,0);
function update(n,k) {
    var temp = [];

for (var key in dataDeathDay) {
 if((dataDeathDay[key].days>=n)&&(dataDeathDay[key].days<=k)){    

 temp.push(dataDeathDay[key]);
                                                            }




                            }
 mapbox.selectAll("#tempList").remove();

 var symbol = d3.svg.symbol().type(function(d,i){return type[d.Sex]}).size(function(d){return 120;});
var type = ['cross','square'];
var color=['#ffffb2','#fed976','#feb24c','#fd8d3c','#f03b20','#bd0026'];
var symbolChart = mapbox.selectAll('tempList').data(temp).enter().append('path').attr("id","tempList");
symbolChart.attr('transform',function(d){return 'translate('+d.PopulationX*40+','+(d.PopulationY*(-40)+10.0153532*40*2)+')'}).attr('d',function(d){return symbol(d)}).style("fill", function(d) { return color[d.Age]; }).attr("id","tempList").style({stroke:'white', "stroke-width":0.15});


                                    }

 });




d3.select("#pathsvg").attr("transform","translate(-150,-110) scale(0.8)");


