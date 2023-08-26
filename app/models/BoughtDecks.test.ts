import { BoughtDecksModel } from "./BoughtDecks"

test("can be created with no data", () => {
  const instance = BoughtDecksModel.create({
    bought_deck_id: "test",
  })
  expect(instance).toBeTruthy()
})
