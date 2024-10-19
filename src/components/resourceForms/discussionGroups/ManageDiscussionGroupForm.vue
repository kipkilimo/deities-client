<template>
  <v-card prepend-icon="mdi-account-group" title="Create Discussion Group">
    <v-card-text>
      <v-row dense>
        <!-- Discussion Group Name -->
        <v-col cols="12" md="5">
          <v-text-field
            label="Discussion Group Name*"
            v-model="form.name"
            required
          ></v-text-field>
        </v-col>

        <!-- Discussion Group ID -->
        <v-col cols="12" md="7">
          <v-text-field
            label="Discussion description*"
            v-model="form.program"
            required
          ></v-text-field>
        </v-col>

        <!-- Members (Autocomplete to select from existing users) -->

        <!-- Programs (Text field for program details) -->
        <v-col cols="12" sm="12">
          <v-textarea
            label="Provide at least 2 valid emails, separated by commas, up to a max of 20 emails*" 
            v-model="form.members"
            item-text="name" 
            multiple
            chips
            required 
            :rules="[emailValidation]"
            hint="Add members to the group."
            persistent-hint
          ></v-textarea>
        </v-col>
      </v-row>

      <small class="text-caption text-medium-emphasis"
        >*indicates required field</small
      >
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn text="Close" variant="plain" @click="$emit('closeDialog')"></v-btn>

      <v-btn
        color="primary"
        text="Save"
        variant="tonal"
        @click="saveDiscussionGroup"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref, reactive } from "vue";

export default {
  setup() {
    const dialog = ref(false);

    const form = reactive({
      program: "",
      name: "",
      members: [],
      programs: "",
    });

    const userOptions = ref([
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
      { id: 3, name: "Samuel Green" },
    ]);

    const saveDiscussionGroup = () => {
      console.log("Saved Discussion Group:", form);
      // Implement the actual save logic (e.g., API call)
      dialog.value = false;
    };

    return {
      dialog,
      form,
      userOptions,
      saveDiscussionGroup,
    };
  },
};
</script>
