import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { Flashcard, FlashcardModel } from "./Flashcard"

/**
 * Model description here for TypeScript hints.
 */
export const AiGenerationResponseModel = types
  .model("AiGenerationResponse")
  .props({
    words: types.optional(types.array(types.string), []),
    errors: types.optional(types.array(types.string), []),

    success: types.maybe(types.array(types.reference(FlashcardModel))),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get uncompleted(): string[] {
      return self.words.filter(
        (word) => !self?.errors?.includes(word) && !self?.success?.find((e) => e?.front === word),
      )
    },
    get hasResponse(): boolean {
      return (
        (self?.errors && self?.errors?.length > 0) ||
        (this.uncompleted && this.uncompleted?.length > 0) ||
        (self?.success && self?.success?.length > 0)
      )
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setErrors(errors: string[]) {
      self.errors.replace(errors)
    },

    setSuccess(success: Flashcard[]) {
      self.success.replace(success)
    },
    setWords(words: string[]) {
      self.words.replace(words)
    },
    clearAll() {
      self.words.replace([])
      self.errors.replace([])
      self.success.replace([])
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AiGenerationResponse extends Instance<typeof AiGenerationResponseModel> {}
export interface AiGenerationResponseSnapshotOut
  extends SnapshotOut<typeof AiGenerationResponseModel> {}
export interface AiGenerationResponseSnapshotIn
  extends SnapshotIn<typeof AiGenerationResponseModel> {}
export const createAiGenerationResponseDefaultModel = () =>
  types.optional(AiGenerationResponseModel, {})
