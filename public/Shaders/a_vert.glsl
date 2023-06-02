varying vec3 vPos;
uniform vec3 SlayColor;

void main() {
    vPos = position;

    vec4 result;

    result = vec4(position.x, position.y, position.z, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * result;
}