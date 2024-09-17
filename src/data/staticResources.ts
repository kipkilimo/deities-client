// Define resource types with corresponding icons and names
const resourceType = {
    AUDIO: { icon: "🎵", name: "🎵 PODCASTS" },
    PRESENTATION: { icon: "▶", name: "▶ SLIDES PLAYER" },
    VIDEO: { icon: "📹", name: "📹 RECORDINGS" },
    IMAGES: { icon: "🖼️", name: "🖼️ GALLERIES" },
    DOCUMENT: { icon: "📙", name: "📙 DOCUMENTS" },
    EVENT: { icon: "🗓️", name: "🗓️ EVENTS" },
    DATASET: { icon: "⛁", name: "⛁⛁ DATASETS" },
    LINK: { icon: "⛓️", name: "⛓️ RESOURCE LINKS" },
    POLL: { icon: "🗣️📊", name: "🗣️📊 LIVE POLLS" },
    TEST: { icon: "🕖📋✍🏼", name: "🕖📋✍🏼 EXAM TESTS" },
    POSTER: { icon: "🎴", name: "🎴 ABSTRACT POSTERS" },
    ARTICLE: { icon: "📑", name: "📑 BLOG ARTICLES" },
    JOB: { icon: "📁", name: "📁 WORK STUDY" },
    TASK: { icon: "📚🎧", name: "📚🎧 ASSIGNMENT TASKS" },
    MODEL: { icon: "🎲", name: "🎲 CLINICAL MODELS" },
    // Add more resource types here if needed
};

// Define static resources using the resource types
const staticResources = ref([
    {
        type: "PRESENTATION",
        description: "View presentations and slideshows on various topics.",
        resourceCount: 0,
        ...resourceType.PRESENTATION,
    },
    {
        type: "DOCUMENT",
        description: "Access important books, reports, and other textual resources.",
        resourceCount: 0,
        ...resourceType.DOCUMENT,
    },
    {
        type: "ARTICLE",
        description: "Read articles, papers, and publications from experts.",
        resourceCount: 0,
        ...resourceType.ARTICLE,
    },
    {
        type: "TASK",
        description: "View and attempt class or peer published assignments.",
        resourceCount: 0,
        ...resourceType.TASK,
    },
    {
        type: "TEST",
        description: "Test yourself! Participate in trial mocks or tutor-administered exam sessions.",
        resourceCount: 0,
        ...resourceType.TEST,
    },
    {
        type: "VIDEO",
        description: "Watch videos from a range of categories including tutorials, lectures, and fun facts.",
        resourceCount: 0,
        ...resourceType.VIDEO,
    },
    {
        type: "AUDIO",
        description: "Discover and listen to various audio resources, including podcasts, music, and more.",
        resourceCount: 0,
        ...resourceType.AUDIO,
    },
    {
        type: "IMAGES",
        description: "Browse through collections of images, artwork, and visual media.",
        resourceCount: 0,
        ...resourceType.IMAGES,
    },
    {
        type: "LINK",
        description: "Useful links to external resources, websites, and tools.",
        resourceCount: 0,
        ...resourceType.LINK,
    },
    {
        type: "DATASET",
        description: "Explore datasets for research, analysis, and academic purposes.",
        resourceCount: 0,
        ...resourceType.DATASET,
    },
    {
        type: "MODEL",
        description: "Explore various models and simulations across different fields.",
        resourceCount: 0,
        ...resourceType.MODEL,
    },
    {
        type: "JOB",
        description: "Find job opportunities and career resources.",
        resourceCount: 0,
        ...resourceType.JOB,
    },
    // Add more static resources here if needed
]);

// Export both staticResources and resourceType
export default { staticResources, resourceType };
