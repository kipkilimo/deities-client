<template>
  <v-container>
    <v-row class="resource-actions" align="center" justify="center" no-gutters>
      <!-- Share Button -->
      <v-col cols="auto">
        <v-btn
          class="action-btn"
          variant="tonal"
          color="primary"
          @click="shareResourcesDialog = true"
        >
          <v-icon start>mdi-share-variant</v-icon>
          Share resource
        </v-btn>
      </v-col>

      <!-- Add to Favorite Button -->
      <v-col cols="auto">
        <v-btn
          class="action-btn"
          variant="tonal"
          color="red lighten-2"
          @click="saveResourceToLibrary"
        >
          <v-icon start>mdi-bookmark</v-icon>
          Add to my library
        </v-btn>
      </v-col>

      <!-- Add Review Button -->
      <v-col cols="auto">
        <v-btn
          class="action-btn"
          variant="tonal"
          color="#ef7f01"
          @click="rateReviewResourcesDialog = true"
        >
          <v-icon start>mdi-star-check-outline</v-icon>
          Rate & Review
        </v-btn>
      </v-col>
    </v-row>

    <!-- Share Dialog -->
    <v-dialog width="36rem" v-model="shareResourcesDialog">
      <v-card max-width="36rem" class="pa-4">
        <v-card-title class="text-h6" align-center>
          Share this resource
        </v-card-title>
        <v-divider />
        <v-card-text class="d-flex flex-wrap justify-center">
          <v-chip
            v-for="network in networks"
            :key="network.network"
            class="ma-2"
            :color="network.color"
            text-color="white"
            pill
            @click="handleShare(network)"
          >
            <v-icon start :icon="network.icon" class="me-2"></v-icon>
            {{ network.name }}
          </v-chip>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn color="primary" text @click="shareResourcesDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add to Favorite Dialog -->
    <v-dialog width="36rem" v-model="favoriteResourcesDialog">
      <v-card max-width="36rem" class="pa-4">
        <v-card-title class="text-h6" align-center>
          Adding this resource to your library ...
        </v-card-title>
        <v-divider />
        <v-card-actions>
          <v-btn color="primary" text @click="favoriteResourcesDialog = false">
            Close
          </v-btn>
        </v-card-actions>
        <v-progress-linear
          color="#08487f"
          indeterminate
          class="mb-2"
        ></v-progress-linear>
      </v-card>
    </v-dialog>

    <!-- Rate & Review Dialog -->
    <v-dialog width="36rem" v-model="rateReviewResourcesDialog">
      <v-card max-width="36rem" class="pa-4">
        <v-card-title class="text-h6" align-center>
          Review this resource ({{ reviewRating.toFixed(1) }})
        </v-card-title>
        <v-slider
          v-model="reviewRating"
          :min="1.0"
          :max="5.0"
          :step="0.1"
          thumb-label="always"
          label="Select a rating"
        >
          <template v-slot:thumb-label="{ modelValue }">
            {{ satisfactionEmojis[Math.min(Math.floor(modelValue / 0.6), 9)] }}
          </template>
        </v-slider>

        <v-textarea
          height="5rem"
          v-model="reviewText"
          :rules="textRules"
          label="Write a review"
        ></v-textarea>

        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="saveResourceRateReview"
            class="mt-2"
            width="7rem"
            color="primary"
          >
            Submit
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useResourceStore } from "@/stores/resources";

import { useUserStore } from "@/stores/users";
const userId = localStorage.getItem("sessionId") || "";

const userStore = useUserStore();
const rateReviewResourcesDialog = ref(false);
const shareResourcesDialog = ref(false);
const favoriteResourcesDialog = ref(false);
const reviewRating = ref(2); // Default rating
const reviewText = ref("");
const textRules = [
  (value) => !!value || "Review cannot be empty",
  (value) => value.length >= 10 || "Review must be at least 10 characters",
];

const satisfactionEmojis = [
  "😢",
  "😔",
  "😊",
  "😊",
  "⭐️",
  "⭐️🌟",
  "🌟🌟🌟",
  "🏆🌟🌟🌟",
  "🏆🏆🌟🌟🌟",
];

async function saveResourceToLibrary() {
  favoriteResourcesDialog.value = true;
  const resourceStore = useResourceStore();
  const resourceId = resourceStore.resource.id;

  await userStore.handleAddResourceToFavorites(userId, resourceId);
  favoriteResourcesDialog.value = false;
}
async function saveResourceRateReview() {
  const resourceStore = useResourceStore();
  const resourceId = resourceStore.resource.id;

  const reviewDetails = {
    rating: Number(reviewRating.value),
    text: reviewText.value,
  };

  await userStore.handleRateReviewResources(userId, resourceId, reviewDetails);
  rateReviewResourcesDialog.value = false;
}

// Sharing information
const sharing = reactive({
  url: "https://nem.bio/dashboard/player",
  title: "Resource Title",
  description: "Resource Description",
  quote: "Resource Quote",
  hashtags: "epidemiology,biostatistics,research,methods",
  twitterUser: "me",
});

const networks = reactive([
  {
    network: "facebook",
    name: "Facebook",
    icon: "mdi-facebook",
    color: "#1877f2",
  },
  {
    network: "whatsapp",
    name: "WhatsApp",
    icon: "mdi-whatsapp",
    color: "#25d366",
  },
  {
    network: "messenger",
    name: "Messenger",
    icon: "mdi-facebook-messenger",
    color: "#0084ff",
  },
  {
    network: "twitter",
    name: "Twitter",
    icon: "mdi-twitter",
    color: "#1da1f2",
  },
  {
    network: "linkedin",
    name: "LinkedIn",
    icon: "mdi-linkedin",
    color: "#007bb5",
  },
  {
    network: "telegram",
    name: "Telegram",
    icon: "mdi-send-circle-outline",
    color: "#0088cc",
  },
]);

function handleShare(network) {
  const { url, title, description, quote, hashtags, twitterUser } = sharing;
  let shareUrl = "";

  switch (network.network) {
    case "facebook":
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(quote)}`;
      break;
    case "whatsapp":
      shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n${url}`)}`;
      break;
    case "messenger":
      shareUrl = `fb-messenger://share?link=${encodeURIComponent(url)}&app_id=123456789`;
      break;
    case "twitter":
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=${hashtags}&via=${twitterUser}`;
      break;
    case "linkedin":
      shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`;
      break;
    case "telegram":
      shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
      break;
    default:
      console.warn(`Unsupported network: ${network.name}`);
  }

  if (shareUrl) {
    window.open(shareUrl, "_blank");
  }
}

function submitReview() {
  console.log("Rating:", reviewRating.value);
  console.log("Review:", reviewText.value);
  rateReviewResourcesDialog.value = false; // Close the dialog after submission
}
</script>

<style scoped>
.resource-actions {
  margin-top: 16px;
  gap: 8px;
}

.action-btn {
  font-weight: bold;
  font-size: 14px;
  border-radius: 16px;
  text-transform: none;
}
</style>
