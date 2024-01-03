import { IconTypes } from "app/components/Icon"

import { Dimensions } from "react-native"

export const SCREEN_HEIGHT = Dimensions.get("window").height
export const SCREEN_WIDTH = Dimensions.get("window").width

export enum SortType {
  DATE_ADDDED = "date_added",
  ACTIVE = "active",
  ALPHABETICAL = "alphabetical",
  DIFFICULTY = "difficulty",
}

export type AppStackParamList = {
  Home: undefined
  Login: undefined
  Sign_Up: undefined
  Forgot_Password: undefined
  Session: undefined
  Decks: undefined
  Flashcard_List: undefined
  Global_Decks: undefined
  Deck_Add: { deck: any }
  Settings: undefined
  About: undefined
  Deck_Settings: undefined
  Password_Reset: undefined
  Terms_of_Service: undefined
  Privacy_Policy: undefined
  Open_Source: undefined
  Subscribe: undefined
  About_Stack: undefined
  User_Setup: undefined
  Progress_Conflict: undefined
  Purchase_Deck: undefined
  User_Global_Decks: undefined
  User_Global_Decks_Edit: undefined
  Tutorial: undefined
  Free_Study: undefined
  Free_Study_Session: undefined
  Deck_Home: undefined
  Multi_Add_AI: undefined
  Restart_Overdue: undefined
  Custom_Prompts: undefined
}

export enum AppRoutes {
  HOME = "Home",
  LOGIN = "Login",
  SIGN_UP = "Sign_Up",
  FORGOT_PASSWORD = "Forgot_Password",
  DECKS = "Decks",
  SESSION = "Session",
  FLASHCARD_LIST = "Flashcard_List",
  GLOBAL_DECKS = "Global_Decks",
  DECK_ADD = "Deck_Add",
  SETTINGS = "Settings",
  PASSWORD_RESET = "Password_Reset",
  ABOUT = "About",
  DECK_SETTINGS = "Deck_Settings",
  TERMS_OF_SERVICE = "Terms_of_Service",
  PRIVACY_POLICY = "Privacy_Policy",
  OPEN_SOURCE = "Open_Source",
  SUBSCRIBE = "Subscribe",
  ABOUT_STACK = "About_Stack",
  USER_SETUP = "User_Setup",
  PROGRESS_CONFLICT = "Progress_Conflict",
  PURCHASE_DECK = "Purchase_Deck",
  USER_GLOBAL_DECKS = "User_Global_Decks",
  USER_GLOBAL_DECKS_EDIT = "User_Global_Decks_Edit",
  TUTORIAL = "Tutorial",
  FREE_STUDY = "Free_Study",
  FREE_STUDY_SESSION = "Free_Study_Session",
  DECK_HOME = "Deck_Home",
  MUTLI_ADD_AI = "Multi_Add_AI",
  RESTART_OVERDUE = "Restart_Overdue",
  CUSTOM_PROMPTS = "Custom_Prompts",
}

export const SortTypeLabels = {
  [SortType.DATE_ADDDED]: "Date Added",
  [SortType.ACTIVE]: "Active",
  [SortType.ALPHABETICAL]: "Alphabetical",
  [SortType.DIFFICULTY]: "Difficulty",
}

export const SortTypeIcon: { [key: string]: IconTypes } = {
  [SortType.DATE_ADDDED]: "fluent_calendar",
  [SortType.ACTIVE]: "fluent_play_outline",
  [SortType.ALPHABETICAL]: "fluent_alpha_sort",
  [SortType.DIFFICULTY]: "difficulty",
}

export enum SoundOptions {
  FRONT = "front",
  BACK = "back",
  EXTRA = "extra",
  SUB_HEADER = "sub_header",
  EXTRA_ARRAY = "extra_array",
}

export enum SoundLanguage {
  ENGLISH = "en-US",
  SPANISH_MX = "es-MX", //Mexico spanish
  KOREAN = "ko-KR",
  GERMAN = "de-DE",
  FRENCH = "fr-FR",
  DUTCH = "nl-NL",
  MANDARIN = "zh-CN",
  JAPANESE = "ja-JP",
  THAI = "th-TH",
  ITALIAN = "it-IT",
}

export enum TranslateLanguage {
  ENGLISH = "english",
  SPANISH = "spanish",
  KOREAN = "korean",
  GERMAN = "german",
  FRENCH = "french",
  DUTCH = "dutch",
  MANDARIN = "mandarin",
  JAPANESE = "japanese",
  THAI = "thai",
  ITALIAN = "italian",
  DEFINITION = "definition",
}

export interface CustomPromptLanguageModel {
  frontLanguage: TranslateLanguage
  back_language: TranslateLanguage
  extra_language: TranslateLanguage
  extraArray_language: TranslateLanguage
  subheader_language: TranslateLanguage
}

export const soundOptionArray = [
  SoundOptions.FRONT,
  SoundOptions.BACK,
  SoundOptions.EXTRA,
  SoundOptions.EXTRA_ARRAY,
  SoundOptions.SUB_HEADER,
]

export const translateLanguageArray = [
  TranslateLanguage.ENGLISH,
  TranslateLanguage.SPANISH,
  TranslateLanguage.KOREAN,
  TranslateLanguage.GERMAN,
  TranslateLanguage.MANDARIN,
  TranslateLanguage.JAPANESE,
  TranslateLanguage.FRENCH,
  TranslateLanguage.DUTCH,
  TranslateLanguage.THAI,
  TranslateLanguage.ITALIAN,
]

export const playSoundLanguageArray = [
  SoundLanguage.ENGLISH,
  SoundLanguage.SPANISH_MX,
  SoundLanguage.KOREAN,
  SoundLanguage.GERMAN,
  SoundLanguage.FRENCH,
  SoundLanguage.DUTCH,
  SoundLanguage.MANDARIN,
  SoundLanguage.JAPANESE,
  SoundLanguage.THAI,
  SoundLanguage.ITALIAN,
]
export const aiLanguageOptions = [
  TranslateLanguage.ENGLISH,
  TranslateLanguage.SPANISH,
  TranslateLanguage.MANDARIN,
  TranslateLanguage.GERMAN,
  TranslateLanguage.JAPANESE,
  TranslateLanguage.FRENCH,
  TranslateLanguage.KOREAN,
  TranslateLanguage.DUTCH,
  TranslateLanguage.THAI,
  TranslateLanguage.ITALIAN,
]

export const defaultPromptOptions = [
  TranslateLanguage.DEFINITION,
  TranslateLanguage.SPANISH,
  TranslateLanguage.MANDARIN,
  TranslateLanguage.GERMAN,
  TranslateLanguage.JAPANESE,
  TranslateLanguage.FRENCH,
  TranslateLanguage.KOREAN,
  TranslateLanguage.DUTCH,
  TranslateLanguage.THAI,
  TranslateLanguage.ITALIAN,
]

export const languageLabels = {
  [SoundLanguage.ENGLISH]: "English",
  [SoundLanguage.SPANISH_MX]: "Spanish",
  [SoundLanguage.MANDARIN]: "Mandarin",
  [SoundLanguage.GERMAN]: "German",
  [SoundLanguage.JAPANESE]: "Japanese",
  [SoundLanguage.FRENCH]: "French",
  [SoundLanguage.KOREAN]: "Korean",
  [SoundLanguage.DUTCH]: "Dutch",
  [SoundLanguage.THAI]: "Thai",
  [SoundLanguage.ITALIAN]: "Italian",
}

export const soundLanguageOptions = [
  SoundLanguage.ENGLISH,
  SoundLanguage.SPANISH_MX,
  SoundLanguage.MANDARIN,
  SoundLanguage.GERMAN,
  SoundLanguage.JAPANESE,
  SoundLanguage.FRENCH,
  SoundLanguage.KOREAN,
  SoundLanguage.DUTCH,
  SoundLanguage.THAI,
  SoundLanguage.ITALIAN,
]

export const soundSettingOptions = [
  SoundOptions.FRONT,
  SoundOptions.BACK,
  SoundOptions.EXTRA,
  SoundOptions.EXTRA_ARRAY,
  SoundOptions.SUB_HEADER,
]

export const soundSettingOptionsLabels = {
  [SoundOptions.FRONT]: "Front",
  [SoundOptions.BACK]: "Back",
  [SoundOptions.EXTRA]: "Extra",
  [SoundOptions.EXTRA_ARRAY]: "Tags",
  [SoundOptions.SUB_HEADER]: "Subheader",
}

export const starterSpanishDeckId = "89813480-0dd2-432b-ae7e-2dc601f9a680"
export const starterSATVocabularyDeckId = "340a0dc1-3767-455d-a8f6-cad938ea9827"
export const starterGermanDeckId = "0c4947d2-6b76-4967-93e7-b444ffee30bb"
export const starterJapaneseDeckId = "4f94f837-da58-475a-888a-cc7635978726"
export const starterFrenchDeckId = "aa9520cc-69d6-44d8-988f-20245478c3cd"
export const starterItalianDeckId = "cf0a68f9-3659-4d58-a73c-8d103aa88b2c"
export const starterMandarinDeckId = "4fabe92a-26cb-49b8-9472-c96ac7350866"

export enum StartOption {
  RANDOM = "random",
  DATE_ADDED = "date_added",
}

export const startOptions = [StartOption.RANDOM, StartOption.DATE_ADDED]
export const startOptionLabels = {
  [StartOption.RANDOM]: "Random",
  [StartOption.DATE_ADDED]: "Created",
}

export const freeLimitDeck = 2

export const defaultBackPrompt =
  "The part of the speech for the word, followed by a short and consise definition"
export const defaultSubheaderPrompt = "The English pronounciation"
export const defaultExtraPrompt = "An example sentence."
export const defaultExtraArrayPrompt = "Three related words"

export const defaultLanguageBackPrompt = (language: TranslateLanguage) =>
  "The meaning of the word in English in a short and concise response"
export const defaultLanguageExtraPrompt = (language: TranslateLanguage) =>
  `An example sentence for the word in ${language}, followed by a English translation in parenthesis`
export const defaultLanguageSubheaderPrompt = (language: TranslateLanguage) =>
  "The part of speech for the word in English in lowercase followed by a period, followed by an '(m)' if the word is masculine or '(f)' if feminine"
export const defaultLanguageExtraArrayPrompt = (language: TranslateLanguage) =>
  `If there are any synonyms or related words, give them in ${language} followed by an English translation in parenthesis. Up to three.`
