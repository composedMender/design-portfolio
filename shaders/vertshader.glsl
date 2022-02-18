precision highp float;

attribute float scale;
varying float vScale;

void main() {

	vec4 mvPosition = modelViewMatrix * vec4(position,.4);

	gl_PointSize = scale * (400.0/-mvPosition.z);

	gl_Position = projectionMatrix * mvPosition;

	vScale = scale / 100.0;
}