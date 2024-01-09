import { render, fireEvent, act } from "@testing-library/react-native"
import React from "react"
import { SessionScreen } from "../SessionScreen"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"
import { mockDeckStoreCreate, mockSettingStoreCreate } from "app/components/mock/mock"

jest.mock("../../models/helpers/useStores", () => ({
  useStores: () => ({
    deckStore: mockDeckStoreCreate,
    settingsStore: mockSettingStoreCreate,
  }),
}))
jest.mock("../../utils/flashcardUtils")

/* const mockedNavigate = jest.fn()

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native")
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  }
}) */

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
  const navigation = useNavigation()
  const firstSessionCard = deckStore.selectedDeck.sessionCards[0]
  const screen = render(<SessionScreen navigation={navigation} route={undefined} />)
  expect(screen).toBeTruthy()
  expect(screen.getAllByText(firstSessionCard.front)).toBeTruthy()
})

test("right swipe works", async () => {
  const { deckStore } = useStores()
  deckStore.selectDeck(deckStore.decks[0])
  deckStore.selectedDeck.setSessionCards()
  const navigation = useNavigation()
  const sessionCardCount = deckStore.selectedDeck.sessionCards.length
  const firstSessionCard = deckStore.selectedDeck.sessionCards[0]
  const secondSessionCard = deckStore.selectedDeck.sessionCards[1]
  const currentNextShown = firstSessionCard.next_shown.getTime()
  const screen = render(<SessionScreen navigation={navigation} route={undefined} />)
  expect(screen).toBeTruthy()
  expect(screen.getByText(sessionCardCount.toString())).toBeTruthy()
  expect(screen.getByText(firstSessionCard.front)).toBeTruthy()

  //this works below somtimes when there is two of the flashcard fronts
  //screen.debug()
  act(() => {
    fireEvent(screen.getByText(firstSessionCard.front), "swipeRight")
  })

  // expect(currentNextShown).toBeLessThan(firstSessionCard.next_shown.getTime())
  // expect(screen.getByText(firstSessionCard.front)).toBeFalsy()
  //we need to expect that the next card shows
  //we need to expect that the card is updated with the time even in an offline mode
})

test("add note", async () => {
  const { deckStore } = useStores()
  deckStore.selectDeck(deckStore.decks[0])
  deckStore.selectedDeck.setSessionCards()
  const navigation = useNavigation()
  const screen = render(<SessionScreen navigation={navigation} route={undefined} />)
  expect(screen).toBeTruthy()
  expect(screen.getByTestId("fluent_edit_outline")).toBeTruthy()
  await act(() => {
    fireEvent.press(screen.getByTestId("fluent_edit_outline"))
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
