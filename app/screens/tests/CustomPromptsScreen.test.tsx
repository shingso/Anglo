import { act, fireEvent, render } from "@testing-library/react-native"
import { mockDeckStoreCreate, mockSettingStoreCreate } from "app/components/mock/mock"
import { v4 as uuidv4 } from "uuid"
import MockedNavigator from "./MockedNavigator"
import { CustomPromptsScreen } from "../CustomPromptsScreen"
import { useStores } from "app/models"

jest.mock("../../models/helpers/useStores", () => ({
  useStores: () => ({
    deckStore: mockDeckStoreCreate,
    settingsStore: mockSettingStoreCreate,
  }),
}))

test("custom prompts works", async () => {
  const { deckStore } = useStores()
  deckStore.selectDeck(deckStore.decks[0])

  const screen = render(<MockedNavigator component={CustomPromptsScreen} />)

  const backEdit = screen.getByTestId("back_input")
  const subheaderEdit = screen.getByTestId("subheader_input")
  const extraEdit = screen.getByTestId("extra_input")
  const extraArrayEdit = screen.getByTestId("extra_array_input")
  const backNewValue = uuidv4()
  const subheaderNewValue = uuidv4()
  const extraNewValue = uuidv4()
  const extraArrayNewValue = uuidv4()
  await act(() => {
    fireEvent.changeText(backEdit, backNewValue)
    fireEvent.changeText(subheaderEdit, subheaderNewValue)
    fireEvent.changeText(extraArrayEdit, extraArrayNewValue)
    fireEvent.changeText(extraEdit, extraNewValue)
  })
  await act(() => {
    fireEvent(backEdit, "submitEditing")
    fireEvent(subheaderEdit, "submitEditing")
    fireEvent(extraArrayEdit, "submitEditing")
    fireEvent(extraEdit, "submitEditing")
  })
  expect(screen).toBeTruthy()
  expect(deckStore.selectedDeck.customPrompts.backPrompt).toEqual(backNewValue)
  expect(deckStore.selectedDeck.customPrompts.subheaderPrompt).toEqual(subheaderNewValue)
  expect(deckStore.selectedDeck.customPrompts.extraArrayPrompt).toEqual(extraArrayNewValue)
  expect(deckStore.selectedDeck.customPrompts.extraPrompt).toEqual(extraNewValue)
})
