import { mockDeckStoreCreate } from "app/components/mock/mock"
import { useStores } from "app/models"
import { HomeScreen } from "../HomeScreen"

import { act, render, waitFor, fireEvent } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

jest.mock("react-native-safe-area-context", () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 }
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
  }
})

jest.mock("../../models/helpers/useStores", () => ({
  useStores: () => ({
    deckStore: mockDeckStoreCreate,
  }),
}))

test("Home screen works", async () => {
  const { deckStore } = useStores()
  const navigation = useNavigation()
  deckStore.selectDeck(deckStore.decks[0])
  const currentTodaysCardsLength = deckStore?.selectedDeck?.todaysCards?.length
  //console.log(deckStore.selectedDeck.new_per_day, "new inside test")
  //console.log(deckStore.selectedDeck.last_added, "adeddd inside")
  //console.log(currentTodaysCardsLength, "curre inside")
  deckStore.selectedDeck.clearLastAdded()
  // console.log(
  //   deckStore.selectedDeck.flashcards.filter((card) => !card?.next_shown).length,
  //   "current number of unstarted cards",
  // )
  //console.log(deckStore.selectedDeck.last_added, "adeddd inside")

  const screen = render(<HomeScreen navigation={navigation} route={undefined} />)

  await waitFor(() => {
    // expect(screen).toBeTruthy()
    //expect(deckStore.selectedDeck.todaysCards.length).toBeGreaterThan(currentTodaysCardsLength)
  })

  // expect(deckStore.selectedDeck.todaysCards.length).toBeGreaterThan(currentTodaysCardsLength)
})

test("Home screen open drawer", async () => {
  const { deckStore } = useStores()
  deckStore.selectDeck(deckStore.decks[0])
  const navigation = useNavigation()
  const screen = render(<HomeScreen navigation={navigation} route={undefined} />)
  const drawer = screen.getByTestId("menu")
  expect(drawer).toBeTruthy()

  //const addDeckButton = screen.getByTestId("fluent_add_circle")
  //expect(addDeckButton).toBeTruthy()
})

test("Buying deck button shows", async () => {
  const { deckStore } = useStores()
  deckStore.selectDeck(deckStore.decks[0])
  const selectedDeck = deckStore.selectedDeck
  const navigation = useNavigation()
  const screen = render(<HomeScreen navigation={navigation} route={undefined} />)

  //expect(screen.getByText("Get 0 more premium cards")).toBeTruthy()
  /*  act(() => {
    fireEvent.press(screen.getByText("Get 0 more premium cards"))
  }) */
})
