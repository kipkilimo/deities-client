<template>
  <div class="pdf-container">
    <div>
      <div
        v-for="page in JSON.parse(paper.url)"
        :key="page.image"
        class="pdf-page"
        @mousedown.prevent="startHighlight(page.number, $event)"
        @mousemove="updateHighlight($event), showComment(page.number, $event)"
        @mouseup="endHighlight"
        @mouseleave="hideComment"
      >
        <img
          :src="page.image" 
          alt="PDF page"
          class="pdf-image"
        />
        <div
          v-for="highlight in page.highlights"
          :key="highlight.id"
          :style="highlight.style"
          class="highlight-overlay"
        ></div>
        <div
          v-if="currentLine.active"
          :style="currentLine.style"
          class="line-overlay"
        ></div>
      </div>
    </div>
    <div
      v-if="hoveredComment"
      :style="hoveredComment.style"
      class="comment-popup"
    >
      {{ hoveredComment.content }}
    </div>
    <div
      v-if="newComment.visible"
      class="new-comment-form"
      :style="newComment.style"
    >
      <input v-model="newComment.title" placeholder="Discussion title" />
      <textarea
        v-model="newComment.text"
        placeholder="Your journal article discussion"
      ></textarea>
      <div class="buttons">
        <button @click="saveComment">Save</button>
        <button @click="cancelComment">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, onMounted, computed } from "vue";
import { usePaperStore } from "../stores/papers";

const paperStore = usePaperStore();
const paper = paperStore.paper;
const user = ref<any>(null);

onBeforeMount(() => {
  if (typeof localStorage !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        user.value = parsedUser && parsedUser[0] ? parsedUser[0] : {};
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }
});

const pages = ref<any[]>([]);
const hoveredComment = ref<{
  title: string;
  content: string;
  style: Record<string, string>;
} | null>(null);

const comments = reactive(paper.discussion || []);

const newHighlight = reactive({
  active: false,
  pageNumber: 0,
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
});

const newComment = reactive({
  visible: false,
  title: "",
  text: "",
  x: 0,
  y: 0,
  pageNumber: 0,
  style: {
    left: "0px",
    top: "0px",
  },
});

const currentLine = ref({
  active: false,
  pageNumber: 0,
  startY: 0,
  height: 0,
  style: {
    left: "0px",
    top: "0px",
    height: "0px",
    backgroundColor: "rgba(255, 200, 0, 0.3)", // Adjust color as needed
  },
});

// Fetch and process pages data, adding highlights
const fetchPages = async () => {
  pages.value = JSON.parse(paper.url).map((pageData: any) => ({
    ...pageData,
    highlights: comments
      .filter((comment) => comment.pageNumber === pageData.number)
      .map((comment) => ({
        ...comment,
        style: {
          left: `${comment.x}px`,
          top: `${comment.y}px`,
          width: "100px", // Example width, adjust based on comment data if available
          height: "100px", // Example height, adjust based on comment data if available
        },
      })),
  }));
};

// Function to extract timestamp from the image URL
const extractTimestamp = (url: string) => {
  const match = url.match(/t-(\d+)-page/);
  return match ? parseInt(match[1], 10) : null;
};

// Sort pages based on timestamp
const sortedPages = computed(() => {
  return pages.value.slice().sort((a, b) => {
    const timestampA = extractTimestamp(a.image);
    const timestampB = extractTimestamp(b.image);
    return (timestampA || 0) - (timestampB || 0);
  });
});

// Show comment tooltip
const showComment = (pageNumber: number, event: MouseEvent) => {
  const target = event.currentTarget as HTMLDivElement;
  const rect = target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const comment = comments.find(
    (comment) =>
      comment.pageNumber === pageNumber &&
      Math.abs(comment.x - x) < 10 &&
      Math.abs(comment.y - y) < 10
  );

  if (comment) {
    hoveredComment.value = {
      title: comment.title,
      content: comment.content,
      style: {
        left: `${event.clientX}px`,
        top: `${event.clientY}px`,
      },
    };
  } else {
    hoveredComment.value = null;
  }
};

// Hide comment tooltip
const hideComment = () => {
  hoveredComment.value = null;
};

// Start creating a highlight
const startHighlight = (pageNumber: number, event: MouseEvent) => {
  currentLine.value.active = true;
  currentLine.value.pageNumber = pageNumber;
  currentLine.value.startY = event.clientY;
};

// Update highlight dimensions during mouse move
const updateHighlight = (event: MouseEvent) => {
  if (!currentLine.value.active) return;

  const pageElement = (
    event.currentTarget as HTMLDivElement
  ).getBoundingClientRect();
  const offsetY = event.clientY - pageElement.top;

  currentLine.value.height = Math.max(
    0,
    offsetY - (currentLine.value.startY - pageElement.top)
  );
  currentLine.value.style.top = `${Math.min(currentLine.value.startY - pageElement.top, offsetY)}px`;
  currentLine.value.style.height = `${currentLine.value.height}px`;
};

// End highlighting, possibly create a new comment
const endHighlight = async () => {
  if (!currentLine.value.active) return;

  currentLine.value.active = false;

  const lineHeight = 20; // Example line height; replace with actual if known
  if (currentLine.value.height <= lineHeight * 3) {
    // Open dialog for single line selection
    newComment.visible = true;
    newComment.pageNumber = currentLine.value.pageNumber;
    newComment.x = parseInt(currentLine.value.style.left, 10) || 0;
    newComment.y = parseInt(currentLine.value.style.top, 10) || 0;
    newComment.style.left = currentLine.value.style.left;
    newComment.style.top = currentLine.value.style.top;
  } else {
    // Current selection is too large, reset line
    currentLine.value.height = 0;
  }
};

// Generate a unique base64 ID
const generateBase64Id = (length = 12) => {
  const array = new Uint8Array(Math.ceil((length * 3) / 4));
  crypto.getRandomValues(array);
  let base64 = btoa(String.fromCharCode(...array));

  base64 = base64.replace(/=/g, "");

  if (base64.length > length) {
    base64 = base64.substring(0, length);
  }

  return base64;
};

// Save the new comment to the store
const saveComment = async () => {
  const valRaw = [
    {
      pageNumber: newComment.pageNumber,
      title: newComment.title,
      content: newComment.text,
      x: newComment.x,
      y: newComment.y,
      id: generateBase64Id(),
      username: user.value.username,
      addedDate: String(Date.now()),
    },
  ];
  const val = JSON.stringify(valRaw);
  await paperStore.saveDiscussionComment(val);
  newComment.visible = false;
};

// Cancel creating a new comment
const cancelComment = () => {
  newComment.visible = false;
};

// Fetch pages data on component mount
onMounted(async () => {
  await fetchPages();
});
</script>

<style scoped>
.pdf-container {
  display: flex;
  flex-direction: column;
  background-color: #fcfcfc;
  align-items: center;
  max-height: 100vh;
  overflow-y: auto;
  padding: 5px;
}

.pdf-page {
  position: relative;
  margin: 2px 0;
}

.pdf-image {
  width: 100%;
  max-width: 98%;
  border: 1px solid #ccc;
}

.comment-popup {
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px;
  border-radius: 5px;
  pointer-events: none;
  z-index: 999;
}

.highlight-overlay {
  position: absolute;
  background-color: rgba(0, 255, 0, 0.5);
  border: 1px solid rgba(0, 255, 0, 0.7);
  pointer-events: none;
  z-index: 1;
}

.line-overlay {
  position: absolute;
  background-color: rgba(255, 200, 0, 0.3);
  border: 1px solid rgba(255, 200, 0, 0.5);
  pointer-events: none;
  z-index: 2;
}

.new-comment-form {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
  width: 300px;
}

.new-comment-form input,
.new-comment-form textarea {
  width: 100%;
}

.new-comment-form .buttons {
  display: flex;
  gap: 10px;
}

.new-comment-form button {
  padding: 5px 10px;
}
</style>
