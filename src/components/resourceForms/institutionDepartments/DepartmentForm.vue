<template>
  <v-card
    prepend-icon="mdi-office-building"
    title="Create Department"
  >
    <v-card-text>
      <v-row dense>
        <!-- Department Name -->
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            label="Department Name*"
            v-model="form.name"
            required
          ></v-text-field>
        </v-col>

        <!-- Department ID -->
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            label="Department ID*"
            v-model="form.departmentId"
            required
          ></v-text-field>
        </v-col>

        <!-- Parent Institution -->
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            label="Parent Institution*"
            v-model="form.parent_institution"
            required
          ></v-text-field>
        </v-col>

        <!-- Phone Number -->
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            label="Phone Number*"
            v-model="form.phone_number"
            required
          ></v-text-field>
        </v-col>

        <!-- Email Address -->
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            label="Email Address*"
            v-model="form.email_address"
            required
            type="email"
          ></v-text-field>
        </v-col>

        <!-- Faculty Members (Autocomplete for existing users) -->
        <v-col
          cols="12"
          md="6"
        >
          <v-autocomplete
            label="Add Faculty*"
            :items="userOptions"
            v-model="form.faculty"
            item-text="name"
            item-value="id"
            multiple
            chips
            required
            hint="Select faculty members"
            persistent-hint
          ></v-autocomplete>
        </v-col>

        <!-- Programs (Autocomplete for existing programs) -->
        <v-col
          cols="12"
          md="6"
        >
          <v-autocomplete
            label="Add Programs*"
            :items="programOptions"
            v-model="form.programs"
            item-text="name"
            item-value="id"
            multiple
            chips
            required
            hint="Select programs offered by the department"
            persistent-hint
          ></v-autocomplete>
        </v-col>

        <!-- Students (Autocomplete for existing users) -->
        <v-col
          cols="12"
          md="6"
        >
          <v-autocomplete
            label="Add Students*"
            :items="userOptions"
            v-model="form.students"
            item-text="name"
            item-value="id"
            multiple
            chips
            required
            hint="Select students enrolled in the department"
            persistent-hint
          ></v-autocomplete>
        </v-col>
      </v-row>

      <small class="text-caption text-medium-emphasis">*indicates required field</small>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn
        text="Close"
        variant="plain"
        @click="dialog.value = false"
      ></v-btn>

      <v-btn
        color="primary"
        text="Save"
        variant="tonal"
        @click="saveDepartment"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref, reactive } from 'vue';

export default {
  setup() {
    const dialog = ref(false);

    const form = reactive({
      departmentId: '',
      name: '',
      parent_institution: '',
      phone_number: '',
      email_address: '',
      faculty: [],
      programs: [],
      students: []
    });

    const userOptions = ref([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
      { id: 3, name: 'Samuel Green' }
    ]);

    const programOptions = ref([
      { id: 1, name: 'Computer Science' },
      { id: 2, name: 'Mathematics' },
      { id: 3, name: 'Physics' }
    ]);

    const saveDepartment = () => {
      console.log('Saved Department:', form);
      // Implement the actual save logic (e.g., API call)
      dialog.value = false;
    };

    return {
      dialog,
      form,
      userOptions,
      programOptions,
      saveDepartment
    };
  }
};
</script>
