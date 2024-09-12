<template>
  <v-form @submit.prevent="submitModel" v-model="isFormValid">
    <!-- Model Name -->
    <v-text-field
      v-model="model.modelName"
      label="Model Name"
      :rules="[rules.required]"
      required
    ></v-text-field>

    <!-- Description -->
    <v-textarea
      v-model="model.description"
      label="Description"
      :rules="[rules.required]"
      required
    ></v-textarea>

    <!-- Research Paper URL -->
    <v-text-field
      v-model="model.researchPaperUrl"
      label="Research Paper URL"
      :rules="[rules.required, rules.url]"
      required
    ></v-text-field>

    <!-- Dynamic Parameters -->
    <div v-for="(param, index) in model.parameters" :key="index">
      <!-- Parameter Name -->
      <v-text-field
        v-model="param.name"
        label="Parameter Name"
        :rules="[rules.required]"
        required
      ></v-text-field>

      <!-- Parameter Type -->
      <v-select
        v-model="param.type"
        :items="['number', 'boolean', 'string']"
        label="Parameter Type"
        :rules="[rules.required]"
        required
      ></v-select>

      <!-- Parameter Description -->
      <v-textarea
        v-model="param.description"
        label="Parameter Description"
        :rules="[rules.required]"
        required
      ></v-textarea>

      <!-- Optional Default Value -->
      <v-text-field
        v-if="param.type === 'number' || param.type === 'string'"
        v-model="param.default"
        label="Default Value"
      ></v-text-field>

      <v-checkbox
        v-if="param.type === 'boolean'"
        v-model="param.default"
        label="Default Value"
      ></v-checkbox>
    </div>

    <!-- Regression Formula -->
    <v-textarea
      v-model="model.regressionFormula"
      label="Regression Formula"
      :rules="[rules.required]"
      required
    ></v-textarea>

    <!-- Result Interpretation -->
    <v-text-field
      v-model="model.resultInterpretation.lowRiskThreshold"
      label="Low Risk Threshold"
      type="number"
      :rules="[rules.required, rules.number]"
      required
    ></v-text-field>

    <v-text-field
      v-model="model.resultInterpretation.highRiskThreshold"
      label="High Risk Threshold"
      type="number"
      :rules="[rules.required, rules.number]"
      required
    ></v-text-field>

    <v-textarea
      v-model="model.resultInterpretation.interpretationGuidelines[0]"
      label="Interpretation Guidelines"
      :rules="[rules.required]"
      required
    ></v-textarea>

    <!-- Submit Button -->
    <v-btn type="submit" color="primary" :disabled="!isFormValid">
      Submit Model
    </v-btn>
  </v-form>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useResourceStore } from "@/stores/resources";

const resourceStore = useResourceStore();

const isFormValid = ref(false);

const model = reactive({
  modelName: "",
  description: "",
  researchPaperUrl: "",
  parameters: [
    {
      name: "",
      type: "string",
      description: "",
      default: "",
    },
  ],
  regressionFormula: "",
  resultInterpretation: {
    lowRiskThreshold: null,
    highRiskThreshold: null,
    interpretationGuidelines: [""],
  },
});

const rules = {
  required: (value) => !!value || "Required.",
  number: (value) => !isNaN(value) || "Must be a number.",
  url: (value) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return pattern.test(value) || "Invalid URL.";
  },
};

const submitModel = async () => {
  if (isFormValid.value) {
    const paramsObjRaw = [
      {
        resourceId: resourceStore.resource.id,
        resourceContent: JSON.stringify([model], null, 2),
      },
    ];
    console.log({ paramsObjRaw });

    const resourceDetails = JSON.stringify(paramsObjRaw);
    await resourceStore.addResourceFormContent({ resourceDetails });
    window.location.reload();
  }
};
</script>
