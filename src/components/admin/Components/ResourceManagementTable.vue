<template>
  <v-container>
    <v-progress-linear
      color="#08487f"
      v-if="isLoading"
      indeterminate
      class="mb-2"
    ></v-progress-linear>
    <v-data-table
      :headers="headers"
      v-if="!isLoading"
      :items="resourceStore.resources"
      :sort-by="[{ key: 'title', order: 'asc' }]"
    >
      <template v-slot:item.averageRating="{ value }">
        <v-chip :color="getAverageRatingColor(value)">
          {{ getAverageRatingText(value) }} ({{ value }})
        </v-chip>
      </template>
      <template v-slot:item.isPublished="{ value }">
        <v-chip :color="getColor(value)">
          {{ value == false ? "Not published" : "Published" }}
        </v-chip>
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Resource Management</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card width="54rem">
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                        disabled
                        v-model="editedItem.title"
                        label="Resource title"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                        disabled
                        v-model="editedItem.topic"
                        label="Topic"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-select
                        :items="getStatus(editedItem)"
                        v-model="resourceTask"
                        label="Publication status"
                      ></v-select>
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                        disabled
                        v-model="editedItem.contentType"
                        label="Content type"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                        disabled
                        v-model="editedItem.subject"
                        label="Subject"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  class="mr-4"
                  color="blue-darken-1"
                  variant="text"
                  @click="close"
                  >Cancel</v-btn
                >
                <v-btn
                  variant="outlined"
                  width="12rem"
                  color="primary"
                  @click="save"
                  >Save status</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon color="grey" class="me-2" size="small" @click="viewItem(item)"
          >mdi-eye</v-icon
        >
        <v-icon color="info" class="me-2" size="small" @click="editItem(item)"
          >mdi-pencil</v-icon
        >
        <v-icon color="red" size="small" @click="deleteItem(item)"
          >mdi-delete</v-icon
        >
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import {
  ref,
  reactive,
  onBeforeMount,
  computed,
  nextTick,
  onMounted,
} from "vue";
import { useResourceStore } from "@/stores/resources";
const resources = ref([]);
const isLoading = ref(false);

import { useRouter } from "vue-router";
const router = useRouter();
const resourceStore = useResourceStore();
onBeforeMount(async () => {
  isLoading.value = true;
  await resourceStore.getAllResources();
  resources.value = resourceStore.resources;
  isLoading.value = false;
});
function getColor(status) {
  if (status == true) return "green";
  else return "red";
}

// getAverageRatingColor(value)"
//   {{ getAverageRatingText(item) }}

function getAverageRatingColor(rating) {
  if (rating > 2.8) return "green";
  if (rating > 1.5 && rating < 2.8) return "orange";
  return "red";
}

function getAverageRatingText(rating) {
  if (rating > 2.8) return "Good rating";
  if (rating > 1.5 && rating < 2.8) return "Fairly rated";
  return "Poorly rated";
}

function getStatus(resource) {
  let array = ["Publish", "Unpublish"];
  if (resource.isPublished === true) {
    array = ["Unpublish"];
  }
  if (resource.isPublished === false) {
    array = ["Publish"];
  }
  return array;
}
const dialog = ref(false);
const dialogDelete = ref(false);
const headers = [
  {
    title: "Resource title",
    align: "start",
    sortable: false,
    key: "title",
  },
  { title: "Topic", key: "topic" }, // averageRating
  { title: "Rating", key: "averageRating" },
  { title: "Type", key: "contentType" },
  { title: "Subject", key: "subject" },
  { title: "Publication status", key: "isPublished" },
  { title: "Actions", key: "actions", sortable: false },
];
const editedIndex = ref(-1);
const resourceTask = ref("");
const editedItem = reactive({
  title: "",
  topic: "",
  contentType: "",
  subject: "",
});
const defaultItem = {
  title: "",
  topic: "",
  contentType: "",
  subject: "",
};

const formTitle = computed(() =>
  editedIndex.value === -1 ? "New Item" : "Edit Item"
);

const initialize = () => {
  resources.value = []; // Replace with actual resource fetching logic
};

const editItem = (item) => {
  editedIndex.value = resources.value.indexOf(item);
  Object.assign(editedItem, item);
  dialog.value = true;
};
const viewItem = (item) => {
  console.log("Resource:", item);
  localStorage.setItem(
    "queryParams",
    JSON.stringify([{ ...[], resourceType: item.contentType }])
  );
  router.push(
    item.contentType === "TEST" ? "/exam/mocks" : "/dashboard/player"
  );
};
const deleteItem = (item) => {
  editedIndex.value = resources.value.indexOf(item);
  Object.assign(editedItem, item);
  dialogDelete.value = true;
};

const deleteItemConfirm = () => {
  resources.value.splice(editedIndex.value, 1);
  closeDelete();
};

const close = () => {
  dialog.value = false;
  nextTick(() => {
    Object.assign(editedItem, defaultItem);
    editedIndex.value = -1;
  });
};

const closeDelete = () => {
  dialogDelete.value = false;
  nextTick(() => {
    Object.assign(editedItem, defaultItem);
    editedIndex.value = -1;
  });
};

const save = async () => {
  try {
    isLoading.value = true;

    // Toggle the publication status
    await resourceStore.togglePublicationStatus({
      resourceStatus: resourceTask.value,
      resourceId: editedItem.id,
    });

    // Fetch the updated list of resources
    window.location.reload();
  } catch (error) {
    console.error("Error saving resource:", error);
  }
};

onMounted(() => {
  initialize();
});
</script>
