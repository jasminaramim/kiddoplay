// Rich structured datasets for KiddoPlay's 15 Learn & Phonics games

export interface PhonicsCard {
  letter: string;
  word: string;
  wordBn: string;
  phonicsSound: string;
  emoji: string;
  color: string;
}

export const PHONICS_ALPHABET: PhonicsCard[] = [
  { letter: 'A', word: 'Apple', wordBn: 'আপেল', phonicsSound: 'ah', emoji: '🍎', color: 'bg-rose-100 border-rose-300 text-rose-800' },
  { letter: 'B', word: 'Ball', wordBn: 'বল', phonicsSound: 'buh', emoji: '⚽', color: 'bg-sky-100 border-sky-300 text-sky-800' },
  { letter: 'C', word: 'Cat', wordBn: 'বিড়াল', phonicsSound: 'kuh', emoji: '🐱', color: 'bg-amber-100 border-amber-300 text-amber-800' },
  { letter: 'D', word: 'Dog', wordBn: 'কুকুর', phonicsSound: 'duh', emoji: '🐶', color: 'bg-orange-100 border-orange-300 text-orange-800' },
  { letter: 'E', word: 'Elephant', wordBn: 'হাতি', phonicsSound: 'eh', emoji: '🐘', color: 'bg-indigo-100 border-indigo-300 text-indigo-800' },
  { letter: 'F', word: 'Fish', wordBn: 'মাছ', phonicsSound: 'fuh', emoji: '🐟', color: 'bg-cyan-100 border-cyan-300 text-cyan-800' },
  { letter: 'G', word: 'Grapes', wordBn: 'আঙুর', phonicsSound: 'guh', emoji: '🍇', color: 'bg-purple-100 border-purple-300 text-purple-800' },
  { letter: 'H', word: 'Hat', wordBn: 'টুপি', phonicsSound: 'huh', emoji: '👒', color: 'bg-pink-100 border-pink-300 text-pink-800' },
  { letter: 'I', word: 'Ice Cream', wordBn: 'আইসক্রিম', phonicsSound: 'ih', emoji: '🍦', color: 'bg-fuchsia-100 border-fuchsia-300 text-fuchsia-800' },
  { letter: 'J', word: 'Juice', wordBn: 'জুস', phonicsSound: 'juh', emoji: '🧃', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
  { letter: 'K', word: 'Kite', wordBn: 'ঘুড়ি', phonicsSound: 'kuh', emoji: '🪁', color: 'bg-teal-100 border-teal-300 text-teal-800' },
  { letter: 'L', word: 'Lion', wordBn: 'সিংহ', phonicsSound: 'luh', emoji: '🦁', color: 'bg-amber-100 border-amber-300 text-amber-800' },
  { letter: 'M', word: 'Monkey', wordBn: 'বানর', phonicsSound: 'muh', emoji: '🐵', color: 'bg-orange-100 border-orange-300 text-orange-800' },
  { letter: 'N', word: 'Nest', wordBn: 'পাখির বাসা', phonicsSound: 'nuh', emoji: '🪺', color: 'bg-lime-100 border-lime-300 text-lime-800' },
  { letter: 'O', word: 'Orange', wordBn: 'কমলা', phonicsSound: 'aw', emoji: '🍊', color: 'bg-orange-100 border-orange-300 text-orange-800' },
  { letter: 'P', word: 'Panda', wordBn: 'পান্ডা', phonicsSound: 'puh', emoji: '🐼', color: 'bg-slate-100 border-slate-300 text-slate-800' },
  { letter: 'Q', word: 'Queen', wordBn: 'রানী', phonicsSound: 'kwuh', emoji: '👑', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
  { letter: 'R', word: 'Rocket', wordBn: 'রকেট', phonicsSound: 'ruh', emoji: '🚀', color: 'bg-violet-100 border-violet-300 text-violet-800' },
  { letter: 'S', word: 'Sun', wordBn: 'সূর্য', phonicsSound: 'suh', emoji: '☀️', color: 'bg-amber-100 border-amber-300 text-amber-800' },
  { letter: 'T', word: 'Tiger', wordBn: 'বাঘ', phonicsSound: 'tuh', emoji: '🐯', color: 'bg-orange-100 border-orange-300 text-orange-800' },
  { letter: 'U', word: 'Umbrella', wordBn: 'ছাতা', phonicsSound: 'uh', emoji: '☂️', color: 'bg-sky-100 border-sky-300 text-sky-800' },
  { letter: 'V', word: 'Violin', wordBn: 'বেহালা', phonicsSound: 'vuh', emoji: '🎻', color: 'bg-rose-100 border-rose-300 text-rose-800' },
  { letter: 'W', word: 'Whale', wordBn: 'তিমি', phonicsSound: 'wuh', emoji: '🐳', color: 'bg-blue-100 border-blue-300 text-blue-800' },
  { letter: 'X', word: 'Xylophone', wordBn: 'জাইলোফোন', phonicsSound: 'eks', emoji: '🎼', color: 'bg-indigo-100 border-indigo-300 text-indigo-800' },
  { letter: 'Y', word: 'Yacht', wordBn: 'নৌকা', phonicsSound: 'yuh', emoji: '⛵', color: 'bg-cyan-100 border-cyan-300 text-cyan-800' },
  { letter: 'Z', word: 'Zebra', wordBn: 'জেব্রা', phonicsSound: 'zuh', emoji: '🦓', color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
];

export interface WordItem {
  word: string;
  wordBn: string;
  emoji: string;
  hint: string;
  level: 'easy' | 'medium' | 'hard';
}

export const WORD_BUILDER_WORDS: WordItem[] = [
  { word: 'CAT', wordBn: 'বিড়াল', emoji: '🐱', hint: 'A cute pet that says Meow!', level: 'easy' },
  { word: 'DOG', wordBn: 'কুকুর', emoji: '🐶', hint: 'A loyal friend that barks Woof!', level: 'easy' },
  { word: 'SUN', wordBn: 'সূর্য', emoji: '☀️', hint: 'Shines bright in the sky!', level: 'easy' },
  { word: 'BUS', wordBn: 'বাস', emoji: '🚌', hint: 'Takes kids to school!', level: 'easy' },
  { word: 'HAT', wordBn: 'টুপি', emoji: '👒', hint: 'You wear it on your head!', level: 'easy' },
  { word: 'BEE', wordBn: 'মৌমাছি', emoji: '🐝', hint: 'Makes sweet honey!', level: 'easy' },
  { word: 'BALL', wordBn: 'বল', emoji: '⚽', hint: 'Bounce or kick it in games!', level: 'medium' },
  { word: 'STAR', wordBn: 'তারা', emoji: '⭐', hint: 'Twinkles in the night sky!', level: 'medium' },
  { word: 'FISH', wordBn: 'মাছ', emoji: '🐟', hint: 'Swims happily in water!', level: 'medium' },
  { word: 'TREE', wordBn: 'গাছ', emoji: '🌳', hint: 'Has green leaves and gives shade!', level: 'medium' },
  { word: 'BOOK', wordBn: 'বই', emoji: '📖', hint: 'Full of fun stories to read!', level: 'medium' },
  { word: 'FROG', wordBn: 'ব্যাঙ', emoji: '🐸', hint: 'Green jumper that says Ribbit!', level: 'medium' },
  { word: 'APPLE', wordBn: 'আপেল', emoji: '🍎', hint: 'A crunchy red fruit!', level: 'hard' },
  { word: 'TRAIN', wordBn: 'ট্রেন', emoji: '🚂', hint: 'Rides on tracks and says Choo Choo!', level: 'hard' },
  { word: 'TIGER', wordBn: 'বাঘ', emoji: '🐯', hint: 'Big striped wild cat!', level: 'hard' },
  { word: 'CLOUD', wordBn: 'মেঘ', emoji: '☁️', hint: 'Fluffy white puffs in the sky!', level: 'hard' },
  { word: 'EARTH', wordBn: 'পৃথিবী', emoji: '🌍', hint: 'Our home planet!', level: 'hard' },
  { word: 'SMILE', wordBn: 'হাসি', emoji: '😊', hint: 'What you do when you are happy!', level: 'hard' },
];

export interface AnimalItem {
  id: string;
  name: string;
  nameBn: string;
  emoji: string;
  soundText: string;
  effect: 'moo' | 'bark' | 'meow' | 'chirp' | 'roar' | 'duck' | 'sheep' | 'frog';
  fact: string;
}

export const ANIMALS_QUIZ: AnimalItem[] = [
  { id: 'cow', name: 'Cow', nameBn: 'গরু', emoji: '🐮', soundText: 'Moo! Moo!', effect: 'moo', fact: 'Cows have best friends and love listening to calm music!' },
  { id: 'dog', name: 'Dog', nameBn: 'কুকুর', emoji: '🐶', soundText: 'Woof! Woof!', effect: 'bark', fact: 'Dogs have an amazing sense of smell and wag their tails when happy.' },
  { id: 'cat', name: 'Cat', nameBn: 'বিড়াল', emoji: '🐱', soundText: 'Meow! Meow!', effect: 'meow', fact: 'Cats spend nearly 70% of their lives taking cozy naps!' },
  { id: 'bird', name: 'Bird', nameBn: 'পাখি', emoji: '🐦', soundText: 'Tweet! Tweet!', effect: 'chirp', fact: 'Birds have hollow lightweight bones that help them soar in the sky.' },
  { id: 'lion', name: 'Lion', nameBn: 'সিংহ', emoji: '🦁', soundText: 'Roar! Roar!', effect: 'roar', fact: 'A lion’s mighty roar can be heard from 5 miles away!' },
  { id: 'duck', name: 'Duck', nameBn: 'হাঁস', emoji: '🦆', soundText: 'Quack! Quack!', effect: 'duck', fact: 'Ducks have waterproof feathers that keep them dry in ponds.' },
  { id: 'sheep', name: 'Sheep', nameBn: 'ভেড়া', emoji: '🐑', soundText: 'Baa! Baa!', effect: 'sheep', fact: 'Sheep can remember up to 50 different faces for years!' },
  { id: 'frog', name: 'Frog', nameBn: 'ব্যাঙ', emoji: '🐸', soundText: 'Ribbit! Ribbit!', effect: 'frog', fact: 'Frogs drink water through their skin instead of their mouths!' },
];

export interface BanglaLetter {
  char: string;
  roman: string;
  word: string;
  meaningEn: string;
  emoji: string;
  group: 'vowel' | 'consonant';
}

export const BANGLA_LETTERS: BanglaLetter[] = [
  { char: 'অ', roman: 'O (Aw)', word: 'অজগর', meaningEn: 'Python', emoji: '🐍', group: 'vowel' },
  { char: 'আ', roman: 'Aa', word: 'আম', meaningEn: 'Mango', emoji: '🥭', group: 'vowel' },
  { char: 'ই', roman: 'I (Ee)', word: 'ইলিশ', meaningEn: 'Hilsa Fish', emoji: '🐟', group: 'vowel' },
  { char: 'ঈ', roman: 'Ii', word: 'ঈগল', meaningEn: 'Eagle', emoji: '🦅', group: 'vowel' },
  { char: 'উ', roman: 'U', word: 'উট', meaningEn: 'Camel', emoji: '🐪', group: 'vowel' },
  { char: 'ঊ', roman: 'Uu', word: 'ঊর্মি', meaningEn: 'Ocean Wave', emoji: '🌊', group: 'vowel' },
  { char: 'ঋ', roman: 'Ri', word: 'ঋতু', meaningEn: 'Season', emoji: '🌦️', group: 'vowel' },
  { char: 'এ', roman: 'E', word: 'একতারা', meaningEn: 'Ektara', emoji: '🪕', group: 'vowel' },
  { char: 'ঐ', roman: 'Oi', word: 'ঐরাবত', meaningEn: 'Elephant', emoji: '🐘', group: 'vowel' },
  { char: 'ও', roman: 'O', word: 'ওল', meaningEn: 'Yam', emoji: '🥔', group: 'vowel' },
  { char: 'ঔ', roman: 'Ou', word: 'ঔষধ', meaningEn: 'Medicine', emoji: '💊', group: 'vowel' },
  { char: 'ক', roman: 'Ko', word: 'কলা', meaningEn: 'Banana', emoji: '🍌', group: 'consonant' },
  { char: 'খ', roman: 'Kho', word: 'খরগোশ', meaningEn: 'Rabbit', emoji: '🐰', group: 'consonant' },
  { char: 'গ', roman: 'Go', word: 'গরু', meaningEn: 'Cow', emoji: '🐮', group: 'consonant' },
  { char: 'ঘ', roman: 'Gho', word: 'ঘুড়ি', meaningEn: 'Kite', emoji: '🪁', group: 'consonant' },
  { char: 'চ', roman: 'Cho', word: 'চাঁদ', meaningEn: 'Moon', emoji: '🌙', group: 'consonant' },
  { char: 'ছ', roman: 'Chho', word: 'ছাতা', meaningEn: 'Umbrella', emoji: '☂️', group: 'consonant' },
  { char: 'জ', roman: 'Jo', word: 'জাহাজ', meaningEn: 'Ship', emoji: '🚢', group: 'consonant' },
  { char: 'ত', roman: 'To', word: 'তারা', meaningEn: 'Star', emoji: '⭐', group: 'consonant' },
  { char: 'ন', roman: 'No', word: 'নৌকা', meaningEn: 'Boat', emoji: '⛵', group: 'consonant' },
  { char: 'প', roman: 'Po', word: 'পাখি', meaningEn: 'Bird', emoji: '🐦', group: 'consonant' },
  { char: 'ফ', roman: 'Pho', word: 'ফুল', meaningEn: 'Flower', emoji: '🌸', group: 'consonant' },
  { char: 'ব', roman: 'Bo', word: 'বাঘ', meaningEn: 'Tiger', emoji: '🐯', group: 'consonant' },
  { char: 'ম', roman: 'Mo', word: 'মাছ', meaningEn: 'Fish', emoji: '🐠', group: 'consonant' },
];

export interface CountryQuestion {
  country: string;
  countryBn: string;
  flag: string;
  capital: string;
  continent: string;
  landmark: string;
  emoji: string;
}

export const WORLD_COUNTRIES: CountryQuestion[] = [
  { country: 'Bangladesh', countryBn: 'বাংলাদেশ', flag: '🇧🇩', capital: 'Dhaka', continent: 'Asia', landmark: 'Sundarbans Mangrove Forest', emoji: '🐯' },
  { country: 'Japan', countryBn: 'জাপান', flag: '🇯🇵', capital: 'Tokyo', continent: 'Asia', landmark: 'Mount Fuji', emoji: '🗻' },
  { country: 'France', countryBn: 'ফ্রান্স', flag: '🇫🇷', capital: 'Paris', continent: 'Europe', landmark: 'Eiffel Tower', emoji: '🗼' },
  { country: 'Egypt', countryBn: 'মিশর', flag: '🇪🇬', capital: 'Cairo', continent: 'Africa', landmark: 'Great Pyramids', emoji: '🐪' },
  { country: 'United States', countryBn: 'যুক্তরাষ্ট্র', flag: '🇺🇸', capital: 'Washington, D.C.', continent: 'North America', landmark: 'Statue of Liberty', emoji: '🗽' },
  { country: 'Brazil', countryBn: 'ব্রাজিল', flag: '🇧🇷', capital: 'Brasília', continent: 'South America', landmark: 'Amazon Rainforest', emoji: '🦜' },
  { country: 'Australia', countryBn: 'অস্ট্রেলিয়া', flag: '🇦🇺', capital: 'Canberra', continent: 'Oceania', landmark: 'Sydney Opera House', emoji: '🦘' },
  { country: 'United Kingdom', countryBn: 'যুক্তরাজ্য', flag: '🇬🇧', capital: 'London', continent: 'Europe', landmark: 'Big Ben', emoji: '🕰️' },
  { country: 'India', countryBn: 'ভারত', flag: '🇮🇳', capital: 'New Delhi', continent: 'Asia', landmark: 'Taj Mahal', emoji: '🕌' },
  { country: 'Canada', countryBn: 'কানাডা', flag: '🇨🇦', capital: 'Ottawa', continent: 'North America', landmark: 'Niagara Falls', emoji: '🍁' },
];

export interface PlanetInfo {
  name: string;
  nameBn: string;
  order: number;
  color: string;
  sizePx: number;
  emoji: string;
  fact: string;
  question: string;
}

export const SOLAR_PLANETS: PlanetInfo[] = [
  { name: 'Sun', nameBn: 'সূর্য', order: 0, color: '#F59E0B', sizePx: 54, emoji: '☀️', fact: 'The Sun is a glowing star at the center of our Solar System!', question: 'Which bright star sits at the center of our Solar System?' },
  { name: 'Mercury', nameBn: 'বুধ', order: 1, color: '#94A3B8', sizePx: 22, emoji: '🪨', fact: 'Mercury is the smallest planet and the closest one to the Sun.', question: 'Which is the smallest planet and closest to the Sun?' },
  { name: 'Venus', nameBn: 'শুক্র', order: 2, color: '#FBBF24', sizePx: 28, emoji: '✨', fact: 'Venus is the hottest and brightest planet in our night sky!', question: 'Which planet is the hottest in our Solar System?' },
  { name: 'Earth', nameBn: 'পৃথিবী', order: 3, color: '#0EA5E9', sizePx: 30, emoji: '🌍', fact: 'Earth is our home planet covered mostly in blue oceans!', question: 'Which blue planet is our home with liquid water and life?' },
  { name: 'Mars', nameBn: 'মঙ্গল', order: 4, color: '#EF4444', sizePx: 26, emoji: '🔴', fact: 'Mars is called the Red Planet because of rusty red dust!', question: 'Which planet is famous as the Red Planet?' },
  { name: 'Jupiter', nameBn: 'বৃহস্পতি', order: 5, color: '#FB923C', sizePx: 44, emoji: '🟠', fact: 'Jupiter is the biggest planet and has a giant swirling storm!', question: 'Which is the largest planet in our Solar System?' },
  { name: 'Saturn', nameBn: 'শনি', order: 6, color: '#EAB308', sizePx: 40, emoji: '🪐', fact: 'Saturn wears sparkling icy rings around its middle!', question: 'Which planet is famous for its bright icy rings?' },
  { name: 'Uranus', nameBn: 'ইউরেনাস', order: 7, color: '#22D3EE', sizePx: 32, emoji: '🧊', fact: 'Uranus is an icy blue planet that spins on its side!', question: 'Which ice-giant planet spins tilted on its side?' },
  { name: 'Neptune', nameBn: 'নেপচুন', order: 8, color: '#3B82F6', sizePx: 32, emoji: '🔵', fact: 'Neptune is the farthest windy deep-blue planet from the Sun.', question: 'Which deep-blue planet is farthest from the Sun?' },
];

export interface FoodItem {
  name: string;
  nameBn: string;
  emoji: string;
  category: 'healthy' | 'treat';
  tip: string;
}

export const FOOD_SORTER_ITEMS: FoodItem[] = [
  { name: 'Apple', nameBn: 'আপেল', emoji: '🍎', category: 'healthy', tip: 'Apples give you vitamins and fiber!' },
  { name: 'Broccoli', nameBn: 'ব্রকলি', emoji: '🥦', category: 'healthy', tip: 'Broccoli makes your bones and body strong!' },
  { name: 'Carrot', nameBn: 'গাজর', emoji: '🥕', category: 'healthy', tip: 'Carrots help keep your eyes sharp!' },
  { name: 'Banana', nameBn: 'কলা', emoji: '🍌', category: 'healthy', tip: 'Bananas give quick natural energy for play!' },
  { name: 'Watermelon', nameBn: 'তরমুজ', emoji: '🍉', category: 'healthy', tip: 'Watermelon keeps you cool and hydrated!' },
  { name: 'Milk', nameBn: 'দুধ', emoji: '🥛', category: 'healthy', tip: 'Milk has calcium for strong teeth!' },
  { name: 'Donut', nameBn: 'ডোনাট', emoji: '🍩', category: 'treat', tip: 'Sugary donuts are an occasional treat, not everyday fuel!' },
  { name: 'Candy', nameBn: 'ক্যান্ডি', emoji: '🍬', category: 'treat', tip: 'Too much candy can hurt your teeth!' },
  { name: 'Soda', nameBn: 'কোমল পানীয়', emoji: '🥤', category: 'treat', tip: 'Water and fresh juice are much healthier than sugary soda!' },
  { name: 'French Fries', nameBn: 'ফ্রেঞ্চ ফ্রাই', emoji: '🍟', category: 'treat', tip: 'Fried snacks are best eaten only once in a while!' },
  { name: 'Cupcake', nameBn: 'কাপকেক', emoji: '🧁', category: 'treat', tip: 'Save cupcakes for special birthday parties!' },
  { name: 'Avocado', nameBn: 'অ্যাভোকাডো', emoji: '🥑', category: 'healthy', tip: 'Avocados are packed with brain-healthy nutrients!' },
];

export interface VehicleItem {
  name: string;
  nameBn: string;
  emoji: string;
  soundLabel: string;
  effect: 'car' | 'bus' | 'train' | 'siren' | 'plane' | 'ship';
  clue: string;
}

export const VEHICLE_QUIZ_ITEMS: VehicleItem[] = [
  { name: 'School Bus', nameBn: 'স্কুল বাস', emoji: '🚌', soundLabel: 'Beep! Beep!', effect: 'bus', clue: 'A big yellow vehicle that carries children to school.' },
  { name: 'Train', nameBn: 'ট্রেন', emoji: '🚂', soundLabel: 'Choo! Choo!', effect: 'train', clue: 'Travels fast along steel railroad tracks.' },
  { name: 'Fire Truck', nameBn: 'দমকল গাড়ি', emoji: '🚒', soundLabel: 'Wee-Ooo! Wee-Ooo!', effect: 'siren', clue: 'Rushes with ladders and water hoses to help put out fires.' },
  { name: 'Airplane', nameBn: 'উড়োজাহাজ', emoji: '✈️', soundLabel: 'Whooosh!', effect: 'plane', clue: 'Flies high above the clouds with big wings!' },
  { name: 'Car', nameBn: 'গাড়ি', emoji: '🚗', soundLabel: 'Honk! Honk!', effect: 'car', clue: 'Has four wheels and drives families along roads.' },
  { name: 'Ship', nameBn: 'জাহাজ', emoji: '🚢', soundLabel: 'Bwaaaah!', effect: 'ship', clue: 'Sails across deep blue oceans and rivers.' },
];

// ================= BANGLA SPECIAL CONTENT =================

export interface BanglaRhyme {
  id: string;
  title: string;
  poet: string;
  emoji: string;
  themeColor: string;
  lines: string[];
  linesEn: string[];
  quizQuestion: string;
  quizOptions: string[];
  correctAnswer: string;
}

export const BANGLA_RHYMES: BanglaRhyme[] = [
  {
    id: 'ata-gache',
    title: 'আতা গাছে তোতা পাখি',
    poet: 'প্রচলিত লোকছড়া',
    emoji: '🦜',
    themeColor: 'from-emerald-400 to-teal-500',
    lines: [
      'আতা গাছে তোতা পাখি',
      'ডালিম গাছে মৌ,',
      'এত ডাকি তবু কথা',
      'কও না কেন বউ?'
    ],
    linesEn: [
      'A parrot on the custard apple tree,',
      'Bees buzzing on the pomegranate tree,',
      'I call you so many times,',
      'Why don’t you speak, little bride?'
    ],
    quizQuestion: 'ডালিম গাছে কী থাকে?',
    quizOptions: ['মৌ (মৌমাছি)', 'তোতা পাখি', 'বানর', 'বিড়াল'],
    correctAnswer: 'মৌ (মৌমাছি)',
  },
  {
    id: 'bhor-holo',
    title: 'ভোর হলো দোর খোলো',
    poet: 'কাজী নজরুল ইসলাম',
    emoji: '🌅',
    themeColor: 'from-amber-400 to-rose-400',
    lines: [
      'ভোর হলো দোর খোলো',
      'খুকুমণি ওঠো রে,',
      'ঐ ডাকে জুঁই-শাখে',
      'ফুল-খুকি ছোটো রে।'
    ],
    linesEn: [
      'Dawn has broken, open the door,',
      'Wake up, little sweetheart,',
      'The jasmine branch calls out,',
      'Run out, little flower-girl!'
    ],
    quizQuestion: 'ভোর হলে কাকে উঠতে বলা হয়েছে?',
    quizOptions: ['খুকুমণি', 'চাঁদ মামা', 'সূর্য', 'টিয়া পাখি'],
    correctAnswer: 'খুকুমণি',
  },
  {
    id: 'hattimatim',
    title: 'হাট্টিমাটিম টিম',
    poet: 'রোকনুজ্জামান খান (দাদাভাই)',
    emoji: '🥚',
    themeColor: 'from-sky-400 to-indigo-500',
    lines: [
      'হাট্টিমাটিম টিম,',
      'তারা মাঠে পাড়ে ডিম,',
      'তাদের খাড়া দুটো শিং,',
      'তারা হাট্টিমাটিম টিম!'
    ],
    linesEn: [
      'Hattimatim Tim,',
      'They lay eggs in the green meadow,',
      'They have two upright horns,',
      'They are Hattimatim Tim!'
    ],
    quizQuestion: 'হাট্টিমাটিম টিমের মাথায় কয়টি খাড়া শিং?',
    quizOptions: ['দুটো', 'একটি', 'চারটি', 'তিনটি'],
    correctAnswer: 'দুটো',
  },
  {
    id: 'chad-utheche',
    title: 'চাঁদ উঠেছে ফুল ফুটেছে',
    poet: 'প্রচলিত শিশুতোষ ছড়া',
    emoji: '🌙',
    themeColor: 'from-violet-400 to-purple-500',
    lines: [
      'চাঁদ উঠেছে ফুল ফুটেছে',
      'কদম তলায় কে?',
      'হাতি নাচছে ঘোড়া নাচছে',
      'সোনামণির বে!'
    ],
    linesEn: [
      'The moon is up, blossoms bloom,',
      'Who stands beneath the kadam tree?',
      'Elephants and horses dance with joy,',
      'For our little sweetheart’s wedding!'
    ],
    quizQuestion: 'কদম তলায় কারা নাচছে?',
    quizOptions: ['হাতি ও ঘোড়া', 'বাঘ ও সিংহ', 'মাছ ও পাখি', 'বিড়াল ও কুকুর'],
    correctAnswer: 'হাতি ও ঘোড়া',
  },
  {
    id: 'aay-chhelera',
    title: 'আয় ছেলেরা আয় মেয়েরা',
    poet: 'জসীমউদ্দীন',
    emoji: '🥭',
    themeColor: 'from-orange-400 to-amber-500',
    lines: [
      'আয় ছেলেরা আয় মেয়েরা',
      'ফুল তুলিতে যাই,',
      'ফুলের মালা গলায় দিয়ে',
      'মামার বাড়ি যাই।'
    ],
    linesEn: [
      'Come boys, come girls,',
      'Let us go pick fragrant flowers,',
      'Wearing flower garlands around our necks,',
      'Off to maternal uncle’s home we go!'
    ],
    quizQuestion: 'ফুলের মালা গলায় দিয়ে কোথায় যাওয়ার কথা বলা হয়েছে?',
    quizOptions: ['মামার বাড়ি', 'স্কুলে', 'নদীর ঘাটে', 'মেলায়'],
    correctAnswer: 'মামার বাড়ি',
  },
  {
    id: 'khokon-khokon',
    title: 'খোকন খোকন ডাক পাড়ি',
    poet: 'প্রচলিত লোকছড়া',
    emoji: '👶',
    themeColor: 'from-pink-400 to-rose-400',
    lines: [
      'খোকন খোকন ডাক পাড়ি,',
      'খোকন মোদের কার বাড়ি?',
      'আয় রে খোকন ঘরে আয়,',
      'দুধে-ভাতে জুড়ো খায়।'
    ],
    linesEn: [
      'Calling Khokon again and again,',
      'At whose house is our Khokon?',
      'Come back home, dear Khokon,',
      'Enjoy sweet milk and rice!'
    ],
    quizQuestion: 'ঘরে এসে খোকন কী খাবে?',
    quizOptions: ['দুধ-ভাত', 'মিষ্টি ফল', 'পায়েস', 'আইসক্রিম'],
    correctAnswer: 'দুধ-ভাত',
  },
];

export interface BanglaWordPuzzle {
  word: string;
  meaningEn: string;
  emoji: string;
  letters: string[];
  hint: string;
}

export const BANGLA_WORD_PUZZLES: BanglaWordPuzzle[] = [
  { word: 'আম', meaningEn: 'Mango', emoji: '🥭', letters: ['আ', 'ম'], hint: 'মিষ্টি ও সুস্বাদু জাতীয় ফল!' },
  { word: 'মা', meaningEn: 'Mother', emoji: '👩', letters: ['ম', 'া'], hint: 'পৃথিবীর সবচেয়ে প্রিয় মানুষ!' },
  { word: 'বাবা', meaningEn: 'Father', emoji: '👨', letters: ['ব', 'া', 'ব', 'া'], hint: 'আমাদের পরম স্নেহের অভিভাবক!' },
  { word: 'ফুল', meaningEn: 'Flower', emoji: '🌸', letters: ['ফ', 'ু', 'ল'], hint: 'বাগানে ফুটে সুবাস ছড়ায়!' },
  { word: 'পাখি', meaningEn: 'Bird', emoji: '🐦', letters: ['প', 'া', 'খ', 'ি'], hint: 'ডানা মেলে নীল আকাশে ওড়ে!' },
  { word: 'বাঘ', meaningEn: 'Tiger', emoji: '🐯', letters: ['ব', 'া', 'ঘ'], hint: 'সুন্দরবনের ডোরাকাটা জাতীয় পশু!' },
  { word: 'মাছ', meaningEn: 'Fish', emoji: '🐟', letters: ['ম', 'া', 'ছ'], hint: 'নদী-পুকুরে সাঁতার কাটে রূপালী ইলিশ!' },
  { word: 'নদী', meaningEn: 'River', emoji: '🌊', letters: ['ন', 'দ', 'ী'], hint: 'কুলকুল রবে সাগরে বয়ে যায়!' },
  { word: 'সূর্য', meaningEn: 'Sun', emoji: '☀️', letters: ['স', 'ূ', 'র', '্', 'য'], hint: 'দিনের বেলা পৃথিবীকে আলো দেয়!' },
  { word: 'চাঁদ', meaningEn: 'Moon', emoji: '🌙', letters: ['চ', 'ঁ', 'া', 'দ'], hint: 'রাতের আকাশে রুপালি আলো ছড়ায়!' },
  { word: 'বই', meaningEn: 'Book', emoji: '📖', letters: ['ব', 'ই'], hint: 'পড়লে বাড়ে জ্ঞান ও আনন্দ!' },
  { word: 'মেঘ', meaningEn: 'Cloud', emoji: '☁️', letters: ['ম', 'ে', 'ঘ'], hint: 'আকাশে ভাসে আর বৃষ্টি ঝরায়!' },
];

export interface BanglaNumberCard {
  num: number;
  bnDigit: string;
  bnWord: string;
  enWord: string;
  emoji: string;
  itemBn: string;
}

export const BANGLA_NUMBERS: BanglaNumberCard[] = [
  { num: 1, bnDigit: '১', bnWord: 'এক', enWord: 'One', emoji: '🐘', itemBn: 'একটি বড় হাতি' },
  { num: 2, bnDigit: '২', bnWord: 'দুই', enWord: 'Two', emoji: '🐱', itemBn: 'দুটি কিউট বিড়াল' },
  { num: 3, bnDigit: '৩', bnWord: 'তিন', enWord: 'Three', emoji: '🥭', itemBn: 'তিনটি পাকা আম' },
  { num: 4, bnDigit: '৪', bnWord: 'চার', enWord: 'Four', emoji: '🌸', itemBn: 'চারটি রঙিন ফুল' },
  { num: 5, bnDigit: '৫', bnWord: 'পাঁচ', enWord: 'Five', emoji: '🎈', itemBn: 'পাঁচটি উড়ন্ত বেলুন' },
  { num: 6, bnDigit: '৬', bnWord: 'ছয়', enWord: 'Six', emoji: '⭐', itemBn: 'ছয়টি জ্বলজ্বলে তারা' },
  { num: 7, bnDigit: '৭', bnWord: 'সাত', enWord: 'Seven', emoji: '🍎', itemBn: 'সাতটি লাল আপেল' },
  { num: 8, bnDigit: '৮', bnWord: 'আট', enWord: 'Eight', emoji: '🚗', itemBn: 'আটটি খেলনা গাড়ি' },
  { num: 9, bnDigit: '৯', bnWord: 'নয়', enWord: 'Nine', emoji: '🦋', itemBn: 'নয়টি রঙিন প্রজাপতি' },
  { num: 10, bnDigit: '১০', bnWord: 'দশ', enWord: 'Ten', emoji: '🍓', itemBn: 'দশটি মিষ্টি স্ট্রবেরি' },
];

export const BANGLA_NAMTA_DATA = [
  {
    multiplier: 1,
    title: '১ এর নামতা',
    rows: [
      { text: '১ × ১ = ১', voice: 'এক একে এক' },
      { text: '১ × ২ = ২', voice: 'এক দুগুণে দুই' },
      { text: '১ × ৩ = ৩', voice: 'এক তিনে তিন' },
      { text: '১ × ৪ = ৪', voice: 'এক চারে চার' },
      { text: '১ × ৫ = ৫', voice: 'এক পাঁচে পাঁচ' },
      { text: '১ × ৬ = ৬', voice: 'এক ছয়ে ছয়' },
      { text: '১ × ৭ = ৭', voice: 'এক সাতে সাত' },
      { text: '১ × ৮ = ৮', voice: 'এক আটে আট' },
      { text: '১ × ৯ = ৯', voice: 'এক নয় এ নয়' },
      { text: '১ × ১০ = ১০', voice: 'এক দশে দশ' },
    ],
  },
  {
    multiplier: 2,
    title: '২ এর নামতা',
    rows: [
      { text: '২ × ১ = ২', voice: 'দুই একে দুই' },
      { text: '২ × ২ = ৪', voice: 'দুই দুগুণে চার' },
      { text: '২ × ৩ = ৬', voice: 'তিন দুগুণে ছয়' },
      { text: '২ × ৪ = ৮', voice: 'চার দুগুণে আট' },
      { text: '২ × ৫ = ১০', voice: 'পাঁচ দুগুণে দশ' },
      { text: '২ × ৬ = ১২', voice: 'ছয় দুগুণে বারো' },
      { text: '২ × ৭ = ১৪', voice: 'সাত দুগুণে চৌদ্দ' },
      { text: '২ × ৮ = ১৬', voice: 'আট দুগুণে ষোল' },
      { text: '২ × ৯ = ১৮', voice: 'নয় দুগুণে আঠারো' },
      { text: '২ × ১০ = ২০', voice: 'দশ দুগুণে বিশ' },
    ],
  },
  {
    multiplier: 5,
    title: '৫ এর নামতা',
    rows: [
      { text: '৫ × ১ = ৫', voice: 'পাঁচ একে পাঁচ' },
      { text: '৫ × ২ = ১০', voice: 'পাঁচ দুগুণে দশ' },
      { text: '৫ × ৩ = ১৫', voice: 'তিন পাঁচে পনেরো' },
      { text: '৫ × ৪ = ২০', voice: 'চার পাঁচে বিশ' },
      { text: '৫ × ৫ = ২৫', voice: 'পাঁচ পাঁচে পঁচিশ' },
      { text: '৫ × ৬ = ৩০', voice: 'পাঁচ ছয়ে ত্রিশ' },
      { text: '৫ × ৭ = ৩৫', voice: 'পাঁচ সাতে পঁয়ত্রিশ' },
      { text: '৫ × ৮ = ৪০', voice: 'পাঁচ আটে চল্লিশ' },
      { text: '৫ × ৯ = ৪৫', voice: 'পাঁচ নয় এ পঁয়তাল্লিশ' },
      { text: '৫ × ১০ = ৫০', voice: 'পাঁচ দশে পঞ্চাশ' },
    ],
  },
];
