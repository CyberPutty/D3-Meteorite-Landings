
let meteorList=[];
let chart;
let padding= 200;
let width= 1600;
let height= 1000;
let randomColor;
let rotateScale= d3.scaleLinear();
rotateScale.domain([0,width]);
rotateScale.range([0,360]);
let rotation=0;
let mouseX;
let rotationspeed=6;
let selected= false;
let blurb= "";
let meteors;
let map;
let projection = d3.geoOrthographic().scale(350).translate([width/2,height/2]);

const urls=["https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json","https://rawgit.com/CyberPutty/D3-Meteorite-Landings/master/simpleMap.geojson"]

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

if (!!window.chrome){
meteors=meteorList[1];
map=meteorList[0];
}
if(typeof InstallTrigger !== 'undefined'){
meteors=meteorList[0];
map=meteorList[1];
}
console.log(meteors);

chart= d3.select("#chart")
.append("svg")
.attr("width", width).attr("height",height);


let timeFormat= d3.timeFormat("%B,%Y");


let path = d3.geoPath(projection);





let massMin= d3.min(meteors.features,function(d){
    if(d.properties.mass){

        return parseInt(d.properties.mass);
        }
});
let massMax= d3.max(meteors.features,function(d){
    if(d.properties.mass){

    return parseInt(d.properties.mass);
    }
   
});

let scale= d3.scaleLinear();
scale.domain([massMin,massMax]);
scale.range([2,25]);




chart.append("g").attr("class","map")
.append("path")
.datum(map)
.attr("d",path);


chart.append("g").attr("class","meteors")
.selectAll("path")
.data(meteors.features)
.enter()
.append("path")
.attr("d",function(d){
  
    path.pointRadius([scale(d.properties.mass)]);    
    return path(d);
})
.attr("fill",function(d){
   
    return "teal";
});


chart.append("text").text("Meteorite-Landings")
.attrs({
    "class": "title",
    "x": (width/2),
    "y": padding/2,
    "text-anchor": "middle",
    "fill": "white",
});


let isdown= false    
chart.on("mousedown", function(){
    isdown= true;
    let x= d3.mouse(this)[0];
    mouseX= x;
    });
chart.on("mouseup",function(){
    isdown= false;
});

chart.on("mousemove",function(){
    if(isdown===true){
    let x= d3.mouse(this)[0];
    let y= d3.mouse(this)[1];
    
    if(rotation+ 1>360){
        rotation= rotation-360;
    }
    if(mouseX>x){
        rotation= rotation+ (x-rotation);
    }
    else if(mouseX<x){
        rotation= rotation+ (x-rotation);
    }
    projection.rotate([rotation,0,0]);
  chart.select(".map").selectAll("path")
    .attr("d",path);
    chart.select(".meteors").selectAll("path")
    .attr("d",function(d){
        path.pointRadius([scale(d.properties.mass)]);    
        return path(d);
    });

    }
          
    });


chart.select(".meteors").selectAll("path")
.on("mouseenter",function(d){

    let x= d3.mouse(this)[0];
    let y= d3.mouse(this)[1];

     
    if(!document.getElementById("tooltip")){
     
    chart.append("text")
   .html(d.properties.name)
   .attr("id", "tooltip")
   .attr("x", x)
   .attr("y", y);
    
   }
    



})
.on("mousemove",function(d){
 
  let x= d3.mouse(this)[0];
  let y= d3.mouse(this)[1];

 
  let tooltip= document.getElementById("tooltip");
  

      d3.select("#tooltip").attrs({
    "x": x,
    "y": y   
   });

   
   

})
.on("mouseleave",function(d){
    if(document.getElementById("tooltip")){
        
      d3.select("#tooltip").remove();
   
    }
   
})
.on("click", function(d){
 fetchWiki(d.properties.name,d,this);
   
});

function fetchWiki(meteorname,d,meteor){
    fetch("https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=description&titles="+meteorname+" meteorite&format=json")
    .then(response=> response.json())
   .then(data=>{
        
     
        blurb= Object.values(data.query.pages)[0].description;
        

    }).then(()=>{
        if(typeof blurb ==="undefined"){
            blurb= "no information avalailable"
        }


       if (selected=== false){
            
        document.getElementById("information")
        .innerHTML="Meteor Name: "+
        d.properties.name+"</br> Year: "+
        timeFormat(new Date(d.properties.year))+"<br /> Mass: "+ 
        d.properties.mass+"<br /> Type: "+ 
        d.properties.recclass+"<br/>Wikipedia Information: <br/>"+ 
        blurb;   
         meteor.classList.add("selected");
         console.log(this);
         selected= true;
     }
        if (selected === true){
            let elements= document.getElementsByClassName("selected");
            elements[0].classList.remove("selected");
             meteor.classList.add("selected");
        
            document.getElementById("information")
            .innerHTML="Meteor Name: "+
            d.properties.name+"<br/> Year: "+
            timeFormat(new Date(d.properties.year))+"<br /> Mass: "+ 
            d.properties.mass+"<br /> Type: "+ 
            d.properties.recclass+"<br/>Wikipedia Information: <br/>"+ 
            blurb;
        }
        
    });
        
    
}








}
