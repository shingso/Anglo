import { AiGenerationResponseModel } from "./AiGenerationResponse"

test("can be created", () => {
  const instance = AiGenerationResponseModel.create({})

  expect(instance).toBeTruthy()
})
