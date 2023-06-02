    varying vec3 vPos;
    uniform vec3 uPos;
    uniform vec3 SlayColor;

    const float PHI = 1.61803398874989484820459; // Φ = Golden Ratio 

    float gold_noise(in vec3 xyz)
    {
        return fract(tan(distance(xyz*PHI, xyz)*1938324.)*xyz.x);
    }

    void main() {
        vec3 pos = vPos + uPos; // Modify the pos variable with uPos
        pos += 1.;
        pos /= 2.;
        pos *= 4.;
        vec3 girdPos = fract(pos);
        vec3 gridPosId = floor(pos);
        gridPosId *= .25;
        float slay = gold_noise(pos);
        gl_FragColor = vec4(gridPosId,1.); 
    }