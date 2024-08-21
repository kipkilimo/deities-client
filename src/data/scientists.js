const notableFigures = [
    {
        name: "John Snow",
        field: "Epidemiology",
        contributions: "Father of modern epidemiology; traced cholera outbreak in London.",
        years: "1813-1858",
        mdi_icon: "mdi-virus",
        gender: "Male"
    },
    {
        name: "Ignaz Semmelweis",
        field: "Medicine",
        contributions: "Introduced handwashing in medical practice, reducing puerperal fever.",
        years: "1818-1865",
        mdi_icon: "mdi-hand-water",
        gender: "Male"
    },
    {
        name: "Florence Nightingale",
        field: "Public Health",
        contributions: "Pioneer in statistical graphics; improved sanitary practices in hospitals.",
        years: "1820-1910",
        mdi_icon: "mdi-hospital",
        gender: "Female"
    },
    {
        name: "Edward Jenner",
        field: "Medicine",
        contributions: "Developed the first successful smallpox vaccine.",
        years: "1749-1823",
        mdi_icon: "mdi-needle",
        gender: "Male"
    },
    {
        name: "Girolamo Fracastoro",
        field: "Medicine",
        contributions: "Proposed the germ theory of disease.",
        years: "1478-1553",
        mdi_icon: "mdi-microscope",
        gender: "Male"
    },
    {
        name: "Sir Richard Doll",
        field: "Epidemiology",
        contributions: "Linked smoking to lung cancer.",
        years: "1912-2005",
        mdi_icon: "mdi-lungs",
        gender: "Male"
    },
    {
        name: "Alice Stewart",
        field: "Epidemiology",
        contributions: "Researched the dangers of prenatal X-rays and radiation.",
        years: "1906-2002",
        mdi_icon: "mdi-radiology-box",
        gender: "Female"
    },
    {
        name: "William Farr",
        field: "Statistics",
        contributions: "Founder of medical statistics; systematized recording causes of death.",
        years: "1807-1883",
        mdi_icon: "mdi-chart-line",
        gender: "Male"
    },
    {
        name: "Joseph Goldberger",
        field: "Epidemiology",
        contributions: "Discovered the dietary cause of pellagra.",
        years: "1874-1929",
        mdi_icon: "mdi-food-apple",
        gender: "Male"
    },
    {
        name: "Janet Lane-Claypon",
        field: "Epidemiology",
        contributions: "Pioneer in cancer research, especially breast cancer.",
        years: "1877-1967",
        mdi_icon: "mdi-ribbon",
        gender: "Female"
    },
    {
        name: "Louis Pasteur",
        field: "Microbiology",
        contributions: "Developed pasteurization and vaccines for rabies and anthrax.",
        years: "1822-1895",
        mdi_icon: "mdi-bacteria",
        gender: "Male"
    },
    {
        name: "Robert Koch",
        field: "Microbiology",
        contributions: "Identified causative agents of tuberculosis, cholera, and anthrax.",
        years: "1843-1910",
        mdi_icon: "mdi-biohazard",
        gender: "Male"
    },
    {
        name: "Alexander Fleming",
        field: "Medicine",
        contributions: "Discovered penicillin.",
        years: "1881-1955",
        mdi_icon: "mdi-pill",
        gender: "Male"
    },
    {
        name: "Paul Ehrlich",
        field: "Immunology",
        contributions: "Developed first cure for syphilis; advanced immunology.",
        years: "1854-1915",
        mdi_icon: "mdi-shield-plus",
        gender: "Male"
    },
    {
        name: "Barbara McClintock",
        field: "Genetics",
        contributions: "Discovered transposable elements (jumping genes).",
        years: "1902-1992",
        mdi_icon: "mdi-dna",
        gender: "Female"
    },
    {
        name: "Rosalind Franklin",
        field: "Biophysics",
        contributions: "Contributed to understanding DNA, RNA, viruses.",
        years: "1920-1958",
        mdi_icon: "mdi-molecule",
        gender: "Female"
    },
    {
        name: "James Watson",
        field: "Genetics",
        contributions: "Co-discovered the double-helix structure of DNA.",
        years: "1928-present",
        mdi_icon: "mdi-dna",
        gender: "Male"
    },
    {
        name: "Francis Crick",
        field: "Genetics",
        contributions: "Co-discovered the double-helix structure of DNA.",
        years: "1916-2004",
        mdi_icon: "mdi-dna",
        gender: "Male"
    },
    {
        name: "Gregor Mendel",
        field: "Genetics",
        contributions: "Father of genetics; worked on inheritance of traits in pea plants.",
        years: "1822-1884",
        mdi_icon: "mdi-flower",
        gender: "Male"
    },
    {
        name: "Maurice Hilleman",
        field: "Virology",
        contributions: "Developed over 40 vaccines, including for measles and mumps.",
        years: "1919-2005",
        mdi_icon: "mdi-virus",
        gender: "Male"
    },
    {
        name: "Katalin Karikó",
        field: "Biochemistry",
        contributions: "Pioneered mRNA technology for COVID-19 vaccines.",
        years: "1955-present",
        mdi_icon: "mdi-dna",
        gender: "Female"
    },
    {
        name: "Ronald Ross",
        field: "Epidemiology",
        contributions: "Discovered malaria parasite in mosquitoes.",
        years: "1857-1932",
        mdi_icon: "mdi-virus",
        gender: "Male"
    },
    {
        name: "Max von Pettenkofer",
        field: "Public Health",
        contributions: "Promoted sanitation and hygiene in urban areas.",
        years: "1818-1901",
        mdi_icon: "mdi-city",
        gender: "Male"
    },
    {
        name: "Thomas Sydenham",
        field: "Medicine",
        contributions: "English Hippocrates; emphasized clinical observation.",
        years: "1624-1689",
        mdi_icon: "mdi-doctor",
        gender: "Male"
    },
    {
        name: "Andreas Vesalius",
        field: "Anatomy",
        contributions: "Founder of modern human anatomy.",
        years: "1514-1564",
        mdi_icon: "mdi-human-male",
        gender: "Male"
    },
    {
        name: "Hippocrates",
        field: "Medicine",
        contributions: "Father of Medicine; Hippocratic Oath.",
        years: "460-370 BC",
        mdi_icon: "mdi-doctor",
        gender: "Male"
    },
    {
        name: "William Harvey",
        field: "Physiology",
        contributions: "Described the circulation of blood.",
        years: "1578-1657",
        mdi_icon: "mdi-heart-pulse",
        gender: "Male"
    },
    {
        name: "Alfred Grotjahn",
        field: "Social Medicine",
        contributions: "Pioneer in social hygiene and social medicine.",
        years: "1869-1931",
        mdi_icon: "mdi-hand-heart",
        gender: "Male"
    },
    {
        name: "Alfred Blalock",
        field: "Surgery",
        contributions: "Developed the first successful open heart surgery techniques.",
        years: "1899-1964",
        mdi_icon: "mdi-account-injury-outline",
        gender: "Male"
    },
    {
        name: "Harvey Cushing",
        field: "Neurosurgery",
        contributions: "Pioneer of brain surgery techniques.",
        years: "1869-1939",
        mdi_icon: "mdi-brain",
        gender: "Male"
    },
    {
        name: "Norman Bethune",
        field: "Medicine",
        contributions: "Pioneered mobile blood transfusion services.",
        years: "1890-1939",
        mdi_icon: "mdi-blood-bag",
        gender: "Male"
    },
    {
        name: "Elie Metchnikoff",
        field: "Immunology",
        contributions: "Father of natural immunity; discovered phagocytosis.",
        years: "1845-1916",
        mdi_icon: "mdi-shield-bug",
        gender: "Male"
    },
    {
        name: "Henry Gray",
        field: "Anatomy",
        contributions: "Authored 'Gray's Anatomy', a comprehensive anatomical reference.",
        years: "1827-1861",
        mdi_icon: "mdi-book-open-page-variant",
        gender: "Male"
    },
    {
        name: "Walter Reed",
        field: "Medicine",
        contributions: "Proved mosquitoes transmit yellow fever.",
        years: "1851-1902",
        mdi_icon: "mdi-emoticon-sick",
        gender: "Male"
    },
    {
        name: "Rudolf Virchow",
        field: "Pathology",
        contributions: "Father of modern pathology; cellular pathology.",
        years: "1821-1902",
        mdi_icon: "mdi-liquid-spot",
        gender: "Male"
    },
    {
        name: "Victor McKusick",
        field: "Genetics",
        contributions: "Father of medical genetics; cataloged human genetic disorders.",
        years: "1921-2008",
        mdi_icon: "mdi-dna",
        gender: "Male"
    },
    {
        name: "Claude Bernard",
        field: "Physiology",
        contributions: "Founder of experimental medicine.",
        years: "1813-1878",
        mdi_icon: "mdi-magnify",
        gender: "Male"
    },
    {
        name: "René Laennec",
        field: "Medicine",
        contributions: "Invented the stethoscope.",
        years: "1781-1826",
        mdi_icon: "mdi-stethoscope",
        gender: "Male"
    },
    {
        name: "Niels Bohr",
        field: "Physics",
        contributions: "Developed the Bohr model of the atom; quantum theory.",
        years: "1885-1962",
        mdi_icon: "mdi-atom",
        gender: "Male"
    },
    {
        name: "Marie Curie",
        field: "Physics",
        contributions: "Pioneering research on radioactivity; first woman to win a Nobel Prize.",
        years: "1867-1934",
        mdi_icon: "mdi-radiology-box",
        gender: "Female"
    },
    {
        name: "Ahmed Zewail",
        field: "Chemistry",
        contributions: "Pioneered femtochemistry; Nobel Prize in Chemistry 1999.",
        years: "1946-2016",
        mdi_icon: "mdi-chemical-weapon",
        gender: "Male"
    },
    {
        name: "Tshilidzi Marwala",
        field: "Engineering",
        contributions: "Expert in artificial intelligence and computational intelligence.",
        years: "1971-present",
        mdi_icon: "mdi-robot",
        gender: "Male"
    },
    {
        name: "Salim Abdool Karim",
        field: "Epidemiology",
        contributions: "Renowned HIV/AIDS researcher and epidemiologist.",
        years: "1960-present",
        mdi_icon: "mdi-virus",
        gender: "Male"
    },
    {
        name: "Francisca Nneka Okeke",
        field: "Physics",
        contributions: "Known for her work on geomagnetism.",
        years: "1956-present",
        mdi_icon: "mdi-magnet",
        gender: "Female"
    },
    {
        name: "Quarraisha Abdool Karim",
        field: "Epidemiology",
        contributions: "Research on HIV prevention in women.",
        years: "1960-present",
        mdi_icon: "mdi-virus",
        gender: "Female"
    },
    {
        name: "Dorothy Hodgkin",
        field: "Chemistry",
        contributions: "Pioneered X-ray crystallography and biomolecules; Nobel Prize in Chemistry 1964.",
        years: "1910-1994",
        mdi_icon: "mdi-chemical-weapon",
        gender: "Female"
    },
    {
        name: "Rita Levi-Montalcini",
        field: "Neurobiology",
        contributions: "Discovered nerve growth factor; Nobel Prize in Physiology or Medicine 1986.",
        years: "1909-2012",
        mdi_icon: "mdi-brain",
        gender: "Female"
    },
    {
        name: "Ada Lovelace",
        field: "Mathematics/Computer Science",
        contributions: "The first computer programmer; worked on the early mechanical general-purpose computer.",
        years: "1815-1852",
        mdi_icon: "mdi-calculator",
        gender: "Female"
    },
    {
        name: "Chien-Shiung Wu",
        field: "Physics",
        contributions: "Conducted the Wu experiment, which proved the theory of parity violation.",
        years: "1912-1997",
        mdi_icon: "mdi-atom",
        gender: "Female"
    },
    {
        name: "Tu Youyou",
        field: "Pharmacology",
        contributions: "Discovered artemisinin, a treatment for malaria; Nobel Prize in Physiology or Medicine 2015.",
        years: "1930-present",
        mdi_icon: "mdi-pill",
        gender: "Female"
    },
    {
        name: "Lise Meitner",
        field: "Physics",
        contributions: "Co-discovered nuclear fission; worked on radioactivity and nuclear physics.",
        years: "1878-1968",
        mdi_icon: "mdi-radioactive",
        gender: "Female"
    },
    {
        name: "Jane Goodall",
        field: "Ethology/Primatology",
        contributions: "World-renowned primatologist known for her study of chimpanzee behavior in the wild.",
        years: "1934-present",
        mdi_icon: "mdi-monkey",
        gender: "Female"
    },
    {
        name: "Emmanuelle Charpentier",
        field: "Microbiology",
        contributions: "Co-developed CRISPR-Cas9 gene editing technology; Nobel Prize in Chemistry 2020.",
        years: "1968-present",
        mdi_icon: "mdi-dna",
        gender: "Female"
    }
];

export default notableFigures;
