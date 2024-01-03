import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import {
  defaultBackPrompt,
  defaultExtraArrayPrompt,
  defaultExtraPrompt,
  defaultSubheaderPrompt,
} from "app/utils/consts"

/**
 * Model description here for TypeScript hints.
 */
export const CustomPromptModel = types
  .model("CustomPrompt")
  .props({
    defaultPromptType: types.maybeNull(types.string),
    backPrompt: types.optional(types.string, defaultBackPrompt),
    extraPrompt: types.optional(types.string, defaultExtraPrompt),
    subheaderPrompt: types.optional(types.string, defaultSubheaderPrompt),
    extraArrayPrompt: types.optional(types.string, defaultExtraArrayPrompt),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setDefaultPromptType(prompt: string) {
      self.defaultPromptType = prompt
    },
    setBackPrompt(prompt: string) {
      self.backPrompt = prompt
    },
    setExtraPrompt(prompt: string) {
      self.extraPrompt = prompt
    },
    setSubheaderPrompt(prompt: string) {
      self.subheaderPrompt = prompt
    },
    setExtraArrayPrompt(prompt: string) {
      self.extraArrayPrompt = prompt
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface CustomPrompt extends Instance<typeof CustomPromptModel> {}
export interface CustomPromptSnapshotOut extends SnapshotOut<typeof CustomPromptModel> {}
export interface CustomPromptSnapshotIn extends SnapshotIn<typeof CustomPromptModel> {}
export const createCustomPromptDefaultModel = () => types.optional(CustomPromptModel, {})
