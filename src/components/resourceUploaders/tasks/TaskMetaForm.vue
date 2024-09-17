<template>
  <v-container>
    <v-stepper v-model="step" vertical>
      <!-- Assignment Details Step -->
      <v-stepper-step step="1" header="Assignment Details">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          v-if="showingAssignmentCreator"
        >
          <v-select
            v-model="assignmentType"
            :items="assignmentTypes"
            label="Select Assignment Type"
            required
            :menu-props="{ maxHeight: 'none' }"
          ></v-select>

          <v-select
            v-model="assignmentDuration"
            :items="assignmentDurationOptions"
            label="Select Task Duration"
            required
            :menu-props="{ maxHeight: 'none' }"
          ></v-select>
          <p>Deadline: {{ getDeadline(assignmentDuration) }}</p>
          <v-divider />
          <v-text-field
            v-model="assignmentTitle"
            label="Assignment Title"
            required
          ></v-text-field>

          <v-textarea
            v-model="assignmentDescription"
            label="Assignment Description"
            required
          ></v-textarea>

          <v-card-actions>
            <v-btn @click="showAssignmentCreator">Submit Assignment</v-btn>
          </v-card-actions>
        </v-form>
      </v-stepper-step>

      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="outlined"
          width="7.5rem"
          @click="submitAssignment"
          :disabled="!isAssignmentValid"
        >
          Submit
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-stepper>

    <v-dialog max-width="500" v-model="uploadingTaskSet">
      <v-card title="Upload Assignment Set Questions">
        <v-divider />
        <TestUploader />
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup>
import { ref, computed } from "vue";

const valid = ref(false);
const uploadingTaskSet = ref(false);
const step = ref(1);
const assignmentType = ref("");
const assignmentTitle = ref("");
const assignmentDescription = ref("");
const assignmentDuration = ref("1 week");
const assignmentTypes = ["Quiz Tasks", "Project", "Essay", "Research"];
const assignmentDurationOptions = [
  "1 day",
  "2 days",
  "1 week",
  "2 weeks",
  "3 weeks",
  "4 weeks",
  "3 months - Term Paper",
];

//
function getDeadline(duration) {
  const now = new Date();
  let deadline;

  switch (duration) {
    case "1 day":
      deadline = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Add 1 day
      break;
    case "2 days":
      deadline = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // Add 2 days
      break;
    case "1 week":
      deadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Add 1 week
      break;
    case "2 weeks":
      deadline = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // Add 2 weeks
      break;
    case "3 weeks":
      deadline = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000); // Add 3 weeks
      break;
    case "4 weeks":
      deadline = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000); // Add 4 weeks
      break;
    case "3 months - Term Paper":
      deadline = new Date(now.setMonth(now.getMonth() + 3)); // Add 3 months
      break;
    default:
      throw new Error("Unknown duration");
  }

  return deadline;
}
const showingAssignmentCreator = ref(true);

const isAssignmentValid = computed(() => {
  return (
    assignmentType.value !== "" &&
    assignmentTitle.value !== "" &&
    assignmentDescription.value !== "" &&
    assignmentDuration.value !== ""
  );
});

function submitAssignment() {
  if (valid.value) {
    const formData = {
      assignmentType: assignmentType.value,
      assignmentTitle: assignmentTitle.value,
      assignmentDescription: assignmentDescription.value,
      assignmentDuration: assignmentDuration.value,
    };
    console.log("Assignment Submitted", formData);
    // You can replace this with an actual form submission logic
    localStorage.setItem("assignmentMetaInfo", JSON.stringify(formData));
    uploadingTaskSet.value = true;
  }
}
</script>
