<template>
  <div>
    <h2 class="mb-2">NEMBio PaperDive Discussion Participants</h2>
    <v-divider />

    <div>
      <v-card-item
        :title="cardTitle"
        style="cursor: pointer"
        @click="openGetLinkDialog"
      >
        <template v-slot:subtitle>
          <v-icon
            class="me-1 pb-1"
            color="info"
            @click="openGetLinkDialog"
            :icon="cardIcon"
            size="24"
          />
          {{ cardSubtitle }}
        </template>

        <!-- Card for showing QR Code when no pending participants -->
        <v-card width="540" v-if="pendingParticipants.length === 0">
          <v-card-text>
            <v-icon class="mr-2">mdi-multicast</v-icon>
            Share enrollment link with participants
          </v-card-text>
          <v-divider />
          <div ref="participantInvite" class="text-center">
            <!-- Ensure QR code is generated and visible -->
            <v-img
              v-if="qrCodeUrl"
              style="height: 12rem; cursor: pointer"
              :src="qrCodeUrl"
              alt="QR Code"
            />
            <p class="ma-4">{{ urlData }}</p>
          </div>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn text color="info" variant="outlined" @click="saveLink">
              <v-icon class="mr-2">mdi-cloud-download-outline</v-icon>
              SAVE
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-card-item>
    </div>

    <!-- Show loading progress when loading -->
    <div v-if="isLoading">
      <v-progress-linear color="cyan" indeterminate />
    </div>

    <!-- Display participants when available -->
    <v-row
      v-if="!isLoading && pendingParticipants.length > 0"
      class="overflow-y-auto mt-1"
      style="height: 95vh; max-height: 95vh"
    >
      <v-col
        cols="12"
        md="6"
        lg="4"
        v-for="(participant, index) in pendingParticipants"
        :key="index"
      >
        <v-card
          :loading="loading"
          class="mx-auto my-3"
          width="42rem"
          color="#dbdbdf"
        >
          <v-card
            class="mx-auto"
            prepend-icon="mdi-account-check"
            :subtitle="participant.status"
            width="400"
          >
            <template v-slot:title>
              <span class="font-weight-black">{{
                participant.participantName
              }}</span>
            </template>
          </v-card>
          <v-divider class="mx-4 mb-1" />
          <v-card-actions>
            <!-- Action buttons for participant request -->
            <v-btn color="red" text @click="rejectRequest(participant)"
              >REJECT</v-btn
            >
            <v-spacer />
            <v-btn
              color="green"
              variant="text"
              @click="acceptRequest(participant)"
              >ACCEPT REQUEST</v-btn
            >
            <v-spacer />
            <!-- Accept all button, shown only if the user is the creator 
              v-if="userId === participant.createdBy.id"-->
            <v-btn
              color="success"
              variant="outlined"
              @click="acceptAllRequests"
              rounded
            >
              <v-icon size="32">mdi-cloud-lock-open-outline</v-icon>
              ACCEPT ALL PARTICIPANT REQUESTS
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Alert for error messages -->
    <v-alert
      v-if="errorMessage"
      border="top"
      type="warning"
      variant="outlined"
      prominent
      class="ml-38 mt-4"
      width="72%"
    >
      {{ errorMessage }}
    </v-alert>

    <!-- Alert for success messages -->
    <v-alert
      v-if="success"
      border="top"
      type="success"
      class="ml-38 mt-4"
      width="72%"
      variant="outlined"
      prominent
    >
      {{ success }}
    </v-alert>

    <!-- Dialog for generating and sharing link -->
    <v-dialog v-model="getLinkDialog" width="auto">
      <v-card min-width="540">
        <v-card-text>
          <v-icon class="mr-2">mdi-multicast</v-icon>
          Share enrollment link with participants
        </v-card-text>
        <v-divider />
        <div ref="participantInvite" class="text-center">
          <img
            v-if="qrCodeUrl"
            style="height: 12rem; cursor: pointer"
            :src="qrCodeUrl"
            alt="QR Code"
          />
          <p class="ma-4">{{ urlData }}</p>
        </div>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn text color="info" variant="outlined" @click="saveLink">
            <v-icon class="mr-2">mdi-cloud-download-outline</v-icon>
            SAVE
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import { usePaperStore } from "@/stores/papers";

const paperStore = usePaperStore();
const apiUrl = import.meta.env.VITE_BASE_URL;
const serverUrl = apiUrl;
const clientUrl = import.meta.env.VITE_CLIENT_URL;

const getLinkDialog = ref(false);
const qrCodeUrl = ref("");
const urlData = ref("");
const isLoading = ref(false);
const success = ref(null);
const errorMessage = ref(null);
const sessionId = ref(paperStore.paper.sessionId);
const userId = ref(localStorage.getItem("sessionId"));

const participants = computed(() => {
  return JSON.parse(paperStore.paper.participants || "[]");
});

const pendingParticipants = computed(() => {
  return participants.value.filter((p) => p.requestStatus === "PENDING");
});

const cardTitle = computed(() => {
  return !isLoading.value && participants.value.length === 0
    ? "No paper participants yet"
    : "Share paper discussion link.";
});

const cardSubtitle = computed(() => {
  return !isLoading.value && participants.value.length === 0
    ? "Create QR Code URL and share with participants"
    : "Share paper discussion link.";
});

const cardIcon = computed(() => {
  return !isLoading.value && participants.value.length === 0
    ? "mdi-account-multiple-plus-outline"
    : "mdi-share-variant-outline";
});

const openGetLinkDialog = () => {
  generateQRCode(paperStore.paper.sessionId);
  urlData.value = `${clientUrl}/paper/participant?sessionId=${sessionId.value}`;
  getLinkDialog.value = true;
};

const generateQRCode = async (sessionId) => {
  urlData.value = `${clientUrl}/paper/participant?sessionId=${sessionId}`;
  try {
    const data = `${apiUrl}/paper/participant?sessionId=${sessionId}`;
    qrCodeUrl.value = await QRCode.toDataURL(data, { type: "png" });
  } catch (err) {
    console.error(err);
  }
};
const handleGetLinkDialog = () => {
  generateQRCode(sessionId.value);
  urlData.value = `${clientUrl}/paper/participant?sessionId=${sessionId.value}`;
};
const handleActionClick = (item) => {
  console.log(`Starting exam for ${item.title}`);
};

// Parse the exams data
onMounted(() => {
  generateQRCode(sessionId.value);
});
const saveLink = () => {
  const padding = 4;
  const lineThickness = 0.1;
  const doc = new jsPDF();

  // Add the QR code
  doc.addImage(qrCodeUrl.value, "PNG", padding, padding + 10, 180, 160);

  const lineY = padding + 180 + 5;
  doc.setLineWidth(lineThickness);
  doc.line(padding, lineY, 205, lineY);

  const textY = lineY + 10;
  doc.text(
    "Participants enrollment link (Via NEMBio Paper Dive).",
    padding,
    textY
  );
  doc.text(urlData.value, padding, textY + 10);

  // Add a repeating image (link) as a background for top and bottom 25% of the page
  const logoUrl =
    "https://png.pngtree.com/png-vector/20230227/ourmid/pngtree-block-blue-logo-png-image_6621541.png"; // Image URL (example)
  const linkWidth = 50; // Width of the repeating image
  const linkHeight = 20; // Height of the repeating image
  const linkOpacity = 0.4;

  // Set opacity for watermark images
  doc.setGState(new doc.GState({ opacity: linkOpacity }));

  // Top 12.5% repeating background
  const topHeight = doc.internal.pageSize.height * 0.12; // Calculate 12.5% of the page height
  for (let y = 10; y < topHeight; y += linkHeight + 10) {
    for (let x = 5; x < 200; x += linkWidth + 10) {
      doc.addImage(logoUrl, "PNG", x, y, linkWidth, linkHeight);
    }
  }
  // Bottom 25% repeating background
  for (let y = 260; y < 290; y += linkHeight + 10) {
    for (let x = 5; x < 200; x += linkWidth + 10) {
      doc.addImage(logoUrl, "PNG", x, y, linkWidth, linkHeight);
    }
  }

  // Reset opacity for other elements
  doc.setGState(new doc.GState({ opacity: 1 }));

  // Add the main logo at the bottom of the PDF
  const mainLogoWidth = 67;
  const mainLogoHeight = 60;
  const logoX = padding;
  const logoY = textY + 20;

  doc.addImage(logoUrl, "PNG", logoX, logoY, mainLogoWidth, mainLogoHeight);

  // Save the PDF with the participant link
  doc.save(`nembio_paperdive_participant_link_${sessionId.value}.pdf`);

  getLinkDialog.value = false;
};

const acceptRequest = async (participant) => {
  try {
    await axios.post(`${serverUrl}/resources/uploads/paper/enroll`, {
      participantId: participant.userId,
      action: "ACCEPT",
      sessionId: sessionId.value,
    });

    success.value = `Participant ${participant.participantName} accepted successfully.`;
    window.location.reload();
  } catch (error) {
    errorMessage.value = `Error accepting ${participant.participantName}: ${error.message}`;
  }
};

const rejectRequest = async (participant) => {
  try {
    await axios.post(`${serverUrl}/resources/uploads/paper/enroll`, {
      participantId: participant.userId,
      action: "REJECT",
      sessionId: sessionId.value,
    });

    success.value = `Participant ${participant.participantName} rejected.`;
    window.location.reload();
  } catch (error) {
    errorMessage.value = `Error rejecting ${participant.participantName}: ${error.message}`;
  }
};

const acceptAllRequests = async () => {
  try {
    const participantIds = pendingParticipants.value.map((p) => p.userId);
    await axios.post(`${serverUrl}/resources/uploads/paper/enroll`, {
      participantIds,
      action: "ACCEPT_ALL",
      sessionId: sessionId.value,
    });

    success.value = "All participant requests accepted successfully.";
    window.location.reload();
  } catch (error) {
    errorMessage.value = `Error accepting all participants: ${error.message}`;
  }
};
</script>
