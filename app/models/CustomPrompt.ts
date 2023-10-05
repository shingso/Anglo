import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const CustomPromptModel = types
  .model("CustomPrompt")
  .props({
    backPrompt: types.maybeNull(types.string),
    extraPrompt: types.maybeNull(types.string),
    captionPrompt: types.maybeNull(types.string),
    extraArrayPrompt: types.maybeNull(types.string),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    setBackPrompt(prompt: string) {
      self.backPrompt = prompt
    },
    setExtraPrompt(prompt: string) {
      self.extraPrompt = prompt
    },
    setCaptionPrompt(prompt: string) {
      self.captionPrompt = prompt
    },
    setExtraArrayPrompt(prompt: string) {
      self.extraArrayPrompt = prompt
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface CustomPrompt extends Instance<typeof CustomPromptModel> {}
export interface CustomPromptSnapshotOut extends SnapshotOut<typeof CustomPromptModel> {}
export interface CustomPromptSnapshotIn extends SnapshotIn<typeof CustomPromptModel> {}
export const createCustomPromptDefaultModel = () => types.optional(CustomPromptModel, {})
