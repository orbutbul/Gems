
export const colors = ["red","orange","yellow","green","blue","purple","black","white"]


export function colorNameChecker (seed){
    colors.forEach(function(color){
        if (seed.includes(color)){
            console.log(color);
        }
    })
}
function returnColorComp(component,start,end){
    component= parseInt(component.substring(start,end));
    component = (component % 255)/255;
    if (component <= .1){
        Math.sqrt(1 - Math.pow(component - 1, 2));
    }
    return (component/255);
}


// function ColorGen(number){
//     number = parseInt(number,36);
//     number = number.toString();
//     let red = returnColorComp(number,0,2);
//     let green = returnColorComp(number,3,5);
//     let blue = returnColorComp(number,6,8);
//     const GeoColor = new THREE.Color(red,green,blue);
//     return(GeoColor);
// }


