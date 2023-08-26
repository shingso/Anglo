import { render, screen, fireEvent, waitFor, act } from "@testing-library/react-native"

import { View } from "react-native"
import App from "app/app"
import React from "react"
import { EditFlashcard } from "../EditFlashcard"
import { DeckModel, DeckSnapshotIn } from "../../models/Deck"
import { DeckStoreModel, DeckStoreSnapshotIn } from "../../models/DeckStore"
import { subDays, addDays, isToday } from "date-fns"
import { v4 as uuidv4 } from "uuid"

import { Flashcard, FlashcardModel, FlashcardSnapshotIn } from "../../models/Flashcard"
import * as flashcardUtils from "../../utils/flashcardUtils"
import { removeFlashcardFromDeck } from "../../utils/deckUtils"
import { generateMockFlashcards, mockDeckStoreModel } from "../mock/mock"

jest.mock("../../models/helpers/useStores", () => ({
  useStores: () => ({
    deckStore: {
      decks: [],
      selectedDeck: {},
    },
  }),
}))
jest.mock("../../utils/flashcardUtils")
jest.mock("../../utils/deckUtils")

test("can update and save flashcard", async () => {
  const deckStore = DeckStoreModel.create(mockDeckStoreModel)
  const selectedDeck = deckStore.decks[0]
  deckStore.selectDeck(selectedDeck)
  const flashcards = selectedDeck.flashcards
  const randomFlashcard = flashcards[Math.floor(Math.random() * flashcards.length)]

  selectedDeck.selectFlashcard(randomFlashcard)

  const screen = render(<EditFlashcard flashcard={randomFlashcard} deck={selectedDeck} />)

  const updateField = async (field: string) => {
    fireEvent.press(screen.getByTestId(field))
    const inputEdit = screen.getByTestId(field + "_edit")
    fireEvent.changeText(inputEdit, field + "_newValue")
    await act(() => {
      inputEdit.props.onBlur()
    })
    //expect(randomFlashcard?.[field]).toEqual(field + "_newValue")
  }

  //updateField("front")
  //updateField("back")
  //updateField("extra")
  //updateField("sub_header")
  //we should test clearing the extra array -- this test is for extra aray
  fireEvent.press(screen.getByTestId("extra_array_edit"))
  const inputEditExtra = screen.getByTestId("extra_array_edit")
  expect(inputEditExtra).toBeTruthy()
  fireEvent.changeText(inputEditExtra, "test")
  await act(() => {
    inputEditExtra.props.onSubmitEditing()
  })

  const saveIconButton = screen.getByTestId("fluent_save")
  expect(saveIconButton).toBeTruthy()
  await act(async () => {
    fireEvent.press(saveIconButton)
  })
  await waitFor(() => expect(flashcardUtils.updateFlashcard).toHaveBeenCalledTimes(1))
  expect(randomFlashcard?.["extra_array"]).toEqual(["test"])
})

test("can be delete flashcard", async () => {
  const deckStore = DeckStoreModel.create(mockDeckStoreModel)
  const selectedDeck = deckStore.decks[0]
  deckStore.selectDeck(selectedDeck)
  const flashcards = selectedDeck.flashcards
  const randomFlashcard = flashcards[Math.floor(Math.random() * flashcards.length)]
  selectedDeck.selectFlashcard(randomFlashcard)
  const screen = render(
    <EditFlashcard
      onDelete={() => selectedDeck.deleteFlashcard(randomFlashcard)}
      flashcard={randomFlashcard}
      deck={selectedDeck}
    />,
  )

  const initialDeckFlashcardLength = flashcards.length

  const deleteButton = screen.getByTestId("fluent_delete")
  await act(() => {
    fireEvent.press(deleteButton)
  })
  expect(selectedDeck.flashcards.length).toEqual(initialDeckFlashcardLength - 1)
})

test("can be start flashcard", async () => {
  const deckStore = DeckStoreModel.create(mockDeckStoreModel)
  const selectedDeck = deckStore.decks[0]
  deckStore.selectDeck(selectedDeck)
  const flashcards = selectedDeck.flashcards
  const randomFlashcard = flashcards[Math.floor(Math.random() * flashcards.length)]

  await act(() => {
    randomFlashcard.updateFlashcard({
      [flashcardUtils.Flashcard_Fields.NEXT_SHOWN]: undefined,
    })
    selectedDeck.selectFlashcard(randomFlashcard)
  })
  expect(randomFlashcard.next_shown).toBeFalsy()
  const screen = render(<EditFlashcard flashcard={randomFlashcard} deck={selectedDeck} />)
  const startFlashcardButton = screen.getByTestId("fluent_play_outline")
  expect(startFlashcardButton).toBeTruthy()
  await act(async () => {
    await fireEvent.press(startFlashcardButton)
  })
  expect(randomFlashcard.next_shown).toBeTruthy()
  expect(isToday(randomFlashcard.next_shown)).toBeTruthy()
})

test("can add new flashcard", async () => {
  const deckStore = DeckStoreModel.create(mockDeckStoreModel)
  const selectedDeck = deckStore.decks[0]
  deckStore.selectDeck(selectedDeck)
  const flashcards = selectedDeck.flashcards
  const initialDeckFlashcardLength = flashcards.length
  const randomFlashcard = generateMockFlashcards(1)[0]

  const flashcardModel = FlashcardModel.create(randomFlashcard)
  const mockAddFlashcard = jest.spyOn(flashcardUtils, "addFlashcard")
  const mockMapResponse = jest.spyOn(flashcardUtils, "mapReponseToFlashcard")
  mockAddFlashcard.mockImplementation(() =>
    Promise.resolve({
      ...flashcardModel,
    } as any),
  )

  mockMapResponse.mockImplementation(() => {
    return {
      id: uuidv4(),
      front: flashcardModel.front,
      back: flashcardModel.back,
      extra: flashcardModel.extra,
    }
  })
  const screen = render(
    <EditFlashcard flashcard={{ ...flashcardModel, id: undefined }} deck={selectedDeck} />,
  )

  const saveFlashcardButton = screen.getByTestId("fluent_save")
  await act(async () => {
    await fireEvent.press(saveFlashcardButton)
  })

  expect(deckStore.selectedDeck.flashcards.length).toEqual(initialDeckFlashcardLength + 1)
})
