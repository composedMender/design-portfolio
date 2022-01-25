
import * as THREE from '/vendor/three/build/three.module.js';
import { RoundedBoxGeometry } from '/vendor/three/examples/jsm/geometries/RoundedBoxGeometry.js';

// texture stuff 
const textureLoader = new THREE.TextureLoader();

const fiveTone = textureLoader.load( './vendor/three/examples/textures/gradientMaps/fiveTone.jpg' );
fiveTone.minFilter = THREE.NearestFilter;
fiveTone.magFilter = THREE.NearestFilter;

// constant variables
const SEPARATION = 80, AMOUNTX = 40, AMOUNTY = 40;
const phoneHeight = 5000;
const phoneWidth = phoneHeight / 2.5;
const elementHeight = 1500;
const iconSize = ( phoneWidth / 4 );

//colors
const darkPurple = 0x0E0220;
const pink =       0xE40475;
const lightBlue =  0x48E0E4;
const gold =       0xFF8A01;

// housekeeping
let camera, scene, renderer;

renderer = new THREE.WebGLRenderer( { canvas: document.getElementById('canvas'), antialias: true, alpha: true } );

const frustumSize = 10000;

let particles, count = 0;
let phone, element = 0;
let topBarElement, topBarLayer = 0;
let bottomNavBar = 0;
let roundBox = 0;

let bottomIcon = 0;

let mesh1, mesh2, mesh3 = 0;

const iconArray = [];
let icon1, icon2, icon3, icon4 = 0;
icon1 = createIconMesh( 0xFFA5D2 );
icon2 = createIconMesh( 0xFFA5D2 );
icon3 = createIconMesh( 0xFFA5D2 );
icon4 = createIconMesh( 0xFFA5D2 );

iconArray.push(icon1);
iconArray.push(icon2);
iconArray.push(icon3);
iconArray.push(icon4);


const clock = new THREE.Clock();

//options for tweening
const tweenOptions = {
    range : 80,
    duration : 2500,
    delay : 0,
    easing : 'Elastic.EaseInOut'
};


//initialize and animate
init();
animate();

function init() {
    const container = document.getElementById( 'canvas-container' );
    const w = container.clientWidth;
    const h = container.clientHeight;
    const aspect = w / h;

    console.log( "width: " + w + "height: " + h + "aspect: " + aspect )

    // camera = new THREE.OrthographicCamera( - w * 10, w * 10, h * 5, h * -5, 1, 1000000 );
    camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2 - 1000, frustumSize / - 2 - 1000, 1, 1000000 );
    scene = new THREE.Scene();

    //

    const numParticles = AMOUNTX * AMOUNTY;

    const positions = new Float32Array( numParticles * 3 );
    const scales = new Float32Array( numParticles );

    let i = 0, j = 0;

    for ( let ix = 0; ix < AMOUNTX; ix ++ ) {
        for ( let iy = 0; iy < AMOUNTY; iy ++ ) {

            positions[ i ] = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2); // x
            positions[ i + 1 ] = 0; // y
            positions[ i + 2 ] = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 ); // z

            scales[ j ] = 1;

            i += 3;
            j ++;
        }
    }

    // ===== GEOMETRIES ===== //

    const geometry = new THREE.BufferGeometry();
    const phoneGeo = new THREE.BoxGeometry( phoneWidth, phoneHeight, 200 );
    const elementGeo = new THREE.BoxGeometry( phoneWidth, elementHeight, 20 );
    const roundedElementGeo = new RoundedBoxGeometry( (phoneWidth * 2 / 3) - 50, elementHeight / 3, 80, 25, 900 );
    const roundedElementGeo2 = new RoundedBoxGeometry( (phoneWidth / 3) - 50, elementHeight / 3, 80, 25, 900 );
    const bottomNavBarGeo = new THREE.BoxGeometry( phoneWidth, iconSize, 100 );
    
    const bottomIconGeometry = new THREE.PlaneGeometry( phoneWidth / 4, phoneWidth / 4);
    const roundBoxGeo = new RoundedBoxGeometry( phoneWidth / 1.2, phoneWidth / 1.2, 200, 25, 900 );

    geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 'scale', new THREE.BufferAttribute( scales, 1 ) );

    // ===== MATERIALS ===== //

    const material = new THREE.ShaderMaterial( {

        uniforms: { color: { value: new THREE.Color( 0xffffff ) } },
        vertexShader: document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent

    } );

    const phoneMat = new THREE.MeshToonMaterial( {
            color: 0x48E0E4,
            gradientMap: fiveTone
    });

    const elementMat = new THREE.MeshToonMaterial( {
            color: 0xE40475,
            gradientMap: fiveTone
    });

    const darkMat = new THREE.MeshToonMaterial( {
        color: pink,
        gradientMap: fiveTone
    })

    const topBarLayerMat = new THREE.MeshToonMaterial( {
            color: 0xFF8A01,
            gradientMap: fiveTone
    });

    const roundedMat = new THREE.MeshToonMaterial( {
            color: 0xFFFFFF,
            gradientMap: fiveTone
    });
    const roundedMat2 = new THREE.MeshToonMaterial( {
            color: pink,
            gradientMap: fiveTone
    });
    const roundedMat3 = new THREE.MeshToonMaterial( {
            color: gold,
            gradientMap: fiveTone
    });

    const bottomIconMaterial = new THREE.MeshToonMaterial( {
            color: pink,
            transparent: true,
            gradientMap: fiveTone
    });

    // initial geometry translation
    elementGeo.translate( 0, - elementHeight / 2, 0 );

// ===== CREATING MESHES ===== //

    particles = new THREE.Points( geometry, material );

    phone = new THREE.Mesh( phoneGeo, phoneMat );
    element = new THREE.Mesh( elementGeo, elementMat );

    topBarElement = new THREE.Mesh( roundedElementGeo, elementMat );
    topBarLayer = new THREE.Mesh( roundedElementGeo2, topBarLayerMat );

    bottomIcon = new THREE.Mesh( bottomIconGeometry, bottomIconMaterial );

    roundBox = new THREE.Mesh ( roundBoxGeo, roundedMat );

    bottomNavBar = new THREE.Mesh( bottomNavBarGeo, darkMat );

   
    
    // adding meshes to scene
    scene.add( particles, phone, element );
    // scene.add( roundBox );
    scene.add( topBarElement, topBarLayer );
    scene.add( bottomNavBar );

    // add and place icons
    for( let q = 0; q < 4; q ++ ) {
        scene.add( iconArray[ q ])
        iconArray[ q ].position.set( - (phoneWidth / 2) + ( ( iconSize * ( q * 2 + 1 ) / 2 ) ), iconSize - ( phoneHeight / 2 ), 350 );
        iconArray[ q ].scale.set( 0.8, 0.8, 1);
        iconArray[ q ].castShadow = true;
        console.log(q);
    }

    // initial positioning
    particles.position.set( 0, - (phoneHeight / 2 ), 0);
    element.position.set( 0, ( phoneHeight / 2 ) - ( elementHeight / 3) - 200 , 300 );

    topBarElement.position.set( -( phoneWidth / 2 ) + ( phoneWidth * 2 / 6), (phoneHeight / 2) - (elementHeight / 3), 350 );
    topBarLayer.position.set( (phoneWidth / 2) - ( phoneWidth / 6 ), (phoneHeight / 2) - (elementHeight / 3), 350 );

    bottomNavBar.position.set( 0, - ( phoneHeight / 2 ) + ( elementHeight / 2 ), 200);
    bottomIcon.position.set( ( -phoneWidth / 2) + ( phoneWidth / 8 ), -phoneHeight / 3, 151);
    
    roundBox.position.set( -1500, 500, 1200 );

// MAGIC ROTATING STUFF //
    //parent
    parent = new THREE.Object3D();
    parent.position.set( 0, 0, -9800)
    scene.add( parent );

    //pivots
    var pivot1 = new THREE.Object3D();
    var pivot2 = new THREE.Object3D();
    var pivot3 = new THREE.Object3D();

    pivot1.rotation.y = 0;
    pivot2.rotation.y = .2 * Math.PI / 3;
    pivot3.rotation.y = -.2 * Math.PI / 3;

    parent.add( pivot1 );
    parent.add( pivot2 );
    parent.add( pivot3 );

    //mesh
    mesh1 = new THREE.Mesh( roundBoxGeo, roundedMat );
    mesh2 = new THREE.Mesh( roundBoxGeo, roundedMat2 );
    mesh3 = new THREE.Mesh( roundBoxGeo, roundedMat3 );

    mesh1.position.z = 10000;
    mesh2.position.z = 10000;
    mesh3.position.z = 10000;

    pivot1.add( mesh1 );
    pivot2.add( mesh2 );
    pivot3.add( mesh3 );

// ===== LIGHTING ===== //

    // creating lights, positioning, and adding
    const pointLight = new THREE.PointLight( 0xFFFFFF, .7 );
    const ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.5);
    pointLight.position.set( -1200, 3500, 2000 );

    scene.add( pointLight, ambientLight );
    

    // shadow properties
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 512;
    pointLight.shadow.mapSize.height = 512;
    pointLight.shadow.camera.near = 0.5;
    pointLight.shadow.camera.far = 6000;

    phone.receiveShadow = true;
    bottomNavBar.receiveShadow = true;
    element.castShadow = true;
    topBarElement.castShadow = true;
    topBarLayer.castShadow = true;
    icon1.castShadow = true;

    mesh1.castShadow = true;
    mesh2.castShadow = true;
    mesh3.castShadow = true;

    roundBox.castShadow = true;

    // shadow camera helper //
    // const helper = new THREE.CameraHelper( pointLight.shadow.camera );
    // scene.add( helper );

// ===== RENDERER ===== //

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( w , h );

    //

    setupTween();
    iconTweening();
}

// TWEENING SETUP

function setupTween() {

    var update = function() {
        element.scale.y = current.y / 200 * 2;

    }
    var current = { y : 30 };

    var tweenHead = new TWEEN.Tween(current)
        .to( {y : tweenOptions.range }, tweenOptions.duration)
        .delay( tweenOptions.delay )
        .easing( TWEEN.Easing.Elastic.InOut )
        .onUpdate( update );
    var tweenBack = new TWEEN.Tween(current)
        .to( { y : 30 }, tweenOptions.duration )
        .delay( 1500 )
        .easing( TWEEN.Easing.Elastic.InOut )
        .onUpdate( update );

    tweenHead.chain(tweenBack);
    tweenBack.chain(tweenHead);
    tweenHead.start();

}

function iconTweening() {
    
    const elapsedTime = clock.getElapsedTime();
    var current = { y : -8000 };
    var currentOpacity = { opacity: 0 };

    for ( let t = 0; t < 4; t++ ) {

        var iconFloat = new TWEEN.Tween( current )
            .to( { y : (Math.sin( elapsedTime + t * 50 ) * 100 ) + (iconSize * .8) - ( phoneHeight / 2 ) }, 4000 )
            .delay( t * 50 )
            .easing( TWEEN.Easing.Elastic.InOut )
            .onUpdate( function() {
                iconArray[ t ].position.y = current.y;
            });

        var iconOpacity = new TWEEN.Tween( currentOpacity )
            .to( { opacity : 1 }, 1000 )
            .delay( t * 50 + 1700 )
            .easing( TWEEN.Easing.Elastic.InOut ) 
            .onUpdate( function() {
                iconArray[ t ].material.opacity = currentOpacity.opacity;
            });
     
        iconFloat.start();
        iconOpacity.start();
    }

   
}

//

function createIconMesh( hex ) {
    var geometry = new RoundedBoxGeometry( iconSize, iconSize, 100, 25, 50 )
    var material = new THREE.MeshToonMaterial( { color : hex, gradientMap : fiveTone, transparent: true, opacity : 0 } );
    var mesh = new THREE.Mesh( geometry, material );
    return mesh;
}

//

function onWindowResize() {
    const container = document.getElementById('canvas-container');
    const canvas = document.getElementById('canvas');
    const width = container.clientWidth;
    const height = container.clientHeight;
    const aspect = width / height;
    console.log(width, height)

    camera.left = - frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2 - 1000;
    camera.bottom = - frustumSize / 2 - 1000;

    if (canvas.clientWidth !== width || canvas.clientHeight !== height) {
        // you must pass false here or three.js sadly fights the browser
        renderer.setSize(width, height);
        camera.updateProjectionMatrix();
    }
}

function resizeCanvasToDisplaySize() {
    var container = document.getElementById( 'canvas' );
    var w = window.innerWidth;
    var h = window.innerHeight;
    const aspect = w / h;

    console.log( w, h )

    camera.left = - frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2 - 1000;
    camera.bottom = - frustumSize / 2 - 1000;
    
    camera.updateProjectionMatrix();

    renderer.setSize( w, h )

}

function animate() {
    
    onWindowResize();
    requestAnimationFrame( animate );
    render();

    TWEEN.update();
}

//

function render() {
     
    const elapsedTime = clock.getElapsedTime();
    const positions = particles.geometry.attributes.position.array;
    const scales = particles.geometry.attributes.scale.array;


    // CAMERA POSITIONING //
    camera.position.x = 2500;
    camera.position.y = 3000;
    camera.position.z = 3000;
    camera.lookAt( scene.position );

    // ELEMENTS POSITIONING //

    // particle field positioning and scale automation
    
    let i = 0, j = 0;

    for ( let ix = 0; ix < AMOUNTX; ix ++ ) {

        for ( let iy = 0; iy < AMOUNTY; iy ++ ) {

            positions[ i + 1 ] = ( Math.sin( ( ix + count ) * .5  ) * 25 ) +
                                 ( Math.sin( ( iy + count ) * .5 ) * 25 ) - 200;

            scales[ j ] = Math.sin( ( ix + count ) * .8 )  * 15 +
                          Math.cos( ( iy + count ) * .5 + Math.cos(count * 0.5)) * 15 + 15 ;

            i += 3;
            j ++;
        }
    }

    var iconSinFloat = function() {
        for ( let t = 0; t < 4; t ++ ) {
            iconArray[ t ].position.y = (Math.sin( elapsedTime + 180 ) * 100 ) + (iconSize * .8) - ( phoneHeight / 2 );
        }
    }

    setTimeout( iconSinFloat, 4000 )
    
    bottomNavBar.position.y = ( Math.sin( elapsedTime ) * 100 - phoneHeight/2 + ( iconSize / 2 ) );
    phone.position.y = ( Math.sin( elapsedTime ) * 100 );
    element.position.y = ( Math.sin( elapsedTime ) * 100 ) + ( phoneHeight / 2 ) - ( elementHeight / 3 ) - 200;

    topBarElement.position.y = ( Math.sin( elapsedTime ) * 100 ) + ( phoneHeight / 2 ) - (( elementHeight / 6 ) / 0.75);
    topBarLayer.position.y = ( Math.sin( elapsedTime ) * 100 ) + ( phoneHeight / 2 ) - (( elementHeight / 6 ) / 0.75);

    roundBox.position.y = Math.sin( elapsedTime * 2 ) * 500;

    parent.rotation.y = Math.sin( elapsedTime * 0.6 ) * 0.21;
    parent.position.y = ( Math.sin( elapsedTime ) * 100 ) - 800;

    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.scale.needsUpdate = true;

    renderer.render( scene, camera );

    count += 0.1;

}

