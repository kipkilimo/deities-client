<template>
  <v-container>
    <v-row justify="center">
      <!-- User Profile Card -->
      <v-col cols="12" md="12">
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
            <!-- <v-row>
              <v-col cols="12" sm="4">
                <h3>{{ user?.name || "Guest" }}</h3>
                <p>{{ user?.email || "Not Available" }}</p>
              </v-col>
            </v-row> -->

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

          <v-card-actions>
            <v-btn
              color="primary"
              @click="
                (managingResources = true),
                  (managingUsers = false),
                  (managingPayments = false)
              "
              text="Manage Resources"
            ></v-btn>

            <v-btn
              color="brown"
              @click="
                (managingResources = false),
                  (managingUsers = true),
                  (managingPayments = false)
              "
              text="Manage Users"
            ></v-btn>
            <v-btn
              color="purple"
              @click="
                (managingResources = false),
                  (managingUsers = false),
                  (managingPayments = true)
              "
              text="Manage Payments"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Account Settings -->
      <v-col cols="12" md="12">
        <v-card width="99.96%" v-if="managingResources">
          <v-card-text>
            <v-scroll-y-wrapper>
              <ResourceManagementTable />
            </v-scroll-y-wrapper>
          </v-card-text>
        </v-card>
        <v-card width="99.96%" v-if="managingUsers">
          <v-card-text>
            <v-scroll-y-wrapper>
              <UserManagementTable />
            </v-scroll-y-wrapper>
          </v-card-text>
        </v-card>
        <v-card width="99.96%" v-if="managingPayments">
          <v-card-text>
            <v-scroll-y-wrapper>
              <PaymentsManagementTable />
            </v-scroll-y-wrapper>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Activity Section -->

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
const managingResources = ref(true);
const managingUsers = ref(false);
const managingPayments = ref(false);

const manageDepartmentDialog = ref(false);
const manageDiscussionGroupDialog = ref(false);

import CryptoJS from "crypto-js";

import { useStaffStore } from "@/stores/staff";
import PaymentsManagementTable from "@/components/admin/Components/PaymentsManagementTable.vue";
onBeforeMount(async () => {
  const userStore = useStaffStore();
  await userStore.getCurrentUser(userId.value || "");
});
function closeDialog() {
  console.log("Closing dialog...");
  addDiscussionGroupDialog.value = false;
  manageDiscussionGroupDialog.value = false;
  addDepartmentDialog.value = false;
  manageDepartmentDialog.value = false;
}
const user = useStaffStore().user;
// Import the CryptoJS library2222222
function generateMD5Hash(size = 200) {
  // Generate a random string
  const randomString =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  // Create the MD5 hash of the random email (using the random string as email)
  const emailHash = CryptoJS.MD5(useStaffStore().user.personalInfo.email);

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
