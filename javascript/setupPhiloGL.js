var camera;
var geometry = [];

function initGL() {
   

        PhiloGL('viscanvas', {
            program: {
                from: 'ids',
                vs: 'shader-vs',
                fs: 'shader-fs'
            },
            onError: function() {
                alert("An error ocurred while loading the application");
            },
            onLoad: function(app) {

                camera = app.camera;
                var gl = app.gl,
                canvas = app.canvas,
                program = app.program,
                view = new PhiloGL.Mat4;


                gl.viewport(0, 0, canvas.width, canvas.height);
                gl.clearColor(0, 0, 0, 1);
                gl.clearDepth(1);
                gl.enable(gl.DEPTH_TEST);
                gl.depthFunc(gl.LEQUAL);

                camera.modelView.id();

                function setupElement(elem) {
                    //update element matrix
                    elem.update();
                    //get new view matrix out of element and camera matrices
                    view.mulMat42(camera.modelView, elem.matrix);
                    //set buffers with element data
                    program.setBuffers({
                        'aVertexPosition': {
                            value: elem.toFloat32Array('vertices'),
                            size: 3
                        },
                        'aVertexColor': {
                            value: elem.toFloat32Array('colors'),
                            size: 4
                        }
                    });
                    //set uniforms
                    program.setUniform('uMVMatrix', view);
                    program.setUniform('uPMatrix', camera.projection);
                }

                function animate() { }

                function tick() {
                    drawScene();
                    animate();
                }

                function drawScene() {
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                    $.each( geometry, function() {
                        program.setBuffer('indices', {
                            value: this.obj.toUint16Array('indices'),
                            bufferType: gl.ELEMENT_ARRAY_BUFFER,
                            size: 1
                        });
                        setupElement(this.obj);
                        gl.drawElements(gl.TRIANGLES, this.obj.indices.length, gl.UNSIGNED_SHORT, 0);   
                    });
                }

                setInterval(tick, 1000/60);
            },
            events: {
                onMouseWheel: function(e) {
                    e.stop();
                    var camera = this.camera;
                    camera.position.z += e.wheel;
                    camera.update();
                }
            }
        });
}

