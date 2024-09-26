<template>
  <div ref="pdfContainer" class="pdf-container">
    <canvas ref="pdfCanvas" class="pdf-canvas"></canvas>
    <canvas ref="drawCanvas" class="draw-canvas" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing"></canvas>
  </div>
  <button @click="savePdf">Save PDF</button>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import jsPDF from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';

 
    const pdfContainer = ref(null);
    const pdfCanvas = ref(null);
    const drawCanvas = ref(null);
    let isDrawing = false;
    let ctx = null;
    let pdfCtx = null;

    const startDrawing = (event) => {
      isDrawing = true;
      ctx.beginPath();
      ctx.moveTo(event.offsetX, event.offsetY);
    };

    const draw = (event) => {
      if (!isDrawing) return;
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.stroke();
    };

    const stopDrawing = () => {
      isDrawing = false;
    };

    const loadPdf = async () => {
      const loadingTask = pdfjsLib.getDocument('/path/to/your.pdf');
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 1 });
      pdfCanvas.value.width = viewport.width;
      pdfCanvas.value.height = viewport.height;
      drawCanvas.value.width = viewport.width;
      drawCanvas.value.height = viewport.height;

      pdfCtx = pdfCanvas.value.getContext('2d');
      ctx = drawCanvas.value.getContext('2d');

      const renderContext = {
        canvasContext: pdfCtx,
        viewport: viewport,
      };

      page.render(renderContext);
    };

    const savePdf = () => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(pdfCanvas.value, 'JPEG', 0, 0, 210, 297);
      pdf.addImage(drawCanvas.value, 'JPEG', 0, 0, 210, 297);
      pdf.save('marked.pdf');
    };

    onMounted(() => {
      loadPdf();
    });

     
</script>

<style scoped>
.pdf-container {
  position: relative;
}

.pdf-canvas,
.draw-canvas {
  position: absolute;
  top: 0;
  left: 0;
}

.draw-canvas {
  z-index: 10;
  border: 1px solid black;
}
</style>