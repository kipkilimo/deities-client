<template>
  <v-container>
    <!-- Survey Questions -->
    <v-form @submit.prevent="submitSurvey">
      <!-- Introduction -->
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>Baseline Survey for   NEMBi</v-card-title>
            <v-card-subtitle>
              We are gathering feedback on the introduction of   NEMBi, a students
              research platform focusing on research methods in the health
              sciences. Your input will help shape the development of this
              platform.
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>

      <!-- Additional Questions -->

      <v-row>
        <v-col>
          <v-select
            v-model="surveyResponses.yearOfStudy"
            :items="[
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              'MMed',
              'MPH',
              'MSc',
              'Graduate',
            ]"
            label="Level of Study / Course"
            outlined
          ></v-select>
        </v-col>
      </v-row>

      <v-row v-if="surveyResponses.yearOfStudy === 'MMed'">
        <v-col>
          <v-select
            v-model="surveyResponses.mmedSpecialty"
            :items="[
              'Internal Medicine',
              'Pediatrics',
              'Surgery',
              'Obstetrics and Gynecology',
              'Family Medicine',
              'Psychiatry',
              'Emergency Medicine',
              'Orthopedic Surgery',
              'Anesthesiology',
              'Radiology',
              'Radiation Oncology',
              'ENT',
              'Opthalmology',
              'Dermatology',
            ]"
            label="Year of Study"
            outlined
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-textarea
            v-model="surveyResponses.background"
            label="Please describe your background and experience in health sciences research."
            rows="3"
            outlined
          ></v-textarea>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-checkbox
            v-model="surveyResponses.hasThesisTopic"
            label="Do you have a thesis proposal yet?"
          ></v-checkbox>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <!-- Add a label for the radio group -->
          <v-form>
            <!-- Label for the radio group -->
            <v-radio-group
              label="How confident are you with statistical aspects?"
              v-model="surveyResponses.confidenceInStats"
              row
            >
              <v-radio label="Very confident" value="Very Confident" />
              <v-radio label="Confident" value="Confident" />
              <v-radio label="Neutral" value="Neutral" />
              <v-radio label="Not confident" value="Not Confident" />
              <v-radio
                label="Not at all confident"
                value="Not at All Confident"
              />
            </v-radio-group>
          </v-form>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-checkbox
            v-model="surveyResponses.needsMentorship"
            label="Do you need mentorship in your research?"
          ></v-checkbox>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-checkbox
            v-model="surveyResponses.budgetForConsulting"
            label="Do you have a budget for consulting a statistician?"
          ></v-checkbox>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field
            v-model="surveyResponses.budgetAmount"
            label="If yes, how much?"
            type="number"
            outlined
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-checkbox
            v-model="surveyResponses.ethicalReviewAwareness"
            label="Are you aware of the ethical review process for research?"
          ></v-checkbox>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-checkbox
            v-model="surveyResponses.nacostiCertificateAwareness"
            label="Are you aware of the NACOSTI research licence process?"
          ></v-checkbox>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-checkbox
            v-model="surveyResponses.planToPublish"
            label="Do you plan to publish your thesis in a journal?"
          ></v-checkbox>
        </v-col>
      </v-row>

      <!-- Submit Button -->
      <v-row>
        <v-col>
          <v-btn type="submit" color="primary">Save and Continue </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <!-- Save Priority Order Button -->
    <v-row>
      <v-col>
        <v-btn @click="savePriorityOrder" color="primary"
          >Save Topics Priority Order</v-btn
        >
      </v-col>
    </v-row>

    <!-- Draggable Ranking Items -->
    <v-row>
      <v-col v-for="(item, index) in items" :key="item.id" class="mb-2">
        <v-card
          draggable="true"
          @dragstart="dragStart(index)"
          @dragover.prevent
          @drop="drop(index)"
        >
          <v-card-title>{{ item.title }}</v-card-title>
          <v-select
            v-model="item.userRank"
            :items="[1, 2, 3, 4, 5]"
            label="Weigh the importance of this topic (1 = least important, 5 = very important)"
            hint="1 = Less important, 5 = Very important"
            class="mt-2"
          ></v-select>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn type="submit" color="primary">SUBMIT SURVEY RESPONSES</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";

type Item = {
  id: number;
  title: string;
  priority: number;
  userRank: number | null; // User-selected rank
};

type UserOrder = {
  userId: string;
  order: Item[];
};

const items = ref<Item[]>([
  {
    id: 1,
    title: "Introduction to Clinical Research",
    priority: 1,
    userRank: null,
  },
  { id: 2, title: "Fundamentals of Epidemiology", priority: 2, userRank: null },
  {
    id: 3,
    title: "Basic Concepts in Biostatistics",
    priority: 3,
    userRank: null,
  },
  {
    id: 4,
    title: "Data Collection and Management in Research",
    priority: 4,
    userRank: null,
  },
  {
    id: 5,
    title: "AI & ML in Health Sciences Research",
    priority: 5,
    userRank: null,
  },
  {
    id: 6,
    title: "Study Design Basics: Cross-sectional and Case-Control Studies",
    priority: 6,
    userRank: null,
  },
  {
    id: 7,
    title: "Introduction to Diagnostic Testing",
    priority: 7,
    userRank: null,
  },
  {
    id: 8,
    title: "Introduction to Clinical Trials",
    priority: 8,
    userRank: null,
  },
  {
    id: 9,
    title: "Understanding Bias and Confounding in Research",
    priority: 9,
    userRank: null,
  },
  {
    id: 10,
    title: "Introduction to Systematic Reviews",
    priority: 10,
    userRank: null,
  },
  {
    id: 11,
    title: "Ethical Principles in Research",
    priority: 11,
    userRank: null,
  },
  {
    id: 12,
    title: "Health Services and Health Policy Research",
    priority: 12,
    userRank: null,
  },
]);

const userOrders = ref<UserOrder[]>([]);

const surveyResponses = ref({
  background: "",
  yearOfStudy: "",
  mmedSpecialty: "",
  hasThesisTopic: false,
  confidenceInStats: "",
  needsMentorship: false,
  budgetForConsulting: false,
  budgetAmount: "",
  ethicalReviewAwareness: false,
  nacostiCertificateAwareness: false,
  easeOfDoingClinicalResearch: 5,
  planToPublish: false,
});

const submitSurvey = () => {
  // Handle survey data submission
  console.log("Survey Responses:", surveyResponses.value);
};

const dragIndex = ref<number | null>(null);

const dragStart = (index: number) => {
  dragIndex.value = index;
};

const drop = (index: number) => {
  if (dragIndex.value === null) return;
  const draggedItem = items.value.splice(dragIndex.value, 1)[0];
  items.value.splice(index, 0, draggedItem);
  dragIndex.value = null;
};

const savePriorityOrder = () => {
  const userId = "currentUserId"; // Replace with a unique ID for each user
  const newOrder = items.value.map((item) => ({
    ...item,
    priority: item.userRank || item.priority, // Use userRank or fallback to original priority
  }));

  const finalOrder = updateFinalOrder(newOrder, userId);
  console.log("Final Order:", finalOrder);
};

const updateFinalOrder = (newOrder: Item[], userId: string): Item[] => {
  const existingUserOrder = userOrders.value.find(
    (order) => order.userId === userId
  );

  if (existingUserOrder) {
    existingUserOrder.order = newOrder;
  } else {
    userOrders.value.push({ userId, order: newOrder });
  }

  const rankSum: { [id: number]: number } = {};
  const rankCount: { [id: number]: number } = {};

  userOrders.value.forEach((userOrder) => {
    userOrder.order.forEach((item) => {
      if (item.userRank === null) return; // Skip if no rank is provided

      if (!rankSum[item.id]) {
        rankSum[item.id] = 0;
        rankCount[item.id] = 0;
      }
      rankSum[item.id] += item.userRank;
      rankCount[item.id] += 1;
    });
  });

  const averageRanks: Item[] = items.value.map((item) => ({
    ...item,
    priority: rankCount[item.id]
      ? rankSum[item.id] / rankCount[item.id]
      : item.priority,
  }));

  averageRanks.sort((a, b) => b.priority - a.priority); // Sort in descending order

  // Update the items array with the final sorted order
  items.value = averageRanks;

  return averageRanks;
};
</script>

<style scoped>
.v-card {
  cursor: pointer;
}
</style>
