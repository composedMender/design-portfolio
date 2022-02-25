import * as THREE from '/vendor/three/build/three.module.js';
import { LineMaterial } from '/vendor/three/examples/jsm/lines/LineMaterial.js';
import { Wireframe } from '/vendor/three/examples/jsm/lines/Wireframe.js';
import { WireframeGeometry2 } from '/vendor/three/examples/jsm/lines/WireframeGeometry2.js';

import { EffectComposer } from '/vendor/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '/vendor/three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '/vendor/three/examples/jsm/postprocessing/UnrealBloomPass.js';

let canvas, renderer, scene, camera, analyzer, uniforms;

const fov = 75;
const aspect = 2;
const near = 0.1;
const far = 1000;

let cube;
let line;

let d, o;
let material;

let wireframe;
let composer;

const params = {
    exposure: 1,
    bloomStrength: 3.5,
    bloomThreshold: 0,
    bloomRadius: 1
};

init();
animate();

function init() {

    const fftSize = 512;

    //

    canvas = document.querySelector('#c');
    renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(canvas.clientWidth, canvas.clientHeight / 2 );
    
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.z = 2;
    const renderScene = new RenderPass( scene, camera );

    const bloomPass = new UnrealBloomPass( new THREE.Vector2( canvas.clientWidth, canvas.clientHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    //lighting

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight( color, intensity );
        light.position.set( -1, 2, 4 );
        scene.add( light );

        scene.add( new THREE.AmbientLight( 0x404040 ) );
    }

    //

    composer = new EffectComposer( renderer );
    composer.addPass( renderScene );
    composer.addPass( bloomPass );

    const listener = new THREE.AudioListener();
    const sound = new THREE.Audio( listener );
    const file = '../resources/deo.mp3';

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( file, function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.setVolume( 0.5 );
        sound.play();
    });

    analyzer = new THREE.AudioAnalyser( sound, fftSize );

    //

    const power = new Float32Array( 160 );
    const cubeMat = new THREE.MeshPhongMaterial();
    const cubeGeo = new THREE.IcosahedronGeometry( 1, 0 );

    const format = ( renderer.capabilities.isWebGL2 ) ? THREE.RedFormat : THREE.LuminanceFormat;

    uniforms = {
        vertPos: { value: 55.0 },
        tAudioData: { value: analyzer.getFrequencyData().reduce((prev, curr) => prev + curr, 0) }
    };


    // central icosahedron //

    let icoGeo = new THREE.IcosahedronGeometry( 1, 0 );
    const wireGeo = new THREE.WireframeGeometry( icoGeo );
    let matLine = new THREE.LineBasicMaterial( {
        color: 0x4080ff,
        linewidth: 1
    });

    wireframe = new THREE.LineSegments( wireGeo );
    wireframe.material.depthTest = false;
    wireframe.material.transparent = true;
    scene.add( wireframe );

    //

    

}

function resizeRendererToDisplaySize( renderer ) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if ( needResize ) {
        renderer.setSize( width, height, false );
    }
    return needResize;
}

function animate() {

    requestAnimationFrame( animate );
    render();

}

function render() {

    d = analyzer.getFrequencyData();
    o = d.reduceRight((prev, curr) => prev + curr, 240);

    uniforms.tAudioData.value = o;
    uniforms.tAudioData.needsUpdate = true;

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    params.bloomStrength = (o * 0.1 / d.length * 0.02) * 0.4;

    wireframe.rotation.x += (o * 0.1 / d.length * 0.02) * 0.1;
    wireframe.rotation.y += (o * 0.1 / d.length * 0.02) * 0.1;
    wireframe.scale.setScalar(
        o * 0.1 / d.length * 0.15);

    composer.render( scene, camera );
}
