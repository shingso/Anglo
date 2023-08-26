import { DeckModel, DeckSnapshotIn } from "./Deck"
import { FlashcardSnapshotIn } from "./Flashcard"
import { v4 as uuidv4 } from "uuid"
import { addDays, endOfDay, isBefore, subDays } from "date-fns"
import { DeckStoreSnapshotIn } from "./DeckStore"
import { generateMockFlashcards, mockDeckModel } from "app/components/mock/mock"

test("can be select flashcard", () => {
  const instance = DeckModel.create(mockDeckModel)
  const flashcards = instance.flashcards
  const randomFlashcard = flashcards[Math.floor(Math.random() * flashcards.length)]
  instance.selectFlashcard(randomFlashcard)
  expect(instance.selectedFlashcard).toEqual(randomFlashcard)
})

test("can remove selected flashcard", () => {
  const instance = DeckModel.create(mockDeckModel)
  const flashcards = instance.flashcards
  const randomFlashcard = flashcards[Math.floor(Math.random() * flashcards.length)]
  instance.selectFlashcard(randomFlashcard)
  instance.removeSelectedFlashcard()
  expect(instance.selectedFlashcard).toEqual(undefined)
})

test("can update deck", () => {
  const instance = DeckModel.create(mockDeckModel)
  const newDeckTitle = "newDeckTitleValue"
  const newCardsPerDay = mockDeckModel?.new_per_day ? mockDeckModel?.new_per_day + 1 : 10
  const newLastAdded = addDays(new Date(), 10)
  const newLastGlobalSync = addDays(new Date(), 5)
  instance.updateDeck({
    title: newDeckTitle,
    new_per_day: newCardsPerDay,
    last_added: newLastAdded,
    last_global_sync: newLastGlobalSync,
  })

  expect(instance.title).toEqual(newDeckTitle)
  expect(instance.new_per_day).toEqual(newCardsPerDay)
  expect(instance.last_added).toEqual(newLastAdded)
  expect(instance.last_global_sync).toEqual(newLastGlobalSync)
})

test("can add flashcard", () => {
  const instance = DeckModel.create(mockDeckModel)
  const flashcards = instance.flashcards
  const flashcardsLength = flashcards.length
  const newMockFlashcards = generateMockFlashcards(1)[0]
  instance.addFlashcard(newMockFlashcards)
  expect(instance.flashcards.length).toEqual(flashcardsLength + 1)
  expect(instance.flashcards.findIndex((card) => card.id === newMockFlashcards.id)).toBeGreaterThan(
    -1,
  )
})

test("can not add null flashcard", () => {
  const instance = DeckModel.create(mockDeckModel)
  const flashcards = instance.flashcards
  const flashcardsLength = flashcards.length
  instance.addFlashcard(undefined)
  expect(instance.flashcards.length).toEqual(flashcardsLength)
})

test("can delete flashcard", () => {
  const instance = DeckModel.create(mockDeckModel)
  const flashcards = instance.flashcards
  const flashcardsLength = flashcards.length
  const randomFlashcard = flashcards[Math.floor(Math.random() * flashcards.length)]
  instance.selectFlashcard(randomFlashcard)
  const randomFlashcardId = randomFlashcard.id
  instance.deleteFlashcard(randomFlashcard)
  expect(instance.flashcards.length).toEqual(flashcardsLength - 1)
  expect(instance.flashcards.findIndex((card) => card.id === randomFlashcardId)).toEqual(-1)
  expect(instance.selectedFlashcard).toEqual(undefined)
})

test("can not delete null flashcard", () => {
  const instance = DeckModel.create(mockDeckModel)
  const flashcards = instance.flashcards
  const flashcardsLength = flashcards.length
  instance.deleteFlashcard(null)
  expect(instance.flashcards.length).toEqual(flashcardsLength)
})

test("getting todays cards", () => {
  const instance = DeckModel.create(mockDeckModel)
  const todaysFlashcards = instance.flashcards.filter((card) => {
    return card?.next_shown && isBefore(card.next_shown, endOfDay(new Date()))
  })

  expect(instance.todaysCards.length).toEqual(todaysFlashcards.length)
})

test("getting todays cards and session cards", () => {
  const instance = DeckModel.create(mockDeckModel)
  const flashcards = instance.flashcards
  const flashcardsLength = instance.todaysCards.length
  instance.setSessionCards()
  expect(instance.sessionCards.length).toEqual(flashcardsLength)
})

test("reshuffleFirstCard", () => {
  const instance = DeckModel.create(mockDeckModel)
  instance.setSessionCards()
  //TODO We dont want to gate this though
  if (instance.sessionCards.length > 0) {
    const firstCard = instance.sessionCards[0]
    instance.reshuffleFirstCard()
    expect(instance.sessionCards[instance.sessionCards.length - 1]).toEqual(firstCard)
  }
})

test("add exisiting flashcards to session", () => {
  const instance = DeckModel.create(mockDeckModel)
  instance.setSessionCards()
  const randomFlashcard =
    instance.sessionCards[Math.floor(Math.random() * instance.sessionCards.length)]
  instance.addFlashcardToSession(randomFlashcard.id)
  expect(instance.sessionCards[0]).toEqual(randomFlashcard)
})

test("remove and readd flashcard from session", () => {
  const instance = DeckModel.create(mockDeckModel)
  instance.setSessionCards()
  const initialFlashcardsLength = instance.sessionCards.length
  const firstCard = instance.sessionCards[0]
  instance.removeFirstSessionCard()
  expect(instance.sessionCards.length).toEqual(initialFlashcardsLength - 1)
  expect(instance.sessionCards.findIndex((card) => card.id === firstCard.id)).toEqual(-1)
  instance.addFlashcardToSession(firstCard.id)
  expect(instance.sessionCards[0]).toEqual(firstCard)
  expect(instance.sessionCards.length).toEqual(initialFlashcardsLength)
})
