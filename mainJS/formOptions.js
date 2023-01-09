const allAwardsList = [
    'AHS Citizen/Student of the Month',
    'AHS Citizenship Award in English',
    'AHS Citizenship Award in Science',
    'AHS Citizenship Award in Math',
    'AHS Citizenship Award in History',
    'AHS Citizenship Award in World Language',
    'AHS Citizenship Award in FACS',
    'AHS Citizenship Award in Visual/Studio Art',
    'AHS Citizenship Award in Performing Arts',
    'AHS Citizenship Award in Physical Education',
    'AP Scholar',
    'Eagle Scout Rank/Award',
    'Global Competency Certificate',
    'Junior Book Award',
    'Koplik/Adams Scholarship',
    'Math Fair/Expo Award',
    'National Honors Society',
    'National Language Exams (all languages/levels)',
    'National Merit Commended Scholar/Semifinalist/Finalist/Winner',
    'National World Language Honors Society',
    'Relay for Life Captain',
    'Rotary Youth Leadership Award (RYLA)',
    'Science Olympiad Award',
    'Seal of Biliteracy'
]

const allSportsList = [
    "AB Crew/Rowing",
    "Alpine Skiing",
    "Baseball",
    "Basketball, Boys",
    "Basketball, Girls",
    "Cheerleading - Football",
    "Cross Country, Boys",
    "Cross Country, Girls",
    "Dance",
    "Field Hockey",
    "Football",
    "Gymnastics",
    "Golf",
    "Ice Hockey, Boys",
    "Ice Hockey, Girls",
    "Ice/Figure Skating",
    "Indoor Track, Boys",
    "Indoor Track, Girls",
    "Lacrosse, Boys",
    "Lacrosse, Girls",
    "Martial Arts",
    "Outdoor Track, Boys",
    "Outdoor Track, Girls",
    "Soccer, Boys",
    "Soccer, Girls",
    "Softball",
    "Swimming, Boys",
    "Swimming, Girls",
    "Tennis, Boys",
    "Tennis, Girls",
    "Ultimate Frisbee",
    "Volleyball, Boys",
    "Volleyball, Girls",
    "Wrestling"
]

const allClubsList = [
    "AHS Arcade",
    "American Red Cross Club",
    "American Sign Language Club",
    "Amnesty International Club",
    "Animal Advocacy Club",
    "Anime and Manga Club",
    "Anti - Food Insecurity Club",
    "Anti - Racism Working Group",
    "Arlington Science Training and Research(A STaR)",
    "Armenian Club",
    "Art and Photography Club",
    "Asian American Coalition",
    "Astronomy Club",
    "Badminton Club",
    "Bass After Class Fishing Club",
    "Best Buddies",
    "Bio - Med Club",
    "Black Student Union",
    "Board Game Club",
    "Book Club",
    "Boy Scouts",
    "Bridge Builders",
    "Bullet Journal Club",
    "Business Club",
    "Ceramics Club",
    "Chess Club",
    "Chinese Culture Club",
    "Comedy Club",
    "Compass Club",
    "Computer Club",
    "Creating Connections and Change in the APD",
    "Culinary Classes",
    "Current Crises Club",
    "Cycling Club(Biking Club)",
    "Employment",
    "Do Something and Interact Club",
    "Drama Guild",
    "Dungeons and Dragons(D & D) Club",
    "Faith Based Activities",
    "Finance Club",
    "Focus Media",
    "French Club",
    "Future Nurses Club",
    "Gardening Club",
    "Gilbert and Sullivan Club",
    "Girl Scouts",
    "Girl - Up",
    "Girls in STEM",
    "GSA(Gender and Sexuality Alliance)",
    "Half Marathon Club",
    "Health and Fitness Club",
    "Hiking Club",
    "History Club",
    "Intergenerational Book Club",
    "Japanese Culture Club",
    "Jewelry Making Club",
    "Journalism Club",
    "LARP(Live Action Role Play)",
    "Latin Club",
    "Literary Magazine",
    "Madrigals",
    "Marketing Club",
    "Math Club",
    "Mock Trial Team",
    "Model Congress",
    "Model UN",
    "Music / Instrument lessons",
    "Music Tech club",
    "National Honor Society",
    "Philosophy Club",
    "Ping Pong Club",
    "Pokemon Club",
    "Political Action Club",
    "Ponder Scope Club",
    "Prevention Allies Club",
    "Public Speaking",
    "Quiz Club",
    "Relay For Life Participant",
    "Religious Youth Group",
    "Robotics Club",
    "SAVE Club",
    "Save the Children",
    "Science Olympiad Club",
    "Scoopermania Club",
    "SEGA Club",
    "Self - Love and Positivity Club",
    "Ski Club",
    "Spanish Club",
    "Speech and Debate Club",
    "STEAM Club",
    "String Orchestra",
    "Student Library Advisory Committee",
    "Studio / Fine Art ",
    "Sustainability Club",
    "Symphonic / Jazz Band",
    "Ukulele Club",
    "Ultimate Frisbee Club",
    "Veg Club",
    "Women's Health Club",
    "XC Ski Club",
    "Yearbook",
    "Young Americans",
    "Young Feminist Alliance(YFA)",
    "Young Progressive"
]

const allIntendedCareerList = [
    "Accounting",
    "Anthropology",
    "Architecture",
    "Astronomy",
    "Astrophysics",
    "Biomedical Fields",
    "Business",
    "Communications",
    "Computer Engineering",
    "Computer Science",
    "Criminal Justice/Law Enforcement",
    "Drama",
    "Data Science",
    "Digital Design",
    "Education - Early Childhood",
    "Education – Elementary",
    "Education - Secondary",
    "Education – Special Ed",
    "Electrical & Computer Engineering",
    "Engineering any",
    "Engineering Mechanical",
    "English/Creative Writing/Journalism",
    "Environmental Science",
    "Fashion Design",
    "Film Production/Animation",
    "Finance",
    "Fine Art",
    "Health Fields Undecided",
    "Health Science",
    "History/Social Science",
    "Interactive Media Design/ Video Game Design",
    "International Development Studies",
    "International Business",
    "International/Global Politics",
    "International Relations",
    "Information Technology",
    "Journalist",
    "Kinesiology",
    "Marketing",
    "Mathematics",
    "Modern & World Languages",
    "Music/Sound/Recording",
    "Neuroscience",
    "Nursing",
    "Performing Arts",
    "Pharmacy",
    "Photography",
    "Physical Therapy",
    "Physiology",
    "Political Science",
    "Pre-Dental",
    "Pre-Law",
    "Pre-Med",
    "Psychology",
    "Public Health",
    "Occupational Therapy",
    "Religious Studies",
    "Sociologist",
    "Sports Management",
    "Sports Management/Communication",
    "Statistics/Data Science",
    "Studio Art",
    "Theatre",
    "Urban Planning",
    "Undecided",
    "None of the Above",
]

const allMajorsList = [
    "Accounting",
    "Anthropology",
    "Architecture",
    "Astronomy",
    "Astrophysics",
    "Biomedical Fields",
    "Business Includes",
    "Communications",
    "Computer Science",
    "Computer Engineering",
    "Criminal Justice/Law Enforcement",
    "Drama",
    "Data Science and Environmental Science",
    "Digital Design",
    "Education - Early Childhood",
    "Education – Elementary",
    "Education - Secondary",
    "Education – Special Ed",
    "Electrical & Computer Engineering",
    "Engineering any",
    "Engineering Mechanical",
    "English/Creative Writing/Journalism",
    "Environment",
    "Environmental Science.",
    "Fashion Design",
    "Film Production/Animation",
    "Finance",
    "Fine Art",
    "Health Fields Undecided",
    "Health Science",
    "History/Social Science",
    "Interactive Media Design/ Video Game Design",
    "Information Technology",
    "International Business",
    "International Development Studies",
    "International/Global Politics",
    "International Relations",
    "Kinesiology",
    "Languages Modern",
    "Marketing",
    "Mathematics",
    "Modern & World Languages",
    "Music",
    "Music/Sound/Recording",
    "Neuroscience",
    "Nursing",
    "Performing Arts",
    "Pharmacy",
    "Photography",
    "Physical Therapy/Occupational Therapy",
    "Physiology",
    "Political Science",
    "Pre-Dental",
    "Pre-Law",
    "Pre-Med",
    "Psychology",
    "Psychology",
    "Public Health",
    "Religious Studies",
    "Sports Communication",
    "Sports Management",
    "Sociology",
    "Statistics/Data Science",
    "Studio Art",
    "Theatre",
    "Urban Planning",
    "Undecided",
    "None of the Above",
]

const postGradPlansList = [
    "2 year college",
    "4 year college",
    "Military",
    "Trade School",
    "Post-Grad School",
    "Employment",
    "Gap Year",
    "Undecided",
    "Other",
]

const allCollegesList = [
    "Haven't yet",
    "Alaska Pacific University",
    "Alverina University",
    "American University",
    "Arizona State University",
    "Anna Maria College",
    "Assumption University",
    "Babson College",
    "Bard College",
    "Barnard College",
    "Barry University",
    "Bates College",
    "Bay Path University",
    "Bay State College",
    "Beacon College",
    "Becker College",
    "Beloit College",
    "Benington College",
    "Bentley University",
    "Berklee College of Music",
    "Boston College",
    "Boston Conservatory at Berklee",
    "Boston University",
    "Bowdoin College",
    "Brandeis University",
    "Bridgewater State University",
    "Brown University",
    "Bryant University",
    "Bryn Mawr College",
    "Bucknell University",
    "Carnegie Mellon University",
    "Catholic University of America",
    "Champlain College",
    "Clark University",
    "Clemson University",
    "Coastal Carolina University",
    "Codarts Hogeschool voor de Kunsten",
    "Colby College",
    "Colby-Sawyer College",
    "Colgate University",
    "College of Arts & Sciences",
    "College of Atlantic",
    "College of the Holy Cross",
    "Colorado College",
    "Columbia College Chicago",
    "Columbia University in the City of New York",
    "Connecticut College",
    "Cornell University",
    "Curry College",
    "Dalhousie University",
    "Dartmouth College",
    "Dean College",
    "Dickinson College",
    "Drexel University",
    "Dublin City University",
    "Duke University",
    "Duquesne University",
    "Eckerd College",
    "Ecole de Cirque de Quebec",
    "Ecole Nationale de Cirque",
    "Elms College (College of Our Lady of the Elms)",
    "Elon University",
    "Embry-Riddle Aeronautical University-Daytona Beach",
    "Emerson College",
    "Emmanuel College",
    "Endicott College",
    "Fairfield University",
    "Fairleigh Dickinson University-Florham Campus",
    "Fisher College",
    "Fitchburg State University",
    "Framingham State University",
    "Franklin Pierce University",
    "George Washington University",
    "Gettysburg College",
    "Hamilton College",
    "Hampshire College",
    "Harvard University",
    "Haverford College",
    "High Point University",
    "Hobart William Smith Colleges",
    "Hofstra University",
    "Hult International Business School",
    "Husson University",
    "Ithaca College",
    "John Hopkins University",
    "Johnson & Wales University-Providence",
    "Keane University",
    "Keene State College",
    "Kenyon College",
    "Kettering University",
    "Lasell College",
    "Lawrence University",
    "Le Moyne College",
    "Lehigh University",
    "Leiden University College The Hague",
    "Lesley University",
    "Lousiana State University",
    "Loyola University Chicago",
    "Lynn University",
    "Macalester College",
    "Macromedia University of Applied Sciences",
    "Maine Maritime Academy",
    "Manhattan College",
    "Manhattanville College",
    "Marist College",
    "Massachusssets Bay Community College",
    "Massachusssets College of Liberal Arts",
    "Massachusssets College of Pharmacy and Health Sciences",
    "Massachusssets Institute of Technology (MIT)",
    "Massachusssets Maritime Academy",
    "McGill University",
    "Merrimack College",
    "Middlebury College",
    "Middlesex Community College",
    "Millsaps College",
    "Moravian University",
    "Mount Holyoke College",
    "Mount Saint Mary College",
    "New England College",
    "New England Institute of Technology",
    "New England School of Photography",
    "New York Film Academy- New York City",
    "New York University",
    "Niagara University",
    "Nichols College",
    "North Carolina State University at Raleigh",
    "Northeastern University",
    "Northern Vermont University-Johnson",
    "Northwestern University",
    "Nova Southeastern University",
    "Oberlin College",
    "Occidental College",
    "Ohio State University-Main Campus",
    "Otis College of Art and Design",
    "Oxford University",
    "Pace University-Westchester Campus",
    "Pennslvania College of Technology", 
    "Pennsylvania State University",
    "Pine Manor College",
    "Plymouth State University",
    "Pratt Institute-Main",
    "Princeton University",
    "Providence College",
    "Purdue University-Main Campus",
    "Quincy College",
    "Quinnipiac University",
    "Regis College",
    "Rensselaer Polytechnic Institute",
    "Rhode Island College",
    "Ringling College of Art and Design",
    "Rivier University",
    "Rochester Institute of Technology",
    "Roger Williams University",
    "Rutgers University-New Brunswick",
    "Sacred Heart University",
    "Saint Anselm College",
    "Saint John's University",
    "Saint Joseph's College of Maine",
    "Saint Michael's College",
    "Salem State University",
    "Salve Regina University",
    "Sarah Lawrence College",
    "Savannah College of Art and Design- SCAD",
    "School of Art Institute of Chicago",
    "Simmons University",
    "Skidmore College",
    "Smith College",
    "Southern New Hampshire University",
    "Springfield College",
    "St. Bonaventure University",
    "St. Olaf College",
    "St. Francis Xavier University",
    "St. John's University-New York",
    "St. Lawrence University",
    "Stanford University",
    "Stephen F. Austin State University",
    "Stonehill College",
    "Stony Brook University",
    "Suffolk University",
    "SUNY at Albany",
    "SUNY ar Purchase College",
    "SUNY College at Oswego",
    "SUNY College at Potsdam",
    "Syracuse University",
    "Technische Universiteit Delft",
    "Temple University",
    "The American University of Paris",
    "The American University of Rome",
    "The College of New Jersey",
    "The College of Wooster",
    "The New School",
    "The Univesity of Alabama",
    "The University of Tampa",
    "The Univesity of Tennessee-Knoxville",
    "Thomas College",
    "Trinity College Dublin",
    "Tufts University",
    "U.S Air Force",
    "U.S. Coast Guard",
    "U.S. Marine Corps",
    "U.S. National Guard",
    "U.S. Navy",
    "Union College",
    "Universita Bocconi",
    "Universiteit Maastricht",
    "Universiteit Twente",
    "University College Dublin",
    "University of Alabama at Birmingham",
    "University of Bridgeport",
    "University of British Columbia",
    "University of California-Berkeley",
    "University of California-Santa Barbara",
    "University of Chicago",
    "University of Connecticut",
    "University of Delaware",
    "University of Hartford",
    "University of Maine",
    "University of Maine at Farmington",
    "University of Mary Washington",
    "University of Maryland-College Park",
    "University of Massachusetts-Amherst",
    "University of Massachusetts-Boston",
    "University of Massachusetts-Dartmouth",
    "University of Massachusetts-Lowell",
    "University of Michigan-Ann Arbor",
    "University of New England",
    "University of New Hampshire-Main Campus",
    "University of New Haven",
    "University of Pennsylvania",
    "University of Pittsburgh-Pittsburgh Campus",
    "University of Rhode Island",
    "University of Richmond",
    "University of Rochester",
    "University of Saint Joseph",
    "University of Southern Maine",
    "University of Toronto",
    "University of Vermont",
    "Universityof Wisconsin-Green Bay",
    "Ursinus College",
    "Vanderbilt University",
    "Vassar College",
    "Villanova University",
    "Virginia Polytechnic Institute and State University",
    "Wagner College",
    "Washington University in St. Louis",
    "Wellesley College",
    "Wentworth Institute of Technology",
    "Wesleyan University",
    "Western Connecticut State University",
    "Western New England University",
    "Westfield State University",
    "Wheaton College- Massachusetts",
    "Worcester Polytechnic Institute",
    "Worcester State University",
    "Yale University",
    "Other:"
]

// basically contains all the questions for the form and the options for each question
const formOptions = [
    {
        "question": "6 Digit Student ID",
        "type": "text",
        "required": true,
        "name": "id"
    },
    {
        "question": "Last Name",
        "type": "text",
        "required": true,
        "name": "lastName"
    }, 
    {
        "question": "First Name",
        "type": "text",
        "required": true,
        "name": "firstName"
    }, 
    {
        "question": "Gender",
        "type": "options",
        "required": true,
        "name": "gender",
        "options": [
            "Female",
            "Male",
            "Non-Binary",
            "Other:",
        ]
    },
    {
        "question": "Are you a first generation college student? (Neither parent graduated from college.)",
        "type": "options",
        "options": [
            "Yes",
            "No",
        ],
        "name": "firstGen",
        "required": true
    },
    {
        "question": "How many siblings (not including yourself) will be in college next year?",
        "type": "options",
        "options": [
            "0",
            "1",
            "2",
            "3",
            "Other:",
        ],
        "required": true,
        "name": "siblingsInCollege"
    },
    {
        "question": "Please list any special/unusual circumstances, hardships, personal challenges, financial difficulties/circumstances, illness, etc.  (ex: loss of parent, difficulty paying for college, etc.)",
        "type": "text",
        "required": false,
        "name": "specialCircumstances"
    },
    {
        "question": "Which elementary school did you attend?",
        "type": "checkBoxesGrid",
        "options": {
            "rows"  : [
                "Bishop",
                "Brackett",
                "Dallin",
                "Hardy",
                "Peirce",
                "Stratton",
                "Thompson",					
                "Other:"
            ],
            "columns" : [
                "Kindergarten",
                "Grade 1",
                "Grade 2",
                "Grade 3",
                "Grade 4",
                "Grade 5",
            ]
        },
        "required": true,
        "name": "elementarySchools"
    },
    {
        "question": "Did you participate in Pop Warner Football or Cheerleading?",
        "type": "options",
        "options": [
            "Yes",
            "No",
        ],
        "required": true,
        "name": "popWarner"
    },
    {
        "question": "How many years did you participate in Pop Warner Football or Cheerleading?",
        "type": "options",
        "options": [
            "0",
            "1",
            "2",
            "3",
            "4",
            "Other:"
        ],
        "required": true,
        "name": "popWarnerYears"
    },
    {
        "question": "Total number of community service hours completed in grades 9-12? This may be more than the 40 required hours for graduation requirement.",
        "type": "text",
        "required": true,
        "name": "communityServiceHours"
    },
    {
        "question": "List where you have completed your community service.  (ex: CIT summer of 2019)",
        "type": "text",
        "required": true,
        "name": "communityServiceList"
    },
    {
        "question": "Did you receive any of the listed honors/leadership awards? (Check all that apply)",
        "type": "checkBoxes",
        "options": allAwardsList,
        "required": false,
        "name": "awardsList"
    }, 
    {
        "question": "List any other honors/awards you have received that are not listed above: (ex: Youth Banner Project Award)",
        "type": "text",
        "required": false,
        "name": "otherAwards"
    }, 
    {
        "question": "Click all sports (in and outside of school) that apply to you:",
        "type": "checkBoxesGrid",
        "options": {
            "rows"  : allSportsList,
            "columns" : [
                "9th Grade",
                "10th Grade",
                "11th Grade",
                "12th Grade",
            ]
        },
        "required": false,
        "name": "sportsList"
    },
    {
        "question": "Please list any additional sports not included above.",
        "type": "text",
        "required": false,
        "name": "otherSports"
    },
    {
        "question": "Sports-Related Leadership/Awards - (ex: team captain)",
        "type": "text",
        "required": false,
        "name": "sportsAwards"
    },
    {
        "question": "Click all extracurriculars (in and outside of school) that apply to you:",
        "type": "checkBoxesGrid",
        "options": {
            "rows"  : allClubsList,
            "columns" : [
                "9th Grade",
                "10th Grade",
                "11th Grade",
                "12th Grade",
            ]
        },
        "required": false,
        "name": "clubsList"
    },
    {
        "question": "Please list additional extracurriculars not listed above.",
        "type": "text",
        "required": false,
        "name": "otherClubs"
    },
    {
        "question": "Extra Curricular Leadership/Awards - (ex: officer in a club)",
        "type": "text",
        "required": false,
        "name": "clubsAwards"
    },
    {
        "question": "Please list other activities that you participate in: (only list if not in your application elsewhere)",
        "type": "text",
        "required": false,
        "name": "otherActivities"
    },
    {
        "question": "Employment Experience - Have you ever been employed?",
        "type": "checkBoxesGrid",
        "options": {
            "rows"  : [
                "Yes",
                "No",
            ],
            "columns" : [
                "9th Grade",
                "10th Grade",
                "11th Grade",
                "12th Grade",
            ]
        },
        "required": true,
        "name": "employmentExperience"
    },
    {
        "question": "Where have you been employed?",
        "type": "text",
        "required": false,
        "name": "employmentList"
    },
    {
        "question": "What is your intended career? (Check up to 3)",
        "type": "checkBoxes",
        "options": allIntendedCareerList,
        "required": true,
        "name": "intendedCareer",
        "maxSelections": 3,
    },
    {
        "question": "If your intended career is not listed, please write it here.",
        "type": "text",
        "required": false,
        "name": "otherIntendedCareer"
    },
    {
        "question": "What is your intended major? (Check up to 3)",
        "type": "checkBoxes",
        "options": allMajorsList,
        "required": true,
        "name": "intendedMajor",
        "maxSelections": 3,
    },
    {
        "question": "If your intended major is not listed, please write it here.",
        "type": "text",
        "required": false,
        "name": "otherIntendedMajor"
    },
    {
        "question": "What are your post-graduate plans?",
        "type": "checkBoxes",
        "options": postGradPlansList,
        "required": true,
        "name": "postGradPlans"
    },
    {
        "question": "If you are taking a Gap Year, what are your plans?",
        "type": "text",
        "required": false,
        "name": "gapYearPlans"
    },
    {
        "question": "Do you plan to attend a 4 year UMASS or MA State University?",
        "type": "checkBoxes",
        "options": [
            "Yes",
            "No",
            "Unsure"
        ],
        "required": true,
        "name": "umassStateUniversity"
    },
    {
        "question": "If you have already committed to a school, where will you be attending? If you are undecided, please leave blank.",
        "type": "options",
        "options": allCollegesList,
        "required": false,
        "name": "committedCollege"
    },
    {
        "question": "What is your first choice school?",
        "type": "options",
        "options": allCollegesList,
        "required": true,
        "name": "firstChoiceCollege"
    },
    {
        "question": "Do you plan on commuting to college?",
        "type": "options",
        "options": [
            "Yes",
            "No",
            "Unsure"
        ],
        "required": true,
        "name": "commuteCollege"
    },
    {
        "question": "List any private/outside scholarships you have already received for college.",
        "type": "text",
        "required": true,
        "name": "privateScholarships"
    },
    {
        "question": "Have you or do you plan to file the FAFSA?",
        "type": "options",
        "options": [
            "Yes",
            "No",
            "Unsure"
        ],
        "required": true,
        "name": "fafsa"
    },
    {
        "question": "OPTIONAL: If so, what is your expected family contribution (EFC) as reported on your Student Aid Report (SAR)?",
        "type": "text",
        "required": false,
        "name": "expectedFamilyContribution",
        "img": "https://lh5.googleusercontent.com/YKkJXlwF3Wz05TaLh9rHfZtCqe1SxT3G9VjwSOsSaYvRbPwUhnTFA7i2_fe0vNi7-28kpkCyoka-absCWd-OdJJVdwCDwrR7MLjr8lxQsFjnXN1xl2InFLrbQmpEA4K-_g=w580"
    },
    {
        "question": "In 250 words or less, please share your future aspirations and goals.",
        "type": "text",
        "required": true,
        "name": "futureAspirations"
    },
    {
        "question": "Is there any other information that you would like to share?",
        "type": "text",
        "required": false,
        "name": "otherInformation"
    },
    {
        "question": "Student Signature (Your signature indicates that all information is truthful and accurate to the best of your knowledge.)",
        "type": "text",
        "required": true,
        "name": "studentSignature"
    }

]

module.exports = formOptions;