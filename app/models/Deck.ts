import { endOfDay, isAfter, isBefore } from "date-fns"
import {
  destroy,
  Instance,
  SnapshotIn,
  SnapshotOut,
  types,
  applySnapshot,
  cast,
  flow,
} from "mobx-state-tree"
import { Deck_Fields } from "../utils/deckUtils"
import { Flashcard, FlashcardModel, FlashcardSnapshotIn } from "./Flashcard"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { SortType } from "../utils/consts"
import { getGlobalDeckById } from "../utils/globalDecksUtils"
import {
  Global_Flashcard_Fields,
  mapReponseToGlobalFlashcard,
} from "../utils/globalFlashcardsUtils"
import {
  ConflictTypes,
  GlobalFlashcard,
  GlobalFlashcardModel,
  GlobalFlashcardSnapshotIn,
} from "./GlobalFlashcard"
import { CardProgress } from "./CardProgress"
import { SoundOptions } from "./SettingsStore"

/**
 * Model description here for TypeScript hints.
 */

export enum SoundLanguage {
  ENGLISH = "en-US",
  SPANISH_MX = "es-MX", //Mexico spanish
}

export const DeckModel = types
  .model("Deck")
  .props({
    [Deck_Fields.ID]: types.identifier,
    [Deck_Fields.TITLE]: types.string,
    [Deck_Fields.FLASHCARDS]: types.optional(types.array(FlashcardModel), []),
    [Deck_Fields.LAST_ADDED]: types.maybe(types.Date),
    [Deck_Fields.NEW_PER_DAY]: types.maybe(types.number),
    [Deck_Fields.GLOBAL_DECK_ID]: types.maybe(types.string), //id of the global deck that this deck is cloned from
    [Deck_Fields.LAST_GLOBAL_SYNC]: types.maybe(types.Date), //this is used for global deck syncing
    selectedFlashcard: types.maybe(types.safeReference(FlashcardModel)),
    sessionCards: types.maybe(types.array(types.reference(FlashcardModel))),
    globalConflicts: types.optional(types.array(GlobalFlashcardModel), []),
    soundOption: types.optional(
      types.enumeration([SoundOptions.CUSTOM, SoundOptions.FRONT, SoundOptions.BACK]),
      SoundOptions.FRONT,
    ),
    playSoundAutomatically: types.optional(types.boolean, false),
    playSoundLanguage: types.optional(
      types.enumeration([SoundLanguage.ENGLISH, SoundLanguage.SPANISH_MX]),
      SoundLanguage.ENGLISH,
    ),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get todaysCards() {
      return self.flashcards.filter((card) => {
        //there should be an actual order to this based on showing cards with the most prio
        const endOfToday = endOfDay(new Date())
        return card?.next_shown && isBefore(card.next_shown, endOfToday)
      })
    },
    getFlashcardById: (id: string) => {
      return self.flashcards.find((card) => card.id === id)
    },
    isDeckBought(boughtDeckIds: string[]) {
      return boughtDeckIds.find((item) => item === self.global_deck_id)
    },

    doesDeckAlreadyContainFlashcard(front: String) {
      return !!self.flashcards.find((flashcard) => flashcard.front === front)
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setSoundOption(option: SoundOptions) {
      self.soundOption = option
    },
    setPlaySoundLanguage(language: SoundLanguage) {
      self.playSoundLanguage = language
    },
    togglePlaySoundAutomatically() {
      self.playSoundAutomatically = !self.playSoundAutomatically
    },
    getConflicts: flow(function* () {
      if (!self.global_deck_id) {
        return
      }
      const originalGlobalDeck = yield getGlobalDeckById(self.global_deck_id)
      const globalFlashcards = originalGlobalDeck.global_flashcards
      const conflicts: GlobalFlashcardSnapshotIn[] = []
      globalFlashcards.forEach((card) => {
        if (
          card?.created_at &&
          isAfter(new Date(card.created_at), new Date(self.last_global_sync))
        ) {
          const insertCard = card
          insertCard.conflictType = ConflictTypes.INSERT
          conflicts.push(insertCard)
        } else if (
          card?.last_updated &&
          isAfter(new Date(card.last_updated), new Date(self.last_global_sync))
        ) {
          const updateCard = card
          updateCard.conflictType = ConflictTypes.UPDATE
          conflicts.push(updateCard)
        }
      })

      const conflictModels: GlobalFlashcard[] = conflicts.map((c) =>
        GlobalFlashcardModel.create(mapReponseToGlobalFlashcard(c)),
      )
      self.globalConflicts.replace(conflictModels)
    }),

    addFlashcard: (flashcard: FlashcardSnapshotIn) => {
      if (!flashcard) {
        return
      }
      self.flashcards.push(FlashcardModel.create(flashcard))
    },
    addMutlipleFlashcards: (flashcards: FlashcardSnapshotIn[]) => {
      const flashcardModels = flashcards.map((card) => FlashcardModel.create(card))
      self.flashcards.push(...flashcardModels)
    },
    selectFlashcard: (flashcard: Flashcard) => {
      self.selectedFlashcard = flashcard
    },
    removeSelectedFlashcard: () => {
      self.selectedFlashcard = undefined
    },
    clearLastAdded: () => {
      self.last_added = undefined
    },
    deleteFlashcard: (item: Flashcard) => {
      if (!item || !item?.id) {
        return
      }
      const flashcard = self.flashcards.find((card) => card.id === item.id)
      if (flashcard) {
        destroy(flashcard)
      }
    },
    deleteCardProgress: (cardProgress: CardProgress) => {
      const flashcard = self?.flashcards?.find((card) => card.id === cardProgress.flashcard_id)
      const progress = flashcard?.card_progress?.find((progress) => progress.id === cardProgress.id)
      if (progress) {
        destroy(progress)
        return true
      }
      return false
    },
    initalizeDeckFlashcards: () => {
      // we want update the first 20 - 30 cards with next showns of today
    },
    reshuffleFirstCard: () => {
      if (self.sessionCards.length > 0) {
        const cardReference = self.sessionCards[0]
        self.sessionCards.splice(0, 1)
        self.sessionCards.push(cardReference)
      }
    },
    addFlashcardToSession: (flashcard_id: string) => {
      const flashcard = self.flashcards.find((card) => card.id === flashcard_id)
      const existsInSession = self.sessionCards.findIndex((card) => card.id === flashcard.id)
      if (existsInSession !== -1) {
        self.sessionCards.splice(existsInSession, 1)
        self.sessionCards.unshift(flashcard)
      } else {
        self.sessionCards.unshift(flashcard)
      }
    },
    removeFirstSessionCard: () => {
      self.sessionCards.splice(0, 1)
    },
    setSessionCards: () => {
      self.sessionCards = self.todaysCards as any
    },
    setCustomSessioncards: (cards: any) => {
      self.sessionCards = cards
    },
    sortFlashcardsByType: (type: SortType) => {
      if (!type) {
        return null
      }

      switch (type) {
        case SortType.DATE_ADDDED: {
          console.log("date added ran")
          self.flashcards.replace(
            self.flashcards.sort((a, b) => {
              if (!a?.created_at) {
                return 1
              }
              if (!b?.created_at) {
                return -1
              }
              return b.created_at.getTime() - a.created_at.getTime()
            }),
          )
          break
        }
        case SortType.ALPHABETICAL: {
          console.log("alpha added ran")
          self.flashcards.replace(self.flashcards.sort((a, b) => a?.front.localeCompare(b?.front)))
          break
        }
        case SortType.ACTIVE: {
          console.log("active added ran")
          self.flashcards.replace(
            self.flashcards.sort((a, b) => {
              if (!a?.next_shown) {
                return 1
              }
              if (!b?.next_shown) {
                return -1
              }
              return b.next_shown.getTime() - a.next_shown.getTime()
            }),
          )
          break
        }
        default:
          break
      }
    },
    updateDeck: (deck: Partial<Deck>) => {
      if (!deck) {
        return
      }
      self.title = deck?.title ? deck.title : self.title
      self.new_per_day = deck?.new_per_day ? deck.new_per_day : self.new_per_day
      self.last_added = deck?.last_added ? new Date(deck.last_added) : new Date(self.last_added)
      self.last_global_sync = deck?.last_global_sync
        ? new Date(deck.last_global_sync)
        : new Date(self.last_global_sync)
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Deck extends Instance<typeof DeckModel> {}
export interface DeckSnapshotOut extends SnapshotOut<typeof DeckModel> {}
export interface DeckSnapshotIn extends SnapshotIn<typeof DeckModel> {}
export const createDeckDefaultModel = () => types.optional(DeckModel, {})
