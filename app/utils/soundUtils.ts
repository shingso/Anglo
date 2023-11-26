import { Deck, Flashcard } from "app/models"
import * as Speech from "expo-speech"
import { flipFrontAndBackFlashcard } from "./flashcardUtils"

export const pronouceFlashcardWithDeckSettings = (deck: Deck, flashcard: Flashcard) => {
  //if we are flipping then we can also flip here
  Speech.stop()
  const soundOption = deck.soundOption
  const languageOption = deck.playSoundLanguage
  let modifiedFlashcard = flashcard
  if (deck.flipFlashcard) {
    modifiedFlashcard = flipFrontAndBackFlashcard(flashcard)
  }
  if (modifiedFlashcard?.[soundOption.toString()]) {
    Speech.speak(modifiedFlashcard[soundOption.toString()], { language: languageOption })
  }
}
