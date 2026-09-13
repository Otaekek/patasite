<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

const VERTEX_SRC = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAGMENT_SRC = `
precision mediump float;
uniform vec3 iResolution;
uniform float iTime;
uniform float iScroll;
uniform float iPixelRatio;
#define PI 3.1415926535
float hash( vec2 p ) {
	float h = dot(vec2( p) ,vec2(127.1,311.7));	
    return fract(sin(h)*43758.5453123);
}

float quarter_circle(vec2 uv) {

    float size = 0.01;
    float ret = 0.;
    float l = length(uv - vec2(1., 1.) ) * .18 / 0.01 * size;
    ret = smoothstep(.1, .1 - size, l);
    ret *= smoothstep(.1 - 2. * size, .1 - size, l);
  
    return ret;

}

float truchet(vec2 uv, float s) {
    
    if (s < 0.)
        uv.x = 1. - uv.x;
    float ret = quarter_circle(uv);
    
    vec2 tmp = uv;
    
    uv.x = 1.0 - tmp.y;
    uv.y = 1.0 - tmp.x;
    
    ret += quarter_circle(uv);
    return ret;
}

float rand_trigger(vec2 uv, vec2 id, float scale) {

    float time = scale * iTime / 2. + hash(id) * 1.;
    float r = floor(time / PI  / 3.+ .0);// + -.2;
    float h = hash(vec2(r * vec2( hash(id))) + vec2( hash(id) ));
    if (h < 0.5)
        time = r * PI * 3.;//r;// - .2;
    return min(max(sin(time  ), -0.2 ), 0.2 ) * 5.;
 }
 

 
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

int hashi( vec2 p ) {
	float h = dot(vec2( p) ,vec2(127.1,311.7));	
    float y = 2213123. * fract(sin(h)*43758.5453123);
    return int(y);
}

float diag(vec2 uv, float si) {
    float s = .05;
    return smoothstep(s, 0.0, abs(uv.x * si - uv.y) - s / 2.  );
}

void main(  )
{
    vec2 uv = (-iResolution.xy + 2.0*gl_FragCoord.xy)/iResolution.y;
    uv *= 10.;
    vec2 id = floor(uv);
    float r = rand_trigger(uv.xy, id, 1.0);
    uv = fract(uv) - vec2(.5);
 //   r = abs(r);
    r = min(1.0, r);
    r = max(-0.0, r);
    float angle = 3.14 * r / 2.;
    uv *= rotate2d(angle);
    int si = -1;//hashi(id) % 2 == 0 ? -1 : 1;
    float t = rand_trigger(vec2(21.), vec2(42.), 1. );
    float sd = diag(uv, float(si));
    float ss = truchet(uv + vec2(.5), float(si));
    vec3 col = vec3( mix(sd, ss, 1.) );
    gl_FragColor = vec4(col * .3 * vec3(.5, 0.1, 1.),1.0);
}
`

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`Shader compile error: ${info}`)
  }
  return shader
}

let rafId = 0
let onResize: (() => void) | null = null
let onScroll: (() => void) | null = null

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const gl = canvas.getContext('webgl')
  if (!gl) return // no WebGL support - the plain dark body background remains

  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC)
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC)
  const program = gl.createProgram()!
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Program link error: ${gl.getProgramInfoLog(program)}`)
  }
  gl.useProgram(program)

  // fullscreen quad (two triangles, clip space)
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  )
  const positionLoc = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(positionLoc)
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

  const iResolution = gl.getUniformLocation(program, 'iResolution')
  const iTime = gl.getUniformLocation(program, 'iTime')
  const iScroll = gl.getUniformLocation(program, 'iScroll')
  const iPixelRatio = gl.getUniformLocation(program, 'iPixelRatio')

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)

  function resize() {
    canvas!.width = Math.floor(window.innerWidth * pixelRatio)
    canvas!.height = Math.floor(window.innerHeight * pixelRatio)
    gl!.viewport(0, 0, canvas!.width, canvas!.height)
    gl!.uniform3f(iResolution, canvas!.width, canvas!.height, 1.0)
  }

  let scrollY = window.scrollY
  function handleScroll() {
    scrollY = window.scrollY
  }

  resize()
  gl.uniform1f(iPixelRatio, pixelRatio)
  onResize = resize
  onScroll = handleScroll
  window.addEventListener('resize', onResize)
  window.addEventListener('scroll', onScroll, { passive: true })

  function render(time: number) {
    gl!.uniform1f(iTime, time * 0.001)
    gl!.uniform1f(iScroll, scrollY * pixelRatio)
    gl!.drawArrays(gl!.TRIANGLES, 0, 6)
    rafId = requestAnimationFrame(render)
  }
  rafId = requestAnimationFrame(render)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  if (onResize) window.removeEventListener('resize', onResize)
  if (onScroll) window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <canvas ref="canvasRef" class="pointer-events-none fixed inset-0 -z-10" aria-hidden="true"></canvas>
</template>
