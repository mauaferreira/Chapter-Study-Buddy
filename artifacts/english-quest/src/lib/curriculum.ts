import bedroomImg from "@/assets/images/bedroom.png";
import bathroomImg from "@/assets/images/bathroom.png";
import kitchenImg from "@/assets/images/kitchen.png";
import livingRoomImg from "@/assets/images/living-room.png";
import diningRoomImg from "@/assets/images/dining-room.png";
import garageImg from "@/assets/images/garage.png";
import gardenImg from "@/assets/images/garden.png";
import hallImg from "@/assets/images/hall.png";
import bedImg from "@/assets/images/bed.png";
import tableImg from "@/assets/images/table.png";
import chairImg from "@/assets/images/chair.png";
import sofaImg from "@/assets/images/sofa.png";
import lampImg from "@/assets/images/lamp.png";
import shelfImg from "@/assets/images/shelf.png";
import rugImg from "@/assets/images/rug.png";
import wardrobeImg from "@/assets/images/wardrobe.png";
import mirrorImg from "@/assets/images/mirror.png";
import tvImg from "@/assets/images/tv.png";
import doorImg from "@/assets/images/door.png";
import windowImg from "@/assets/images/window.png";

export type VocabCategory = "room" | "furniture" | "object" | "animal";

export interface VocabItem {
  word: string;
  translation: string;
  image: string;
  category: VocabCategory;
}

export const VOCAB: VocabItem[] = [
  // Rooms
  { word: "bedroom", translation: "quarto", image: bedroomImg, category: "room" },
  { word: "bathroom", translation: "banheiro", image: bathroomImg, category: "room" },
  { word: "kitchen", translation: "cozinha", image: kitchenImg, category: "room" },
  { word: "living room", translation: "sala de estar", image: livingRoomImg, category: "room" },
  { word: "dining room", translation: "sala de jantar", image: diningRoomImg, category: "room" },
  { word: "garage", translation: "garagem", image: garageImg, category: "room" },
  { word: "garden", translation: "jardim", image: gardenImg, category: "room" },
  { word: "hall", translation: "corredor", image: hallImg, category: "room" },
  // Furniture
  { word: "bed", translation: "cama", image: bedImg, category: "furniture" },
  { word: "table", translation: "mesa", image: tableImg, category: "furniture" },
  { word: "chair", translation: "cadeira", image: chairImg, category: "furniture" },
  { word: "sofa", translation: "sofá", image: sofaImg, category: "furniture" },
  { word: "lamp", translation: "luminária", image: lampImg, category: "furniture" },
  { word: "shelf", translation: "prateleira", image: shelfImg, category: "furniture" },
  { word: "rug", translation: "tapete", image: rugImg, category: "furniture" },
  { word: "wardrobe", translation: "guarda-roupa", image: wardrobeImg, category: "furniture" },
  { word: "mirror", translation: "espelho", image: mirrorImg, category: "furniture" },
  { word: "TV", translation: "televisão", image: tvImg, category: "furniture" },
  { word: "door", translation: "porta", image: doorImg, category: "object" },
  { word: "window", translation: "janela", image: windowImg, category: "object" },
];

export function getVocab(word: string): VocabItem {
  const item = VOCAB.find((v) => v.word === word);
  if (!item) throw new Error(`Vocab not found: ${word}`);
  return item;
}

export const PREPOSITIONS = [
  "in",
  "on",
  "under",
  "next to",
  "behind",
  "in front of",
  "between",
] as const;

export const PREPOSITION_TRANSLATIONS: Record<(typeof PREPOSITIONS)[number], string> = {
  in: "dentro de",
  on: "em cima de",
  under: "embaixo de",
  "next to": "ao lado de",
  behind: "atrás de",
  "in front of": "na frente de",
  between: "entre",
};

export type Preposition = (typeof PREPOSITIONS)[number];

export interface PrepositionScene {
  id: string;
  sceneKey:
    | "on-sofa"
    | "under-table"
    | "in-box"
    | "next-to-bed"
    | "behind-chair"
    | "in-front-sofa"
    | "between"
    | "on-shelf";
  sentenceParts: [string, string]; // before blank, after blank
  fullSentence: string;
  answer: Preposition;
  distractors: Preposition[];
}

export const PREPOSITION_SCENES: PrepositionScene[] = [
  {
    id: "on-sofa",
    sceneKey: "on-sofa",
    sentenceParts: ["The cat is", "the sofa."],
    fullSentence: "The cat is on the sofa.",
    answer: "on",
    distractors: ["under", "behind"],
  },
  {
    id: "under-table",
    sceneKey: "under-table",
    sentenceParts: ["The dog is", "the table."],
    fullSentence: "The dog is under the table.",
    answer: "under",
    distractors: ["on", "next to"],
  },
  {
    id: "in-box",
    sceneKey: "in-box",
    sentenceParts: ["The book is", "the box."],
    fullSentence: "The book is in the box.",
    answer: "in",
    distractors: ["on", "behind"],
  },
  {
    id: "next-to-bed",
    sceneKey: "next-to-bed",
    sentenceParts: ["The lamp is", "the bed."],
    fullSentence: "The lamp is next to the bed.",
    answer: "next to",
    distractors: ["under", "in"],
  },
  {
    id: "behind-chair",
    sceneKey: "behind-chair",
    sentenceParts: ["The ball is", "the chair."],
    fullSentence: "The ball is behind the chair.",
    answer: "behind",
    distractors: ["on", "in front of"],
  },
  {
    id: "in-front-sofa",
    sceneKey: "in-front-sofa",
    sentenceParts: ["The TV is", "the sofa."],
    fullSentence: "The TV is in front of the sofa.",
    answer: "in front of",
    distractors: ["behind", "between"],
  },
  {
    id: "between",
    sceneKey: "between",
    sentenceParts: ["The mirror is", "the window and the door."],
    fullSentence: "The mirror is between the window and the door.",
    answer: "between",
    distractors: ["on", "next to"],
  },
  {
    id: "on-shelf",
    sceneKey: "on-shelf",
    sentenceParts: ["The basket is", "the shelf."],
    fullSentence: "The basket is on the shelf.",
    answer: "on",
    distractors: ["in", "under"],
  },
];

// Picture-prepositions activity questions (alias view of PREPOSITION_SCENES with "___" sentence)
export interface PrepositionQuestion {
  id: string;
  sceneKey: PrepositionScene["sceneKey"];
  sentence: string; // contains "___"
  preposition: Preposition;
}

export const PREPOSITION_QUESTIONS: PrepositionQuestion[] = PREPOSITION_SCENES.map((s) => ({
  id: s.id,
  sceneKey: s.sceneKey,
  sentence: `${s.sentenceParts[0]} ___ ${s.sentenceParts[1]}`,
  preposition: s.answer,
}));

// Does / Doesn't yes-no questions
export interface DoesDoesntQuestion {
  id: string;
  image: string;
  question: string;
  answer: "yes" | "no";
  fullAnswer: string;
  hintPt?: string;
}

export const DOES_DOESNT_QUESTIONS: DoesDoesntQuestion[] = [
  {
    id: "bed-bedroom",
    image: bedroomImg,
    question: "Does the bed go in the bedroom?",
    answer: "yes",
    fullAnswer: "Yes, it does.",
    hintPt: "A cama fica no quarto?",
  },
  {
    id: "sofa-bathroom",
    image: bathroomImg,
    question: "Does the sofa go in the bathroom?",
    answer: "no",
    fullAnswer: "No, it doesn't.",
    hintPt: "O sofá fica no banheiro?",
  },
  {
    id: "tv-livingroom",
    image: livingRoomImg,
    question: "Does the TV go in the living room?",
    answer: "yes",
    fullAnswer: "Yes, it does.",
    hintPt: "A TV fica na sala de estar?",
  },
  {
    id: "car-garage",
    image: garageImg,
    question: "Does the car go in the garage?",
    answer: "yes",
    fullAnswer: "Yes, it does.",
    hintPt: "O carro fica na garagem?",
  },
  {
    id: "tree-kitchen",
    image: kitchenImg,
    question: "Does a tree grow in the kitchen?",
    answer: "no",
    fullAnswer: "No, it doesn't.",
    hintPt: "Uma árvore cresce na cozinha?",
  },
  {
    id: "table-dining",
    image: diningRoomImg,
    question: "Does the table go in the dining room?",
    answer: "yes",
    fullAnswer: "Yes, it does.",
    hintPt: "A mesa fica na sala de jantar?",
  },
  {
    id: "flowers-garden",
    image: gardenImg,
    question: "Do flowers grow in the garden?",
    answer: "yes",
    fullAnswer: "Yes, they do.",
    hintPt: "Flores crescem no jardim?",
  },
  {
    id: "bath-kitchen",
    image: kitchenImg,
    question: "Does the bath go in the kitchen?",
    answer: "no",
    fullAnswer: "No, it doesn't.",
    hintPt: "A banheira fica na cozinha?",
  },
  {
    id: "wardrobe-bedroom",
    image: bedroomImg,
    question: "Does the wardrobe go in the bedroom?",
    answer: "yes",
    fullAnswer: "Yes, it does.",
    hintPt: "O guarda-roupa fica no quarto?",
  },
  {
    id: "fridge-bathroom",
    image: bathroomImg,
    question: "Does the fridge go in the bathroom?",
    answer: "no",
    fullAnswer: "No, it doesn't.",
    hintPt: "A geladeira fica no banheiro?",
  },
];

// Quiz: mix of word→picture, picture→word, fill-the-preposition
export interface QuizOption {
  label: string;
  image?: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  type: "word-to-picture" | "picture-to-word" | "fill-preposition";
  prompt: string;
  speakText: string;
  image?: string;
  sceneKey?: PrepositionScene["sceneKey"];
  options: QuizOption[];
}

function pickRandom<T>(arr: T[], n: number, exclude: T[] = []): T[] {
  const filtered = arr.filter((x) => !exclude.includes(x));
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export function buildQuiz(): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const usedVocab = new Set<string>();

  // 3 word-to-picture
  const wpItems = pickRandom(VOCAB, 3);
  wpItems.forEach((item, i) => {
    usedVocab.add(item.word);
    const distractors = pickRandom(VOCAB, 3, [item]);
    const opts: QuizOption[] = [
      { label: item.word, image: item.image, isCorrect: true },
      ...distractors.map((d) => ({ label: d.word, image: d.image, isCorrect: false })),
    ].sort(() => Math.random() - 0.5);
    questions.push({
      id: `wp-${i}`,
      type: "word-to-picture",
      prompt: item.word,
      speakText: item.word,
      options: opts,
    });
  });

  // 2 picture-to-word
  const pwItems = pickRandom(
    VOCAB.filter((v) => !usedVocab.has(v.word)),
    2,
  );
  pwItems.forEach((item, i) => {
    usedVocab.add(item.word);
    const distractors = pickRandom(VOCAB, 3, [item]);
    const opts: QuizOption[] = [
      { label: item.word, isCorrect: true },
      ...distractors.map((d) => ({ label: d.word, isCorrect: false })),
    ].sort(() => Math.random() - 0.5);
    questions.push({
      id: `pw-${i}`,
      type: "picture-to-word",
      prompt: "What is this?",
      speakText: "What is this?",
      image: item.image,
      options: opts,
    });
  });

  // 3 fill-the-preposition
  const sceneSubset = pickRandom(PREPOSITION_SCENES, 3);
  sceneSubset.forEach((scene, i) => {
    const opts: QuizOption[] = [
      { label: scene.answer, isCorrect: true },
      ...scene.distractors.map((d) => ({ label: d, isCorrect: false })),
    ].sort(() => Math.random() - 0.5);
    questions.push({
      id: `fp-${i}`,
      type: "fill-preposition",
      prompt: `${scene.sentenceParts[0]} ___ ${scene.sentenceParts[1]}`,
      speakText: `${scene.sentenceParts[0]} ... ${scene.sentenceParts[1]}`,
      sceneKey: scene.sceneKey,
      options: opts,
    });
  });

  return questions.sort(() => Math.random() - 0.5);
}

// Words for unscramble — start short and easy, get longer
export const UNSCRAMBLE_WORDS = [
  getVocab("bed"),
  getVocab("TV"),
  getVocab("rug"),
  getVocab("lamp"),
  getVocab("door"),
  getVocab("sofa"),
  getVocab("chair"),
  getVocab("table"),
  getVocab("mirror"),
  getVocab("garden"),
  getVocab("kitchen"),
  getVocab("bedroom"),
];
