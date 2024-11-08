<template>
  <v-container>
    <v-row justify="center">
      <!-- User Profile Card -->
      <v-col cols="12" md="6">
        <v-card>
          <v-row>
            <v-col cols="2">
              <div class="avatar-wrapper ma-1 mt-4 ml-4">
                <v-avatar size="63">
                  <img
                    :src="generateMD5Hash() || '/path/to/default/avatar.jpg'"
                  />
                </v-avatar>
              </div>
            </v-col>

            <v-col class="ma-1" cols="7">
              <v-card-title class="text-h5">
                {{ user?.personalInfo?.fullName || "Guest User" }}
              </v-card-title>
              <v-card-title class="text-overline">
                ROLE: {{ user?.role || "Guest" }}
              </v-card-title>
            </v-col>
          </v-row>

          <v-divider></v-divider>

          <v-card-text>
            <v-row>
              <v-col cols="12" sm="4">
                <h3>{{ user?.name || "Guest" }}</h3>
                <p>{{ user?.email || "Not Available" }}</p>
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-row>
              <v-col>
                <v-btn
                  class="mt-3"
                  color="primary"
                  @click="editProfile"
                  :disabled="!user"
                >
                  Edit Profile
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Account Settings -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="text-h5">⚙️ Account Settings</v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            <v-list>
              <v-list-item @click="changePassword" v-if="user">
                <v-list-item-title>Change Password</v-list-item-title>
              </v-list-item>

              <v-divider v-if="user"></v-divider>

              <v-list-item @click="updateEmail" v-if="user">
                <v-list-item-title>Update Email</v-list-item-title>
              </v-list-item>

              <v-divider v-if="user"></v-divider>

              <v-list-item @click="manageNotifications" v-if="user">
                <v-list-item-title>Change Name</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Activity Section -->
    <v-row>
      <v-col md="3" sm="12">
        <v-card>
          <v-card-title class="text-h5">Recent Activity</v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            <v-list v-if="user?.recentActivity && user.recentActivity.length">
              <v-list-item
                v-for="(activity, index) in user.recentActivity"
                :key="index"
              >
                <v-list-item-content>
                  <v-list-item-title>{{
                    activity.description
                  }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    activity.date
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <p v-else>No recent activity available.</p>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Faculty or Student Section Based on Role -->
      <v-col md="2" sm="12" v-if="user?.role === 'FACULTY'">
        <v-card>
          <v-card-title class="text-h5">
            My Department
            <v-avatar
              class="ma-1"
              @click="manageDepartmentDialog = true"
              color="surface-light"
              size="24"
              style="cursor: pointer"
            >
              📝
            </v-avatar>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text v-if="user?.departments?.length >= 1">
            <p>{{ user.departments[0].name }}</p>
            <v-chip variant="outlined" rounded="2"
              >ID: {{ user.departments[0].departmentId }}</v-chip
            >
          </v-card-text>
          <v-card-text v-else>
            <v-btn
              width="100%"
              color="primary"
              variant="tonal"
              @click="addDepartmentDialog = true"
            >
              <v-icon class="mr-1">mdi-plus</v-icon> Add Department
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col md="2" sm="12" v-if="user?.role === 'STUDENT'">
        <v-card>
          <v-card-title class="text-h5">
            My Discussion Group
            <v-avatar
              class="ma-1"
              @click="manageDiscussionGroupDialog = true"
              color="surface-light"
              size="24"
              style="cursor: pointer"
            >
              📝
            </v-avatar>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text v-if="user?.discussion_groups?.length >= 1">
            <p>{{ user.discussion_groups[0].name }}</p>
            <v-chip variant="outlined" rounded="2"
              >ID: {{ user.discussion_groups[0].discussionGroupId }}</v-chip
            >
          </v-card-text>
          <v-card-text v-else>
            <v-btn
              width="100%"
              color="primary"
              variant="tonal"
              @click="addDiscussionGroupDialog = true"
            >
              <v-icon class="mr-1">mdi-plus</v-icon> Add Discussion Group
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialogs -->
    <v-dialog max-width="63rem" v-model="addDiscussionGroupDialog">
      <v-card>
        <DiscussionGroupForm @closeDialog="closeDialog" />
      </v-card>
    </v-dialog>

    <v-dialog max-width="63rem" v-model="manageDiscussionGroupDialog">
      <v-card>
        <ManageDiscussionGroupForm @closeDialog="closeDialog" />
      </v-card>
    </v-dialog>

    <v-dialog max-width="720" v-model="addDepartmentDialog">
      <v-card>
        <DepartmentForm @closeDialog="closeDialog" />
      </v-card>
    </v-dialog>

    <v-dialog max-width="63rem" v-model="manageDepartmentDialog">
      <v-card>
        <ManageDepartmentForm @closeDialog="closeDialog" />
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup>
import { ref, onBeforeMount, onMounted, watch } from "vue";
const userId = ref(localStorage.getItem("sessionId")); // Retrieve userId from local storage
const addDepartmentDialog = ref(false);
const addDiscussionGroupDialog = ref(false);
// We're sorry, our system has encountered an error. Please try again.

const manageDepartmentDialog = ref(false);
const manageDiscussionGroupDialog = ref(false);

import CryptoJS from "crypto-js";

import { useUserStore } from "@/stores/users";
onBeforeMount(async () => {
  const userStore = useUserStore();
  await userStore.getCurrentUser(userId.value || "");
});
function closeDialog() {
  console.log("Closing dialog...");
  addDiscussionGroupDialog.value = false;
  manageDiscussionGroupDialog.value = false;
  addDepartmentDialog.value = false;
  manageDepartmentDialog.value = false;
}
const user = useUserStore().user;
// Import the CryptoJS library2222222
function generateMD5Hash(size = 200) {
  // Generate a random string
  const randomString =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  // Create the MD5 hash of the random email (using the random string as email)
  const emailHash = CryptoJS.MD5(useUserStore().user.personalInfo.email);

  // Construct the Gravatar URL
  // https://www.gravatar.com/avatar/${emailHash}?s=${size}&d=identicon

  const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?s=36&d=identicon&r=PG`;

  return gravatarUrl;
}

const editProfile = () => {
  // Logic to edit profile
  alert("Edit profile clicked");
};

const changePassword = () => {
  // Logic to change password
  alert("Change password clicked");
};

const updateEmail = () => {
  // Logic to update email
  alert("Update email clicked");
};

const manageNotifications = () => {
  // Logic to manage notifications
  alert("Manage notifications clicked");
};

const deleteAccount = () => {
  // Logic to delete the account
  alert("Delete account clicked");
};

const logout = () => {
  // Logic to log out the user
  alert("Logout clicked");
};
</script>

<style scoped>
.text-h5 {
  font-weight: 500;
}
</style>
<style scoped>
.avatar-wrapper {
  display: inline-block;
  padding: 1px; /* Adjust padding to create a 2px border */
  background: conic-gradient(
    from 45deg,
    #faf9f8,
    #dfe5ee,
    #3366c5,
    #5e0ff0,
    #05deee,
    #047beb,
    #eeedec
  );
  border-radius: 50%; /* Circle shape */
}
</style>
