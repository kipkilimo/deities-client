<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card class="transparent-card" height="75vh" min-width="100%">
          <v-container style="max-width: 80%; margin-left: 4%">
            <h1 class="bbc-title">
              Introduction to R Programming for Epidemiology and Biostatistics
            </h1>
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
            <p class="bbc-content">
              Epidemiology and biostatistics are the cornerstones of public
              health research, providing essential tools for analyzing data and
              drawing meaningful conclusions about health trends, disease
              outbreaks, and the effectiveness of interventions. With the rapid
              expansion of data in health science, the need for advanced
              statistical analysis has become more critical than ever. Among the
              many tools available for statistical analysis,
              <strong>R programming</strong> stands out as one of the most
              powerful and widely used.
            </p>

            <p class="bbc-content">
              In this article, we’ll explore the basics of R programming in the
              context of epidemiology and biostatistics, highlighting how it can
              be applied to analyze health data, conduct epidemiological
              studies, and visualize results in a meaningful way.
            </p>

            <h2 class="bbc-subtitle">
              Why Use R for Epidemiology and Biostatistics?
            </h2>

            <p class="bbc-content">
              R is a versatile, open-source programming language specifically
              designed for statistical computing and data analysis. Its
              popularity has soared in recent years, not just among
              statisticians but also among epidemiologists, health scientists,
              and biostatisticians. Here are some reasons why R is a great tool
              for professionals in these fields:
            </p>

            <ul class="bbc-content">
              <li>
                <strong>Statistical Power:</strong> R is built for statistics.
                It contains an enormous library of packages (such as
                <code>survival</code>, <code>epitools</code>, and
                <code>epiR</code>) that provide tools specifically tailored for
                epidemiological and biostatistical analysis.
              </li>
              <li>
                <strong>Data Handling:</strong> R excels at managing and
                manipulating large datasets, which is often necessary when
                working with health data collected from surveys, trials, or
                surveillance systems.
              </li>
              <li>
                <strong>Visualization:</strong> R’s ability to produce
                high-quality, customizable visualizations (with packages like
                <code>ggplot2</code> and <code>lattice</code>) makes it an
                invaluable tool for communicating complex data results in an
                accessible way.
              </li>
              <li>
                <strong>Reproducibility:</strong> R facilitates reproducible
                research, which is essential in scientific studies. With R
                Markdown and built-in version control, researchers can ensure
                that their analyses can be easily shared and replicated by
                others.
              </li>
              <li>
                <strong>Community Support:</strong> R has a robust and active
                community of users, contributing to a vast range of packages
                that extend its functionality for public health research.
              </li>
            </ul>

            <h2 class="bbc-subtitle">
              Core Concepts of R in Epidemiology and Biostatistics
            </h2>

            <p class="bbc-content">
              To get started with R, it's essential to understand some key
              concepts that are especially relevant for epidemiologists and
              biostatisticians.
            </p>

            <h3 class="bbc-subtitle">Data Structures</h3>
            <ul class="bbc-content">
              <li>
                <strong>Vectors and Matrices:</strong> Vectors are the simplest
                data structures in R, representing a sequence of elements.
                Matrices are two-dimensional arrays where each element is of the
                same type, often used for representing data tables in
                epidemiology (e.g., case numbers over time).
              </li>
              <li>
                <strong>Data Frames:</strong> These are essential for
                epidemiologists, as they allow for a mix of different data types
                (e.g., numeric and categorical) in rows and columns, much like a
                traditional spreadsheet. Data frames are commonly used to store
                datasets, such as disease incidence data, patient demographics,
                and lab results.
              </li>
            </ul>

            <h3 class="bbc-subtitle">Descriptive Statistics</h3>
            <p class="bbc-content">
              Before any complex modeling, R can be used to summarize and
              describe data using measures like means, medians, standard
              deviations, and proportions. The <code>summary()</code> function
              and packages like <code>psych</code> are handy for quick overviews
              of the data.
            </p>

            <h3 class="bbc-subtitle">Probability Distributions</h3>
            <p class="bbc-content">
              Epidemiologists often deal with probability distributions to model
              disease risk, such as the binomial distribution for binary events
              (e.g., infection or no infection), or the normal distribution for
              continuous variables (e.g., blood pressure levels). R provides
              built-in functions to generate and work with these distributions
              (<code>rbinom()</code>, <code>rnorm()</code>, etc.).
            </p>

            <h3 class="bbc-subtitle">Hypothesis Testing</h3>
            <p class="bbc-content">
              Biostatisticians frequently conduct hypothesis tests to assess the
              significance of study findings. Common tests include:
            </p>

            <ul class="bbc-content">
              <li>
                <strong>t-tests</strong> for comparing means between two groups
              </li>
              <li>
                <strong>Chi-square tests</strong> for testing independence
                between categorical variables
              </li>
              <li>
                <strong>ANOVA</strong> for comparing means across multiple
                groups
              </li>
              <li><strong>Logistic regression</strong> for binary outcomes</li>
            </ul>

            <p class="bbc-content">
              R's base functions like <code>t.test()</code>,
              <code>chisq.test()</code>, and <code>aov()</code> allow
              researchers to perform these tests easily.
            </p>

            <h3 class="bbc-subtitle">Epidemiological Measures</h3>
            <p class="bbc-content">
              Epidemiologists use specific measures like
              <strong>incidence rates</strong>, <strong>prevalence</strong>,
              <strong>relative risks</strong>, and <strong>odds ratios</strong>.
              R packages like <code>epitools</code> and <code>epiR</code> are
              tailored for calculating these measures directly from health data.
            </p>

            <h3 class="bbc-subtitle">Survival Analysis</h3>
            <p class="bbc-content">
              In clinical research, <strong>survival analysis</strong> plays a
              critical role in studying time-to-event data, such as the time
              until death or disease recurrence. R’s
              <code>survival</code> package provides robust tools to perform
              <strong>Kaplan-Meier survival estimates</strong>,
              <strong>Cox proportional hazards modeling</strong>, and more.
            </p>

            <h2 class="bbc-subtitle">Data Visualization in Epidemiology</h2>
            <p class="bbc-content">
              Data visualization is critical in epidemiology for conveying
              findings to stakeholders, policymakers, or the public. R’s
              <code>ggplot2</code> package allows for the creation of clean,
              sophisticated visualizations such as:
            </p>

            <ul class="bbc-content">
              <li>
                <strong>Time-series plots</strong> to show the progression of an
                epidemic.
              </li>
              <li>
                <strong>Bar plots</strong> and <strong>histograms</strong> to
                display the distribution of variables like age or disease
                counts.
              </li>
              <li>
                <strong>Scatterplots</strong> to identify trends or correlations
                between variables (e.g., smoking rates vs. lung cancer rates).
              </li>
              <li>
                <strong>Heatmaps</strong> to visually represent disease
                incidence across geographic regions.
              </li>
            </ul>

            <h3 class="bbc-subtitle">
              Example: Creating a Simple Time-Series Plot
            </h3>
            <pre><code>
library(ggplot2)
data <- data.frame(
  date = seq(as.Date("2020-01-01"), as.Date("2020-12-31"), by = "month"),
  cases = c(100, 150, 300, 500, 800, 1200, 2000, 2500, 1800, 1500, 1000, 500)
)

ggplot(data, aes(x = date, y = cases)) +
  geom_line(color = "blue") +
  labs(title = "COVID-19 Cases Over Time", x = "Date", y = "Number of Cases")
  </code></pre>

            <h2 class="bbc-subtitle">
              Real-World Applications of R in Epidemiology and Biostatistics
            </h2>

            <ul class="bbc-content">
              <li>
                <strong>Outbreak Investigations:</strong> Epidemiologists use R
                to quickly analyze outbreak data, model the spread of infectious
                diseases, and make real-time predictions. For instance, during
                the COVID-19 pandemic, R was widely used to model infection
                curves, estimate reproduction numbers (R0), and simulate the
                impact of different public health interventions.
              </li>
              <li>
                <strong>Clinical Trials:</strong> Biostatisticians use R for
                designing, monitoring, and analyzing data from clinical trials.
                Functions for randomization, power analysis, and sample size
                estimation are built into packages like
                <code>randomizeR</code> and <code>pwr</code>.
              </li>
              <li>
                <strong>Surveillance Systems:</strong> Public health authorities
                employ R to maintain and analyze large databases from national
                health surveillance systems. Tools like
                <code>EpiEstim</code> are used to estimate the effective
                reproduction number of infectious diseases from surveillance
                data.
              </li>
              <li>
                <strong>Health Policy:</strong> R aids in evaluating the
                effectiveness of health policies by analyzing trends and
                conducting cost-effectiveness analysis, helping policymakers
                make data-driven decisions.
              </li>
            </ul>

            <h2 class="bbc-subtitle">Getting Started with R</h2>
            <p class="bbc-content">To start using R, follow these steps:</p>

            <ol class="bbc-content">
              <li>
                <strong>Install R and RStudio:</strong> Download and install R
                from the CRAN website. RStudio is an integrated development
                environment (IDE) that makes coding in R more accessible and
                user-friendly.
              </li>
              <li>
                <strong>Learn R Basics:</strong> Familiarize yourself with the
                basics of R programming through online courses, tutorials, or
                textbooks. Websites like
                <a
                  href="https://www.datacamp.com/courses/free-introduction-to-r"
                  >DataCamp</a
                >
                and <a href="https://swirlstats.com/">Swirl</a> offer
                interactive learning opportunities.
              </li>
              <li>
                <strong>Explore R Packages:</strong> Explore packages relevant
                to your field, such as <code>epiR</code>, <code>ggplot2</code>,
                and <code>survival</code>. Install and load these packages using
                <code>install.packages()</code> and
                <code>library()</code> functions.
              </li>
              <li>
                <strong>Practice:</strong> Apply your knowledge to real datasets
                and case studies. Participate in online forums and communities
                to seek help and share insights.
              </li>
            </ol>

            <h2 class="bbc-subtitle">Conclusion</h2>
            <p class="bbc-content">
              R programming offers a wealth of tools and functionalities that
              are invaluable in epidemiology and biostatistics. Its capability
              to handle and analyze complex data, along with its powerful
              visualization options, makes it a critical asset for researchers
              and practitioners in public health. By mastering R, you can
              enhance your analytical skills and contribute to more effective
              public health strategies and interventions.
            </p>
          </v-container>
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
  font-size: 52px;
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
