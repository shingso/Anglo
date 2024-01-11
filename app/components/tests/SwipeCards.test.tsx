import { render, screen, fireEvent, waitFor, act } from "@testing-library/react-native"

import { DeckModel, DeckSnapshotIn } from "../../models/Deck"
import { DeckStoreModel, DeckStoreSnapshotIn } from "../../models/DeckStore"
import { subDays, addDays } from "date-fns"
import { v4 as uuidv4 } from "uuid"
import { FlashcardSnapshotIn } from "app/models/Flashcard"
import { SwipeCards } from "../SwipeCards"
import { mockDeckModelCreate, mockDeckStoreCreate, mockDeckStoreModel } from "../mock/mock"
import { useStores } from "app/models"

jest.mock("../../models/helpers/useStores", () => ({
  useStores: () => ({
    deckStore: mockDeckStoreCreate,
  }),
}))

test("can be created", async () => {
  const { deckStore } = useStores()
  deckStore.selectDeck(deckStore.decks[0])

  deckStore.selectedDeck.setSessionCards()
  const firstSessionCard = deckStore.selectedDeck.sessionCards[0]

  const mockLeft = jest.fn()
  const mockRight = jest.fn()
  const mockUp = jest.fn(() => console.log("up"))

  const screen = render(
    <SwipeCards
      currentDeck={deckStore.selectedDeck}
      cards={deckStore.selectedDeck.sessionCards}
      swipeUp={mockUp}
      swipeRight={mockRight}
      swipeLeft={mockLeft}
    />,
  )

  //expect(mockUp).toHaveBeenCalled()
  //expect(screen.getByText(firstSessionCard.front)).toBeTruthy()
  expect(screen.getAllByText(firstSessionCard.front)).toBeTruthy()
  act(() => {
    //fireEvent.press(screen.getAllByText(firstSessionCard.front)[0])
    //fireEvent.press(screen.getAllByText(firstSessionCard.front)[1])
    fireEvent.press(screen.getByTestId("showBack"))
  })
  //fireEvent.press(screen.getByTestId("showBack"))
  //screen.debug(undefined)
  // console.log(firstSessionCard.back.split(" ")[0])
  expect(screen.getAllByText(firstSessionCard.back)).toBeTruthy()
})
