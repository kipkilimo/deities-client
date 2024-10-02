<template>
  <v-card flat color="#dbdbdb" min-width="1080">
    <!-- Wrapping card container -->
    <h4 class="ma-2" color="#55565a" v-if="parsedAssignments.length === 0">
      No tasks to show
    </h4>
    <v-row
      class="overflow-y-auto mt-1"
      style="height: 400px; max-height: 400px; overflow-y: auto"
    >
      <v-col v-for="(item, index) in parsedAssignments" :key="index" cols="12">
        <v-card
          class="mx-auto my-4"
          min-width="42rem"
          max-width="42rem"
          style="
            background-image: url(&quot;https://png.pngtree.com/background/20210712/original/pngtree-cute-hand-drawn-style-math-education-stripes-background-picture-image_1176962.jpg&quot;);
            background-size: cover;
            background-position: center;
          "
        >
          <v-card-title class="headline text-h4 text-black">
            {{ item.title ?? "None" }}
          </v-card-title>
          <v-card-subtitle class="text-overline text-black">
            {{ item.subject ?? "None" }} ASSIGNMENT
          </v-card-subtitle>

          <v-divider />

          <!-- Meta information about assignment -->
          <v-card-subtitle class="text-black">
            <strong>Duration:</strong>
            {{ item.assignmentDuration || "None" }}
            <br />
            <strong>End Time:</strong>
            {{ item.assignmentDeadline || "None" }}
          </v-card-subtitle>

          <!-- Assignment description -->
          <v-card-text>{{ item.description ?? "None" }}</v-card-text>

          <!-- Test Meta information -->

          <v-divider />

          <!-- Card actions -->
          <v-card-actions>
            <v-btn
              text
              @click="handleGetLinkDialog(item), (getLinkDialog = true)"
              >Participants Link</v-btn
            >
            <v-btn text @click="manageExamParticipantsDialog = true">
              Manage Participants
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- QR Link Dialog -->
    <v-dialog v-model="getLinkDialog" width="auto">
      <v-card min-width="540">
        <v-card-text>
          <v-icon class="mr-2">mdi-multicast</v-icon>
          Share enrollment link with participants
        </v-card-text>
        <v-divider />
        <div ref="participantInvite">
          <img
            style="height: 12rem; cursor: pointer"
            :src="qrCodeUrl ?? 'None'"
            alt="QR Code"
          />
          <p class="ma-4">{{ urlData ?? "None" }}</p>
        </div>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn text color="info" variant="outlined" @click="saveLink()">
            <v-icon class="mr-2">mdi-cloud-download-outline</v-icon>
            SAVE
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Participant management dialog -->
    <v-dialog v-model="manageExamParticipantsDialog" max-width="66%">
      <!-- Display participants when available -->
      <v-card min-height="7.5em">
        <h4 class="ma-4" v-if="pendingParticipants.length === 0">
          No pending participants
        </h4>
        <v-row
          v-if="pendingParticipants.length > 0"
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
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import { useResourceStore } from "@/stores/resources";

const resourceStore = useResourceStore();
const getLinkDialog = ref(false);
const manageExamParticipantsDialog = ref(false);
const qrCodeUrl = ref("");
const parsedAssignments = ref([]);
const parsedParticipantsData = ref([]);
const apiUrl = import.meta.env.VITE_CLIENT_URL;
const success = ref(null);
const errorMessage = ref(null);

const urlData = ref(
  `${apiUrl}/assignment/participant?sessionId=${parsedAssignments.value.length > 0 ? parsedAssignments.value[0].sessionId : ""}`
);
const participants = computed(() => {
  return JSON.parse(resourceStore.resource.participants || "[]");
});

const pendingParticipants = computed(() => {
  return participants.value.filter((p) => p.requestStatus === "PENDING");
});
const handleGetLinkDialog = (item) => {
  generateQRCode(item.sessionId);
  urlData.value = `${apiUrl}/assignment/participant?sessionId=${parsedAssignments.value.length > 0 ? item.sessionId : ""}`;
};
const handleActionClick = (item) => {
  console.log(`Starting exam for ${item.title}`);
};

// Parse the exams data
onMounted(() => {
  parsedAssignments.value = JSON.parse(resourceStore.tasks);
  if (parsedAssignments.value.length > 0) {
    generateQRCode(parsedAssignments.value[0].sessionId);
    parsedParticipantsData.value = JSON.parse(
      parsedAssignments.value[0].participants
    );
  }
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
  doc.text("Participants enrollment link (Via NEMBio Exams).", padding, textY);
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
  function getSessionIdFromData(data) {
    // Create a URL object
    const url = new URL(data);

    // Use URLSearchParams to extract the sessionId parameter from the query string
    const params = new URLSearchParams(url.search);

    // Get the sessionId value
    const sessionId = params.get("sessionId");

    return sessionId;
  }

  doc.save(
    `nembio_assignment_${getSessionIdFromData(urlData.value)}_participant_link.pdf`
  );

  getLinkDialog.value = false;
};

// Generate QR code
const generateQRCode = async (sessionId) => {
  try {
    const data = `${apiUrl}/assignment/participant?sessionId=${sessionId}`;
    const url = await QRCode.toDataURL(data, { type: "png" });
    qrCodeUrl.value = url;
  } catch (err) {
    console.error(err);
  }
};

function formatDateTime(dateString, newTime) {
  const date = new Date(dateString);
  const [hours, minutes] = newTime.split(":").map(Number);
  date.setUTCHours(hours - 3, minutes, 0, 0);

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Africa/Nairobi",
  };

  return date
    .toLocaleString("en-US", options)
    .replace("AM", "AM (EAT)")
    .replace("PM", "PM (EAT)");
}
const acceptRequest = async (participant) => {
  try {
    await axios.post(`${serverUrl}/resources/uploads/assignment/enroll`, {
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
    await axios.post(`${serverUrl}/resources/uploads/assignment/enroll`, {
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
    await axios.post(`${serverUrl}/resources/uploads/assignment/enroll`, {
      participantIds,
      action: "ACCEPT_ALL",
      sessionId: sessionId.value,
    });
    if (response.data.message) {
      success.value = "Enrollment request submitted successfully.";
      setTimeout(() => {
        window.location.reload();
      }, 4200);
    }
  } catch (error) {
    errorMessage.value = `Error accepting all participants: ${error.message}`;
  }
};
</script>
