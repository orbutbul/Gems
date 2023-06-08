varying vec3 vPos;
uniform vec3 uPos;
uniform vec3 SlayColor;
#define MAX_ITER 100


const float PHI = 1.61803398874989484820459; // Φ = Golden Ratio 

float gold_noise(in vec3 xyz)
{
    return fract(tan(distance(xyz*PHI, xyz)*1938324.)*xyz.x);
}


float sinstriped(float axis,float scale){
    scale *=3.1415;
    return sin((axis* scale));
}
float sawstriped(float axis,float scale){
    return fract((axis* scale));
}

vec2 randomVec(vec2 p) 
{
    p += .02;
    float x = dot(p, vec2(156.,456.));
    float y = dot(p, vec2(234.,532.));
    vec2 gradient = vec2(x,y);

    
    gradient = sin(gradient);
    gradient *= 13674.;
    gradient = sin(gradient);
    

    return (gradient);

}


float voronoi(vec2 uv,float uvpos, float scale ){
    uv *= scale;
    uv += uvpos;
    float d= 0.;
    float minDist = 100.;
    vec2 gridUv = fract(uv)-.5;
    vec2 gridId = floor(uv);
    vec2 cid =   vec2(0);

        for(float y=-1.;y<=1.;y++){
            for(float x=-1.; x<=1.; x++){
                vec2 offs = vec2(x,y);

                vec2 n = randomVec(gridId+offs);
                vec2 p = offs+sin(n)*.5;
                float d = length(gridUv-p);

                if (d<minDist){
                    minDist =d;
                    cid = gridId + offs;
                }
            }
        }
    return minDist;
}

vec2 quintic(vec2 p) {
  return p * p * p * (10.0 + p * (-15.0 + p * 6.0));
}

float Perlin(vec2 uv, vec2 uvPos, float scale){
  //   return p * p * p * (10.0 + p * (-15.0 + p * 6.0));
  // uv = uv * uv * uv *(10. + uv* (-15. + uv *6.));

  uv *= scale;
  uv += uvPos;

  vec2 gridId = floor(uv);
  vec2 gridUv = fract(uv);

  vec2 botL = gridId + vec2(0.,0.);
  vec2 botR = gridId + vec2(1.,0.);
  vec2 topL = gridId + vec2(0.,1.);
  vec2 topR = gridId + vec2(1.,1.);

  vec2 gradBL= randomVec(botL);
  vec2 gradBR= randomVec(botR);
  vec2 gradTL= randomVec(topL);
  vec2 gradTR= randomVec(topR);

  vec2 distToBL = gridUv - vec2 (0.,0.);
  vec2 distToBR = gridUv - vec2 (1.,0.);
  vec2 distToTL = gridUv - vec2 (0.,1.);
  vec2 distToTR = gridUv - vec2(1.,1.);

  float dotBl = dot(gradBL,distToBL);
  float dotBr = dot(gradBR,distToBR);
  float dotTl = dot(gradTL,distToTL);
  float dotTr = dot(gradTR,distToTR);

  gridUv = quintic(gridUv);
  // gridUv = smoothstep(0.,1.,gridUv);

  float b = mix (dotBl,dotBr,gridUv.x);
  float t = mix (dotTl,dotTr,gridUv.x);

  float perlin = mix(b,t,gridUv.y);


  return perlin;
}
float fractalPerlin(vec2 uv, vec2 uvPos, float scale, int octaves){
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

struct colorStop{
    vec3 color;
    float position;
};

vec3 colorRamp(colorStop[4] colors, float fac){
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
        // pos *= 4.;
        vec3 girdPos = fract(pos);
        vec3 gridPosId = floor(pos);
        gridPosId *= .25;
        float slay = gold_noise(pos);

        colorStop[4] colors = colorStop[](
            colorStop(vec3(0.),0.),
            colorStop(vec3(0.,1.,0.),.5),
            colorStop(vec3(0.09, 0.5, 0.6),.3),
            colorStop(vec3(1.,0.,0.),1.)
        );
        vec3 finalColor = colorRamp(colors,(pos.x * pos.y * pos.z));

        finalColor = vec3(fractalPerlin(pos.xy,vec2(1.),1.,9));
        gl_FragColor = vec4(finalColor,1.); 
    }