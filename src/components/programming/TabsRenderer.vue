<template>
  <v-container fluid>
    <v-row>
      <!-- Navigation Bar -->
      <v-col cols="2">
        <v-navigation-drawer app permanent>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="text-h6">Topics</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list>
            <v-list-item-group v-model="selectedTopic" color="primary">
              <v-list-item v-for="(topic, index) in topics" :key="index" @click="setActiveTab(topic)">
                <v-list-item-content>
                  <v-list-item-title>{{ topic.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>
      </v-col>

      <!-- Blog Content Area -->
      <v-col>
        <v-card>
          <v-card-title class="text-h5">{{ selectedTopic.name }}</v-card-title>
          <v-card-text>
            <div v-html="getBlogContentWithCode(selectedTopic.name, selectedLanguage)"></div>
          </v-card-text>
        </v-card>

        <!-- Language Tabs -->
        <v-tabs v-model="selectedLanguage">
          <v-tab v-for="lang in languages" :key="lang">{{ lang }}</v-tab>
        </v-tabs>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

// Topics
const topics = ref([
  { name: 'ANOVA' },
  { name: 'T-TEST' },
  { name: 'Chi-square Test' },
  { name: 'Linear Regression' },
  { name: 'Logistic Regression' }
])

// Programming Languages
const languages = ref(['R', 'Python', 'Julia'])

const selectedTopic = ref(topics.value[0])
const selectedLanguage = ref(0)

const setActiveTab = (topic) => {
  selectedTopic.value = topic
}

// Blog content for each topic with embedded code
const blogContent = {
  'ANOVA': `
    <h2>Understanding ANOVA</h2>
    <p>Analysis of Variance (ANOVA) is a collection of statistical models used to analyze the differences among group means in a sample. It divides the observed variance into components due to different sources of variation.</p>
    <p>ANOVA is useful when you have more than two groups to compare. Let's explore how to implement ANOVA in different programming languages.</p>
  `,
  'T-TEST': `
    <h2>Introduction to T-TEST</h2>
    <p>The T-Test is a statistical hypothesis test that determines if there is a significant difference between the means of two groups. It's a fundamental tool for comparing two samples.</p>
    <p>We'll look into how to perform a T-Test in R, Python, and Julia.</p>
  `,
  'Chi-square Test': `
    <h2>Chi-square Test Explained</h2>
    <p>The Chi-square test is used to determine whether there is a significant association between two categorical variables. It's often used in hypothesis testing.</p>
    <p>Here's how you can perform a Chi-square test in different languages.</p>
  `,
  'Linear Regression': `
    <h2>Understanding Linear Regression</h2>
    <p>Linear regression is a method to predict the value of a dependent variable based on the value of an independent variable. It's widely used in data analysis and machine learning.</p>
    <p>Let's dive into how to implement linear regression models.</p>
  `,
  'Logistic Regression': `
    <h2>Logistic Regression Basics</h2>
    <p>Logistic regression is a classification algorithm used to assign observations to a discrete set of classes. Unlike linear regression, it's used for binary outcomes.</p>
    <p>Learn how to perform logistic regression using R, Python, and Julia.</p>
  `
}

const getBlogContentWithCode = (topicName, selectedLangIndex) => {
  const codeSamples = {
    'ANOVA': {
      'R': 'anova_result <- aov(dependent ~ independent, data=dataset)',
      'Python': 'from scipy import stats\nanova_result = stats.f_oneway(data1, data2)',
      'Julia': 'anova_result = Anova(glm(dependent ~ independent, data))'
    },
    'T-TEST': {
      'R': 't.test(x, y)',
      'Python': 'from scipy import stats\nt_test = stats.ttest_ind(data1, data2)',
      'Julia': 't_test = ttest(data1, data2)'
    },
    'Chi-square Test': {
      'R': 'chisq.test(table)',
      'Python': 'from scipy import stats\nchi2, p = stats.chisquare(f_obs=observed, f_exp=expected)',
      'Julia': 'chisq_result = chisqtest(matrix)'
    },
    'Linear Regression': {
      'R': 'model <- lm(dependent ~ independent, data=dataset)',
      'Python': 'from sklearn.linear_model import LinearRegression\nmodel = LinearRegression().fit(X, y)',
      'Julia': 'model = lm(dependent ~ independent, data)'
    },
    'Logistic Regression': {
      'R': 'model <- glm(dependent ~ independent, family=binomial, data=dataset)',
      'Python': 'from sklearn.linear_model import LogisticRegression\nmodel = LogisticRegression().fit(X, y)',
      'Julia': 'model = glm(dependent ~ independent, Binomial(), data)'
    }
  }

  const selectedLanguage = languages.value[selectedLangIndex]
  const codeBlock = `
    <h3>Code Implementation in ${selectedLanguage}</h3>
    <pre>${codeSamples[topicName][selectedLanguage]}</pre>
  `

  return blogContent[topicName] + codeBlock
}
</script>

<style scoped>
.v-navigation-drawer {
  background-color: #f4f4f4;
}

.v-list-item-title {
  font-weight: bold;
}

.v-card-title {
  color: #333;
  font-weight: bold;
}

.v-card-text {
  font-size: 16px;
  line-height: 1.5;
  color: #444;
}

pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap; /* Preserve line breaks */
  word-wrap: break-word; /* Allow long lines to break */
}
</style>
