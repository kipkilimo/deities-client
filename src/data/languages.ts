// Define the interface for a language
interface Language {
  number: number;
  name: string;
  speakers_million: number;
  trends: string;
}
// Define the interface for a region
interface Region {
  countries: string[];
  languages: Language[];
}
// Define the interface for the entire data structure
interface WorldRegions {
  [region: string]: Region;
}
// Export the default data object
const worldRegions: WorldRegions = {
  "North Africa": {
    countries: ["Egypt", "Morocco", "Algeria", "Tunisia", "Libya"],
    languages: [
      {
        number: 1,
        name: "Arabic",
        speakers_million: 100,
        trends: "Stable with growth in modern usage and digital communication.",
      },
      {
        number: 2,
        name: "Berber (Tamazight)",
        speakers_million: 30,
        trends: "Increasing due to cultural revitalization.",
      },
      {
        number: 3,
        name: "Hassaniya Arabic",
        speakers_million: 3,
        trends: "Stable in Mauritania and parts of Western Sahara.",
      },
    ],
  },
  "West Africa": {
    countries: ["Nigeria", "Ghana", "Senegal", "Ivory Coast", "Mali"],
    languages: [
      {
        number: 1,
        name: "Hausa",
        speakers_million: 70,
        trends: "Growing as a lingua franca in the region.",
      },
      {
        number: 2,
        name: "Yoruba",
        speakers_million: 45,
        trends: "Cultural and educational resurgence.",
      },
      {
        number: 3,
        name: "Igbo",
        speakers_million: 44,
        trends: "Steady, with increased global diaspora usage.",
      },
      {
        number: 4,
        name: "Fula (Fulani, Fulfulde)",
        speakers_million: 40,
        trends: "Stable, used widely among nomadic communities.",
      },
      {
        number: 5,
        name: "Akan",
        speakers_million: 30,
        trends: "Increasing due to educational and cultural efforts.",
      },
      {
        number: 6,
        name: "Wolof",
        speakers_million: 10,
        trends: "Rising, especially in Senegal's urban areas.",
      },
    ],
  },
  "East Africa": {
    countries: ["Kenya", "Tanzania", "Uganda", "Ethiopia", "Somalia"],
    languages: [
      {
        number: 1,
        name: "Swahili",
        speakers_million: 80,
        trends:
          "Rapid growth due to official language status in multiple countries.",
      },
      {
        number: 2,
        name: "Amharic",
        speakers_million: 35,
        trends: "Stable, used in government and media.",
      },
      {
        number: 3,
        name: "Oromo",
        speakers_million: 35,
        trends: "Increasing visibility and cultural promotion.",
      },
      {
        number: 4,
        name: "Somali",
        speakers_million: 20,
        trends: "Stable, with significant diaspora influence.",
      },
      {
        number: 5,
        name: "Tigrinya",
        speakers_million: 7,
        trends: "Stable with diaspora growth.",
      },
      {
        number: 6,
        name: "Kisii",
        speakers_million: 5,
        trends: "Moderate growth in local contexts.",
      },
    ],
  },
  "Central Africa": {
    countries: [
      "Democratic Republic of the Congo",
      "Central African Republic",
      "Cameroon",
      "Gabon",
      "Equatorial Guinea",
    ],
    languages: [
      {
        number: 1,
        name: "Lingala",
        speakers_million: 15,
        trends: "Increasing in urban areas and media.",
      },
      {
        number: 2,
        name: "Kongo",
        speakers_million: 7,
        trends: "Stable with cultural significance.",
      },
      {
        number: 3,
        name: "Sango",
        speakers_million: 5,
        trends: "Stable as a lingua franca in the Central African Republic.",
      },
    ],
  },
  "Southern Africa": {
    countries: ["South Africa", "Zimbabwe", "Namibia", "Lesotho", "Swaziland"],
    languages: [
      {
        number: 1,
        name: "Zulu",
        speakers_million: 12,
        trends: "Increasing due to cultural pride and media.",
      },
      {
        number: 2,
        name: "Xhosa",
        speakers_million: 10,
        trends: "Stable with slight growth in urban areas.",
      },
      {
        number: 3,
        name: "Shona",
        speakers_million: 15,
        trends: "Stable, predominant in Zimbabwe.",
      },
      {
        number: 4,
        name: "Sesotho",
        speakers_million: 7,
        trends: "Stable with regional significance.",
      },
    ],
  },
  Global: {
    countries: [
      "Asia",
      "Europe",
      "Latin America and the Caribbean",
      "Northern America",
      "Oceania",
    ],
    languages: [
      {
        number: 1,
        name: "Mandarin Chinese",
        speakers_million: 1200,
        trends: "Rapid growth due to economic expansion in China.",
      },
      {
        number: 2,
        name: "Spanish",
        speakers_million: 580,
        trends: "Increasing globally, especially in the Americas and Spain.",
      },
      {
        number: 3,
        name: "English",
        speakers_million: 1500,
        trends: "Dominant in business, technology, and global communication.",
      },
      {
        number: 4,
        name: "Hindi",
        speakers_million: 600,
        trends: "Growing due to India's expanding influence.",
      },
      {
        number: 5,
        name: "Arabic",
        speakers_million: 310,
        trends:
          "Stable with significant use in the Middle East and North Africa.",
      },
      {
        number: 6,
        name: "Bengali",
        speakers_million: 230,
        trends:
          "Growing in South Asia, particularly in Bangladesh and parts of India.",
      },
      {
        number: 7,
        name: "Portuguese",
        speakers_million: 220,
        trends: "Growing due to influence in Brazil and Portugal.",
      },
      {
        number: 8,
        name: "Russian",
        speakers_million: 260,
        trends:
          "Stable with regional influence in Eastern Europe and Central Asia.",
      },
      {
        number: 9,
        name: "Japanese",
        speakers_million: 125,
        trends: "Stable with significant cultural and technological influence.",
      },
      {
        number: 10,
        name: "German",
        speakers_million: 76,
        trends:
          "Stable with strong presence in Europe, particularly in Germany and Austria.",
      },
      {
        number: 11,
        name: "French",
        speakers_million: 300,
        trends:
          "Stable with growing influence in international organizations and diplomacy.",
      },
      {
        number: 12,
        name: "Korean",
        speakers_million: 77,
        trends: "Growing with increased global interest in Korean culture.",
      },
      {
        number: 13,
        name: "Vietnamese",
        speakers_million: 86,
        trends: "Growing due to economic development in Vietnam.",
      },
      {
        number: 14,
        name: "Turkish",
        speakers_million: 85,
        trends: "Growing with increasing geopolitical influence.",
      },
      {
        number: 15,
        name: "Italian",
        speakers_million: 64,
        trends: "Stable with historical significance and cultural influence.",
      },
      {
        number: 16,
        name: "Thai",
        speakers_million: 70,
        trends: "Growing with increased global engagement.",
      },
      {
        number: 17,
        name: "Polish",
        speakers_million: 45,
        trends: "Stable with a growing diaspora in Europe and North America.",
      },
      {
        number: 18,
        name: "Swedish",
        speakers_million: 10,
        trends:
          "Stable with influence in Scandinavia and some international contexts.",
      },
      {
        number: 19,
        name: "Danish",
        speakers_million: 6,
        trends:
          "Stable with influence primarily in Denmark and parts of Greenland.",
      },
      {
        number: 20,
        name: "Dutch",
        speakers_million: 24,
        trends:
          "Stable with influence in the Netherlands and parts of Belgium.",
      },
    ],
  },
};

export default worldRegions;
