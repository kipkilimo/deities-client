<template>
  <v-card class="pa-4" outlined>
    <qrcode-stream style="max-height: 54vh" @detect="onDetect"></qrcode-stream>

    <v-divider class="my-4" />

    <div v-if="qrCode && !isLoading" class="mb-4">
      <h3>Scanned QR Code:</h3>
      <p>{{ qrCode }}</p>
    </div>

    <v-dialog v-model="authenticating" class="">
      <v-card
        color="transparent"
        flat
        class="py-8 px-6 text-center mx-auto ma-4"
        elevation="12"
        max-width="400"
        width="100%"
      >
        <h3 class="text-h6 mb-4">Login to your Account</h3>

        <v-sheet color="surface">
          <v-otp-input
            v-model="vendorPin"
            type="password"
            variant="solo"
          ></v-otp-input>
        </v-sheet>

        <v-btn
          class="my-4"
          color="purple"
          height="40"
          text="Submit"
          variant="flat"
          width="70%"
          @click="loginVendor"
        >
          Submit
        </v-btn>
        <v-divider />
        <div class="text-caption">
          Didn't receive your pin?
          <p>Call 254700378241</p>
        </div>
      </v-card>
    </v-dialog>

    <div v-if="!authenticating" >
      <v-btn
        v-if="userRole === 'VENDOR'"
        color="success"
        class="mb-2"
        style="color: white"
        prepend-icon="mdi-check-circle"
        @click="redeem"
        variant="outlined"
        :loading="isLoading"
        :disabled="!tokenIsValid || isLoading || responseMessage.length > 1"
      >
        <template v-slot:prepend>
          <v-icon color="success"></v-icon>
        </template>
        Redeem voucher
      </v-btn>

      <v-btn
        v-if="userRole !== 'VENDOR'"
        color="success"
        class="mb-2"
        style="color: white"
        prepend-icon="mdi-check-circle"
        @click="redirectUser"
        variant="outlined"
        :loading="isLoading"
        :disabled="!tokenIsValid || isLoading"
      >
        <template v-slot:prepend>
          <v-icon color="success"></v-icon>
        </template>
        Go to NEMBio App
      </v-btn>
    </div>

    <v-alert
      v-if="status === 'invalid'"
      type="error"
      class="mb-2"
      style="color: white"
    >
      Invalid QR Code or URL
    </v-alert>

    <v-alert
      v-if="responseMessage.length > 1"
      type="success"
      class="mb-2"
      style="color: white"
    >
      Redeem Response: {{ responseMessage }}
    </v-alert>

    <v-alert v-if="errorMsg" type="error" class="mb-2" style="color: white">
      Redeem Response: {{ errorMsg }}
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
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { QrcodeStream } from 'vue-qrcode-reader';
import { useUserStore } from '../../stores/users';

const apiUrl = import.meta.env.VITE_NGROK_URL;

const qrCode = ref('');
const status = ref('');
const responseMessage = ref('');
const errorMsg = ref('');
const userRole = localStorage.getItem('userVendorRole');
const tokenIsValid = ref(false);
const isLoading = ref(false);
const vendorPin = ref('');
const vendorId = ref('');
const authenticating = ref(false);
const processParam = ref('');

const userStore = useUserStore();
const user = computed(() => userStore.user);

const validUrl = computed(() => extractCodeFromUrl(qrCode.value));

const checkUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  processParam.value = urlParams.get('process');
  authenticating.value = processParam.value === 'AUTH';
};

const onDetect = async (decodedString) => {
  qrCode.value = decodedString[0].rawValue;
  if (validUrl.value) {
    isLoading.value = true;
    await fetchStatus();
  } else {
    status.value = 'invalid';
    tokenIsValid.value = false;
    isLoading.value = false;
  }
};

const fetchStatus = async () => {
  try {
    const queryUrl = `${apiUrl}/vendors/check`;;
    const response = await axios.get(queryUrl, {
      params: { code: qrCode.value },
    });

   tokenIsValid.value = response.data.status === 'valid';
  } catch (error) {
    console.error('Error fetching status:', error);
    status.value = 'Error fetching status';
    tokenIsValid.value = false;
  } finally {
    isLoading.value = false;
  }
};

 
 

const redirectUser = () => {
  window.location.href = '/';
};



const redeem = async () => {
  isLoading.value = true;
  errorMsg.value = null;

  const code = extractCodeFromUrl(qrCode.value);
  if (!code) return;

  try {
    const redeemUrl = `${apiUrl}/vendors/redeem`;
    const response = await axios.post(
      redeemUrl,
      { token: code },
      { params: { vendorId: localStorage.getItem("vendorId"), vendorPin: localStorage.getItem("vendorPin")  } }
    );
    responseMessage.value = response.data.message;
  } catch (err) {
    errorMsg.value = err.response?.data?.error || 'An error occurred while trying to redeem the voucher';
  } finally {
    isLoading.value = false;
  }
};

const extractCodeFromUrl = (url) => {
  if (!isValidUrl(url)) {
    console.error('Invalid URL format.');
    return null;
  }

  try {
    const urlObject = new URL(url);
    const expectedDomain = 'e1ea-41-90-65-71.ngrok-free.app';

    if (urlObject.hostname === expectedDomain) {
      return urlObject.searchParams.get('code') || null;
    } else {
      console.error('URL domain does not match the expected domain.');
      return null;
    }
  } catch (error) {
    console.error('Error processing URL:', error);
    return null;
  }
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

onMounted(() => {
  checkUrlParams();
});

watch(qrCode, (newValue) => {
  if (newValue) {
    checkUrlParams();
  }
});
</script>
