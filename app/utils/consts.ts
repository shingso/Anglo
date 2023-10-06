import { IconTypes } from "app/components/Icon"

import { Dimensions } from "react-native"

export const SCREEN_HEIGHT = Dimensions.get("window").height
export const SCREEN_WIDTH = Dimensions.get("window").width

export enum SortType {
  DATE_ADDDED = "date_added",
  ACTIVE = "active",
  ALPHABETICAL = "alphabetical",
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
  Global_Conflict: undefined
  Progress_Conflict: undefined
  Purchase_Deck: undefined
  User_Global_Decks: undefined
  User_Global_Decks_Edit: undefined
  Tutorial: undefined
  Free_Study: undefined
  Free_Study_Session: undefined
  Deck_Home: undefined
  Multi_Add_AI: undefined
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
  GLOBAL_CONFLICT = "Global_Conflict",
  PROGRESS_CONFLICT = "Progress_Conflict",
  PURCHASE_DECK = "Purchase_Deck",
  USER_GLOBAL_DECKS = "User_Global_Decks",
  USER_GLOBAL_DECKS_EDIT = "User_Global_Decks_Edit",
  TUTORIAL = "Tutorial",
  FREE_STUDY = "Free_Study",
  FREE_STUDY_SESSION = "Free_Study_Session",
  DECK_HOME = "Deck_Home",
  MUTLI_ADD_AI = "Multi_Add_AI",
}

export const SortTypeLabels = {
  [SortType.DATE_ADDDED]: "Date Added",
  [SortType.ACTIVE]: "Active",
  [SortType.ALPHABETICAL]: "Alphabetical",
}

export const SortTypeIcon: { [key: string]: IconTypes } = {
  [SortType.DATE_ADDDED]: "fluent_calendar",
  [SortType.ACTIVE]: "fluent_play_outline",
  [SortType.ALPHABETICAL]: "fluent_alpha_sort",
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
}

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
]

export const soundSettingOptions = [
  SoundOptions.FRONT,
  SoundOptions.BACK,
  SoundOptions.EXTRA,
  SoundOptions.EXTRA_ARRAY,
  SoundOptions.SUB_HEADER,
]
