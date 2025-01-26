/* eslint-disable no-unused-vars */
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import fragmentShader from '../../shaders/blackHoleFragment.glsl';
import vertexShader from '../../shaders/blackHoleVertex.glsl';

// ----------------------------------
// 1. GLSL Shaders
// ----------------------------------
// const vertexShader = `
//   varying vec2 vUv;
//   void main() {
//     vUv = uv;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//   }
// `;

// This is your Shadertoy fragment code, wrapped into a valid GLSL snippet for Three.js.
// Key changes/notes:
// - We define uniforms for iTime, iResolution, iMouse, and iChannel0.
// - We rename mainImage(...) -> mainImage(...) but wrap it in main() to set gl_FragColor.
// - We use "precision mediump float;" at the top. 
// - We define #define / #if blocks as needed for AA etc.
// const fragmentShader = `
// #define AA 2     // change to 1 to increase performance
// #define _Speed 3.0
// #define _Steps 12.
// #define _Size 0.3

// precision mediump float;

// uniform float iTime;
// uniform vec2 iResolution;
// uniform vec2 iMouse;
// uniform sampler2D iChannel0; // Our nebula texture

// // ------------- The original Shadertoy code below -------------
// float hash(float x){ return fract(sin(x)*152754.742);}
// float hash(vec2 x){	return hash(x.x + hash(x.y));}

// float value(vec2 p, float f) //value noise
// {
//     float bl = hash(floor(p*f + vec2(0.,0.)));
//     float br = hash(floor(p*f + vec2(1.,0.)));
//     float tl = hash(floor(p*f + vec2(0.,1.)));
//     float tr = hash(floor(p*f + vec2(1.,1.)));
    
//     vec2 fr = fract(p*f);    
//     fr = (3. - 2.*fr)*fr*fr;	
//     float b = mix(bl, br, fr.x);	
//     float t = mix(tl, tr, fr.x);
//     return  mix(b,t, fr.y);
// }

// vec4 background(vec3 ray)
// {
//     vec2 uv = ray.xy;
    
//     if( abs(ray.x) > 0.5)
//         uv.x = ray.z;
//     else if( abs(ray.y) > 0.5)
//         uv.y = ray.z;

//     float brightness = value( uv*3., 100.);
//     float color = value( uv*2., 20.); 
//     brightness = pow(brightness, 256.);
//     brightness = brightness*100.;
//     brightness = clamp(brightness, 0., 1.);
    
//     vec3 stars = brightness * mix(vec3(1., .6, .2), vec3(.2, .6, 1.), color);

//     vec4 nebulae = texture(iChannel0, (uv*1.5 )); // sample the iChannel0 texture
//     nebulae.xyz += nebulae.xxx + nebulae.yyy + nebulae.zzz; //average color
//     nebulae.xyz *= 0.25;
    
//     nebulae*= nebulae;
//     nebulae*= nebulae;
//     nebulae*= nebulae;
//     nebulae*= nebulae;
 
// 	nebulae.xyz += stars;
// 	return nebulae;
// }

// vec4 raymarchDisk(vec3 ray, vec3 zeroPos)
// {
// 	vec3 position = zeroPos;      
//     float lengthPos = length(position.xz);
//     float dist = min(1., lengthPos*(1./_Size) *0.5) * _Size * 0.4 *(1./_Steps) /( abs(ray.y) );
//     position += dist*_Steps*ray*0.5;     

//     vec2 deltaPos;
//     deltaPos.x = -zeroPos.z*0.01 + zeroPos.x;
//     deltaPos.y = zeroPos.x*0.01 + zeroPos.z;
//     deltaPos = normalize(deltaPos - zeroPos.xz);
    
//     float parallel = dot(ray.xz, deltaPos);
//     parallel /= sqrt(lengthPos);
//     parallel *= 0.5;
//     float redShift = parallel +0.3;
//     redShift *= redShift;

//     redShift = clamp(redShift, 0., 1.);
    
//     float disMix = clamp((lengthPos - _Size * 2.)*(1./_Size)*0.24, 0., 1.);
//     vec3 insideCol =  mix(vec3(1.0,0.8,0.0), vec3(0.5,0.13,0.02)*0.2, disMix);
    
//     insideCol *= mix(vec3(0.4, 0.2, 0.1), vec3(1.6, 2.4, 4.0), redShift);
// 	insideCol *= 1.25;
//     redShift += 0.12;
//     redShift *= redShift;

//     vec4 o = vec4(0.);

//     for(float i = 0. ; i < _Steps; i++)
//     {                      
//         position -= dist * ray ;  
//         float intensity = clamp( 1. - abs((i - 0.8) * (1./_Steps) * 2.), 0., 1.); 
//         float lengthPos2 = length(position.xz);
//         float distMult = 1.;
//         distMult *=  clamp((lengthPos2 -  _Size * 0.75) * (1./_Size) * 1.5, 0., 1.);        
//         distMult *= clamp((_Size * 10. -lengthPos2) * (1./_Size) * 0.20, 0., 1.);
//         distMult *= distMult;

//         float u = lengthPos2 + iTime*_Size*0.3 + intensity * _Size * 0.2;

//         vec2 xy ;
//         float rot = mod(iTime*_Speed, 8192.);
//         xy.x = -position.z*sin(rot) + position.x*cos(rot);
//         xy.y = position.x*sin(rot) + position.z*cos(rot);

//         float x = abs(xy.x/(xy.y));         
// 		float angle = 0.02*atan(x);
  
//         const float f = 70.;
//         float noise = value(vec2(angle, u * (1./_Size) * 0.05), f);
//         noise = noise*0.66 + 0.33*value(vec2(angle, u * (1./_Size) * 0.05), f*2.);     

//         float extraWidth = noise * 1. * (1. - clamp(i * (1./_Steps)*2. - 1., 0., 1.));
//         float alpha = clamp(noise*(intensity + extraWidth)*((1./_Size)*10. + 0.01 )*dist*distMult, 0., 1.);

//         vec3 col = 2.*mix(vec3(0.3,0.2,0.15)*insideCol, insideCol, min(1.,intensity*2.));
//         o = clamp(vec4(col*alpha + o.rgb*(1.-alpha), o.a*(1.-alpha) + alpha), vec4(0.), vec4(1.));
//         lengthPos2 *= (1./_Size);
//         o.rgb += redShift*(intensity*1. + 0.5)*(1./_Steps)*100.*distMult/(lengthPos2*lengthPos2);
//     }  
//     o.rgb = clamp(o.rgb - 0.005, 0., 1.);
//     return o;
// }

// void Rotate(inout vec3 vector, vec2 angle)
// {
// 	vector.yz = cos(angle.y)*vector.yz + sin(angle.y)*vec2(-1.,1.)*vector.zy;
// 	vector.xz = cos(angle.x)*vector.xz + sin(angle.x)*vec2(-1.,1.)*vector.zx;
// }

// void mainImage(out vec4 colOut, in vec2 fragCoord)
// {
//     colOut = vec4(0.);
//     vec2 fragCoordRot = fragCoord;
//     fragCoordRot.x = fragCoord.x*0.985 + fragCoord.y*0.174;
//     fragCoordRot.y = fragCoord.y*0.985 - fragCoord.x*0.174;
//     fragCoordRot += vec2(-0.06, 0.12) * iResolution.xy;
    
//     for(int j=0; j<AA; j++)
//     for(int i=0; i<AA; i++)
//     {
//         vec3 ray = normalize(vec3((fragCoordRot - iResolution.xy*0.5 + vec2(i,j)/float(AA))/iResolution.x, 1.)); 
//         vec3 pos = vec3(0.,0.05, -(20.*iMouse.xy/iResolution.y-10.)*(20.*iMouse.xy/iResolution.y-10.)*0.05); 
//         vec2 angle = vec2(iTime*0.1, 0.2);      
//         angle.y = (2.*iMouse.y/iResolution.y)*3.14 + 0.1 + 3.14;
//         float dist = length(pos);
//         Rotate(pos, angle);
//         angle.xy -= min(.3/dist, 3.14)*vec2(1., 0.5);
//         Rotate(ray, angle);

//         vec4 col = vec4(0.);
//         vec4 glow = vec4(0.);
//         vec4 outCol = vec4(100.);

//         for(int disks=0; disks<20; disks++)
//         {
//             for(int h=0; h<6; h++)
//             {
//                 float dotpos = dot(pos,pos);
//                 float invDist = inversesqrt(dotpos);
//                 float centDist = dotpos * invDist; 	
//                 float stepDist = 0.92 * abs(pos.y / ray.y);
//                 float farLimit = centDist*0.5;
//                 float closeLimit = centDist*0.1 + 0.05*centDist*centDist*(1./_Size);
//                 stepDist = min(stepDist, min(farLimit, closeLimit));
				
//                 float invDistSqr = invDist*invDist;
//                 float bendForce = stepDist*invDistSqr*_Size*0.625;
//                 ray = normalize(ray - (bendForce*invDist)*pos);
//                 pos += stepDist*ray;
                
//                 glow += vec4(1.2,1.1,1.,1.)*(0.01*stepDist*invDistSqr*invDistSqr*clamp(centDist*2. -1.2, 0.,1.));
//             }

//             float dist2 = length(pos);

//             if(dist2 < _Size*0.1)
//             {
//                 outCol = vec4(col.rgb*col.a + glow.rgb*(1.-col.a),1.);
//                 break;
//             }
//             else if(dist2 > _Size*1000.)
//             {                   
//                 vec4 bg = background(ray);
//                 outCol = vec4(col.rgb*col.a + bg.rgb*(1.-col.a) + glow.rgb*(1.-col.a), 1.);
//                 break;
//             }
//             else if(abs(pos.y) <= _Size*0.002)
//             {                             
//                 vec4 diskCol = raymarchDisk(ray, pos);  
//                 pos.y = 0.;
//                 pos += abs(_Size*0.001/ray.y)*ray;  
//                 col = vec4(diskCol.rgb*(1.-col.a) + col.rgb, col.a + diskCol.a*(1.-col.a));
//             }	
//         }
   
//         if(outCol.r == 100.)
//             outCol = vec4(col.rgb + glow.rgb*(col.a+glow.a), 1.);

//         col = outCol;
//         col.rgb = pow(col.rgb, vec3(0.6));
//         colOut += col/float(AA*AA);
//     }
// }

// // Main entry for the fragment
// void main() {
//   vec2 fragCoord = gl_FragCoord.xy;
//   vec4 colOut;
//   mainImage(colOut, fragCoord);
//   gl_FragColor = colOut;
// }
// `;

function BlackHoleShader() {
  const meshRef = useRef();
  const { size, clock, mouse } = useThree();
  
  // Load the nebula texture for iChannel0
  // Make sure there's a valid "nebula.jpg" in public/textures/
  const nebulaTexture = useTexture('/textures/nebula.jpg');

  // Uniforms
  const uniforms = useMemo(() => ({
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector2(size.width, size.height) },
    iMouse: { value: new THREE.Vector2(0, 0) },
    iChannel0: { value: nebulaTexture },
  }), [size, nebulaTexture]);

  // Each frame, update time, resolution, and mouse
  useFrame(() => {
    uniforms.iTime.value = clock.getElapsedTime();
    uniforms.iResolution.value.set(size.width, size.height);
    // Convert normalized mouse [-1..1] to pixel coords for the shader
    const x = (mouse.x * 0.5 + 0.5) * size.width;
    const y = (1.0 - (mouse.y * 0.5 + 0.5)) * size.height;
    uniforms.iMouse.value.set(x, y);
  });

  return (
    <mesh ref={meshRef} scale={[size.width, size.height, 1]}>
      {/* 
        We create a plane that fills the camera frustum in an orthographic sense.
        We'll rely on the fact that the default camera is perspective, 
        so we just make the plane large enough to cover the entire view.
      */}
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default BlackHoleShader;
