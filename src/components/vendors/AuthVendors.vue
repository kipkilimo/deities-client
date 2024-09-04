<template>
  <v-card class="pa-4" outlined>
    <!-- QR Code Scanner -->
    <qrcode-stream style="max-height: 54vh" @detect="onDetect"></qrcode-stream>

    <v-divider class="my-4" />

    <!-- Display scanned QR code -->
    <div v-if="qrCode" class="mb-4">
      <h3>Scanned QR Code:</h3>
      <p>{{ qrCode }}</p>
      <p>{{ status }}</p>
    </div>

    <!-- PIN Input field (only shown if QR code is valid) -->
    <v-text-field
      v-if="tokenIsValid"
      label="Enter PIN"
      type="password"
      v-model="vendorPin"
      prepend-icon="mdi-lock"
      :disabled="isLoading"
    ></v-text-field>

    <!-- Login button (only shown if QR code is valid and PIN is entered) -->
    <v-btn
      v-if="tokenIsValid"
      color="success"
      class="mb-2"
      style="color: white"
      prepend-icon="mdi-check-circle"
      @click="login"
      variant="outlined"
      :loading="isLoading"
      :disabled="!vendorPin || isLoading"
    >
      <template v-slot:prepend>
        <v-icon color="success"></v-icon>
      </template>
      Login
    </v-btn>

    <!-- Error or Success Alerts -->
    <v-alert
      v-if="status === 'invalid'"
      type="error"
      class="mb-2"
      style="color: white"
    >
      Invalid QR Code or URL
    </v-alert>

    <v-alert
      v-if="authMessage.length > 0"
      :type="authSuccess ? 'success' : 'error'"
      class="mb-2"
      style="color: white"
    >
      {{ authMessage }}
    </v-alert>

    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="primary"
      class="my-4"
    ></v-progress-linear>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { QrcodeStream } from "vue-qrcode-reader";
import { useUserStore } from "../../stores/users";
const apiUrl = import.meta.env.VITE_NGROK_SERVER_URL;
 const clientUrl = import.meta.env.VITE_NGROK_CLIENT_URL;
 
const qrCode = ref("");
const status = ref("");
const vendorPin = ref("");
const isLoading = ref(false);
const tokenIsValid = ref(false);
const authMessage = ref("");
const authSuccess = ref(false);

// Handle QR Code detection
const onDetect = async (decodedString) => {
  qrCode.value = decodedString[0].rawValue;

  isLoading.value = true;
  try {
    // Extract the base URL and the accessToken from qrCode.value
    const url = new URL(qrCode.value);
    const accessToken = url.searchParams.get("accessToken");

    // Make the Axios GET request with the extracted accessToken as a query parameter
    const response = await axios.get(url.origin + url.pathname, {
      params: {
        accessToken,
      },
    });

    status.value = response;
  } catch (error) {
   status.value = error;
    // window.location.reload(); // Corrected method name
  } finally {
    // window.location.reload(); // Corrected method name
  }
};

// Handle login after PIN entry
const login = async () => {
  isLoading.value = true;
  try {
    const urlObject = new URL(qrCode.value);
    const code = urlObject.searchParams.get("code");

    const loginResponse = await axios.post(
      `${apiUrl}/vendors/login`,
      { token: code },
      {
        params: {
          vendorPin: vendorPin.value,
        },
      }
    );

    if (loginResponse.data.success) {
      localStorage.setItem("vendorId", loginResponse.data.vendorId);
      localStorage.setItem("vendorPin", vendorPin.value);
      localStorage.setItem("userVendorRole", "VENDOR");

      authSuccess.value = true;
      authMessage.value = "Authentication successful!";
    } else {
      authSuccess.value = false;
      authMessage.value = "Authentication failed!";
    }
  } catch (error) {
    console.error("Error during login:", error);
    authSuccess.value = false;
    authMessage.value = "Authentication failed!";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.v-card {
  max-width: 500px;
  margin: 0 auto;
}

.v-btn {
  width: 100%;
}

.v-alert {
  margin-top: 1rem;
}
</style>
