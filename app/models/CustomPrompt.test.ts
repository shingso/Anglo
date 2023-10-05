import { CustomPromptModel } from "./CustomPrompt"

test("can be created", () => {
  const instance = CustomPromptModel.create({})

  expect(instance).toBeTruthy()
})
