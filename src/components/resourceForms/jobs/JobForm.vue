<template>
  <v-form @submit.prevent="handleSubmit" v-model="isFormValid">
    <v-text-field
      label="Job Title"
      v-model="form.title"
      :rules="[rules.required]"
      required
    ></v-text-field>
    <v-textarea
      label="Description"
      v-model="form.description"
      :rules="[rules.required]"
      required
    ></v-textarea>
    <v-text-field
      label="Organization Name"
      v-model="form.organization"
      :rules="[rules.required]"
      required
    ></v-text-field>
    <v-text-field
      label="Department"
      v-model="form.department"
      :rules="[rules.required]"
      required
    ></v-text-field>
    <v-text-field
      label="Hours Per Week"
      type="number"
      v-model="form.hoursPerWeek"
      :rules="[rules.required, rules.number]"
      required
    ></v-text-field>
    <v-text-field
      label="Currency and Rate per Hour"
      type="number"
      v-model="form.payRate"
      :rules="[rules.required, rules.number]"
      required
    ></v-text-field>
    <v-row>
      <v-col>
        <v-date-picker
          hint="Start Date"
          label="Start Date"
          v-model="form.startDate"
          :rules="[rules.required]"
          required
        ></v-date-picker>
        <v-date-picker
          hint="End Date"
          label="End Date"
          v-model="form.endDate"
        ></v-date-picker>
        <v-date-picker
          hint="Application Deadline"
          label="Application Deadline"
          v-model="form.applicationDeadline"
          :rules="[rules.required]"
          required
        ></v-date-picker>
      </v-col>
    </v-row>
    <!-- Requirements Field -->
    <v-text-field
      label="Add Requirement"
      v-model="newRequirement"
      @keyup.enter="addRequirement"
      clearable
    ></v-text-field>
    <v-chip-group v-model="form.requirements" column>
      <v-chip
        v-for="requirement in form.requirements"
        :key="requirement"
        close
        @click:close="removeRequirement(requirement)"
      >
        {{ requirement }}
      </v-chip>
    </v-chip-group>

    <!-- Preferred Qualifications Field -->
    <v-text-field
      label="Add Preferred Qualification"
      v-model="newQualification"
      @keyup.enter="addPreferredQualification"
      clearable
    ></v-text-field>
    <v-chip-group v-model="form.preferredQualifications" column>
      <v-chip
        v-for="qualification in form.preferredQualifications"
        :key="qualification"
        close
        @click:close="removePreferredQualification(qualification)"
      >
        {{ qualification }}
      </v-chip>
    </v-chip-group>
    <v-text-field
      label="Contact Name"
      v-model="form.contactInformation.name"
      :rules="[rules.required]"
      required
    ></v-text-field>
    <v-text-field
      label="Contact Email"
      v-model="form.contactInformation.email"
      :rules="[rules.required, rules.email]"
      required
    ></v-text-field>
    <v-text-field
      label="Contact Phone Number"
      v-model="form.contactInformation.phoneNumber"
      :rules="[rules.phoneNumber]"
    ></v-text-field>
    <v-btn type="submit" color="primary" :disabled="!isFormValid"
      >Submit Job</v-btn
    >
  </v-form>
</template>


<script setup>
import { ref } from "vue";
import { useResourceStore } from "@/stores/resources";

const resourceStore = useResourceStore();
const isFormValid = ref(false);

const form = ref({
  title: "",
  description: "",
  department: "",
  organization: "",
  hoursPerWeek: "",
  payRate: "",
  startDate: new Date(Date.now() + 259200000),
  endDate: new Date(Date.now() + 259200000 * 10 * 9),
  applicationDeadline: new Date(Date.now() + 259200000 * 7),
  requirements: [],
  preferredQualifications: [],
  contactInformation: {
    name: "",
    email: "",
    phoneNumber: "",
  },
});

const newRequirement = ref("");
const newQualification = ref("");

// Functions to add and remove requirements
const addRequirement = () => {
  if (newRequirement.value) {
    form.value.requirements.push(newRequirement.value);
    newRequirement.value = "";
  }
};

const removeRequirement = (requirement) => {
  form.value.requirements = form.value.requirements.filter(
    (item) => item !== requirement
  );
};

// Functions to add and remove preferred qualifications
const addPreferredQualification = () => {
  if (newQualification.value) {
    form.value.preferredQualifications.push(newQualification.value);
    newQualification.value = "";
  }
};

const removePreferredQualification = (qualification) => {
  form.value.preferredQualifications = form.value.preferredQualifications.filter(
    (item) => item !== qualification
  );
};

const handleSubmit = async () => {
  if (isFormValid.value) {
    const paramsObjRaw = [
      {
        resourceId: resourceStore.resource.id,
        resourceContent: JSON.stringify([form.value]),
      },
    ];
    console.log({ paramsObjRaw });

    const resourceDetails = JSON.stringify(paramsObjRaw);
    await resourceStore.addResourceFormContent({ resourceDetails });
    window.location.reload();
  }
};
</script>
