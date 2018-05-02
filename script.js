

let meteorList=[];

let padding= 200;
let width= 1600;
let height= 1000;
let randomColor;
const urls=["https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json","./simpleMap.geojson"]

// cylclist data
document.addEventListener('DOMContentLoaded', function(){

  
    
    let getContent= url=> fetch(url)
    .then((response)=>response.json())
    .then((data)=>{
     
       meteorList.push(data);
      
    

       
    });
    Promise.all(urls.map(getContent)).then(()=>{
         
         setChart();
    });
     
}
      
);




function setChart(){
 
console.log(meteorList);
let chart= d3.select("#chart")
.append("svg")
.attr("width", width).attr("height",height);



let projection = d3.geoMercator().scale(150).translate([width/2,height/2]);

let path = d3.geoPath(projection);


// console.log(meteorList[0].features);
// chart.append("g").attr("id","map").selectAll("path")
// .data(meteorList[0].features)
// .enter()
// .append("path")
// .attr("d",path);



chart.append("path")
.datum(meteorList[0])
.attr("d",path);

chart.append("path")
.datum(meteorList[1])
.attr("d",path)
.attr("fill","teal");


chart.append("text").text("Meteorite-Landings")
.attrs({
    "class": "title",
    "x": (width/2),
    "y": padding/2,
    "text-anchor": "middle",
    "fill": "white",
});




// let nodes= chart.append("g").attr("class","nodes")
// .selectAll("circle")
// .data(nodeList)
// .enter()
// .append("circle")
// .attr("r", function(d){

// return 10;
// })


// chart .selectAll("circle")
// .on("mouseenter",function(d){

//     let x= d3.mouse(this)[0];
//     let y= d3.mouse(this)[1];

     
//     if(!document.getElementById("tooltip")){
      
//     chart.append("text")
//    .html("text")
//    .attr("id", "tooltip")
//    .attr("x", x)
//    .attr("y", y);
//    }
 



// })
// .on("mousemove",function(d){
 
//   let x= d3.mouse(this)[0];
//   let y= d3.mouse(this)[1];

 
//   let tooltip= document.getElementById("tooltip");
  

//       d3.select("#tooltip").attrs({
//     "x": x,
//     "y": y   
//    });
   
   

// })
// .on("mouseleave",function(d){
//     if(document.getElementById("tooltip")){
        
//       d3.select("#tooltip").remove();
   
//     }
   
// });










}
