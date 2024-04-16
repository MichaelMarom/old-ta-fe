// constants.js

export const hours = [
  ["12:00 am", "1:00 am", "midnight"],
  ["1:00 am", "2:00 am", "midnight"],
  ["2:00 am", "3:00 am", "midnight"],
  ["3:00 am", "4:00 am", "midnight"],
  ["4:00 am", "5:00 am", "midnight"],
  ["5:00 am", "6:00 am", "midnight"],
  ["6:00 am", "7:00 am", "midnight"],
  ["7:00 am", "8:00 am", "midnight"],
  ["8:00 am", "9:00 am"],
  ["9:00 am", "10:00 am"],
  ["10:00 am", "11:00 am"],
  ["11:00 am", "12:00 pm"],
  ["12:00 pm", "1:00 pm"],
  ["1:00 pm", "2:00 pm"],
  ["2:00 pm", "3:00 pm"],
  ["3:00 pm", "4:00 pm"],
  ["4:00 pm", "5:00 pm"],
  ["5:00 pm", "6:00 pm"],
  ["6:00 pm", "7:00 pm"],
  ["7:00 pm", "8:00 pm"],
  ["8:00 pm", "9:00 pm"],
  ["9:00 pm", "10:00 pm", "midnight"],
  ["10:00 pm", "11:00 pm", "midnight"],
  ["11:00 pm", "12:00 am (midnight)", "midnight"],
];


export const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Holidays"
];


export const monthFormat = 'MMM D, YY';
export const wholeDateFormat = 'ddd, MMM D, hh:mm a';
export const slotPillDateFormat = 'MMM D, hh a';
export const monthFormatWithYYYY = 'MMM D, YYYY'

export const loggedInStudent = {
  sid: 1,
  firstName: "Naomi",
  middleName: "C",
  lastName: "Marom",
  email: "ddiffo@gmail.com",
  password: "qwertyui",
  cell: 15166088464,
  language: "English",
  ageGrade: "9th",
  grade: "",
  address1: "476 Shotwell Rd",
  address2: "Ste 102",
  city: "Clayton",
  state: "CA",
  zipCode: "27527",
  country: "USA",
  gmt: "+03",
  parentEmail: "ddiffo@gmail.com",
  parentFirstName: "Marom",
  parentLastName: "Naomi",
  academyId: "Naomi. C. M8bc074",
  screenName: "Naomi. C. M",
  photo: "data:image/png;ba...", // Replace with actual image data
  status: "Active"
}
export const loggedInTutor = {
  SID: '1',
  Photo: "photo string",
  Video: "video string",
  FirstName: "Michael",
  MiddleName: "C",
  LastName: "Marom",
  Address1: "476 Shotwell Rd",
  Address2: "Ste 102",
  CityTown: "Clayton",
  StateProvince: "NC",
  ZipCode: "27520",
  Country: "USA",
  Email: "michael_marom@yahoo.com",
  CellPhone: "15166088464",
  GMT: "+07",
  ResponseHrs: "48 Hours",
  TutorScreenname: "Michael. C. M",
  HeadLine: "hello world",
  Introduction: "hello world",
  Motivate: "hello world",
  Password: "qwertyui",
  IdVerified: null,
  BackgroundVerified: null,
  AcademyId: "Michael. C. M5ea887",
  Status: "Active",
  Grades: ["8th grade", "9th grade", "7th grade", "10th grade"]
}

export const FACULTIES = [
  {
    "Id": 1,
    "Faculty": "Math"
  },
  {
    "Id": 2,
    "Faculty": "Computer"
  },
  {
    "Id": 3,
    "Faculty": "English"
  },
  {
    "Id": 4,
    "Faculty": "Languges"
  },
  {
    "Id": 5,
    "Faculty": "Elementary Education"
  },
  {
    "Id": 6,
    "Faculty": "Science"
  },
  {
    "Id": 7,
    "Faculty": "Business"
  },
  {
    "Id": 8,
    "Faculty": "Social Study"
  },
  {
    "Id": 9,
    "Faculty": "Programing"
  },
  {
    "Id": 10,
    "Faculty": "Test Preparation"
  },
  {
    "Id": 13,
    "Faculty": "Health"
  },
  {
    "Id": 14,
    "Faculty": "Life Skills"
  },
  {
    "Id": 15,
    "Faculty": "Art"
  },
  {
    "Id": 16,
    "Faculty": "Engineering"
  },
  {
    "Id": 17,
    "Faculty": "Aviation"
  },
  {
    "Id": 18,
    "Faculty": "Economics"
  },
  {
    "Id": 20,
    "Faculty": "History"
  },
  {
    "Id": 21,
    "Faculty": "Statistics"
  },
  {
    "Id": 22,
    "Faculty": "Chemistry"
  },
  {
    "Id": 23,
    "Faculty": "Biology"
  },
  {
    "Id": 24,
    "Faculty": "Physics"
  },
  {
    "Id": 25,
    "Faculty": "Music"
  },
  {
    "Id": 26,
    "Faculty": "Geography"
  },
  {
    "Id": 27,
    "Faculty": "Psychology"
  },
  {
    "Id": 28,
    "Faculty": "Photography"
  },
  {
    "Id": 29,
    "Faculty": "Graphic design"
  },
  {
    "Id": 30,
    "Faculty": "Geometry"
  },
  {
    "Id": 31,
    "Faculty": "Litrature"
  },
  {
    "Id": 32,
    "Faculty": "Business & Management"
  },
  {
    "Id": 33,
    "Faculty": "Artificial intelligence"
  },
  {
    "Id": 34,
    "Faculty": "Home Schooling"
  }
]

export const GMT = [
  {
    "id": 1,
    "GMT": "00        ",
    "Time Zone": "Greenwitch"
  },
  {
    "id": 2,
    "GMT": "+01       ",
    "Time Zone": "West Europe"
  },
  {
    "id": 3,
    "GMT": "+02       ",
    "Time Zone": "East Europe"
  },
  {
    "id": 4,
    "GMT": "+03       ",
    "Time Zone": "East Africa"
  },
  {
    "id": 5,
    "GMT": "+04       ",
    "Time Zone": "Golf Std"
  },
  {
    "id": 6,
    "GMT": "+05       ",
    "Time Zone": "Pakistan"
  },
  {
    "id": 7,
    "GMT": "+06       ",
    "Time Zone": "Bengladesh"
  },
  {
    "id": 8,
    "GMT": "+07       ",
    "Time Zone": "West Indonesia"
  },
  {
    "id": 9,
    "GMT": "+08       ",
    "Time Zone": "Singapore"
  },
  {
    "id": 10,
    "GMT": "+09       ",
    "Time Zone": "Korea, Japan"
  },
  {
    "id": 11,
    "GMT": "+10       ",
    "Time Zone": "Eastren AustraliaL"
  },
  {
    "id": 13,
    "GMT": "+11       ",
    "Time Zone": "Solomon Islands"
  },
  {
    "id": 14,
    "GMT": "+12       ",
    "Time Zone": "New Zeland Std."
  },
  {
    "id": 15,
    "GMT": "-01       ",
    "Time Zone": "Azures Std"
  },
  {
    "id": 16,
    "GMT": "-02       ",
    "Time Zone": "S. Georgia"
  },
  {
    "id": 17,
    "GMT": "-03       ",
    "Time Zone": "Argentina"
  },
  {
    "id": 18,
    "GMT": "-04       ",
    "Time Zone": "Atlantic Std."
  },
  {
    "id": 19,
    "GMT": "-05       ",
    "Time Zone": "Eastren Std."
  },
  {
    "id": 20,
    "GMT": "-06       ",
    "Time Zone": "Central Std."
  },
  {
    "id": 21,
    "GMT": "-07       ",
    "Time Zone": "Mountain Std."
  },
  {
    "id": 22,
    "GMT": "-08       ",
    "Time Zone": "Pacific Std."
  },
  {
    "id": 23,
    "GMT": "-09       ",
    "Time Zone": "Alaska Std."
  },
  {
    "id": 25,
    "GMT": "-10       ",
    "Time Zone": "Hawaii Std."
  },
  {
    "id": 26,
    "GMT": "-11       ",
    "Time Zone": "Niue"
  },
  {
    "id": 27,
    "GMT": "-12       ",
    "Time Zone": "Baker Island"
  }
]
export const LEVEL = [
  "No Academic Education",
  "Undergraduate Student",
  "Associate Degree",
  "Bachelor Degree",
  "Master Degree",
  "Doctorate Degree",
  "Post Doctorate Degree",
  "Professor",
]

export const EXPERIENCE = [
  "1 Yr      ",
  "2 Yrs     ",
  "3 Yrs     ",
  "4 Yrs     ",
  "5 Yrs     ",
  "6-9 Yrs   ",
  "10-14 Yrs ",
  "15-19 Yrs ",
  "20+       "
]

export const CERTIFICATES = [
  "Not Certified",
  "Early Childhood Education",
  "Elementry Education",
  "Secondry Education",
  "Graduate",
  "Initial certificate",
  "Provisional Certificate",
  "Professional certificate",
  "Limited Professional certificate",
  "Retired Educator certificate",
  "<<<PROGRAMING CERTIFICATES>>>",
  "AWS Certified Developer Associate",
  "AWS Certified Solutions Associate",
  "C & C++ Certificattion",
  "OCAJP Oracle Certified Associate Java",
  "R Programming Certification",
  "CCA Spark and Hadop Developer",
  "CMBDA Oracle Database Certification",
  "Comp TIA Security",
  "CELTA",
  "Computer Science",
  "ESL/ELL",
  "SCIENCE",
  "Gifted",
  "Special Education",
  "Other",
  "High School"]

export const GRADES = [
  {
    "id": 1,
    "Grade": "Pre K"
  },
  {
    "id": 2,
    "Grade": "1St"
  },
  {
    "id": 3,
    "Grade": "2nd"
  },
  {
    "id": 4,
    "Grade": "3rd"
  },
  {
    "id": 5,
    "Grade": "4th"
  },
  {
    "id": 6,
    "Grade": "5th"
  },
  {
    "id": 7,
    "Grade": "6th"
  },
  {
    "id": 8,
    "Grade": "7th"
  },
  {
    "id": 9,
    "Grade": "8th"
  },
  {
    "id": 10,
    "Grade": "9th"
  },
  {
    "id": 11,
    "Grade": "10th"
  },
  {
    "id": 12,
    "Grade": "11th"
  },
  {
    "id": 13,
    "Grade": "12th"
  },
  {
    "id": 14,
    "Grade": "Freshman"
  },
  {
    "id": 15,
    "Grade": "Sophmore"
  },
  {
    "id": 16,
    "Grade": "Junior"
  },
  {
    "id": 17,
    "Grade": "Senior"
  }
]

export const Countries = [
  { "Country": "USA", "Code": "US" },
  { "Country": "Canada", "Code": "CA" },
  { "Country": "Greece", "Code": "GR" },
  { "Country": "Jordan", "Code": "JO" },
  { "Country": "Portugal", "Code": "PT" },
  { "Country": "Azrabijan", "Code": "AZ" },
  { "Country": "Sweeden", "Code": "SE" },
  { "Country": "Honduras", "Code": "HN" },
  { "Country": "UAE", "Code": "AE" },
  { "Country": "Hungary", "Code": "HU" },
  { "Country": "Tajikistan", "Code": "TJ" },
  { "Country": "Belarus", "Code": "BY" },
  { "Country": "Austria", "Code": "AT" },
  { "Country": "Papua", "Code": "PG" },
  { "Country": "Serbia", "Code": "RS" },
  { "Country": "Israel", "Code": "IL" },
  { "Country": "Switzerland", "Code": "CH" },
  { "Country": "Togo", "Code": "TG" },
  { "Country": "Sierra Leone", "Code": "SL" },
  { "Country": "Hong Kong", "Code": "HK" },
  { "Country": "Laos", "Code": "LA" },
  { "Country": "Paraguay", "Code": "PY" },
  { "Country": "Bulgaria", "Code": "BG" },
  { "Country": "Libya", "Code": "LY" },
  { "Country": "Lebanon", "Code": "LB" },
  { "Country": "Nicaragua", "Code": "NI" },
  { "Country": "Kyrgyzstan", "Code": "KG" },
  { "Country": "El Salvador", "Code": "SV" },
  { "Country": "Turkmenistan", "Code": "TM" },
  { "Country": "Singapore", "Code": "SG" },
  { "Country": "Denmark", "Code": "DK" },
  { "Country": "Finland", "Code": "FI" },
  { "Country": "Congo", "Code": "CG" },
  { "Country": "Slovakia", "Code": "SK" },
  { "Country": "Norway", "Code": "NO" },
  { "Country": "Oman", "Code": "OM" },
  { "Country": "Palestine", "Code": "PS" },
  { "Country": "Costa Rica", "Code": "CR" },
  { "Country": "Liberia", "Code": "LR" },
  { "Country": "Ireland", "Code": "IE" },
  { "Country": "Central Africa Rep.", "Code": "CF" },
  { "Country": "New Zealand", "Code": "NZ" },
  { "Country": "Mauritania", "Code": "MR" },
  { "Country": "Panama", "Code": "PA" },
  { "Country": "Kuwait", "Code": "KW" },
  { "Country": "Croatia", "Code": "HR" },
  { "Country": "Moldova", "Code": "MD" },
  { "Country": "Georgia", "Code": "GE" },
  { "Country": "Eritrea", "Code": "ER" },
  { "Country": "Uruguay", "Code": "UY" },
  { "Country": "Bosnia", "Code": "BA" },
  { "Country": "Mongolia", "Code": "MN" },
  { "Country": "Armenia", "Code": "AM" },
  { "Country": "Jamaica", "Code": "JM" },
  { "Country": "Qatar", "Code": "QA" },
  { "Country": "Albania", "Code": "AL" },
  { "Country": "Porto Rico", "Code": "PR" },
  { "Country": "Lithuania", "Code": "LT" },
  { "Country": "Namibia", "Code": "NA" },
  { "Country": "Gambia", "Code": "GM" },
  { "Country": "Botswana", "Code": "BW" },
  { "Country": "Gabon", "Code": "GA" },
  { "Country": "Lesotho", "Code": "LS" },
  { "Country": "Macedonia", "Code": "MK" },
  { "Country": "Slovenia", "Code": "SI" },
  { "Country": "Guinea-Bissau", "Code": "GW" },
  { "Country": "Latvia", "Code": "LV" },
  { "Country": "Bahrain", "Code": "BH" },
  { "Country": "Equatorial Guinea", "Code": "GQ" },
  { "Country": "Trinidad", "Code": "TT" },
  { "Country": "Estonia", "Code": "EE" },
  { "Country": "Timor", "Code": "TL" },
  { "Country": "Mauritius", "Code": "MU" },
  { "Country": "Cyprus", "Code": "CY" },
  { "Country": "India", "Code": "IN" },
  { "Country": "China", "Code": "CN" },
  { "Country": "Indonesia", "Code": "ID" },
  { "Country": "Pakistan", "Code": "PK" },
  { "Country": "Brazil", "Code": "BR" },
  { "Country": "Nigeria", "Code": "NG" },
  { "Country": "Bangladesh", "Code": "BD" },
  { "Country": "Russia", "Code": "RU" },
  { "Country": "Mexico", "Code": "MX" },
  { "Country": "Japan", "Code": "JP" },
  { "Country": "Ethiopia", "Code": "ET" },
  { "Country": "Philippines", "Code": "PH" },
  { "Country": "Egypt", "Code": "EG" },
  { "Country": "Vietnam", "Code": "VN" },
  { "Country": "Congo DR", "Code": "CD" },
  { "Country": "Turkey", "Code": "TR" },
  { "Country": "Iran", "Code": "IR" },
  { "Country": "Germany", "Code": "DE" },
  { "Country": "Thailand", "Code": "TH" },
  { "Country": "United Kingdom", "Code": "GB" },
  { "Country": "France", "Code": "FR" },
  { "Country": "Italy", "Code": "IT" },
  { "Country": "Tanzania", "Code": "TZ" },
  { "Country": "South Africa", "Code": "ZA" },
  { "Country": "Myanmar", "Code": "MM" },
  { "Country": "Kenya", "Code": "KE" },
  { "Country": "South Korea", "Code": "KR" },
  { "Country": "Spain", "Code": "ES" },
  { "Country": "Uganda", "Code": "UG" },
  { "Country": "Argentina", "Code": "AR" },
  { "Country": "Algeria", "Code": "DZ" },
  { "Country": "Sudan", "Code": "SD" },
  { "Country": "Ukraine", "Code": "UA" },
  { "Country": "Iraq", "Code": "IQ" },
  { "Country": "Afghanistan", "Code": "AF" },
  { "Country": "Poland", "Code": "PL" },
  { "Country": "Morocco", "Code": "MA" },
  { "Country": "Saudi Arabia", "Code": "SA" },
  { "Country": "Uzbekistan", "Code": "UZ" },
  { "Country": "Peru", "Code": "PE" },
  { "Country": "Angola", "Code": "AO" },
  { "Country": "Malaysia", "Code": "MY" },
  { "Country": "Mozambique", "Code": "MZ" },
  { "Country": "Ghana", "Code": "GH" },
  { "Country": "Yemen", "Code": "YE" },
  { "Country": "Nepal", "Code": "NP" },
  { "Country": "Venezuela", "Code": "VE" },
  { "Country": "Madagascar", "Code": "MG" },
  { "Country": "Cameroon", "Code": "CM" },
  { "Country": "Cote d'Ivoire", "Code": "CI" },
  { "Country": "Australia", "Code": "AU" },
  { "Country": "Niger", "Code": "NE" },
  { "Country": "Sri Lanka", "Code": "LK" },
  { "Country": "Burkina Faso", "Code": "BF" },
  { "Country": "Mali", "Code": "ML" },
  { "Country": "Romania", "Code": "RO" },
  { "Country": "Malawi", "Code": "MW" },
  { "Country": "Chile", "Code": "CL" },
  { "Country": "Kazakhstan", "Code": "KZ" },
  { "Country": "Zambia", "Code": "ZM" },
  { "Country": "Guatemala", "Code": "GT" },
  { "Country": "Ecuador", "Code": "EC" },
  { "Country": "Syria", "Code": "SY" },
  { "Country": "Netherlands", "Code": "NL" },
  { "Country": "Senegal", "Code": "SN" },
  { "Country": "Colombia", "Code": "CO" },
  { "Country": "Chad", "Code": "TD" },
  { "Country": "Somalia", "Code": "SO" },
  { "Country": "Zimbabwe", "Code": "ZW" },
  { "Country": "Guinea", "Code": "GN" },
  { "Country": "Rwanda", "Code": "RW" },
  { "Country": "Benin", "Code": "BJ" },
  { "Country": "Burundi", "Code": "BI" },
  { "Country": "Tunisia", "Code": "TN" },
  { "Country": "Bolivia", "Code": "BO" },
  { "Country": "Belgium", "Code": "BE" },
  { "Country": "Haiti", "Code": "HT" },
  { "Country": "Cuba", "Code": "CU" },
  { "Country": "South Sudan", "Code": "SS" },
  { "Country": "Dominican Republic", "Code": "DO" },
  { "Country": "Czech Republic", "Code": "CZ" }
].sort((a, b) => a.Country.localeCompare(b.Country));


export const STATES = [
  {
    "Id": 1,
    "State": "AK"
  },
  {
    "Id": 2,
    "State": "AZ"
  },
  {
    "Id": 3,
    "State": "AR"
  },
  {
    "Id": 4,
    "State": "CA"
  },
  {
    "Id": 5,
    "State": "CZ"
  },
  {
    "Id": 6,
    "State": "CO"
  },
  {
    "Id": 7,
    "State": "CT"
  },
  {
    "Id": 8,
    "State": "DE"
  },
  {
    "Id": 9,
    "State": "DC"
  },
  {
    "Id": 10,
    "State": "FL"
  },
  {
    "Id": 11,
    "State": "GA"
  },
  {
    "Id": 12,
    "State": "GU"
  },
  {
    "Id": 13,
    "State": "HI"
  },
  {
    "Id": 14,
    "State": "ID"
  },
  {
    "Id": 15,
    "State": "IL"
  },
  {
    "Id": 16,
    "State": "IN"
  },
  {
    "Id": 17,
    "State": "IA"
  },
  {
    "Id": 18,
    "State": "KS"
  },
  {
    "Id": 19,
    "State": "KY"
  },
  {
    "Id": 20,
    "State": "LA"
  },
  {
    "Id": 21,
    "State": "ME"
  },
  {
    "Id": 22,
    "State": "MD"
  },
  {
    "Id": 23,
    "State": "MA"
  },
  {
    "Id": 24,
    "State": "MY"
  },
  {
    "Id": 25,
    "State": "MN"
  },
  {
    "Id": 26,
    "State": "MS"
  },
  {
    "Id": 27,
    "State": "MO"
  },
  {
    "Id": 28,
    "State": "MT"
  },
  {
    "Id": 29,
    "State": "NE"
  },
  {
    "Id": 30,
    "State": "NV"
  },
  {
    "Id": 31,
    "State": "NH"
  },
  {
    "Id": 32,
    "State": "NJ"
  },
  {
    "Id": 33,
    "State": "NM"
  },
  {
    "Id": 34,
    "State": "NY"
  },
  {
    "Id": 35,
    "State": "NC"
  },
  {
    "Id": 36,
    "State": "ND"
  },
  {
    "Id": 37,
    "State": "OH"
  },
  {
    "Id": 38,
    "State": "OK"
  },
  {
    "Id": 39,
    "State": "OR"
  },
  {
    "Id": 40,
    "State": "PA"
  },
  {
    "Id": 41,
    "State": "PR"
  },
  {
    "Id": 42,
    "State": "RI"
  },
  {
    "Id": 43,
    "State": "SC"
  },
  {
    "Id": 44,
    "State": "SD"
  },
  {
    "Id": 45,
    "State": "TN"
  },
  {
    "Id": 46,
    "State": "TX"
  },
  {
    "Id": 47,
    "State": "UT"
  },
  {
    "Id": 48,
    "State": "VT"
  },
  {
    "Id": 49,
    "State": "VI"
  },
  {
    "Id": 50,
    "State": "VA"
  },
  {
    "Id": 51,
    "State": "WV"
  },
  {
    "Id": 52,
    "State": "WI"
  },
  {
    "Id": 53,
    "State": "WY"
  },
  {
    "Id": 55,
    "State": "NL"
  },
  {
    "Id": 56,
    "State": "PE"
  },
  {
    "Id": 57,
    "State": "NS"
  },
  {
    "Id": 58,
    "State": "NB"
  },
  {
    "Id": 59,
    "State": "QC"
  },
  {
    "Id": 60,
    "State": "ON"
  },
  {
    "Id": 61,
    "State": "MB"
  },
  {
    "Id": 62,
    "State": "SK"
  },
  {
    "Id": 63,
    "State": "AB"
  },
  {
    "Id": 64,
    "State": "BC"
  },
  {
    "Id": 65,
    "State": "YT"
  },
  {
    "Id": 66,
    "State": "NT"
  },
  {
    "Id": 67,
    "State": "NU"
  }
]

export const RESPONSE = [
  {
    "id": 1,
    "Response": "4 Hours"
  },
  {
    "id": 2,
    "Response": "8 Hours"
  },
  {
    "id": 3,
    "Response": "12 Hours"
  },
  {
    "id": 4,
    "Response": "24 Hours"
  },
  {
    "id": 5,
    "Response": "48 Hours"
  },
  {
    "id": 6,
    "Response": "72 Hours"
  }
]

export const US_STATES = STATES.map(item => item.State)
export const AUST_STATES =
  [
    "ACT",
    "NSW",
    "NT",
    "QLD",
    "SA",
    "TAS",
    'VIC'
  ];
export const UK_STATES = [
  "BDF",
  "BKM",
  "BRK",
  "CAM",
  "CHS",
  "CON",
  "CUL",
  "DBY",
  "DEV",
  "DOR",
  "DUR",
  "ERY",
  "ESS",
  "GLS",
  "HAM",
  "HEF",
  "HRT",
  "HUN",
  "KEN",
  "LAN",
  "LEI",
  "LIN",
  "MDX",
  "NBL",
  "NFK",
  "NRY",
  "NTH",
  "NTT",
  "OXF",
  "RUT",
  "SAL",
  "SFK",
  "SOM",
  "SRY",
  "SSX",
  "STS",
  "WAR",
  "WES",
  "WIL",
  "WOR",
  "WRY",
  "YKS",
]

export const CAN_STATES = [
  "ALB",
  "BC",
  "LAB",
  "MAN",
  "NB",
  "NFD",
  "NS",
  "NU",
  "NWT",
  "ONT",
  "PEI",
  "QUE",
  "SAS",
  "YT",
]

export const COMMISSION_DATA = [
  {
    lower: 0,
    higher: 60,
    time: "00-60 Hr",
    percent: 20,
  },
  {
    lower: 61,
    higher: 120,
    time: "61-120 Hr",

    percent: 18,
  },
  {
    lower: 121,
    higher: 180,
    time: "121-180 Hr",

    percent: 16,
  },
  {
    lower: 181,
    higher: 240,
    time: "181-240 Hr",

    percent: 14,
  },
  {
    lower: 241,
    higher: 300,
    time: "241-300 Hr",
    percent: 12,
  },
  {
    lower: 301,
    time: '301 > Hr',
    percent: 10,
  },
  {
    time: 'Demo Lesson',
    percent: '50%',
  }
]

// const setDefaultHours = `
// update  TutorSetup set disableHoursRange = '[["1:00 am","2:00 am"],["2:00 am","3:00 am"],["3:00 am","4:00 am"],["4:00 am","5:00 am"],["5:00 am","6:00 am"],["7:00 am","8:00 am"],["9:00 pm","10:00 pm"],["10:00 pm","11:00 pm"],["11:00 pm","12:00 am (midnight)"],["6:00 am","7:00 am"],["12:00 am","1:00 am","midnight"]]'
// ALTER TABLE TutorSetup
// add disableHoursRange VARCHAR(MAX) DEFAULT '[["1:00 am","2:00 am"],["2:00 am","3:00 am"],["3:00 am","4:00 am"],["4:00 am","5:00 am"],["5:00 am","6:00 am"],["7:00 am","8:00 am"],["9:00 pm","10:00 pm"],["10:00 pm","11:00 pm"],["11:00 pm","12:00 am (midnight)"],["6:00 am","7:00 am"],["12:00 am","1:00 am","midnight"]]'
// `
export const loggedInAdmin = {}

export const languages = [
  'Afrikaans',
  'Albanian',
  'Arabic',
  'Armenian',
  'Basque',
  'Bengali',
  'Bulgarian',
  'Catalan',
  'Cambodian',
  'Chinese (Mandarin)',
  'Croatian',
  'Czech',
  'Danish',
  'Dutch',
  'English',
  'Estonian',
  'Fiji',
  'Finnish',
  'French',
  'Georgian',
  'German',
  'Greek',
  'Gujarati',
  'Hebrew',
  'Hindi',
  'Hungarian',
  'Icelandic',
  'Indonesian',
  'Irish',
  'Italian',
  'Japanese',
  'Javanese',
  'Korean',
  'Latin',
  'Latvian',
  'Lithuanian',
  'Macedonian',
  'Malay',
  'Malayalam',
  'Maltese',
  'Maori',
  'Marathi',
  'Mongolian',
  'Nepali',
  'Norwegian',
  'Persian',
  'Polish',
  'Portuguese',
  'Punjabi',
  'Quechua',
  'Romanian',
  'Russian',
  'Samoan',
  'Serbian',
  'Slovak',
  'Slovenian',
  'Spanish',
  'Swahili',
  'Swedish',
  'Tamil',
  'Tatar',
  'Telugu',
  'Thai',
  'Tibetan',
  'Tonga',
  'Turkish',
  'Ukrainian',
  'Urdu',
  'Uzbek',
  'Vietnamese',
  'Welsh',
  'Xhosa',
];

export const STEPS = ['',
  'setup',
  'education',
  'rates',
  'accounting',
]

export const PROFILE_STATUS = {
  PENDING: "pending",
  UNDER_REVIEW: "under-review",
  ACTIVE: 'active',
  SUSPENDED: "suspended",
  CLOSED: "closed",
  DISAPPROVED: 'disapproved'
}

export const statesColours = {
  'pending': { bg: "#e2e222", color: 'black' },
  'active': { bg: "#1fe010", color: 'black' },
  "under-review": { bg: "#d5a414", color: 'black' },
  "suspended": { bg: "#9210e0", color: 'white' },
  "disapproved": { bg: "#dd1919", color: 'white' },
  "closed": { bg: "#000", color: 'white' },
}

export const DEFAULT_URL_AFTER_LOGIN = {
  admin: "/admin/tutor-data",
  tutor: "/tutor/intro",
  student: "/student/intro"
}


// const countriesWithUnicodeFlags = [
//   { name: 'Angola', flag: '🇦🇴' },
//   { name: 'Burkina Faso', flag: '🇧🇫' },
//   { name: 'Burundi', flag: '🇧🇮' },
//   { name: 'Benin', flag: '🇧🇯' },
//   { name: 'Botswana', flag: '🇧🇼' },
//   { name: 'Democratic Republic of the Congo', flag: '🇨🇩' },
//   { name: 'Central African Republic', flag: '🇨🇫' },
//   { name: 'Republic of the Congo', flag: '🇨🇬' },
//   { name: 'Côte d\'Ivoire', flag: '🇨🇮' },
//   { name: 'Cameroon', flag: '🇨🇲' },
//   { name: 'Cape Verde', flag: '🇨🇻' },
//   { name: 'Djibouti', flag: '🇩🇯' },
//   { name: 'Algeria', flag: '🇩🇿' },
//   { name: 'Egypt', flag: '🇪🇬' },
//   { name: 'Western Sahara', flag: '🇪🇭' },
//   { name: 'Eritrea', flag: '🇪🇷' },
//   { name: 'Ethiopia', flag: '🇪🇹' },
//   { name: 'Gabon', flag: '🇬🇦' },
//   { name: 'Ghana', flag: '🇬🇭' },
//   { name: 'Gambia', flag: '🇬🇲' },
//   { name: 'Guinea', flag: '🇬🇳' },
//   { name: 'Equatorial Guinea', flag: '🇬🇶' },
//   { name: 'Guinea-Bissau', flag: '🇬🇼' },
//   { name: 'Kenya', flag: '🇰🇪' },
//   { name: 'Comoros', flag: '🇰🇲' },
//   { name: 'Liberia', flag: '🇱🇷' },
//   { name: 'Lesotho', flag: '🇱🇸' },
//   { name: 'Libya', flag: '🇱🇾' },
//   { name: 'Morocco', flag: '🇲🇦' },
//   { name: 'Madagascar', flag: '🇲🇬' },
//   { name: 'Mali', flag: '🇲🇱' },
//   { name: 'Mauritania', flag: '🇲🇷' },
//   { name: 'Mauritius', flag: '🇲🇺' },
//   { name: 'Malawi', flag: '🇲🇼' },
//   { name: 'Mozambique', flag: '🇲🇿' },
//   { name: 'Namibia', flag: '🇳🇦' },
//   { name: 'Niger', flag: '🇳🇪' },
//   { name: 'Nigeria', flag: '🇳🇬' },
//   { name: 'Rwanda', flag: '🇷🇼' },
//   { name: 'Seychelles', flag: '🇸🇨' },
//   { name: 'Sudan', flag: '🇸🇩' },
//   { name: 'Sierra Leone', flag: '🇸🇱' },
//   { name: 'Senegal', flag: '🇸🇳' },
//   { name: 'Somalia', flag: '🇸🇴' },
//   { name: 'South Sudan', flag: '🇸🇸' },
//   { name: 'Eswatini', flag: '🇸🇿' },
//   { name: 'Chad', flag: '🇹🇩' },
//   { name: 'Togo', flag: '🇹🇬' },
//   { name: 'Tunisia', flag: '🇹🇳' },
//   { name: 'Tanzania', flag: '🇹🇿' },
//   { name: 'Uganda', flag: '🇺🇬' },
//   { name: 'Zambia', flag: '🇿🇲' },
//   { name: 'Zimbabwe', flag: '🇿🇼' },
//   // ... (The Americas, Asia & The Middle East, Europe, Oceania, Island Nations & Territories)
// ];

