// src/components/PdfViewer.vue
<template>
    <v-container>
        <v-card>
            <v-card-title>PDF Viewer</v-card-title>
            <v-card-text>
                <div ref="pdfContainer" class="pdf-container"></div>
            </v-card-text>
        </v-card>
        <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title>Annotation</v-card-title>
                <v-card-text>
                    <v-textarea label="Comment" v-model="comment"></v-textarea>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="blue darken-1" text @click="saveComment">Save</v-btn>
                    <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from '@vue/composition-api';
import { useAuth } from '@/composables/useAuth';
import { useAnnotations } from '@/composables/useAnnotations';

const pdfContainer = ref(null);
const dialog = ref(false);
const comment = ref('');
const selectedText = ref('');
const annotations = ref([]);

const { user } = useAuth();
const { getAnnotations, saveAnnotation } = useAnnotations();

onMounted(async () => {
    // Initialize PDF.js or pdf-lib to render the PDF
    const pdfUrl = '/path/to/your/pdf.pdf';
    const pdfDoc = await pdfjsLib.getDocument(pdfUrl).promise;
    const page = await pdfDoc.getPage(1);
    // Render the page in the container
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    pdfContainer.value.appendChild(canvas);
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
        canvasContext: context,
        viewport: viewport,
    };
    await page.render(renderContext).promise;

    // Fetch and display existing annotations
    annotations.value = await getAnnotations();

    // Handle text selection for adding annotations
    canvas.addEventListener('mouseup', async (event) => {
        const selection = window.getSelection();
        selectedText.value = selection.toString();
        if (selectedText.value) {
            dialog.value = true;
        }
    });
});

const saveComment = async () => {
    await saveAnnotation(selectedText.value, comment.value);
    annotations.value = await getAnnotations();
    dialog.value = false;
    comment.value = '';
};

// Logic to display annotations when hovering over highlighted text
const handleMouseOver = (annotation) => {
    // Display annotation details
};
</script>

<style>
.pdf-container {
  position: relative;
}
.highlight {
  background-color: yellow;
}
</style>
