<template>
  <div ref="imageContainer" class="image-container">
    <!-- Render dynamic HTML content using v-html -->
    <div v-html="htmlContent" ref="htmlContainer" class="html-content"></div>
    <!-- Canvas overlay for annotations -->
    <canvas ref="drawCanvas" class="drawing-canvas"></canvas>
    <!-- Button to save the annotations -->
    <button @click="saveAnnotations">Save Annotations</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios'; 

export default {
  name: 'HtmlAnnotator',
  props: {
    htmlContent: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const htmlContainer = ref(null);
    const drawCanvas = ref(null);
    let annotations = []; // Array to store annotations

    const setupDrawing = () => {
      const drawCtx = drawCanvas.value.getContext('2d');

      // Set the canvas to match the size of the rendered HTML content
      drawCanvas.value.width = htmlContainer.value.offsetWidth;
      drawCanvas.value.height = htmlContainer.value.offsetHeight;

      // Variables for handling drawing state
      let drawing = false;
      let currentStroke = [];

      // Event listeners for drawing on the canvas
      drawCanvas.value.addEventListener('mousedown', (e) => {
        drawing = true;
        drawCtx.beginPath();
        drawCtx.moveTo(e.offsetX, e.offsetY);
        currentStroke.push({ x: e.offsetX, y: e.offsetY });
      });

      drawCanvas.value.addEventListener('mousemove', (e) => {
        if (drawing) {
          drawCtx.lineTo(e.offsetX, e.offsetY);
          drawCtx.stroke();
          currentStroke.push({ x: e.offsetX, y: e.offsetY });
        }
      });

      drawCanvas.value.addEventListener('mouseup', () => {
        drawing = false;
        if (currentStroke.length) {
          annotations.push({ stroke: currentStroke });
          currentStroke = [];
        }
      });

      drawCanvas.value.addEventListener('mouseleave', () => {
        drawing = false;
      });
    };

    const saveAnnotations = () => {
      const payload = {
        annotations
      };

      // Send annotations to the server as JSON
      axios.post('/tasks/response', payload)
        .then(response => {
          console.log('Annotations uploaded successfully', response);
        })
        .catch(error => {
          console.error('Error uploading annotations', error);
        });
    };

    onMounted(() => {
      setupDrawing(); // Initialize drawing functionality when component mounts
    });

    return {
      htmlContainer,
      drawCanvas,
      saveAnnotations
    };
  }
};
</script>

<style scoped>
.image-container {
  position: relative;
  width: 100%;
  height: auto;
}

.html-content {
  width: 100%;
  height: auto;
}

.drawing-canvas {
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid #000;
}
</style>
