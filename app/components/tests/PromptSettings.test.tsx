import { act, fireEvent, render } from "@testing-library/react-native"
import { SwipeCards } from "../SwipeCards"
import { mockDeckStoreCreate } from "../mock/mock"
import { useStores } from "app/models"
import { PromptSettings } from "../PromptSettings"
import { exp } from "react-native-reanimated"

jest.mock("../../models/helpers/useStores", () => ({
  useStores: () => ({
    deckStore: mockDeckStoreCreate,
  }),
}))

test("can be created", async () => {
  const { deckStore } = useStores()
  deckStore.selectDeck(deckStore.decks[0])

  const screen = render(<PromptSettings deck={deckStore.selectedDeck} />)
  const backInput = screen.getByTestId("back_input")
  const subheaderInput = screen.getByTestId("subheader_input")
  const extraInput = screen.getByTestId("extra_input")
  const extraArrayInput = screen.getByTestId("extra_array_input")

  const backPrompt = "backPrompt"
  const extraPrompt = "extraPrompt"
  const extraArrayPrompt = "extraArrayPrompt"
  const subheaderPrompt = "subheaderPrompt"
  fireEvent.changeText(backInput, backPrompt)
  fireEvent.changeText(subheaderInput, subheaderPrompt)
  fireEvent.changeText(extraInput, extraPrompt)
  fireEvent.changeText(extraArrayInput, extraArrayPrompt)

  await act(() => {
    backInput.props.onSubmitEditing()
    extraInput.props.onSubmitEditing()
    extraArrayInput.props.onSubmitEditing()
    subheaderInput.props.onSubmitEditing()
  })
  expect(deckStore.selectedDeck.customPrompts.backPrompt).toEqual(backPrompt)
  expect(deckStore.selectedDeck.customPrompts.extraPrompt).toEqual(extraPrompt)
  expect(deckStore.selectedDeck.customPrompts.extraArrayPrompt).toEqual(extraArrayPrompt)
  expect(deckStore.selectedDeck.customPrompts.subheaderPrompt).toEqual(subheaderPrompt)
})
