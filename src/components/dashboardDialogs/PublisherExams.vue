<template>
  <v-container>
    <v-row>
      <!-- Iterate through each exam -->
      <v-col
        v-for="(item, index) in parsedExams"
        :key="index"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          class="mx-auto my-4"
          min-width="780"
          style="
            background-image: url(&quot;https://img.freepik.com/free-vector/hand-drawn-school-supplies-pattern-background_23-2150855728.jpg&quot;);
            background-size: cover;
            background-position: center;
          "
        >
          <v-card-title>{{ item.title }}</v-card-title>
          <v-card-title class="text-overline"
            >{{ item.subject }} EXAMINATION</v-card-title
          >
          <v-divider />
          <v-card-subtitle>
            <h5>
              <strong>
                DATE:
                {{
                  formatDateTime(
                    item.examMetaInfo.examDate,
                    item.examMetaInfo.examStartTime
                  )
                }}
                | START: {{ item.examMetaInfo.examStartTime }} | DURATION:
                {{ item.examMetaInfo.examDuration }} | END:
                {{ item.examMetaInfo.examEndTime }}</strong
              >
            </h5>
          </v-card-subtitle>
          <v-card-text>{{ item.description }}</v-card-text>
          <v-row>
            <v-col>
              <v-chip-group column active-class="v-chip--active">
                <!-- Iterate over test metadata -->
                <v-chip
                  v-for="(metaItem, index) in item.examMetaInfo.testMeta"
                  :key="index"
                  color="primary"
                  outlined
                  class="ma-2"
                >
                  Type: <strong> {{ metaItem.testType }} </strong> | Number of
                  Questions: <strong> {{ metaItem.numberOfQuestions }} </strong>
                </v-chip>
              </v-chip-group>
            </v-col>
          </v-row>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn @click="getLinkDialog=true">Participants link</v-btn>
            <v-btn @click="handleActionClick(item)">Start Exam</v-btn>
            <v-spacer />
            <v-btn
              @click=" 
                manageExamParticipantsDialog = true;
              "
              >Manage Participants</v-btn
            >
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <!-- QR Link -->
    <v-dialog v-model="getLinkDialog" width="auto">
      <v-card min-width="540">
        <v-card-text
          ><v-icon class="mr-2">mdi-multicast</v-icon> Share enrollment link
          with participants</v-card-text
        >
        <v-divider />
        <div ref="participantInvite">
          <img
            style="height: 12rem; cursor: pointer"
            :src="qrCodeUrl"
            alt="QR Code"
          />
          <p class="ma-4">{{ urlData }}</p>
          <v-divider />
        </div>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="ms-auto"
            text="Save"
            color="info"
            variant="outlined"
            width="7.5rem"
            @click="saveLink"
            ><v-icon class="mr-2">mdi-cloud-download-outline</v-icon>SAVE</v-btn
          >
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Participant management dialog -->
    <v-dialog v-model="manageExamParticipantsDialog" max-width="80%">
      <v-card>
        <v-card-title class="headline">
          <v-icon class="mr-2">mdi-account-multiple-check-outline</v-icon>
          Manage Participant Requests
        </v-card-title>

        <v-card-subtitle>
          <v-divider></v-divider>
        </v-card-subtitle>

        <v-card-text>
          <!-- PENDING requests -->
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-icon class="mr-2">mdi-clock-outline</v-icon>
                PENDING Participant Requests
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col
                    v-for="(request, index) in pendingRequests"
                    :key="index"
                    cols="12"
                    sm="6"
                    md="4"
                    class="d-flex align-center justify-center"
                  >
                    <v-card
                      class="ma-2"
                      max-height="6rem"
                      width="100%"
                      color="#f2f2f2"
                    >
                      <v-card-text>
                        <div class="font-weight-bold">
                          Name: {{ request.participantName }}
                        </div>
                        <v-divider></v-divider>
                        <v-card-actions>
                          <v-btn
                            color="green"
                            @click="handleAcceptRequest(request)"
                          >
                            Accept
                          </v-btn>
                          <v-btn
                            color="red"
                            @click="handleRejectRequest(request)"
                          >
                            Reject
                          </v-btn>
                        </v-card-actions>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <!-- REJECTED requests with RESTORE -->
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-icon class="mr-2">mdi-cancel</v-icon>
                REJECTED Participant Requests
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col
                    v-for="(request, index) in rejectedRequests"
                    :key="index"
                    cols="12"
                    sm="6"
                    md="4"
                    class="d-flex align-center justify-center"
                  >
                    <v-card class="ma-2">
                      <v-card-text>
                        <div class="font-weight-bold">
                          Name: {{ request.participantName }}
                        </div>
                        <v-divider></v-divider>
                        <v-card-actions>
                          <v-btn
                            color="orange"
                            @click="handleRestoreRequest(request)"
                          >
                            Restore to Pending
                          </v-btn>
                        </v-card-actions>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <!-- ACCEPTED requests with UNDO -->
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-icon class="mr-2">mdi-check-circle-outline</v-icon>
                ACCEPTED Participant Requests
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col
                    v-for="(request, index) in acceptedRequests"
                    :key="index"
                    cols="12"
                    sm="6"
                    md="4"
                    class="d-flex align-center justify-center"
                  >
                    <v-card class="ma-2">
                      <v-card-text>
                        <div class="font-weight-bold">
                          Name: {{ request.participantName }}
                        </div>
                        <v-divider></v-divider>
                        <v-card-actions>
                          <v-btn color="red" @click="handleUndoAccept(request)">
                            Undo Accept
                          </v-btn>
                        </v-card-actions>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="outlined"
            :disabled="
              acceptedRequests.length === 0 
            "
            @click="saveParticipantsList"
          >
            <v-icon class="mr-2">mdi-update</v-icon>
            SUBMIT ALL CHANGES
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Participant  //   const acceptedRequests = ref([]);
  // const rejectedRequests = ref([]); management dialog -->
  </v-container>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import QRCode from "qrcode";
import axios from "axios";
import jsPDF from "jspdf";
import { useResourceStore } from "@/stores/resources";

const resourceStore = useResourceStore();
const getLinkDialog = ref(false);
const manageExamParticipantsDialog = ref(false);
const qrCodeUrl = ref("");
const parsedExams = ref([]);
const apiUrl = import.meta.env.VITE_CLIENT_URL;
const serverUrl = import.meta.env.VITE_BASE_URL;
const parsedParticipantsData = ref([]);

const urlData = computed(() => {
  return `${apiUrl}/exam/participant?sessionId=${parsedExams.value.length > 0 ? parsedExams.value[0].sessionId : ""}`;
});
const saveLink = () => {
  const padding = 4;
  const lineThickness = 0.1;

  const doc = new jsPDF();

  doc.addImage(qrCodeUrl.value, "PNG", padding, padding + 10, 180, 160);

  const lineY = padding + 180 + 5;
  doc.setLineWidth(lineThickness);
  doc.line(padding, lineY, 205, lineY);

  const textY = lineY + 10;
  doc.text("Participants enrollment link (Via NEMBio Exams).", padding, textY);
  doc.text(urlData.value, padding, textY + 10);

  const logoUrl =
    "https://png.pngtree.com/png-vector/20230227/ourmid/pngtree-block-blue-logo-png-image_6621541.png";
  const logoWidth = 67;
  const logoHeight = 60;
  const logoX = padding;
  const logoY = textY + 20;

  doc.addImage(logoUrl, "PNG", logoX, logoY, logoWidth, logoHeight);

  doc.save(`participant_link_${parsedExams.value[0].sessionId}.pdf`);

  getLinkDialog.value = false;
};

// Arrays to manage requests
const pendingRequests = computed(() =>
  parsedParticipantsData.value.filter(
    (request) => request.requestStatus === "PENDING"
  )
);
const acceptedRequests = ref([]);
const rejectedRequests = ref([]);

// TIME
function formatDateTime(dateString, newTime) {
  // Parse the date string into a Date object
  const date = new Date(dateString);

  // Split the newTime into hours and minutes
  const [hours, minutes] = newTime.split(":").map(Number);

  // Set the new hours and minutes
  date.setUTCHours(hours - 3, minutes, 0, 0);

  // Define options for date formatting
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Africa/Nairobi", // East Africa Time (EAT)
  };

  // Format the date into the desired string format
  return date
    .toLocaleString("en-US", options)
    .replace("AM", "AM (EAT)")
    .replace("PM", "PM (EAT)");
}

// Consolidated function to update request status and move between lists
const updateRequestStatus = (request, newStatus, fromList, toList) => {
  request.requestStatus = newStatus;
  fromList.value = fromList.value.filter((r) => r.userId !== request.userId);
  toList.value.push(request);
};

// Manage acceptance and rejection
const handleAcceptRequest = (request) => {
  updateRequestStatus(request, "ACCEPTED", pendingRequests, acceptedRequests);
};

const handleRejectRequest = (request) => {
  updateRequestStatus(request, "REJECTED", pendingRequests, rejectedRequests);
};

// Restore a rejected request to pending
const handleRestoreRequest = (request) => {
  updateRequestStatus(request, "PENDING", rejectedRequests, pendingRequests);
};

// Undo an accepted request to pending
const handleUndoAccept = (request) => {
  updateRequestStatus(request, "PENDING", acceptedRequests, pendingRequests);
};

// Save final participant list
const saveParticipantsList = async () => {
  //   const acceptedRequests = ref([]);
  // const rejectedRequests = ref([]);
  //
  const data = {
    sessionId: parsedExams.value[0].sessionId,
    participantsList: JSON.stringify(
      { ACCEPTED: acceptedRequests.value },
      { REJECTED: rejectedRequests.value }
    ),
  };

  try {
    const response = await axios.post(
      `${serverUrl}/resources/uploads/exam/enroll`,
      data
    );
    console.log("Enrollment request submitted successfully:", response);
  } catch (error) {
    console.error("Error saving participant list:", error);
  }
};

// Parse the exams data
onMounted(() => {
  parsedExams.value = JSON.parse(resourceStore.exams);
  if (parsedExams.value.length > 0) {
    generateQRCode(parsedExams.value[0].sessionId);
    parsedParticipantsData.value = JSON.parse(parsedExams.value[0].participants)// parseJsonArray();
  }
});

// Parse participant JSON data
function parseJsonArray() {
  return parsedExams.value[0].participants
    .map((item) => {
      try {
        return JSON.parse(item);
      } catch (error) {
        console.error("Invalid JSON format:", item);
        return null;
      }
    })
    .filter((item) => item !== null); // Remove null entries
}

// Generate QR code
const generateQRCode = async (sessionId) => {
  try {
    const data = `${apiUrl}/exam/participant?sessionId=${sessionId}`;
    const url = await QRCode.toDataURL(data, { type: "png" });
    qrCodeUrl.value = url;
  } catch (err) {
    console.error(err);
  }
};
</script>
