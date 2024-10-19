<template>
  <div ref="imageContainer" class="image-container">
    <!-- Render dynamic HTML content using v-html -->
    <div v-html="htmlContent" ref="htmlContainer" class="html-content"></div>
    <!-- Canvas overlay to render saved annotations -->
    <canvas ref="drawCanvas" class="drawing-canvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'HtmlAnnotationRenderer',
  props: {
    htmlContent: {
      type: String,
      required: true
    },
    annotationUrl: {
      type: String,
      required: true // URL or endpoint to fetch saved annotations
    }
  },
  setup(props) {
    const htmlContainer = ref(null);
    const drawCanvas = ref(null);

    const renderAnnotations = (annotations) => {
      const drawCtx = drawCanvas.value.getContext('2d');

      // Set canvas to the size of the HTML container
      drawCanvas.value.width = htmlContainer.value.offsetWidth;
      drawCanvas.value.height = htmlContainer.value.offsetHeight;

      // Loop through the saved annotations and redraw the strokes
      annotations.forEach(annotation => {
        drawCtx.beginPath();
        annotation.stroke.forEach((point, index) => {
          if (index === 0) {
            drawCtx.moveTo(point.x, point.y);
          } else {
            drawCtx.lineTo(point.x, point.y);
          }
        });
        drawCtx.stroke();
      });
    };

    const loadAnnotations = () => {
      axios.get(props.annotationUrl)
        .then(response => {
          const annotations = response.data.annotations; // Assume annotations are in the "annotations" key
          renderAnnotations(annotations);
        })
        .catch(error => {
          console.error('Error loading annotations', error);
        });
    };

    onMounted(() => {
      loadAnnotations(); // Load and render annotations when component mounts
    });

    return {
      htmlContainer,
      drawCanvas
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