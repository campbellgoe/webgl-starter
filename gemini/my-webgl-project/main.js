async function init() {
  const canvas = document.getElementById('glCanvas');
  const gl = canvas.getContext('webgl');

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Fetch and compile shaders
  const vertexShader = await fetchShader('shaders/vertexShader.glsl', gl.VERTEX_SHADER);
  const fragmentShader = await fetchShader('shaders/fragmentShader.glsl', gl.FRAGMENT_SHADER);

  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  // Triangle vertices
  const positions = [
    0.0, 0.5,
    -0.5, -0.5,
    0.5, -0.5
  ];

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // Clear the canvas
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set clear color to black
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the triangle
  gl.drawArrays(gl.TRIANGLES, 0, 3);


  // Fetch and compile shader function
  async function fetchShader(url, type) { // made async
    const response = await fetch(url);
    const source = await response.text();
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(`Error compiling ${type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'} shader: ${gl.getShaderInfoLog(shader)}`);
    }

    return shader;
  }

  function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
      console.log(gl.getProgramInfoLog(program));  // eslint-disable-line
      gl.deleteProgram(program);
      return null;
    }
    return program;
  }
}
// Call the init function to start the WebGL setup
init();