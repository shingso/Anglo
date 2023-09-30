import { destroy, flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { getDeck, getUserDecks } from "../utils/deckUtils"
import { Deck, DeckModel, DeckSnapshotIn } from "./Deck"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const DeckStoreModel = types
  .model("DeckStore")
  .props({
    decks: types.optional(types.array(DeckModel), []),
    selectedDeck: types.maybe(types.safeReference(DeckModel)),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    getDeckById: (id: string) => {
      return self.decks.filter((decks) => decks.id === id)[0]
    },
    addDeck: (deck: any) => {
      //TODO do a check if the deck already exists if it does maybe we should replace
      if (self.decks.filter((decks) => decks.id === deck.id).length > 0) {
        console.log("You are trying to add a deck that already exists in store")
        return
      }
      self.decks.push(DeckModel.create(deck))
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    saveDecks: (deckSnapshot: DeckSnapshotIn[]) => {
      const deckModels: Deck[] = deckSnapshot.map((c) => DeckModel.create(c))
      self.decks.replace(deckModels)
    },
  }))

  .actions((self) => ({
    getDecks: flow(function* () {
      //Will replace the store with the remote state
      destroy(self.decks)
      const result: DeckSnapshotIn[] = yield getUserDecks()
      self.saveDecks(result)

      return result
    }),
    selectDeck: (deck: Deck) => {
      self.selectedDeck = deck
    },
    addDeckFromRemote: flow(function* (deckId: string) {
      const result: DeckSnapshotIn[] = yield getDeck(deckId)
      if (result) {
        self.addDeck(result)
        //we still need to start the cards if the arent started
      }
      return result
    }),
    deleteDeck: (deck: Deck) => {
      destroy(deck)
    },
    removeSelectedDeck: () => {
      self.selectedDeck = undefined
    },
  }))

export interface DeckStore extends Instance<typeof DeckStoreModel> {}
export interface DeckStoreSnapshotOut extends SnapshotOut<typeof DeckStoreModel> {}
export interface DeckStoreSnapshotIn extends SnapshotIn<typeof DeckStoreModel> {}
export const createDeckStoreDefaultModel = () => types.optional(DeckStoreModel, {})
