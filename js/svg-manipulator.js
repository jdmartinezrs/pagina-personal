class SvgManipulator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                /* General Styles */
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }

                /* Container */
                .container {
                    width: 80%;
                    margin: 20px auto;
                    padding: 20px;
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }

                /* SVG Container */
                .svg-container {
                    width: 100%;
                    height: 300px;
                    background-color: #eaeaea;
                    border: 2px solid #ccc;
                    border-radius: 8px;
                    overflow: hidden;
                    position: relative;
                    margin-bottom: 20px;
                }

                /* Controls */
                .controls {
                    margin-bottom: 20px;
                }

                .control {
                    margin: 10px 0;
                }

                label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                }

                input[type="range"] {
                    width: 100%;
                }

                input[type="color"] {
                    width: 100%;
                    height: 30px;
                    border: none;
                    cursor: pointer;
                }

                .upload {
                    margin-top: 20px;
                }

                .upload input[type="file"] {
                    display: none;
                }

                .upload label {
                    background-color: #007bff;
                    color: #fff;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                }

                .upload label:hover {
                    background-color: #0056b3;
                }

                input[type="text"], input[type="number"], input[type="range"], input[type="color"] {
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    padding: 8px;
                    font-size: 16px;
                    margin-top: 5px;
                    width: calc(100% - 20px);
                    box-sizing: border-box;
                }

                input[type="range"] {
                    -webkit-appearance: none;
                    background: #ddd;
                    height: 6px;
                    border-radius: 3px;
                }

                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    background: #007bff;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    cursor: pointer;
                }

                input[type="range"]::-moz-range-thumb {
                    background: #007bff;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    cursor: pointer;
                }
            </style>
            <div class="container">
                <!-- Contenedor SVG -->
                <div class="svg-container" id="svg-container"></div>

                <!-- Controles para ajustar la imagen SVG -->
                <div class="controls">
                    <div class="control">
                        <label for="xPos">X Position:</label>
                        <input type="range" id="xPos" min="0" max="500" value="0" />
                        <span id="xValue">0</span>
                    </div>
                    <div class="control">
                        <label for="yPos">Y Position:</label>
                        <input type="range" id="yPos" min="0" max="500" value="0" />
                        <span id="yValue">0</span>
                    </div>
                    <div class="control">
                        <label for="width">Width:</label>
                        <input type="range" id="width" min="10" max="500" value="100" />
                        <span id="widthValue">100</span>
                    </div>
                    <div class="control">
                        <label for="height">Height:</label>
                        <input type="range" id="height" min="10" max="500" value="100" />
                        <span id="heightValue">100</span>
                    </div>
                    <div class="control">
                        <label for="rotate">Rotation:</label>
                        <input type="range" id="rotate" min="0" max="360" value="0" />
                        <span id="rotateValue">0</span>
                    </div>
                    <div class="control">
                        <label for="opacity">Opacity:</label>
                        <input type="range" id="opacity" min="0" max="1" step="0.01" value="1" />
                        <span id="opacityValue">1</span>
                    </div>
                    <div class="control">
                        <label for="color">Fill Color:</label>
                        <input type="color" id="color" value="#000000" />
                    </div>
                </div>

                <!-- Formulario para subir una imagen SVG -->
                <div class="upload">
                    <input type="file" id="fileInput" accept=".svg" />
                    <label for="fileInput">Upload SVG</label>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.shadowRoot.querySelectorAll('input[type="range"], input[type="color"]').forEach(input => {
            input.addEventListener('input', () => {
                this.updateSVG();
            });
        });

        this.shadowRoot.getElementById('fileInput').addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file && file.type === 'image/svg+xml') {
                const reader = new FileReader();

                reader.onload = (e) => {
                    const svgContainer = this.shadowRoot.getElementById('svg-container');
                    svgContainer.innerHTML = e.target.result;
                    this.updateSVG();
                };

                reader.readAsText(file);
            } else {
                alert('Please upload an SVG file.');
            }
        });
    }

    updateSVG() {
        const svgContainer = this.shadowRoot.getElementById('svg-container');
        const svgImage = svgContainer.querySelector('svg');

        if (svgImage) {
            svgImage.setAttribute('x', this.shadowRoot.getElementById('xPos').value);
            svgImage.setAttribute('y', this.shadowRoot.getElementById('yPos').value);
            svgImage.setAttribute('width', this.shadowRoot.getElementById('width').value);
            svgImage.setAttribute('height', this.shadowRoot.getElementById('height').value);
            svgImage.setAttribute('transform', `rotate(${this.shadowRoot.getElementById('rotate').value}, ${svgImage.getAttribute('width') / 2}, ${svgImage.getAttribute('height') / 2})`);
            svgImage.setAttribute('opacity', this.shadowRoot.getElementById('opacity').value);

            const color = this.shadowRoot.getElementById('color').value;
            svgImage.querySelectorAll('*').forEach(el => {
                if (el.hasAttribute('fill')) {
                    el.setAttribute('fill', color);
                }
            });

            // Actualizar los valores de los controles
            this.shadowRoot.getElementById('xValue').textContent = this.shadowRoot.getElementById('xPos').value;
            this.shadowRoot.getElementById('yValue').textContent = this.shadowRoot.getElementById('yPos').value;
            this.shadowRoot.getElementById('widthValue').textContent = this.shadowRoot.getElementById('width').value;
            this.shadowRoot.getElementById('heightValue').textContent = this.shadowRoot.getElementById('height').value;
            this.shadowRoot.getElementById('rotateValue').textContent = this.shadowRoot.getElementById('rotate').value;
            this.shadowRoot.getElementById('opacityValue').textContent = this.shadowRoot.getElementById('opacity').value;
        }
    }
}

customElements.define('svg-manipulator', SvgManipulator);
