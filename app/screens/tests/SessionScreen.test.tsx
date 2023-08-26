import { render, screen, fireEvent, waitFor, act } from "@testing-library/react-native"
import React from "react"
import { DeckModel, DeckSnapshotIn } from "../../models/Deck"
import { DeckStoreModel, DeckStoreSnapshotIn } from "../../models/DeckStore"
import { subDays, addDays } from "date-fns"
import { v4 as uuidv4 } from "uuid"
import { Flashcard, FlashcardSnapshotIn } from "../../models/Flashcard"
import { SessionScreen } from "../SessionScreen"
import { useNavigation } from "@react-navigation/native"
import mockSafeAreaContext from "react-native-safe-area-context/jest/mock"
import { View } from "react-native"
import { RootStore, RootStoreModel, useStores } from "app/models"
import { createContext } from "react"
import { mockDeckStoreCreate } from "app/components/mock/mock"

jest.mock("../../models/helpers/useStores", () => ({
  useStores: () => ({
    deckStore: mockDeckStoreCreate,
  }),
}))
jest.mock("../../utils/flashcardUtils")

jest.mock("react-native-safe-area-context", () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 }
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
  }
})

test("session screen works", async () => {
  const { deckStore } = useStores()
  deckStore.selectDeck(deckStore.decks[0])
  deckStore.selectedDeck.setSessionCards()
  const firstSessionCard = deckStore.selectedDeck.sessionCards[0]
  const screen = render(<SessionScreen navigation={useNavigation()} route={undefined} />)
  expect(screen).toBeTruthy()
  expect(screen.getAllByText(firstSessionCard.front)).toBeTruthy()
})

test("right swipe works", async () => {
  const { deckStore } = useStores()
  deckStore.selectDeck(deckStore.decks[0])
  deckStore.selectedDeck.setSessionCards()
  const sessionCardCount = deckStore.selectedDeck.sessionCards.length
  const firstSessionCard = deckStore.selectedDeck.sessionCards[0]
  const screen = render(<SessionScreen navigation={useNavigation()} route={undefined} />)
  expect(screen).toBeTruthy()
  expect(screen.getAllByText(sessionCardCount.toString())).toBeTruthy()
  expect(screen.getAllByText(firstSessionCard.front)[0]).toBeTruthy()
  //this works below somtimes when there is two of the flashcard fronts
  fireEvent(screen.getAllByText(firstSessionCard.front)[0], "swipeRight")
})

test("add note", async () => {
  const { deckStore } = useStores()
  deckStore.selectDeck(deckStore.decks[0])
  deckStore.selectedDeck.setSessionCards()
  const screen = render(<SessionScreen navigation={useNavigation()} route={undefined} />)
  expect(screen).toBeTruthy()
  expect(screen.getByTestId("fluent_note_edit")).toBeTruthy()
  await act(() => {
    fireEvent.press(screen.getByTestId("fluent_note_edit"))
  })

  //expect(screen.getByPlaceholderText("note")).toBeTruthy()
  //screen.debug(undefined)
  //await screen.getByText("Add note")
})

//assert that when we do a left swipe
//put back into the deck
//count does not change

//on right swipe
//count changes
