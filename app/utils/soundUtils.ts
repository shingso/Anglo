import { Deck, Flashcard } from "app/models"
import * as Speech from "expo-speech"

export const pronouceFlashcardWithDeckSettings = (deck: Deck, flashcard: Flashcard) => {
  Speech.stop()
  const soundOption = deck.soundOption
  const languageOption = deck.playSoundLanguage
  if (flashcard?.[soundOption.toString()]) {
    Speech.speak(flashcard[soundOption.toString()], { language: languageOption })
  }
}
