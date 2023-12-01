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
  expect(screen.getByTestId("cards_per_day")).toBeTruthy()
  act(() => {
    fireEvent.press(screen.getByTestId("cards_per_day"))
  })
  //expect(screen.getByText("Number of cards to be automatically each day")).toBeTruthy()
})

test("deck settings works", async () => {
  const { deckStore } = useStores()
  deckStore.selectDeck(deckStore.decks[0])
  const screen = render(<MockedNavigator component={DeckSettingsScreen} />)

  expect(screen).toBeTruthy()
  expect(screen.getByTestId("cards_per_day")).toBeTruthy()
  act(() => {
    fireEvent.press(screen.getByTestId("cards_per_day"))
  })
  //expect(screen.getByText("Number of cards to be automatically each day")).toBeTruthy()
})

//Write test for deck settings
