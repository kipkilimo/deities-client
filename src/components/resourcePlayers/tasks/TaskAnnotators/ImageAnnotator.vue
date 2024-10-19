<template>
  <div ref="imageContainer" class="image-container">
    <!-- Image rendered on a canvas -->
    <canvas ref="imageCanvas"></canvas>
    <canvas ref="drawCanvas"></canvas>
    <!-- Button to save the annotated image -->
    <button @click="saveImageWithAnnotations">
      Save Image with Annotations
    </button>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios"; // Make sure axios is installed and imported

export default {
  name: "ImageAnnotator",
  props: {
    imageUrl: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const imageCanvas = ref(null);
    const drawCanvas = ref(null);
    const imageContainer = ref(null);
    let img = new Image(); // Holds the image for annotation

    const setupDrawing = () => {
      const drawCtx = drawCanvas.value.getContext("2d");

      // Set the canvas to the size of the loaded image
      drawCanvas.value.width = imageCanvas.value.width;
      drawCanvas.value.height = imageCanvas.value.height;

      let drawing = false;

      drawCanvas.value.addEventListener("mousedown", (e) => {
        drawing = true;
        drawCtx.beginPath();
        drawCtx.moveTo(e.offsetX, e.offsetY);
      });

      drawCanvas.value.addEventListener("mousemove", (e) => {
        if (drawing) {
          drawCtx.lineTo(e.offsetX, e.offsetY);
          drawCtx.stroke();
        }
      });

      drawCanvas.value.addEventListener("mouseup", () => {
        drawing = false;
      });

      drawCanvas.value.addEventListener("mouseleave", () => {
        drawing = false;
      });
    };

    const loadImage = () => {
      img.src = props.imageUrl;

      // When the image is loaded, draw it on the canvas
      img.onload = () => {
        const imageCtx = imageCanvas.value.getContext("2d");

        // Set canvas size to the image size
        imageCanvas.value.width = img.width;
        imageCanvas.value.height = img.height;

        // Draw the image onto the canvas
        imageCtx.drawImage(img, 0, 0, img.width, img.height);

        // Setup drawing for the annotation canvas
        setupDrawing();
      };
    };

    const saveImageWithAnnotations = () => {
      // Create a new canvas to merge the image and the drawings
      const mergedCanvas = document.createElement("canvas");
      const mergedCtx = mergedCanvas.getContext("2d");

      // Set merged canvas size to the original image size
      mergedCanvas.width = imageCanvas.value.width;
      mergedCanvas.height = imageCanvas.value.height;

      // Draw the original image onto the merged canvas
      mergedCtx.drawImage(imageCanvas.value, 0, 0);

      // Draw the annotations (drawCanvas) on top of the image
      mergedCtx.drawImage(drawCanvas.value, 0, 0);

      // Convert the merged canvas to Blob data (necessary for FormData)
      mergedCanvas.toBlob((blob) => {
        // Create FormData to send the file
        const formData = new FormData();
        formData.append("files[]", blob, "annotated-image.png");

        // Use axios to send the image to the /tasks/response route
        axios
          .post("/tasks/response", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            console.log("Image uploaded successfully", response);
          })
          .catch((error) => {
            console.error("Error uploading the image", error);
          });
      }, "image/png");
    };

    onMounted(() => {
      loadImage(); // Load the image when the component mounts
    });

    return {
      imageCanvas,
      drawCanvas,
      imageContainer,
      saveImageWithAnnotations,
    };
  },
};
</script>

<style scoped>
.image-container {
  position: relative;
  width: 100%;
  height: auto;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
