varying vec3 vPos;
uniform vec3 uPos;
varying vec3 vnorm;
uniform vec3 unorm;
uniform vec3 Colorie;
#define MAX_ITER 100


const float PHI = 1.61803398874989484820459; // Φ = Golden Ratio 
vec3 quintic(vec3 p) {
  return p*p*p*(p*(p*6.0-15.0)+10.0);
}

//This code is based on the Murmur Hash created by Austin Appleby translated into GLSL by GitHub User mPottinger
//https://gist.github.com/mpottinger/54d99732d4831d8137d178b4a6007d1a
uint murmurHash13(uvec3 src) {
    const uint M = 0x5bd1e995u;
    uint h = 1190494759u;
    src *= M; src ^= src>>24u; src *= M;
    h *= M; h ^= src.x; h *= M; h ^= src.y; h *= M; h ^= src.z;
    h ^= h>>13u; h *= M; h ^= h>>15u;
    return h;
}

// 1 output, 3 inputs
float hash13(vec3 src) {
    uint h = murmurHash13(floatBitsToUint(src));
    return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}

float sinstriped(float axis,float scale){
    scale *=3.1415;
    return sin((axis* scale));
}
float sawstriped(float axis,float scale){
    return fract((axis* scale));
}

vec3 randomVec(vec3 p) 
{
    p += .024;
    float x = dot(p, vec3(156.,456.,321.));
    float y = dot(p, vec3(234.,532.,476.));
    float z = dot(p, vec3(224.,512.,975.));

    vec3 gradient = vec3(x,y,z);

    
    gradient = sin(gradient);
    gradient *= 13674.;
    gradient = sin(gradient);
    

    return (gradient);

}


float Perlin(vec3 uv, float uvPos, float scale){
  //   return p * p * p * (10.0 + p * (-15.0 + p * 6.0));
  // uv = uv * uv * uv *(10. + uv* (-15. + uv *6.));

  uv += uvPos;
  uv *= scale;

  vec3 gridId = floor(uv);
  vec3 gridUv = fract(uv);

  vec3 q000 = randomVec(gridId + vec3(0.,0.,0.));
  vec3 q100 = randomVec(gridId + vec3(1.,0.,0.));
  vec3 q010 = randomVec(gridId + vec3(0.,1.,0.));
  vec3 q110 = randomVec(gridId + vec3(1.,1.,0.));
  vec3 q001 = randomVec(gridId + vec3(0.,0.,1.));
  vec3 q101 = randomVec(gridId + vec3(1.,0.,1.));
  vec3 q011 = randomVec(gridId + vec3(0.,1.,1.));
  vec3 q111 = randomVec(gridId + vec3(1.,1.,1.));

  vec3 distToq000 = gridUv - vec3(0.,0.,0.);
  vec3 distToq100 = gridUv - vec3(1.,0.,0.);
  vec3 distToq010 = gridUv - vec3(0.,1.,0.);
  vec3 distToq110 = gridUv - vec3(1.,1.,0.);
  vec3 distToq001 = gridUv - vec3(0.,0.,1.);
  vec3 distToq101 = gridUv - vec3(1.,0.,1.);
  vec3 distToq011 = gridUv - vec3(0.,1.,1.);
  vec3 distToq111 = gridUv - vec3(1.,1.,1.);


  float dotq1 = dot(q000,distToq000);
  float dotq2 = dot(q100,distToq100);
  float dotq3 = dot(q010,distToq010);
  float dotq4 = dot(q110,distToq110);
  float dotq5 = dot(q001,distToq001);
  float dotq6 = dot(q101,distToq101);
  float dotq7 = dot(q011,distToq011);
  float dotq8 = dot(q111,distToq111);

  gridUv = quintic(gridUv);

  float xZZero = mix(dotq1,dotq2,gridUv.x);
  float xZOne = mix(dotq3,dotq4,gridUv.x);
  float xyZZero = mix(xZZero,xZOne,gridUv.y);
  xZZero = mix(dotq5,dotq6,gridUv.x);
  xZOne = mix(dotq7,dotq8,gridUv.x);
  float xyZOne = mix(xZZero,xZOne,gridUv.y);

  float perlin = mix(xyZZero,xyZOne,gridUv.z);

  return perlin;
}
float valeuNoise(vec3 uv, float uvpos, float scale) {
    uv *= scale;

    vec3 gridUv= fract(uv);
    vec3 gridId = floor(uv);
    
    gridUv = smoothstep(0.,1.,gridUv);


    float q000 = hash13(gridId);
    float q100 = hash13(gridId + vec3(1.,0.,0.));
    float q010 = hash13(gridId + vec3(0.,1.,0.));
    float q110 = hash13(gridId + vec3(1.,1.,0.));
    float q001 = hash13(gridId + vec3(0.,0.,1.));
    float q101 = hash13(gridId + vec3(1.,0.,1.));
    float q011 = hash13(gridId + vec3(0.,1.,1.));
    float q111 = hash13(gridId + vec3(1.));

    float q1 = mix(q000,q100,gridUv.x);
    float q2 = mix(q010,q110,gridUv.x);

    float q3 = mix(q1,q2,gridUv.y);

    float q4 = mix(q001,q101,gridUv.x);
    float q5 = mix(q011,q111,gridUv.x);

    float q6 = mix(q4,q5,gridUv.y);

    float value = mix(q3,q6,gridUv.z);    

    return value;
}

float fractalPerlin(vec3 uv, float uvPos, float scale, int octaves){
    float total = 0.0; 
    float frequency = 1.0;
    float amplitude = 1.0;
    float maxValue = 0.0;  //Used for normalizing result

    for(int i = 0; i < MAX_ITER; i++) {
        if (i>=octaves) break;
        total += Perlin((uv * frequency), uvPos, scale) * amplitude;

        maxValue += amplitude;

        amplitude /= 2.0;
        frequency *= 2.0;
    }
    
    return (total/maxValue)+.3;
}


float fractalValueNoise(vec3 uv, float uvpos, float scale,int octaves){
    
    float total = 0.0; 
    float frequency = 1.0;
    float amplitude = 1.0;
    float maxValue = 0.0;  //Used for normalizing result

    for(int i = 0; i < MAX_ITER; i++) {
        if (i>=octaves) break;
        total += valeuNoise((uv * frequency), uvpos, scale) * amplitude;

        maxValue += amplitude;

        amplitude /= 2.0;
        frequency *= 2.0;
    }
    
    return (total/maxValue);

    return 1.;
}

float voronoi(vec3 uv,float uvpos, float scale ){
    uv += uvpos;
    uv *= scale;
    float d= 0.;
    float minDist = 100.;
    vec3 gridUv = fract(uv)-.5;
    vec3 gridId = floor(uv);
    vec3 cid =   vec3(0);
    for(float z = -1.; z <= 1.; z++) {
        for(float y=-1.;y<=1.;y++){
            for(float x=-1.; x<=1.; x++){
                vec3 offs = vec3(x,y,z);

                vec3 n = randomVec(gridId+offs);
                vec3 p = offs+sin(n)*.5;
                float d = length(gridUv-p);

                if (d<minDist){
                    minDist =d;
                    cid = gridId + offs;
                }
            }
        }
    }
    return minDist;
}



struct colorStop{
    vec3 color;
    float position;
};

vec3 colorRamp(colorStop[3] colors, float fac){
    int index =0;
    for(int i = 0; i < colors.length() -1; i++) {
        colorStop currentColor = colors[i];
        colorStop nextColor = colors[i+1];
        
        bool isInbetween = currentColor.position <= fac;
        index = isInbetween ? i : index;

    }
    colorStop currentColor = colors[index];
    colorStop nextColor = colors[index+1];

    float range = nextColor.position - currentColor.position;
    float lerpfactor = (fac - currentColor.position)/ range;
    return mix(currentColor.color,nextColor.color,lerpfactor);
}


    void main() {
        vec3 pos = vPos + uPos; // Modify the pos variable with uPos
        pos += 1.;
        pos /= 2.;
        vec3 norm = vnorm + unorm;
        vec3 color = vec3(0.);
        vec3 girdPos = fract(pos);
        vec3 gridPosId = floor(pos);
        gridPosId *= .25;

        colorStop[3] colors = colorStop[](
            colorStop(vec3(0.07f, 0.15f, 0.52f),0.),
            colorStop(vec3(0.,1.,0.),.4),
            colorStop(vec3(1.,0.,0.),1.)
        );
        float fractalValue = fractalValueNoise(pos,0.,7.,10);
        float voronoee = voronoi(pos,10.,7.);
        float finalFinal = mix(fractalValue,voronoee,.8);
        finalFinal =(fractalValue + voronoee)/2.; 
        vec3 finalColor = colorRamp(colors,(finalFinal));
        color = vec3(finalColor);
        color = vec3(Colorie);
        gl_FragColor = vec4(color,1.); 
    }