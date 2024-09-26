<!-- PdfViewer.vue -->
<template>
  <div ref="pdfContainer" class="pdf-container">
    <template v-if="isLoading"> Loading... </template>
    <VuePdfEmbed
      ref="pdfRef"
      style="overflow-x: hidden"
      :page="currentPage"
      @mousedown="startSelection"
      :rotation="pageRotation"
      @page-change="updatePageNumber"
      :source="pdfUrl"
      @loaded="handleDocumentLoad"
      @rendered="handleDocumentRender"
    />
    <div v-if="selectionActive" :style="overlayStyle" class="selection-overlay" ref="selectionOverlay"></div>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import VuePdfEmbed from "vue-pdf-embed";

const props = defineProps(['pdfUrl', 'currentPage', 'pageRotation', 'isLoading', 'selectionActive', 'overlayStyle', 'handleDocumentLoad', 'handleDocumentRender', 'startSelection', 'updatePageNumber']);
</script>
