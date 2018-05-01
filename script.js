

let nodeList;
let linkList;
let padding= 200;
let width= 1600;
let height= 1000;
let randomColor;


// cylclist data
document.addEventListener('DOMContentLoaded', function(){
    fetch("https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json")
    .then((response)=>response.json())
    .then((data)=>{
     
        nodeList= data.nodes;
        linkList= data.links;
        console.log(linkList)
    

        setChart();
    })
    
}
    
);







function setChart(){
 

let chart= d3.select("#chart")
.append("svg")
.attr("width", width).attr("height",height);


chart.append("text").text("Force-Directed-Graph")
.attrs({
    "class": "title",
    "x": (width/2),
    "y": padding/2,
    "text-anchor": "middle"
});
chart.append("text").text("Countries that share borders")
.attrs({
    "class": "subtitle",
    "x": (width/2),
    "y": padding/1.5,
    "text-anchor": "middle"
});

let simulation= d3.forceSimulation(nodeList)
.force("link", d3.forceLink(linkList).id(function(d){ 
    
    return d.index}))
.force("charge", d3.forceManyBody())
.force("center", d3.forceCenter(width/2,height/2));


let links= chart.append("g").attr("class","links").attr("stroke","orange")
.selectAll("line")
.data(linkList)
.enter()
.append("line");
console.log(links);


let nodes= chart.append("g").attr("class","nodes")
.selectAll("circle")
.data(nodeList)
.enter()
.append("circle")
.attr("r", function(d){
    let count=0;
    /// index is the country
    console.log(d); 
    for(i=0;i<linkList.length;i++){
      // i is the index search
        if(d.index===linkList[i].source.index){

            count++;
        }
        
    }

    

return count*1.5;
})
.call(d3.drag()
.on("start", dragStarted)
.on("drag", dragged)
.on("end", dragEnded)
);





// link drag forces//many body// returns to center.
simulation.nodes(nodeList).on("tick",ticked);
simulation.force("link").links(linkList);
console.log(links);

chart .selectAll("circle")
.on("mouseenter",function(d){

    let x= d3.mouse(this)[0];
    let y= d3.mouse(this)[1];

     
    if(!document.getElementById("tooltip")){
      chart.append("image")
   .attrs({
       "x": x,
       "y": y,
       "width": "50px",
       "height": "40px",
       "id": d.code,
       "xlink:href": "./svg/"+d.code+".svg"
   });
    chart.append("text")
   .html(d.country)
   .attr("id", "tooltip")
   .attr("x", x)
   .attr("y", y);
   }
 



})
.on("mousemove",function(d){
 
  let x= d3.mouse(this)[0];
  let y= d3.mouse(this)[1];

 
  let tooltip= document.getElementById("tooltip");
  
// d3.select("#newline").attrs({
//     "x": x,
//     "y": y+20   
// });
      d3.select("#tooltip").attrs({
    "x": x,
    "y": y   
   });
   d3.select("#"+d.code).attrs({
       "x": x,
       "y": y-60
   }); 
   

})
.on("mouseleave",function(d){
    if(document.getElementById("tooltip")){
        
      d3.select("#tooltip").remove();
      d3.select("#"+d.code).remove();
    }
   
});

function ticked(d){
    links
    .attr("x1", function(d){
            return d.source.x;
        })
    .attr("y1", function(d){
            return d.source.y;
        })
    .attr("x2", function(d){
            return d.target.x;
        })
    .attr("y2", function(d){
            return d.target.y;
        });
    nodes
    .attr("cx", function(d){
            return d.x;
        })
    .attr("cy", function(d){
            return d.y;
        });
}
function dragStarted(d){
    if(!d3.event.active){ simulation.alphaTarget(0.3).restart();}
d.fx= d.x;
d.fy= d.y;
}
function dragged(d){
d.fx= d3.event.x;
d.fy= d3.event.y;
}
function dragEnded(d){
    if(!d3.event.active){simulation.alphaTarget(0);}
d.fx= null;
d.fy= null;
}




// xscale.range([width-(padding*2),0]);
// yscale.range([height-padding,padding]);
// let xAxis=d3.axisBottom(xscale).tickSizeInner([10]);
// let yAxis=d3.axisLeft(yscale).tickSizeInner([10]);




// d3.select(".ylabel")
//  .attr("transform","rotate(-90)");


//  chart.append("g")
// .attr("class","yaxis")
// .attr("transform","translate("+padding+",0)")
// .call(yAxis);

// chart.append("g")
// .attr("class","xaxis")
// .attr("transform","translate("+padding+","+(height-padding)+")")
// .call(xAxis);







}
