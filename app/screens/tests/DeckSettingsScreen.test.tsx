import { useNavigation } from "@react-navigation/native"
import { HAS_SUBSCRIPTION_TITLE, SubscribeScreen } from "../SubscribeScreen"
import { SubscriptionModel, SubscriptionStoreModel, useStores } from "app/models"
import { act, fireEvent, render } from "@testing-library/react-native"
import MockedNavigator from "./MockedNavigator"
import { mockDeckStoreCreate } from "app/components/mock/mock"
import { DeckSettingsScreen } from "../DeckSettingsScreen"

jest.mock("../../models/helpers/useStores", () => ({
  useStores: () => ({
    deckStore: mockDeckStoreCreate,
  }),
}))

//make sure setting the sound settings works
//setting the custom prompts works
//setting the cards per days

test("deck settings works", async () => {
  const { deckStore } = useStores()
  deckStore.selectDeck(deckStore.decks[0])
  const screen = render(<MockedNavigator component={DeckSettingsScreen} />)

  expect(screen).toBeTruthy()

  //expect(screen.getByText("Number of cards to be automatically each day")).toBeTruthy()
})

test("deck settings works", async () => {
  const { deckStore } = useStores()
  deckStore.selectDeck(deckStore.decks[0])
  const screen = render(<MockedNavigator component={DeckSettingsScreen} />)
  expect(screen).toBeTruthy()
  const soundLanguageButton = screen.getByTestId("soundLanguageButton")
  expect(soundLanguageButton).toBeTruthy()
  // expect(screen.getByText("Added order")).toBeTruthy()
  act(() => {
    //   fireEvent.press(soundLanguageButton)
  })

  // expect(screen.getByText("Number of cards to be automatically added each day")).toBeTruthy()
})

test("play sound automatically toggle works", async () => {
  const { deckStore } = useStores()
  deckStore.selectDeck(deckStore.decks[0])
  const screen = render(<MockedNavigator component={DeckSettingsScreen} />)
  const playSoundAuto = deckStore.selectedDeck.playSoundAutomatically
  expect(screen.getByTestId("playSoundAutoToggle")).toBeTruthy()

  act(() => {
    fireEvent.press(screen.getByTestId("playSoundAutoToggle"))
  })

  expect(deckStore.selectedDeck.playSoundAutomatically).toEqual(!playSoundAuto)
})

test("flip flashcard toggle works", async () => {
  const { deckStore } = useStores()
  deckStore.selectDeck(deckStore.decks[0])
  const screen = render(<MockedNavigator component={DeckSettingsScreen} />)
  const flipFlashcard = deckStore.selectedDeck.flipFlashcard
  expect(screen.getByTestId("flipFlashcardToggle")).toBeTruthy()
  act(() => {
    fireEvent.press(screen.getByTestId("flipFlashcardToggle"))
  })
  expect(deckStore.selectedDeck.flipFlashcard).toEqual(!flipFlashcard)
})

test("new cards per day toggle works", async () => {
  const { deckStore } = useStores()
  deckStore.selectDeck(deckStore.decks[0])
  const screen = render(<MockedNavigator component={DeckSettingsScreen} />)
  const addCards = deckStore.selectedDeck.addNewCardsPerDay
  expect(screen.getByTestId("newCardsToggle")).toBeTruthy()
  act(() => {
    fireEvent.press(screen.getByTestId("newCardsToggle"))
  })
  expect(deckStore.selectedDeck.addNewCardsPerDay).toEqual(!addCards)
})

//Write test for deck settings
