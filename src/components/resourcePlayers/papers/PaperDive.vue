<template>
  <v-card flat height="99.9vh" full-width>
    <!-- Loading Indicator -->
    <!-- PDF Container --><v-row>
      <v-col cols="9">
        <v-toolbar
          style="
            border-radius: 5px 5px 0 0;
            box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.9);
            z-index: 1500;
            color: #e7f2fb;
          "
        >
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
          <v-toolbar-title color="grey"></v-toolbar-title>
          <router-link to="/dashboard/overview">
            <v-toolbar-title color="grey">
              <v-icon>mdi-home</v-icon>NEMBio
            </v-toolbar-title>
          </router-link>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            color="grey"
            flat
            class="mr-2"
            @mousedown="startLongPress('decrement')"
            @mouseup="stopLongPress"
            @mouseleave="stopLongPress"
            @click="handleDecrementClick"
          >
            <v-icon>mdi-menu-left</v-icon> Previous Page
          </v-btn>
          <v-btn variant="outlined" color="grey" flat class="mr-2">
            <v-icon>mdi-star-box-multiple-outline</v-icon>Page
            {{ currentPage }} of {{ totalPages }}
          </v-btn>
          <v-btn
            variant="text"
            color="grey"
            flat
            size="lg"
            class="mr-2"
            style="background-color: rgba(255, 255, 255, 0)"
            @click="rotatePage"
            ><v-icon>mdi-file-rotate-right-outline</v-icon></v-btn
          >

          <v-btn
            color="grey"
            flat
            @mousedown="startLongPress('increment')"
            @mouseup="stopLongPress"
            @mouseleave="stopLongPress"
            @click="handleIncrementClick"
          >
            <v-icon>mdi-menu-right</v-icon>Next Page
          </v-btn>
        </v-toolbar>

        <div id="pdf-container" ref="pdfContainer" class="pdf-container">
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

          <!-- highlighted sections -->
          <div
            v-for="(commentData, index) in filteredComments"
            :key="index"
            :style="commentStyle(commentData)"
            :id="'comment-' + index"
            class="comment-marker z-index-common"
            @mouseover="
              (showTooltip = index),
                (hoverIndex = index),
                moveActiveCardToSecondPosition(commentData.id)
            "
            @mouseleave="
              (showTooltip = null),
                (activeComment = null),
                (hoverIndex = null),
                moveActiveCardToSecondPosition(null)
            "
          >
            <br />
            <br />
            <br />
            <br />
            <div class="tooltip-wrapper">
              <v-tooltip bottom v-if="showTooltip === index">
                <template #activator="{ on, attrs }">
                  <v-row>
                    <v-col>
                      <div
                        style="align-items: center; justify-content: center"
                      ></div>
                      <v-icon class="ml-44" size="50">mdi-menu-up</v-icon>
                      <v-card
                        color="#e7f2fb"
                        v-bind="attrs"
                        min-width="27rem"
                        max-width="27rem"
                        v-on="on"
                        :style="computedCardStyle(index)"
                        style="
                          border: 1px solid #ccc;
                          border-bottom: 1px solid #ccc;
                          box-shadow: 0 1px 0 #ccc;
                          z-index: 10;
                        "
                        class="tooltip-card custom-tooltip"
                      >
                        <div class="ma-4 text-h6">{{ commentData.title }}</div>
                        <div class="ma-4 text-h7">
                          <i>{{ commentData.text }}</i>
                        </div>
                        <v-divider />
                        <v-card-actions>
                          <v-card-subtitle class="ml-11" align-right>
                            Added
                            {{ reactiveTimeAgo(Number(commentData.timestamp)) }}
                            by {{ commentData.author }}
                          </v-card-subtitle>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </template>
              </v-tooltip>
            </div>
          </div>
          <!-- overlay -->
          <div
            v-if="selectionActive"
            :style="overlayStyle"
            class="selection-overlay"
            id="selectionOverlay"
            ref="selectionOverlay"
          ></div>
          <v-toolbar
            id="toolBar2"
            style="
              border-radius: 0px 0px 5px 5px;
              box-shadow: 0 0px 0px rgba(0, 0, 0, 0.9);
              position: fixed;
              bottom: 0;
              left: 0;
              width: 74.4%;
              right: 0;
              color: #cccfcf;
              background-color: transparent; /* Make the background transparent */
            "
          >
            <v-app-bar-nav-icon></v-app-bar-nav-icon>

            <v-spacer></v-spacer>

            <v-btn
              size="x-small"
              color="grey"
              flat
              class="mr-2"
              style="background-color: rgba(255, 255, 255, 0)"
            >
              <v-icon>mdi-star-box-multiple-outline</v-icon>
              Page {{ currentPage }} of {{ totalPages }}
            </v-btn>

            <v-btn
              size="x-small"
              variant="text"
              color="grey"
              flat
              class="mr-2"
              @click="handleDecrementClick"
              style="background-color: rgba(255, 255, 255, 0)"
            >
              <v-icon>mdi-menu-left</v-icon> Previous Page
            </v-btn>

            <v-btn
              size="x-small"
              color="grey"
              flat
              class="mr-2"
              @click="handleIncrementClick"
              style="background-color: rgba(255, 255, 255, 0)"
            >
              <v-icon>mdi-menu-right</v-icon>Next Page
            </v-btn>
            <v-btn
              size="x-small"
              variant="text"
              color="grey"
              flat
              class="mr-2"
              style="background-color: rgba(255, 255, 255, 0)"
              @click="rotatePage"
              ><v-icon>mdi-file-rotate-right-outline</v-icon></v-btn
            >
          </v-toolbar>
        </div>
      </v-col>
      <v-col cols="3">
        <!-- draggable comments iterator  -->
        <v-card-title @mousedown.stop="onMouseDown">
          <span class="headline"
            >Page {{ currentPage }} Discussion Comments.</span
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div class="" v-if="filteredSideComments.length === 0">
            <h5>No discussion comments.</h5>
          </div>

          <v-row class="overflow-y-auto" style="height: 81vh">
            <v-col
              v-for="(comment, index) in reorderedComments"
              :key="index"
              cols="12"
            >
              <v-card
                flat
                max-width="27rem"
                @mouseover="
                  (showTooltip = index),
                    (hoverIndex = index),
                    moveActiveCardToSecondPosition(comment.id),
                    handleDraggableCardClick(hoverIndex)
                "
                @mouseleave="
                  (showTooltip = null),
                    (activeComment = null),
                    (hoverIndex = null),
                    moveActiveCardToSecondPosition(null)
                "
                @click="handleDraggableCardClick(index)"
                color="#e7f2fb"
                v-bind="attrs"
                v-on="on"
                :style="computedCardStyle(index)"
                class="tooltip-card custom-tooltip mt-1 mb-1 mr-2"
                style="
                  border: 1px solid #ccc;
                  border-bottom: 1px solid #ccc;
                  box-shadow: 0 1px 0 #ccc;
                  z-index: 10;
                "
              >
                <div class="ma-4 text-h6">{{ comment.title }}</div>
                <div class="ma-4 text-h7">
                  <i>{{ comment.text }}</i>
                </div>
                <v-divider />
                <v-card-actions>
                  <v-card-subtitle>
                    Added {{ reactiveTimeAgo(Number(comment.timestamp)) }} by
                    {{ comment.author }}
                  </v-card-subtitle>
                </v-card-actions>
                <v-divider />
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>
    <!-- Comment Dialog -->

    <v-dialog v-model="dialogVisible" max-width="30rem" persistent>
      <v-card :disabled="paperStore.paper.discussion.length >= 30">
        <v-card-title>
          <span class="headline ml-2">{{
            paperStore.paper.discussion.length >= 30
              ? "Article discussion closed."
              : "Contribute to the discussion"
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
          <v-btn
            variant="outlined"
            color="primary"
            @click="saveComment"
            :disabled="!isButtonEnabled"
            ><v-icon class="mr-1">mdi-content-save-check</v-icon> Save
            Comment</v-btn
          >

          <v-btn text color="orange" @click="cancelComment">Cancel</v-btn>

          <v-spacer></v-spacer>
        </v-card-actions>
        <br />
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import VuePdfEmbed from "vue-pdf-embed";
import { usePaperStore } from "../../../stores/papers";
import { useUserStore } from "../../../stores/users";
const pdfRef = ref(null); // Reference to the VuePdfEmbed component
const showSide = ref(true);
const comments = ref([]);
const userStore = useUserStore();
const user = computed(() => userStore.user);
const showTooltip = ref(null);
const hoverIndex = ref(null);
const paperStore = usePaperStore();
const pdfUrl = paperStore.paper.url;
const selectionActive = ref(false);
const pdfContainer = ref(null);
const currentPage = ref(1);
const pageRotation = ref(0);
const activeComment = ref(null);
const dialogTop = ref("6.6rem"); // Initial position
const dialogLeft = ref("81%"); // Initial position
const isDragging = ref(false);
const isLoading = ref(true); // For hover state of the draggable card
const dragStartX = ref(0);
const dragStartY = ref(0);
const totalPages = ref(0);
// Filter comments for the current page
const highlightedComment = ref(null);

// Method to scroll to the comment
const scrollToComment = (commentId) => {
  const commentElement = document.getElementById(commentId);

  if (commentElement) {
    commentElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    // Apply the highlight class
    highlightedComment.value = commentId;

    // Remove the highlight after a short delay (e.g., 2 seconds)
    setTimeout(() => {
      highlightedComment.value = null;
    }, 2000);
  }
};

// Method to handle draggable card click
const handleDraggableCardClick = (commentIndex) => {
  const commentId = `comment-${commentIndex}`;
  scrollToComment(commentId);
};
const filteredComments = computed(() => {
  return comments.value.filter((comment) => comment.page === currentPage.value);
});
const filteredSideComments = computed(() => {
  return comments.value.filter((comment) => comment.page === currentPage.value);
});
const computedCardStyle = computed(() => {
  return (index) => ({
    backgroundColor: hoverIndex.value === index ? "#ffff95" : "#fffffc",
    cursor: hoverIndex.value === index ? "pointer" : "",
    // Other styles
  });
});

const computedSideCardStyle = computed(() => {
  return (index) => ({
    backgroundColor: activeComment.value === index ? "#ffff95" : "#fffffc",
    cursor: activeComment.value === index ? "pointer" : "",
    // Other styles
  });
});
// Watch for changes in the page ref
watch(currentPage, (newPage) => {
  console.log("Page changed to:", newPage);
  currentPage.value = newPage;
});

function handleDocumentLoad({ numPages }) {
  totalPages.value = numPages;
}
function handleDocumentRender() {
  isLoading.value = false;
}

let longPressTimer = null;
let longPressInterval = null;
const longPressDelay = 500; // Delay before long press is considered
const longPressAction = ref(null);

const incrementPageNumber = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};

const decrementPageNumber = () => {
  if (currentPage.value === 1) {
    return;
  }
  currentPage.value -= 1;
};

const handleIncrementClick = () => {
  incrementPageNumber();
};

const handleDecrementClick = () => {
  decrementPageNumber();
};

const startLongPress = (action) => {
  longPressAction.value = action;
  longPressTimer = setTimeout(() => {
    longPressInterval = setInterval(() => {
      if (longPressAction.value === "increment") {
        incrementPageNumber();
      } else if (longPressAction.value === "decrement") {
        decrementPageNumber();
      }
    }, 100);
  }, longPressDelay);
};

const stopLongPress = () => {
  clearTimeout(longPressTimer);
  clearInterval(longPressInterval);
  longPressAction.value = null;
};

function rotatePage() {
  if (pageRotation.value === 360) {
    pageRotation.value = 0;
    return;
  }
  pageRotation.value = pageRotation.value + 90;
}
const handleKeydown = (event) => {
  if (event.key === "ArrowLeft") {
    decrementPageNumber();
  } else if (event.key === "ArrowRight") {
    incrementPageNumber();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
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
onMounted(() => {
  comments.value = paperStore.paper.discussion;
});
const onMouseUp = () => {
  if (isDragging.value) {
    isDragging.value = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }
};

const onMouseDown = (event) => {
  if (event.target.closest(".draggable-card")) {
    isDragging.value = true;
    dragStartX.value = event.clientX;
    dragStartY.value = event.clientY;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }
};

const overlayStyle = ref({
  position: "absolute",
  left: "0",
  top: "0",
  width: "0",
  height: "0",
  backgroundColor: "rgba(192, 235, 238, 0.4)",
  border: "1px solid rgba(0, 0, 255, 0.5)",
  pointerEvents: "none",
});

const selectionStart = ref({ x: 0, y: 0 });
const selectionEnd = ref({ x: 0, y: 0 });
const selectedArea = ref({ x: null, y: null, width: null, height: null });
const dialogVisible = ref(false);
const loading = ref(true);
const title = ref("");
const text = ref("");
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
// Computed properties for validation
const titleValid = computed(() => {
  return titleRules.every((rule) => rule(title.value) === true);
});

const textValid = computed(() => {
  return textRules.every((rule) => rule(text.value) === true);
});

const isButtonEnabled = computed(() => titleValid.value && textValid.value);

const updateOverlay = () => {
  overlayStyle.value = {
    ...overlayStyle.value,
    left: `${Math.min(selectionStart.value.x, selectionEnd.value.x)}px`,
    top: `${Math.min(selectionStart.value.y, selectionEnd.value.y)}px`,
    width: `${Math.abs(selectionStart.value.x - selectionEnd.value.x)}px`,
    height: `${Math.abs(selectionStart.value.y - selectionEnd.value.y)}px`,
  };
};
const updatePageNumber = (pageNumber) => {
  console.log("updated page:", pageNumber);
  currentPage.value = pageNumber;
};
// watch(currentPage, (newPage) => {

// Calculate the mouse coordinates on mousedown event
function startSelection(event) {
  selectedArea.value = { x: null, y: null, width: null, height: null };
  dialogVisible.value = false;
  const containerRect = pdfContainer.value.getBoundingClientRect();

  selectionStart.value = {
    x: event.clientX - containerRect.left,
    y: event.clientY - containerRect.top + pdfContainer.value.scrollTop,
  };

  selectionActive.value = true; // Listen to mousemove and mouseup events

  pdfContainer.value.addEventListener("mousemove", moveSelection);
  pdfContainer.value.addEventListener("mouseup", endSelection);
  if (selectedArea.value.width * selectedArea.value.height < 20) {
    cancelComment();
    // Invalidate the selection and do not open the dialog
    return;
  }
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

  updateOverlay();
}

function endSelection(event) {
  // Remove event listeners
  pdfContainer.value.removeEventListener("mousemove", moveSelection);
  pdfContainer.value.removeEventListener("mouseup", endSelection);

  const width = Math.abs(selectionStart.value.x - selectionEnd.value.x);
  const height = Math.abs(selectionStart.value.y - selectionEnd.value.y);

  // Check if the selection is too small to be considered valid

  // Set the selected area since the selection is valid
  selectedArea.value = {
    x: Math.min(selectionStart.value.x, selectionEnd.value.x),
    y: Math.min(selectionStart.value.y, selectionEnd.value.y),
    width: width,
    height: height,
  };

  function checkDimensions(overlayStyle) {
    // Parse width and height from the style object
    const widthValue = parseFloat(overlayStyle.width);
    const heightValue = parseFloat(overlayStyle.height);

    // Convert height to pixels assuming 1rem = 16px (default)
    const heightInPixels = overlayStyle.height.endsWith("rem")
      ? heightValue * 16
      : heightValue;

    // Check conditions
    return widthValue > 250 && heightInPixels < 12 * 16;
  }
  const isWithinBounds = checkDimensions(overlayStyle.value);

  if (!isWithinBounds) {
    title.value = "";
    text.value = "";
    cancelComment();
    // Invalidate the selection and do not open the dialog
    return;
  }
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
    author: userStore.user.personalInfo.username || "Anonymous",
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
  await paperStore.addPaperDiscussion(discussionData);

  window.location.reload();
}

// Handle comment cancel
function cancelComment() {
  title.value = "";
  text.value = "";

  selectedArea.value = { x: null, y: null, width: null, height: null };
  overlayStyle.value = {
    position: "absolute",
    left: "0",
    top: "0",
    width: "0",
    height: "0",
    backgroundColor: "rgba(192, 235, 238, 0.3)",
    border: "1px solid rgba(0, 0, 255, 0.5)",
    pointerEvents: "none",
  };
  dialogVisible.value = false;
}

const commentStyle = (comment) => ({
  position: "absolute",
  left: `${comment.x}px`,
  top: `${comment.y}px`,
  width: `${comment.width}px`,
  height: `${comment.height}px`,
  backgroundColor: "rgba(231, 242, 251, 0.7)",
});

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

const moveActiveCardToSecondPosition = (activeCardId) => {
  activeComment.value = activeCardId;
};

// Watch the activeCardId and run the method whenever it changes
const reorderedComments = computed(() => {
  const comments = filteredSideComments.value;

  // Handle the case where there are no comments
  if (comments.length === 0) {
    return [];
  }

  // If activeComment is null, return the entire comments array as is
  if (activeComment.value === null) {
    return comments;
  }

  // Find the index of the comment matching activeId
  const activeIndex = comments.findIndex(
    (comment) => comment.id === activeComment.value
  );

  // If activeComment is not found, return the entire comments array
  if (activeIndex === -1) {
    return comments;
  }

  // We want to show the active comment and up to 4 others, which means
  // 2 before and 2 after the active comment (total 5 comments max).
  let start = Math.max(0, activeIndex - 2); // Start 2 elements before the active one
  let end = Math.min(comments.length, start + 5); // Show up to 5 comments

  // Adjust the start if we're too close to the end
  if (end - start < 5) {
    start = Math.max(0, end - 5);
  }

  // Return the subarray containing the active comment and its neighbors
  return comments.slice(start, end);
});

// Optional: Wrap in a computed to make it reactive (Vue-specific)
</script>

<style scoped>
/* Add your styles here */
.pdf-container {
  position: relative;
  height: 90vh;
  overflow: auto;
  border: 1px solid #ccc;
}

.comment-marker {
  position: absolute;
  background-color: rgba(192, 235, 238, 0.5);
  cursor: pointer;
}

.tooltip-wrapper {
  position: absolute;
  width: 100%;
}

.tooltip-card {
  position: absolute;
  width: 100%;
}

.loading-indicator {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  border-radius: 4px;
  z-index: 2000;
}

.hover-card:hover {
  background-color: #fffb95;
  cursor: pointer;
}

.selection-overlay {
  position: absolute;
  pointer-events: none;
}

.draggable-card {
  cursor: move;
}

.hover-draggable {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}
</style>
<style scoped>
.custom-card {
  position: relative;
}

.triangle-pointer {
  position: absolute;
  top: -10px; /* Adjust as needed to position the triangle pointer */
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #e7f2fb; /* Match the card color */
}

.tooltip-card {
  border: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  box-shadow: 0 1px 0 #ccc;
}
</style>
<style scoped>
.card-container {
  width: 30%;
  overflow-x: hidden;
}

.cards-wrapper {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
}

.card {
  min-width: 200px;
  margin: 0 10px;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.card.active {
  transform: scale(1.1);
}
</style>
