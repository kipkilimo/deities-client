<template>
  <v-container fluid>
    <!-- First static row with 8 columns -->
    <v-row>
      <v-col v-for="i in 8" :key="i" cols="3">
        <!-- Static content for each column -->
        <v-card>
          <v-card-title>Card {{ i }}</v-card-title>
          <v-card-subtitle>Details for Card {{ i }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Second dynamic row with variable number of columns -->
    <v-row>
      <v-col v-for="(item, index) in parsedContent" :key="index" :cols="12 / dynamicNumberOfCols">
        <!-- Dynamic Content in each column -->
        <v-card>
          <v-card-title>Dynamic Card {{ index + 1 }}</v-card-title>
          <v-card-subtitle>{{ item.title }}</v-card-subtitle>
          <v-card-actions>
            <!-- Dummy PDF URL for answer key -->
            <v-btn icon :href="item.pdfUrl" target="_blank">
              <v-icon>mdi-file-pdf-box</v-icon> Answer Key
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useResourceStore } from "@/stores/resources";

// Store access to fetch resource content
const resourceStore = useResourceStore();

// Recursive JSON parser function
function useDynamicParseContent(initialContent: any) {
  // Recursive function to parse nested JSON
  const parseNestedJSON = (data: any): any => {
    if (typeof data === "string") {
      try {
        const parsedData = JSON.parse(data);
        return parseNestedJSON(parsedData);
      } catch (e) {
        return data; // Return raw string if not parseable
      }
    } else if (Array.isArray(data)) {
      return data.map(parseNestedJSON);
    } else if (typeof data === "object" && data !== null) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          data[key] = parseNestedJSON(data[key]);
        }
      }
      return data;
    }
    return data;
  };

  // Reactive ref for parsed content
  const parsedContent = ref(parseNestedJSON(initialContent));

  // Function to update content dynamically
  const updateContent = (newContent: any) => {
    parsedContent.value = parseNestedJSON(newContent);
  };

  return {
    parsedContent,
    updateContent,
  };
}

// Initial dummy content (replace with actual resource content later)
const initialContent = resourceStore.resource.content;

// Parse the initial content
const { parsedContent, updateContent } = useDynamicParseContent(initialContent);

// Reactive ref for controlling the dynamic number of columns
const dynamicNumberOfCols = ref(3); // Adjust the number of columns as necessary
console.log({thisExam:parsedContent})
// Watch for changes in parsed content (for debugging purposes)
watch(parsedContent, () => {
  console.log("Parsed Content:", parsedContent.value);
});
</script>

<style scoped>
.v-btn {
  color: white;
}

.v-carousel--fullscreen {
  height: 100vh;
}

.v-carousel-item {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
