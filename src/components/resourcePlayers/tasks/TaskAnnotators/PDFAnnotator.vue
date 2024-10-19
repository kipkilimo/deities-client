<template>
  <div ref="pdfContainer" class="pdf-container">
    <!-- Use vue3-pdf component for PDF rendering -->
    <pdf src="pdfUrl" @loaded="onPdfLoaded" ref="pdfCanvas"></pdf>
    <canvas ref="drawCanvas"></canvas>
    <!-- Button to trigger save functionality -->
    <button @click="savePdfWithAnnotations">Save PDF with Annotations</button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { usePdf } from 'vue3-pdf';
import jsPDF from 'jspdf';
import axios from 'axios'; // Import axios for making HTTP requests

export default {
  name: 'PdfViewer',
  props: {
    pdfUrl: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const pdfCanvas = ref(null);
    const drawCanvas = ref(null);
    const pdfContainer = ref(null);

    const onPdfLoaded = () => {
      setupDrawing();
    };

    const setupDrawing = () => {
      const drawCtx = drawCanvas.value.getContext('2d');
      const pdfCtx = pdfCanvas.value.$el.getContext('2d');

      drawCanvas.value.width = pdfCanvas.value.$el.width;
      drawCanvas.value.height = pdfCanvas.value.$el.height;

      let drawing = false;

      drawCanvas.value.addEventListener('mousedown', (e) => {
        drawing = true;
        drawCtx.beginPath();
        drawCtx.moveTo(e.offsetX, e.offsetY);
      });

      drawCanvas.value.addEventListener('mousemove', (e) => {
        if (drawing) {
          drawCtx.lineTo(e.offsetX, e.offsetY);
          drawCtx.stroke();
        }
      });

      drawCanvas.value.addEventListener('mouseup', () => {
        drawing = false;
      });

      drawCanvas.value.addEventListener('mouseleave', () => {
        drawing = false;
      });
    };

    const savePdfWithAnnotations = () => {
      // Create a new canvas to merge the PDF and drawings
      const mergedCanvas = document.createElement('canvas');
      const mergedCtx = mergedCanvas.getContext('2d');

      // Set the size of the merged canvas
      mergedCanvas.width = pdfCanvas.value.$el.width;
      mergedCanvas.height = pdfCanvas.value.$el.height;

      // Draw the PDF onto the merged canvas
      mergedCtx.drawImage(pdfCanvas.value.$el, 0, 0);

      // Draw the annotations (drawCanvas) on top of the PDF
      mergedCtx.drawImage(drawCanvas.value, 0, 0);

      // Convert the merged canvas to an image
      const imgData = mergedCanvas.toDataURL('image/png');

      // Use jsPDF to create a PDF from the image
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [mergedCanvas.width, mergedCanvas.height]
      });

      // Add the image to the PDF document
      pdf.addImage(imgData, 'PNG', 0, 0, mergedCanvas.width, mergedCanvas.height);

      // Convert the jsPDF object to a Blob
      const pdfBlob = pdf.output('blob');

      // Prepare FormData to send to the server
      const formData = new FormData();
      formData.append('file', pdfBlob, 'annotated.pdf');

      // Send the PDF to the server using axios
      axios.post('/upload-annotated-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        console.log('PDF uploaded successfully', response);
      })
      .catch(error => {
        console.error('Error uploading PDF', error);
      });
    };

    return {
      pdfCanvas,
      drawCanvas,
      pdfContainer,
      onPdfLoaded,
      savePdfWithAnnotations
    };
  }
};
</script>

<style scoped>
.pdf-container {
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