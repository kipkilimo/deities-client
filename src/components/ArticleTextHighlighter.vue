<template>
  <v-container>
    <!-- Loading Indicator -->

    <div id="loading-indicator" v-if="loading" class="loading-indicator">
      Loading...
    </div>
    <div class="header header-wrapper scroller">
      <!-- PDF Container -->
      <div
        id="pdf-container"
        ref="pdfContainer"
        class="pdf-container z-index-common"
        @scroll="handleScroll"
      >
        <PDF
          :src="pdfUrl"
          ref="pdfImage"
          @onPageChange="updatePageNumber"
          @mousedown="startSelection"
          @page-change="onPageChange"
          style="width: 100%; height: auto"
          class="z-index-common"
        />
        <!-- Comment Markers -->
        <div
          v-for="(commentData, index) in filteredComments"
          :key="index"
          :style="commentStyle(commentData)"
          :id="'comment-' + index"
          ref="commentData"
          class="comment-marker z-index-common"
          @mouseover="showTooltip = index"
          @mouseleave="showTooltip = null"
        >
          <br />
          <br />
          <br />
          <br />
          <div class="tooltip-wrapper">
            <v-tooltip bottom v-if="showTooltip === index">
              <template #activator="{ on, attrs }">
                <div class="triangle"></div>

                <v-card
                  color="#FFFB95"
                  v-bind="attrs"
                  v-on="on"
                  class="tooltip-card custom-tooltip z-index-common"
                >
                  <div class="ma-4 text-h6">{{ commentData.title }}</div>
                  <div class="ma-4 text-h7">
                    <i>{{ commentData.text }}</i>
                  </div>
                  <v-divider />
                  <v-card-actions>
                    <v-card-subtitle class="ml-11" align-right>
                      Added
                      {{ reactiveTimeAgo(Number(commentData.timestamp)) }} by
                      {{ commentData.author }}
                    </v-card-subtitle>
                  </v-card-actions>
                </v-card>
              </template>
            </v-tooltip>
          </div>
        </div>
        <!-- Selection Overlay with Secondary Scrollbar -->
        <div
          v-if="selectionActive"
          :style="overlayStyle"
          class="selection-overlay z-index-common"
          id="selectionOverlay"
          ref="selectionOverlay"
        ></div>
      </div>
    </div>

    <!-- Comment Dialog -->

    <v-dialog v-model="dialogVisible" max-width="30rem" persistent>
      <v-card :disabled="paperStore.paper.discussion.length >= 30">
        <v-card-title>
          <span class="headline ml-2">{{
            paperStore.paper.discussion.length >= 30
              ? "Article discussion closed."
              : "Add a comment"
          }}</span>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text>
          <v-form fast-fail @submit.prevent>
            <v-text-field
              v-model="title"
              :rules="titleRules"
              label="Title"
            ></v-text-field>

            <v-textarea
              v-model="text"
              label="Discussion text"
              rows="3"
              :rules="textRules"
              required
            ></v-textarea>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="outlined" color="primary" @click="saveComment"
            >Save Comment</v-btn
          >

          <v-btn text color="orange" @click="cancelComment">Cancel</v-btn>

          <v-spacer></v-spacer>
        </v-card-actions>
        <br />
      </v-card>
    </v-dialog>

    <!-- Filtered Comments Iterator Dialog -->

    <div
      max-width="350px"
      style="
        position: fixed;
        z-index: 1000;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
      "
      :style="{ top: dialogTop, left: dialogLeft }"
      @mousedown="onMouseDown"
    >
      <v-card ref="draggableCard" class="draggable-card">
        <v-card-title @mousedown.stop="onMouseDown">
          <span class="headline"
            >Page {{ currentPage }} Discussion Comments.</span
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div class="" v-if="filteredComments.length === 0">
            <h5>No discussion comments added yet.</h5>
          </div>

          <div class="scrollable-list-container" id="draggableComments">
            <v-list>
              <v-list-item-group
                v-for="(comment, index) in filteredComments"
                :key="index"
                :id="'card-' + index"
                @mouseover="highlightComment(index), toggleHoverColorIn(index)"
                @mouseleave="
                  unhighlightComment(index), toggleHoverColorOut(index)
                "
              >
                <v-card flat :style="cardStyle(index)" style="max-width: 27rem" class="mr-3">
                  <div class="ma-4 text-h6">{{ comment.title }}</div>
                  <div class="ma-4 text-h7">
                    <i>{{ comment.text }}</i>
                  </div>
                  <v-divider />
                  <v-card-actions>
                    <v-card-subtitle>
                      Added
                      {{ reactiveTimeAgo(Number(comment.timestamp)) }} by
                      {{ comment.author }}
                    </v-card-subtitle>
                  </v-card-actions>
                  <v-divider />
                </v-card>
                <br />
              </v-list-item-group>
            </v-list>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import PDF from "pdf-vue3";
import { usePaperStore } from "../stores/papers";
import { useUserStore } from "../stores/users";

const userStore = useUserStore();
const user = computed(() => userStore.user);
// Paper store
const paperStore = usePaperStore();
const pdfUrl = paperStore.paper.url;
const scrollerDivs = ref([]);

// Function to scroll all elements to the same scroll position
const scrollAll = (scrollLeft) => {
  scrollerDivs.value.forEach((element) => {
    element.scrollLeft = scrollLeft;
  });
};
const commentsDialogVisible = ref(true);
const titleRules = [
  (value) =>
    value?.length > 3 ? true : "Input must be at least 3 characters.",
  (value) =>
    value?.length < 75 ? true : "Input must be at most 70 characters.",
];

const textRules = [
  (value) =>
    value?.length > 15 ? true : "Input must be at least 15 characters.",
  (value) =>
    value?.length < 255 ? true : "Input must be at most 250 characters.",
];

// Refs for managing state
const title = ref("");
const text = ref("");

const comments = ref([]);
const selectionStart = ref({ x: null, y: null });
const selectionEnd = ref({ x: null, y: null });
const selectedArea = ref({ x: null, y: null, width: null, height: null });
const currentPage = ref(1);
const index = ref(null);

const selectionActive = ref(false);
const dialogVisible = ref(false);
const showTooltip = ref(null);
const pdfContainer = ref(null);
const pdfImage = ref(null);
const loading = ref(false);
const hoverColor = ref("#FFFFCC");
let lastScrollTop = 0;
const scrollThreshold = 100;
const dialogTop = ref("6.6rem"); // Initial position
const dialogLeft = ref("75%"); // Initial position
const isDragging = ref(false);
const dragStartX = ref(0);
const dragStartY = ref(0);
onMounted(() => {
  console.log({ user: user.value });
  comments.value = paperStore.paper.discussion;

  const scrollers = document.getElementsByClassName("scroller"); // Filter the scrollers to get only the DIV elements

  scrollerDivs.value = Array.from(scrollers).filter((element) => {
    return element.nodeName === "DIV";
  }); // Add scroll event listeners to each div

  scrollerDivs.value.forEach((element) => {
    element.addEventListener("scroll", (e) => {
      scrollAll(e.target.scrollLeft);
    });
  });
});
// Methods
/*

function toggleHoverColorIn(index) {
  index.value = index;
  hoverColor.value = "#FFFB95";
}
function toggleHoverColorOut() {
  hoverColor.value = "#FFFFCC";
  index.value = null;
}

*/
const onMouseDown = (event) => {
  if (event.target.closest(".draggable-card")) {
    isDragging.value = true;
    dragStartX.value = event.clientX;
    dragStartY.value = event.clientY;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }
};

const hoverIndex = ref(null); // Tracks the index of the hovered card

const toggleHoverColorIn = (index) => {
  hoverIndex.value = index;
};

const toggleHoverColorOut = () => {
  hoverIndex.value = null;
};

const cardStyle = (index) => {
  return computed(() => {
    if (hoverIndex.value === index) {
      return {
        backgroundColor: "#FFFB95", // Darker background color on hover
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // Add shadow on hover
        transition: "background-color 0.3s ease, box-shadow 0.3s ease", // Smooth transition
      };
    }
    return {
      backgroundColor: "#FFFFCC", // Default color
      boxShadow: "none", // No shadow by default
      transition: "background-color 0.3s ease, box-shadow 0.3s ease", // Smooth transition
    };
  }).value;
};

function highlightComment(index) {
  const commentElement = document.getElementById(`comment-${index}`);
  if (commentElement) {
    commentElement.style.backgroundColor = "rgba(255, 255, 0, 0.5)"; // Highlight color
    commentElement.style.border = "2px solid rgba(255, 255, 0, 0.8)"; // Optional border
    // Check if the element is out of view and scroll to it if necessary

    const containerRect = pdfContainer.value.getBoundingClientRect();
    const elementRect = commentElement.getBoundingClientRect();

    if (
      elementRect.top < containerRect.top ||
      elementRect.bottom > containerRect.bottom
    ) {
      pdfContainer.value.scrollTop =
        commentElement.offsetTop - containerRect.top;
    }
  }
}
// Function to update the position of the selection overlay on scroll
function updateOverlayPosition() {
  if (!selectionActive.value) return;

  const pdfImageElement = pdfImage.value.$el;
  const rect = pdfImageElement.getBoundingClientRect();
  const scrollTop = pdfContainer.value.scrollTop;

  const x = Math.min(selectionStart.value.x, selectionEnd.value.x);
  const y = Math.min(selectionStart.value.y, selectionEnd.value.y) - scrollTop;
  const width = Math.abs(selectionStart.value.x - selectionEnd.value.x);
  const height = Math.abs(selectionStart.value.y - selectionEnd.value.y);

  overlayStyle.value = {
    position: "absolute",
    left: `${x}px`,
    top: `${y}px`,
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: "rgba(0, 0, 255, 0.3)",
    border: "1px solid rgba(0, 0, 255, 0.5)",
    pointerEvents: "none",
  };
}

// Compute the style for comment markers
function commentStyle(commentData) {
  const pdfContainerElement = pdfContainer.value;
  const scrollTop = pdfContainerElement.scrollTop;
  const scrollLeft = pdfContainerElement.scrollLeft;

  const newTop = commentData.y - scrollTop; // Adjusting for scroll
  const newLeft = commentData.x - scrollLeft;

  return {
    position: "absolute",
    left: `${newLeft}px`,
    top: `${newTop}px`,
    width: `${commentData.width}px`,
    height: `${commentData.height}px`,
    backgroundColor: "rgb(23, 127, 212, 0.1)",
    padding: "4px",
    borderRadius: "4px",
    cursor: "pointer",
  };
}

// Update positions of highlights and comments on scroll
function handleScroll(event) {
  const container = this.$refs.pdfContainer; // Ensure all elements within the container scroll together

  const scrollTop = container.scrollTop;
  const scrollLeft = container.scrollLeft; // Propagate the scroll to other elements as necessary

  if (this.$refs.pdfImage) {
    this.$refs.pdfImage.scrollTop = scrollTop;
    this.$refs.pdfImage.scrollLeft = scrollLeft;
  } // If there are other elements that need synchronized scrolling:
  // (You can add similar lines for other elements, such as comment markers)

  this.$refs.selectionOverlay.style.top = `${scrollTop}px`;
  this.$refs.selectionOverlay.style.left = `${scrollLeft}px`;

  const pdfImage = this.$refs.pdfImage.$el || this.$refs.pdfImage; // Reference to PDF element
  const selectionOverlay = this.$refs.selectionOverlay; // Reference to overlay element
  // Sync overlay scroll position with PDF scroll position

  if (event.target === this.$refs.parentContainer) {
    const scrollTop = this.$refs.parentContainer.scrollTop;
    const scrollLeft = this.$refs.parentContainer.scrollLeft;

    pdfImage.scrollTop = scrollTop;
    pdfImage.scrollLeft = scrollLeft;

    if (selectionOverlay) {
      selectionOverlay.scrollTop = scrollTop;
      selectionOverlay.scrollLeft = scrollLeft;
    }
  } // Get the scroll position of the PDF component
  // Apply the scroll position to each commentData div
  const commentDivs = this.$refs.commentData;

  if (Array.isArray(commentDivs)) {
    commentDivs.forEach((commentDiv) => {
      commentDiv.style.transform = `translateY(${scrollTop}px)`;
    });
  } else {
    commentDivs.style.transform = `translateY(${scrollTop}px)`;
  }
  this.updateHighlightPositions(); // Update the comment markers
  this.updateOverlayPosition(); // Update the selection overlay

  const pdfImageElement = pdfImage;
  const containerRect = this.$refs.parentContainer.getBoundingClientRect();
  const pdfRect = pdfImageElement.getBoundingClientRect(); // Calculate visible area

  const visibleHeight =
    Math.min(containerRect.bottom, pdfRect.bottom) -
    Math.max(containerRect.top, pdfRect.top);
  const totalHeight = pdfRect.height;
  const visibilityPercentage = (visibleHeight / totalHeight) * 100; // Show comments when 60% of the page is visible

  if (visibilityPercentage >= 60) {
    this.showCommentsForPage(this.currentPage);
  } else {
    this.hideCommentsForPage(this.currentPage);
  }

  lastScrollTop = this.$refs.parentContainer.scrollTop;
}

// Update positions of comments when scroll occurs
function updateHighlightPositions() {
  filteredComments.value.forEach((commentData, index) => {
    const commentElement = document.querySelectorAll(`.comment-marker`)[index];
    if (commentElement) {
      const newStyle = commentStyle(commentData);
      Object.assign(commentElement.style, newStyle);
    }
  });
}

function unhighlightComment(index) {
  const commentElement = document.getElementById(`comment-${index}`);
  if (commentElement) {
    commentElement.style.backgroundColor = "rgb(23, 127, 212, 0.1)";
    commentElement.style.border = "none";
  }
}

const onMouseMove = (event) => {
  if (isDragging.value) {
    const dx = event.clientX - dragStartX.value;
    const dy = event.clientY - dragStartY.value; // Update dialog position

    dialogTop.value = `${parseInt(dialogTop.value) + dy}px`;
    dialogLeft.value = `${parseInt(dialogLeft.value) + dx}px`; // Update start positions for the next move

    dragStartX.value = event.clientX;
    dragStartY.value = event.clientY;
  }
};

const onMouseUp = () => {
  if (isDragging.value) {
    isDragging.value = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }
};

const overlayStyle = ref({
  position: "absolute",
  left: "0",
  top: "0",
  width: "0",
  height: "0",
  backgroundColor: "rgba(0, 0, 255, 0.3)",
  border: "1px solid rgba(0, 0, 255, 0.5)",
  pointerEvents: "none",
});

// Calculate the mouse coordinates on mousedown event
function startSelection(event) {
  const containerRect = pdfContainer.value.getBoundingClientRect();

  selectionStart.value = {
    x: event.clientX - containerRect.left,
    y: event.clientY - containerRect.top + pdfContainer.value.scrollTop,
  };

  selectionActive.value = true; // Listen to mousemove and mouseup events

  pdfContainer.value.addEventListener("mousemove", moveSelection);
  pdfContainer.value.addEventListener("mouseup", endSelection);
}

// Calculate the mouse coordinates on mousemove event
function moveSelection(event) {
  const containerRect = pdfContainer.value.getBoundingClientRect();

  selectionEnd.value = {
    x: event.clientX - containerRect.left,
    y: event.clientY - containerRect.top + pdfContainer.value.scrollTop,
  };

  let height = Math.abs(selectionStart.value.y - selectionEnd.value.y); // Limit the height to a maximum of 7.5rem

  const maxHeight =
    parseFloat(getComputedStyle(document.documentElement).fontSize) * 7.5;
  if (height > maxHeight) {
    height = maxHeight;
    selectionEnd.value.y =
      selectionStart.value.y > selectionEnd.value.y
        ? selectionStart.value.y - maxHeight
        : selectionStart.value.y + maxHeight;
  }

  updateOverlayPosition();
}

// End the selection
function endSelection(event) {
  // Remove event listeners
  pdfContainer.value.removeEventListener("mousemove", moveSelection);
  pdfContainer.value.removeEventListener("mouseup", endSelection);

  const width = Math.abs(selectionStart.value.x - selectionEnd.value.x);
  const height = Math.abs(selectionStart.value.y - selectionEnd.value.y);

  selectedArea.value = {
    x: Math.min(selectionStart.value.x, selectionEnd.value.x),
    y: Math.min(selectionStart.value.y, selectionEnd.value.y),
    width: width,
    height: height,
  };

  console.log("Selected Area:", selectedArea.value); // Debugging line
  // Open the comment dialog

  dialogVisible.value = true;

  selectionActive.value = false;
}

// Handle comment save
async function saveComment() {
  const commentData = {
    page: Number(currentPage.value),
    title: title.value,
    text: text.value,
    x: Number(selectedArea.value.x),
    y: Number(selectedArea.value.y),
    width: Number(selectedArea.value.width),
    height: Number(selectedArea.value.height),
    author: userStore.user.username,
    timestamp: String(Date.now()),
  }; // comments.value.push(commentData);
  /*
  Well written to include key variables and methodology.

      {
      "page": null,
      "title": "Good title.",
      "text": null,
      "x": null,
      "y": null,
      "width": null,
      "height": null,
      "id": "66b5cd267839d79573531daf",
      "author": null,
      "timestamp": null
      }

  */

  const discussionData = JSON.stringify([
    {
      id: paperStore.paper.id,
      data: commentData,
    },
  ]);
  console.log({ discussionData });
  await paperStore.addPaperDiscussion(discussionData);
  title.value = "";
  text.value = "";
  dialogVisible.value = false; // Force update of comments

  updateHighlightPositions();
  window.location.reload;
}

// Handle comment cancel
function cancelComment() {
  title.value = "";
  text.value = "";
  dialogVisible.value = false;
}

const timeAgo = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (seconds < 60) {
    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
  } else if (minutes < 60) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else if (hours < 24) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
};

const reactiveTimeAgo = (timestamp) => {
  return computed(() => timeAgo(timestamp));
};

const updatePageNumber = (pageNumber) => {
  currentPage.value = pageNumber;
};

// Filter comments for the current page
const filteredComments = computed(() => {
  return comments.value.filter((comment) => comment.page === currentPage.value);
});

const showCommentsForPage = (page) => {
  filteredComments.value.forEach((commentData, index) => {
    const commentElement = document.getElementById(`card-${index}`);
    if (commentElement) {
      commentElement.style.display = "block";
    }
  });
};

const hideCommentsForPage = (page) => {
  filteredComments.value.forEach((commentData, index) => {
    const commentElement = document.getElementById(`card-${index}`);
    if (commentElement) {
      commentElement.style.display = "none";
    }
  });
};
</script>

<style scoped>
/* Loading Indicator */
.loading-indicator {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  font-size: 2rem;
  color: #666;
}

/* PDF Container */

/* PDF Image */
.pdf-image {
  width: 100%;
  height: auto;
}

/* Selection Overlay */
.selection-overlay {
  position: absolute;
  background-color: rgba(0, 0, 255, 0.3);
  border: 1px solid rgba(0, 0, 255, 0.5);
  pointer-events: none;
}

/* Comment Markers */
.comment-marker {
  position: absolute;
  background-color: rgb(23, 127, 212, 0.1);
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
}

/* Comment Tooltip */
.comment-tooltip {
  max-width: 27rem;
}

/* Draggable Card */
.draggable-card-wrapper {
  position: fixed;
  z-index: 1000;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

.draggable-card {
  max-width: 27rem;
}

/* Scrollable List Container */
.scrollable-list-container {
  max-height: 300px;
  overflow-y: auto;
}

/* Comment Card */
.comment-card {
  max-width: 27rem;
}
</style>

<style>
/* Example styles for pdf-container */
.pdf-container {
  width: 100%;
  height: 100vh; /* Full viewport height for scrolling */
  overflow: auto; /* Scrollbar on the container */
  position: relative;
}
.comment-marker {
  position: absolute; /* Absolute positioning for comment markers */
  /* More styling as necessary */
}
.selection-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  /* More styling as necessary */
}
</style>
<style scoped>
/* Customize the scrollbar for the scroll-container */
.scroll-container {
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #888 #f1f1f1; /* Firefox */
}

/* WebKit Browsers (Chrome, Safari, Edge) */
.scroll-container::-webkit-scrollbar {
  width: 12px;
}

.scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scroll-container::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
  border: 2px solid #f1f1f1;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

/* Secondary scrollbar styling */
.selection-overlay {
  overflow-y: scroll;
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #555 #ddd; /* Firefox */
}

.selection-overlay::-webkit-scrollbar {
  width: 8px;
}

.selection-overlay::-webkit-scrollbar-track {
  background: #ddd;
}

.selection-overlay::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 8px;
  border: 2px solid #ddd;
}

.selection-overlay::-webkit-scrollbar-thumb:hover {
  background-color: #333;
}
</style>
<style scoped>
.custom-tooltip .v-tooltip__content {
  position: relative;
}

.custom-tooltip .v-tooltip__content::after {
  content: "";
  position: absolute;
  bottom: -10px; /* Adjust based on your needs */
  left: 50%;
  transform: translateX(-50%);
  border-width: 10px;
  border-style: solid;
  border-color: #fffb95 transparent transparent transparent; /* Matches the tooltip background color */
}

.tooltip-card {
  max-width: 27rem;
}
</style>
<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.triangle {
  position: absolute;
  top: -10px; /* Adjust to align properly */
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 3rem solid transparent;
  border-right: 3rem solid transparent;
  border-bottom: 3rem solid #fffb95; /* Match the card's color */
}

.tooltip-card {
  position: relative;
  padding-top: 5px; /* Adjust for spacing */
}
</style>
