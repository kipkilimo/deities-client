<template>
  <div>
    <!-- <button @click="logContent">Log Content</button> -->
    <pdf
      ref="myPdfComponent"
      :src="paperStore.paper.url"
      @textLayerRendered="attachHighlightListeners"
    ></pdf>
    <div v-if="selectedText" class="annotation-box">
      <textarea v-model="commentText" placeholder="Add your comment"></textarea>
      <button @click="saveAnnotation">Save</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import pdf from '@jbtje/vite-vue3pdf';
import { usePaperStore } from '../../../client/src/stores/papers';
// import { saveAnnotation as saveAnnotationService, fetchAnnotations as fetchAnnotationsService } from './annotationService';

const paperStore = usePaperStore();

const myPdfComponent = ref(null);
const selectedText = ref(null);
const commentText = ref('');
const annotations = reactive([]);

const logContent = () => {
  if (myPdfComponent.value) {
    myPdfComponent.value.pdf.forEachPage((page) =>
      page.getTextContent().then((content) => {
        const text = content.items.map((item) => item.str);
        console.log(text);
      })
    );
  }
};

const attachHighlightListeners = () => {
  const textLayer = myPdfComponent.value.$el.querySelector('.textLayer');
  textLayer.addEventListener('mouseup', handleTextSelection);
};

const handleTextSelection = () => {
  const selection = window.getSelection();
  if (selection && selection.toString()) {
    const range = selection.getRangeAt(0);
    const rects = range.getClientRects();
    selectedText.value = {
      text: selection.toString(),
      rects: Array.from(rects).map(rect => ({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      })),
    };
  }
};

const saveAnnotation = async () => {
  if (selectedText.value && commentText.value) {
    const annotation = await saveAnnotationService({
      text: selectedText.value.text,
      comment: commentText.value,
      user: 'Current User', // Replace with actual user data
      rects: selectedText.value.rects,
    });
    annotations.push(annotation);
    commentText.value = '';
    selectedText.value = null;
  }
};

// const loadAnnotations = async () => {
//   const fetchedAnnotations = await fetchAnnotationsService();
//   fetchedAnnotations.forEach(annotation => annotations.push(annotation));
// };

onMounted(() => {
 //  loadAnnotations();
});
</script>

<style>
.textLayer {
  position: relative;
}
.annotation-box {
  position: fixed;
  top: 10px;
  left: 10px;
  background: white;
  border: 1px solid black;
  padding: 10px;
  z-index: 1000;
}
</style>
