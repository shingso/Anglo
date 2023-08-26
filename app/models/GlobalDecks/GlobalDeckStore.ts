import { Instance, SnapshotIn, SnapshotOut, destroy, flow, types } from "mobx-state-tree"
import { withSetPropAction } from "./../helpers/withSetPropAction"
import { GlobalDeck, GlobalDeckModel, GlobalDeckSnapshotIn } from "./GlobalDeck"
import { getUserDecks } from "app/utils/deckUtils"
import { DeckSnapshotIn } from "../Deck"
import { getGlobalDecksByUserId } from "app/utils/globalDecksUtils"
import { supabase } from "app/services/supabase/supabase"

/**
 * Model description here for TypeScript hints.
 */
export const GlobalDeckStoreModel = types
  .model("GlobalDeckStore")
  .props({
    decks: types.optional(types.array(GlobalDeckModel), []),
    selectedDeck: types.maybe(types.safeReference(GlobalDeckModel)),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    saveDecks: (deckSnapshot: GlobalDeckStoreSnapshotIn[]) => {
      const deckModels: GlobalDeck[] = deckSnapshot.map((c) => GlobalDeckModel.create(c))
      self.decks.replace(deckModels)
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    getUserGlobalDecks: flow(function* (userId: string) {
      //Will replace the store with the remote state
      destroy(self.decks)
      const result: GlobalDeckSnapshotIn[] = yield getGlobalDecksByUserId(userId)
      self.saveDecks(result)
      return result
    }),
    selectGlobalDeck: (deck: GlobalDeck) => {
      self.selectedDeck = deck
    },
    addDeck: (deck: any) => {
      //TODO do a check if the deck already exists if it does maybe we should replace
      /*      if (self.decks.filter((decks) => decks.id === deck.id).length > 0) {
        console.log("You are trying to add a deck that already exists in store")
        return
      } */
      self.decks.push(GlobalDeckModel.create(deck))
    },
    removeSelectedDeck: () => {
      self.selectedDeck = undefined
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface GlobalDeckStore extends Instance<typeof GlobalDeckStoreModel> {}
export interface GlobalDeckStoreSnapshotOut extends SnapshotOut<typeof GlobalDeckStoreModel> {}
export interface GlobalDeckStoreSnapshotIn extends SnapshotIn<typeof GlobalDeckStoreModel> {}
export const createGlobalDeckStoreDefaultModel = () => types.optional(GlobalDeckStoreModel, {})
