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
  Global_Flashcards: undefined
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
  GLOBAL_FLASHCARDS = "Global_Flashcards",
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
}

export const SortTypeLabels = {
  [SortType.DATE_ADDDED]: "Date Added",
  [SortType.ACTIVE]: "Active",
  [SortType.ALPHABETICAL]: "Alphabetical",
}

export const SortTypeIcon: { [key: string]: IconTypes } = {
  [SortType.DATE_ADDDED]: "fluent_calendar",
  [SortType.ACTIVE]: "fluent_alpha_sort",
  [SortType.ALPHABETICAL]: "fluent_alpha_sort",
}
