import * as THREE from 'three';

export const colors = ["red", "orange", "yellow", "green", "blue", "purple", "black", "white"]

export const listOfObjects = ["Cube", "Hex Bipyramid", "Icosahedron", "Oct Cupola", "Octahedron", "Pyramid", "Sphere", "Sq Antiprism", "Torus", "Triak Tetrahedron", "Triaug Pyramid", "Truncated Cube"]
export const listOfTextures = ["voronoi", "Striped", "ValueNoise", "Perlin"]
// export function colorNameChecker (seed){
//     colors.forEach(function(color){
//         if (seed.includes(color)){
//             console.log(color);
//         }
//     })
// }


export function lcg(seed = 1, a = 1103515245, c = 12345, m = 3656158440062975, x = 10) {
    for (let i = 0; i < x; i++) {
        seed = (a * seed + c) % m;
    }
    return seed;
}
export function digitSum(seed, isFirst = true) {
    let sum = 0;
    for (let char of String(seed)) {
        sum += Number(char);
    }
    if (sum >= 10 && isFirst == true) {
        return (digitSum(sum));
    }
    else {
        return (sum);
    }

}
export function digitProduct(seed, isFirst = true) {
    let product = 1;
    for (let char of String(seed)) {
        if (Number(char) == 0) {
            product *= 1;
        }
        else {
            product *= Number(char);
        }
    }
    if (product >= 10 && isFirst == true) {
        return (digitProduct(product));
    }
    else {
        return (product);
    }

}
export function magnitude(seed) {
    return (seed /= 3656158440062975);
}
export function Base36(seed) {
    let x = parseInt(seed, 36);
    if (x < 1000000000) {
        x = lcg(x);
    }
    return x
}

export function geo(seed) {
    let x = (seed % 12);
    if (x != undefined)
        return listOfObjects[x];
    else
        return ("Cube");
}




function common(number) {
    const digitCounts = new Map();

    const str = String(number);

    for (let i = 0; i < str.length; i++) {
        const digit = str[i];

        if (digitCounts.has(digit)) {
            digitCounts.set(digit, digitCounts.get(digit) + 1);
        } else {
            digitCounts.set(digit, 1);
        }
    }

    let mostCommonDigit = "";
    let highestCount = 0;

    for (const [digit, count] of digitCounts) {
        if (count > highestCount) {
            highestCount = count;
            mostCommonDigit = digit;
        }
    }

    return Number(mostCommonDigit);
}

function firstDigit(seed) {
    let x = String(seed)[0];
    return Number(x);

}

export function textureInit(seed, which = 0) {
    var type = ((seed + which) % 3);
    seed = lcg(seed + which);
    var uvpos = firstDigit(seed);
    var scale = common(seed)+1;
    var octaves = Math.floor((lcg(seed) % 6) + 2);
    return (new THREE.Vector4(type, uvpos, scale, octaves));
}



export function returnColorComp(component) {
    component = (component % 255) / 255;
    if (component <= .1) {
        Math.pow(Math.sqrt(1 - Math.pow(component - 1, 2)), 2);
    }
    return component;
}

export function colorgen(seed) {
    let color = [];
    var seed = String(seed);
    for (let i = 0; i < 3; i++) {
        let start = ((lcg(seed / (i + 3))) % (seed.length));
        let end = start + 3;
        if (end <= seed.length) {
            let colorComp = Number(seed.substring(start, end));
            color.push(returnColorComp(colorComp));
        }
        else {
            let part1 = seed.substring(start);
            let part2 = seed.substring(0, end % seed.length);
            let colorComp = Number(part1 + part2);
            color.push(returnColorComp(colorComp));
        }
    }
    return new THREE.Vector3(color[0], color[1], color[2]);
}

export class Gem {
    constructor(seed) {
        this.Gemseed = seed;
        this.NumSeed = Base36(seed);

    }
    generateShapes() {
        let x = (this.NumSeed % 12);
        if (x != undefined)
            return listOfObjects[x];
        else
            return ("Cube");
    }

    amtOfTex(){
        return (this.NumSeed %3)+1;
    }

    genCol() {
        let colorList = []
        let x = (common(this.NumSeed)/1)
        if (x >= .85) {
            colorList.push(colorgen(this.NumSeed));
            colorList.push(colorgen(lcg(this.NumSeed)));
            colorList.push(colorgen(lcg(this.NumSeed, 6)));


        }
        else if (x >= .35) {
            colorList.push(colorgen(this.NumSeed));
            colorList.push(colorgen(lcg(this.NumSeed, 3)));
            colorList.push(colorgen(lcg(this.NumSeed, 12)));



        }
        else {
            colorList.push(colorgen(lcg(this.NumSeed, 12)));
            colorList.push(colorgen(lcg(this.NumSeed, 11)));
            colorList.push(colorgen(lcg(this.NumSeed, 10)));
        }
        return colorList;
    }


    genTex() {
        let texList = [];
        // Amount of textures in the seed
        let arrayNumSeed = (Array.from((this.NumSeed).toString()));
        let i=0;
        while(texList.length < 3){
            //the first number of the seed maps to the array location of the number used in the texture of in the object
            switch (arrayNumSeed[arrayNumSeed[i] % (arrayNumSeed.length)] % 3) {
                case 0:
                    texList.push(textureInit(this.NumSeed, arrayNumSeed[i]))
                    break;
                case 1:
                    texList.push(textureInit(this.NumSeed, arrayNumSeed[i]))
                    break;
                case 2:
                    texList.push(textureInit(this.NumSeed, arrayNumSeed[i]))
                    break;
            }
            i+=1;
        }
        return texList;
    }



}