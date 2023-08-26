import { GlobalDeckStoreModel } from "./GlobalDeckStore"

test("can be created", () => {
  const instance = GlobalDeckStoreModel.create({})

  expect(instance).toBeTruthy()
})
