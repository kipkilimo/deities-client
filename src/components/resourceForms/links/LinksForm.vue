<template>
  <v-container>
    <v-form ref="urlForm" v-model="valid" @submit.prevent="saveUrls">
      <div v-for="(url, index) in urlInputs" :key="index">
        <v-text-field
          v-model="urlInputs[index]"
          :rules="[urlRule]"
          label="Enter External Resources URL Links"
          placeholder="https://example.com"
          required
          type="url"
        />
      </div>

      <v-btn color="primary" @click="saveUrls" :disabled="!valid">
        Save URLs
      </v-btn>
    </v-form>

    <!-- Display Saved URLs -->
    <v-list>
      <v-list-item v-for="(url, index) in savedUrls" :key="index">
        <v-list-item-content>{{ url }}</v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useResourceStore } from "@/stores/patients";

const resourceStore = useResourceStore();
const urlInputs = ref(Array(5).fill(""));
const savedUrls = ref([]);
const valid = ref(false);

const urlRule = (value) => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i" // fragment locator
  );
  return urlPattern.test(value) || "Invalid URL";
};

const saveUrls = async () => {
  if (urlInputs.value.every((url) => urlRule(url) === true)) {
    savedUrls.value.push(...urlInputs.value);
    const paramsObjRaw = [
      {
        resourceId: resourceStore.resource.id,
        resourceContent: JSON.stringify(savedUrls.value),
      },
    ]; 

    const resourceDetails = JSON.stringify(paramsObjRaw);
    await resourceStore.addResourceFormContent({ resourceDetails });
    urlInputs.value = Array(5).fill(""); // Clear form
    window.location.reload();
  }
};
</script>
