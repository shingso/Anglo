import { isAfter, subDays } from "date-fns"
import { DeckModel } from "./Deck"
import { FlashcardModel } from "./Flashcard"
import { mockDeckModel } from "app/components/mock/mock"
import { CardProgressSnapshotIn } from "./CardProgress"
import { v4 as uuidv4 } from "uuid"

test("can update flashcard", () => {
  const instance = DeckModel.create(mockDeckModel)
  const flashcards = instance.flashcards
  const randomFlashcard = flashcards[Math.floor(Math.random() * flashcards.length)]
  const newFrontValue = "newFront"
  const newBackValue = "newBack"
  const newExtraValue = "newExtra"
  const newSubHeaderValue = "newSubHeader"
  const newExtraArrayValue = ["new_extra_array"]
  const newNextShownValue = subDays(new Date(), 20)
  randomFlashcard.updateFlashcard({
    front: newFrontValue,
    back: newBackValue,
    extra: newExtraValue,
    extra_array: newExtraArrayValue,
    sub_header: newSubHeaderValue,
    next_shown: newNextShownValue,
  })
  expect(randomFlashcard.front).toEqual(newFrontValue)
  expect(randomFlashcard.back).toEqual(newBackValue)
  expect(randomFlashcard.extra).toEqual(newExtraValue)
  expect(randomFlashcard.extra_array).toEqual(newExtraArrayValue)
  expect(randomFlashcard.sub_header).toEqual(newSubHeaderValue)
  expect(randomFlashcard.next_shown).toEqual(newNextShownValue)
})

test("get most recent card progres", () => {
  const newCardProgress: CardProgressSnapshotIn = {
    id: uuidv4(),
    time_elapsed: Math.floor(Math.random() * 2000) + 1,
    retrieval_level: Math.floor(Math.random() * 3) + 1,
    created_at: subDays(new Date(), Math.floor(Math.random() * 10)),
  }

  const generateCardProgress = (flashcardId: string): CardProgressSnapshotIn => {
    return {
      id: uuidv4(),
      flashcard_id: flashcardId,
      time_elapsed: Math.floor(Math.random() * 2000) + 1,
      retrieval_level: Math.floor(Math.random() * 3) + 1,
      created_at: subDays(new Date(), Math.floor(Math.random() * 10)),
    }
  }

  const instance = DeckModel.create(mockDeckModel)
  const flashcards = instance.flashcards
  const randomFlashcard = flashcards[Math.floor(Math.random() * flashcards.length)]
  const numberOfProgress = 10
  for (let x = 0; x < numberOfProgress; x++) {
    randomFlashcard.addToCardProgress(generateCardProgress(randomFlashcard.id))
  }
  expect(randomFlashcard.card_progress.length).toEqual(numberOfProgress)
  let largestTimestamp
  randomFlashcard.card_progress.forEach((progress) => {
    if (!largestTimestamp) {
      largestTimestamp = progress.created_at
    } else {
      if (isAfter(progress.created_at, largestTimestamp)) {
        largestTimestamp = progress.created_at
      }
    }
  })
  expect(randomFlashcard.mostRecentProgress.created_at).toEqual(largestTimestamp)
})
