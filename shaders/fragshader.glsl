precision highp float;

uniform vec3 color;
uniform float u_time;
varying float vScale;

void main() {

    if (length(gl_PointCoord - vec2(0.5,0.5)) > 0.475) discard;

    gl_FragColor = vec4(vScale,0.0,cos(vScale) / 2.0,1.0);

}