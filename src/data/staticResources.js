// Define resource types with corresponding icons and names
const resourceTypes = {
    AUDIO: { icon: "🎵", name: "🎵 PODCASTS" },
    PRESENTATION: { icon: "▶", name: "▶ SLIDES PLAYER" },
    VIDEO: { icon: "🎥", name: "🎥 RECORDINGS" },
    IMAGES: { icon: "🖼️", name: "🖼️ GALLERIES" },
    DOCUMENT: { icon: "📙", name: "📙 DOCUMENTS" },
    EVENT: { icon: "🗓️", name: "🗓️ EVENTS" },
    DATASET: { icon: "⛁", name: "DATASETS" },
    LINK: { icon: "⛓️", name: "⛓️ RESOURCE LINKS" },
    POLL: { icon: "🗣️📊", name: "🗣️📊 LIVE POLLS" },
    TEST: { icon: "🕖📋✍🏼", name: "🕖📋✍🏼 EXAM TESTS" },
    POSTER: { icon: "🎴", name: "🎴 ABSTRACT POSTERS" },
    ARTICLE: { icon: "📑", name: "📑 BLOG ARTICLES" },
    JOB: { icon: "📁", name: "📁 WORK STUDY" },
    TASK: { icon: "📚🎧", name: "📚🎧ASSIGNMENT TASKS" },
    MODEL: { icon: "🎲", name: "🎲 CLINICAL MODELS" },
    // Add more resource types here if needed
};

const staticResources = ref([
    {
        type: "PRESENTATION",
        description: "View presentations and slideshows on various topics.",
        resourceCount: 0,
        ...resourceTypes.PRESENTATION,
    },
    {
        type: "DOCUMENT",
        description: "Access important documents, reports, and other textual resources.",
        resourceCount: 0,
        ...resourceTypes.DOCUMENT,
    }, {
        type: "VIDEO",
        description: "Watch videos from a range of categories including tutorials, lectures, and fun facts.",
        resourceCount: 0,
        ...resourceTypes.VIDEO,
    },
    {
        type: "TEST",
        description: "Take tests and quizzes to assess your knowledge and skills.",
        resourceCount: 0,
        ...resourceTypes.TEST,
    },
    {
        type: "TASK",
        description: "Manage tasks and to-dos efficiently with our task manager.",
        resourceCount: 0,
        ...resourceTypes.TASK,
    },
    {
        type: "ARTICLE",
        description: "Read articles, papers, and publications from experts.",
        resourceCount: 0,
        ...resourceTypes.ARTICLE,
    },

    {
        type: "AUDIO",
        description: "Discover and listen to various audio resources, including podcasts, music, and more.",
        resourceCount: 0,
        ...resourceTypes.AUDIO,
    },
    {
        type: "DATASET",
        description: "Explore datasets for research, analysis, and academic purposes.",
        resourceCount: 0,
        ...resourceTypes.DATASET,
    },
    {
        type: "MODEL",
        description: "Explore various models and simulations across different fields.",
        resourceCount: 0,
        ...resourceTypes.MODEL,
    },
    {
        type: "EVENT",
        description: "Stay updated on upcoming events, webinars, and conferences.",
        resourceCount: 0,
        ...resourceTypes.EVENT,
    },
    {
        type: "IMAGES",
        description: "Browse through collections of images, artwork, and visual media.",
        resourceCount: 0,
        ...resourceTypes.IMAGES,
    },
    {
        type: "LINK",
        description: "Useful links to external resources, websites, and tools.",
        resourceCount: 0,
        ...resourceTypes.LINK,
    },
    {
        type: "POSTER",
        description: "View and download posters on various topics and themes.",
        resourceCount: 0,
        ...resourceTypes.POSTER,
    },
    {
        type: "POLL",
        description: "Participate in polls and surveys to share your opinion.",
        resourceCount: 0,
        ...resourceTypes.POLL,
    },
    {
        type: "JOB",
        description: "Find job opportunities and career resources.",
        resourceCount: 0,
        ...resourceTypes.JOB,
    },
]);

export default staticResources;
