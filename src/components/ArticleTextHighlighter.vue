<template>
  <div>
    <div
      ref="pdfContainer"
      style="position: relative; width: 100%; overflow: auto"
    >
      <div
        v-for="pageIndex in numPages"
        :key="pageIndex"
        class="page-container"
      >
        <canvas :ref="`canvas_${pageIndex}`" class="pdf-page"></canvas>
        <div :ref="`textLayer_${pageIndex}`" class="textLayer"></div>
      </div>
    </div>
    <div v-if="textDialogVisible" id="text-dialog">
      <textarea v-model="selectedText" rows="5" cols="30"></textarea>
      <button @click="closeDialog">Close</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePaperStore } from '../stores/papers';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/web/pdf_viewer.css';

// Set the workerSrc property to the correct public path
// @ts-ignore
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

// Define types

// @ts-ignore
type PDFDocumentProxy = pdfjsLib.PDFDocumentProxy;
// @ts-ignore
type PDFPageProxy = pdfjsLib.PDFPageProxy;

const pdfContainer = ref<HTMLDivElement | null>(null);
const numPages = ref<number>(0);
const pdfInstance = ref<PDFDocumentProxy | null>(null);
const textDialogVisible = ref<boolean>(false);
const selectedText = ref<string>('');

const paperStore = usePaperStore();
const url = paperStore.paper.url;

const loadPdf = async (): Promise<void> => {
  try {
// @ts-ignore
    const pdf = await pdfjsLib.getDocument({ url }).promise;
    console.log('PDF loaded successfully', pdf);

    pdfInstance.value = pdf;
    numPages.value = pdf.numPages;
    await renderAllPages();
  } catch (error) {
    console.error('Error loading PDF:', error);
  }
};

const renderAllPages = async (): Promise<void> => {
  if (pdfInstance.value) {
    for (let pageNumber = 1; pageNumber <= numPages.value; pageNumber++) {
      await renderPage(pageNumber);
    }
  }
};

const renderPage = async (pageNumber: number): Promise<void> => {
  try {
    const page = await pdfInstance.value!.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });

    const canvas = pdfContainer.value!.querySelector<HTMLCanvasElement>(
      `canvas:nth-of-type(${pageNumber})`
    )!;
    const context = canvas.getContext('2d')!;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    const textLayerDiv = pdfContainer.value!.querySelector<HTMLDivElement>(
      `.textLayer:nth-of-type(${pageNumber})`
    )!;

// @ts-ignore
    await pdfjsLib.renderTextLayer().promise;
  } catch (error) {
    console.error('Error rendering page:', error);
  }
};

const handleMouseUp = (): void => {
  const selection = window.getSelection();
  if (selection && selection.toString()) {
    selectedText.value = selection.toString();
    textDialogVisible.value = true;
  }
};

const closeDialog = (): void => {
  textDialogVisible.value = false;
  selectedText.value = '';
};

onMounted(() => {
  loadPdf();
  document.addEventListener('mouseup', handleMouseUp);
});
</script>

<style scoped>
.pdf-page {
  display: block;
  width: 100%;
  margin: 10px 0;
}

.page-container {
  position: relative;
  width: 100%;
}

#text-dialog {
  position: absolute;
  top: 50px;
  left: 50px;
  background-color: white;
  padding: 10px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
