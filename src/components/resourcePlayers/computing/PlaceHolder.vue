<template>
  <v-container fluid class="ma-2">
    <v-row>
      <v-col>
        <v-card class="transparent-card" height="75vh" min-width="100%">
          <h2 class="bbc-title">
            An Introduction to Programming for Epidemiology and Biostatistics: Comparing
            STATA, R, and Python
          </h2>
          <v-banner
            color="transparent"
            min-width="100%"
            small
            icon="mdi-clipboard-text-clock-outline"
            lines="one"
          >
            <template v-slot:text>
              Last updated on {{ millisToLongDate(1726320314497) }}
            </template>
          </v-banner> 
            <h3 class="bbc-content ml-2">
              In the fields of epidemiology and biostatistics, data analysis and
              statistical modeling are critical. Programming allows researchers
              to process and analyze data more efficiently, test hypotheses, and
              draw insights that inform public health decisions.
            </h3> 

          <v-divider></v-divider>

          <!-- Section for STATA -->
          <v-card class="my-5">
            <v-card-title>
              <h3 class="bbc-subtitle">1. STATA</h3>
            </v-card-title>
            <v-card-text>
              <p class="bbc-content">
                <strong>Overview:</strong> STATA is a powerful tool for data
                analysis, particularly well-suited for epidemiology and
                biostatistics due to its extensive library of statistical
                functions and specialized commands.
              </p>
              <h4>Strengths:</h4>
              <ul class="bbc-subtitle ml-2">
                <li>
                  <strong>User-Friendly Interface:</strong> STATA’s graphical
                  user interface is straightforward, making it easy for
                  beginners.
                </li>
                <li>
                  <strong>Specialized Statistical Functions:</strong> STATA
                  includes functions for survival analysis, logistic regression,
                  etc.
                </li>
                <li>
                  <strong>Reproducibility:</strong> With command-based
                  scripting, STATA supports reproducibility in research.
                </li>
                <li>
                  <strong>Community and Documentation:</strong> STATA has
                  excellent documentation and an active community.
                </li>
              </ul>
              <h4>Weaknesses:</h4>
              <ul class="bbc-subtitle ml-2">
                <li>
                  <strong>Limited Flexibility:</strong> STATA is highly
                  specialized, limiting custom analyses or complex data
                  manipulation.
                </li>
                <li>
                  <strong>Cost:</strong> STATA is a paid software, and its
                  licensing can be expensive.
                </li>
                <li>
                  <strong>Limited Integration:</strong> STATA does not integrate
                  seamlessly with external libraries or APIs.
                </li>
              </ul>
            </v-card-text>
          </v-card>

          <v-divider></v-divider>

          <!-- Section for R -->
          <v-card class="my-5">
            <v-card-title>
              <h3 class="bbc-subtitle">2. R</h3>
            </v-card-title>
            <v-card-text>
              <p class="bbc-content">
                <strong>Overview:</strong> R is a free, open-source programming
                language designed for statistical computing and graphics.
              </p>
              <h4>Strengths:</h4>
              <ul class="bbc-subtitle ml-2">
                <li>
                  <strong>Wide Range of Statistical Packages:</strong> R has an
                  extensive library of packages covering various aspects of
                  biostatistics.
                </li>
                <li>
                  <strong>Data Visualization:</strong> R’s libraries, such as
                  <code>ggplot2</code>, offer powerful data visualization
                  capabilities.
                </li>
                <li>
                  <strong>Community and Resources:</strong> R has a vibrant
                  community and ample resources for support.
                </li>
                <li>
                  <strong>Open Source:</strong> R is free and accessible to
                  researchers with budget constraints.
                </li>
              </ul>
              <h4>Weaknesses:</h4>
              <ul class="bbc-subtitle ml-2">
                <li>
                  <strong>Steep Learning Curve:</strong> R can be challenging
                  for beginners due to its syntax.
                </li>
                <li>
                  <strong>Memory Management:</strong> R operates mostly in
                  memory, which can limit its performance with large datasets.
                </li>
                <li>
                  <strong>Speed:</strong> R can be slower compared to other
                  languages for certain tasks.
                </li>
              </ul>
            </v-card-text>
          </v-card>

          <v-divider></v-divider>

          <!-- Section for Python -->
          <v-card class="my-5">
            <v-card-title>
              <h3 class="bbc-subtitle">3. Python</h3>
            </v-card-title>
            <v-card-text>
              <p class="bbc-content">
                <strong>Overview:</strong> Python is a versatile and
                beginner-friendly programming language popular in data science
                and bioinformatics.
              </p>
              <h4>Strengths:</h4>
              <ul class="bbc-subtitle ml-2">
                <li>
                  <strong>Ease of Learning and Readability:</strong> Python’s
                  readable syntax makes it accessible to beginners.
                </li>
                <li>
                  <strong>Extensive Libraries:</strong> Python has libraries
                  like <code>Pandas</code> and <code>SciPy</code> for data
                  manipulation and analysis.
                </li>
                <li>
                  <strong>Machine Learning and Integration:</strong> Python
                  integrates well with APIs, databases, and machine learning
                  tools.
                </li>
                <li>
                  <strong>Open Source and Free:</strong> Python is free and
                  widely supported.
                </li>
              </ul>
              <h4>Weaknesses:</h4>
              <ul class="bbc-subtitle ml-2">
                <li>
                  <strong>Statistical Analysis Limitations:</strong> Python has
                  fewer specialized statistical packages compared to R.
                </li>
                <li>
                  <strong>Less Community Support in Biostatistics:</strong>
                  Python has a smaller user base in these specific fields.
                </li>
                <li>
                  <strong>Performance:</strong> Python’s interpreted nature can
                  make it slower without additional optimization.
                </li>
              </ul>
            </v-card-text>
          </v-card>

          <v-divider></v-divider>

          <!-- Conclusion -->
          <v-card class="my-5">
            <v-card-title>
              <h3 class="bbc-subtitle">Conclusion</h3>
            </v-card-title>
            <v-card-text>
              <p class="bbc-content">
                STATA, R, and Python each offer unique strengths for
                epidemiology and biostatistics. STATA excels in ease of use for
                statistical tasks, R leads in statistical depth and
                visualization, and Python is flexible for complex projects. By
                choosing the right tool, researchers can maximize efficiency,
                accuracy, and insight, ultimately supporting better research and
                public health decisions.
              </p>
            </v-card-text>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
// Function to format milliseconds to a long date string
// Function to format milliseconds to a long date string with GMT+3
// Function to format milliseconds to a long date string with 12-hour time
function millisToLongDate(milliseconds) {
  const date = new Date(milliseconds);

  // Options for formatting the date
  const options = {
    weekday: "long", // e.g., "Thursday"
    year: "numeric", // e.g., "2024"
    month: "long", // e.g., "September"
    day: "numeric", // e.g., "15"
    hour: "numeric", // e.g., "4"
    minute: "numeric", // e.g., "48"
    hour12: true, // Use 12-hour clock
    timeZone: "Africa/Nairobi", // Time zone
  };

  // Get formatted date string
  let formattedDate = new Intl.DateTimeFormat("en-KE", options).format(date);

  // Convert AM/PM to uppercase
  formattedDate = formattedDate.replace(/(am|pm)/g, (match) =>
    match.toUpperCase()
  );

  return formattedDate;
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap");

.transparent-card {
  background-color: rgba(255, 255, 255, 0.5);
  height: 75vh;
  overflow-y: auto;
  box-shadow: none;
}

.bbc-title {
  font-family: "Cormorant Garamond", serif;
  font-size: 40px;
  font-weight: 700;
  line-height: 1.3;
  color: #222;
  margin-bottom: 1rem;
}

.bbc-subtitle {
  font-family: "Cormorant Garamond", serif;
  font-size: 21px;
  color: #3f3d3d;
  margin-bottom: 1rem;
}

.bbc-meta {
  font-family: "Cormorant Garamond", serif;
  font-size: 14px;
  color: #3f3d3d;
  margin-right: 1.5rem;
}

.bbc-content {
  font-family: "Cormorant Garamond", serif;
  font-size: 24px;
  line-height: 1.6;
  color: #333;
}

.scrollable-content {
  max-height: 81vh;
  overflow-y: auto;
}

.v-img {
  border-radius: 8px;
}

.confetti {
  position: absolute;
  width: 5px;
  height: 5px;
  background: #ffd700;
  border-radius: 50%;
  animation: confetti-fall 1.5s ease-in-out;
}

@keyframes confetti-fall {
  0% {
    opacity: 1;
    transform: translateY(-50px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(50px) scale(0);
  }
}
</style>
