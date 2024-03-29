import { differenceInMinutes, endOfDay, isAfter, isBefore, isToday } from "date-fns"
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
import {
  SortType,
  SoundLanguage,
  SoundOptions,
  StartOption,
  TranslateLanguage,
  playSoundLanguageArray,
  soundOptionArray,
  startOptions,
  translateLanguageArray,
} from "../utils/consts"
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
import { CardProgress, CardProgressSnapshotIn } from "./CardProgress"
import { QueryModel, QuerySnapshotIn } from "./Query"
import { CustomPromptModel } from "./CustomPrompt"
import { AiGenerationResponseModel } from "./AiGenerationResponse"

/**
 * Model description here for TypeScript hints.
 */

export const DeckModel = types
  .model("Deck")
  .props({
    [Deck_Fields.ID]: types.identifier,
    [Deck_Fields.TITLE]: types.string,
    [Deck_Fields.FLASHCARDS]: types.optional(types.array(FlashcardModel), []),
    [Deck_Fields.LAST_ADDED]: types.maybe(types.Date),
    [Deck_Fields.NEW_PER_DAY]: types.maybe(types.number),
    [Deck_Fields.PICTURE_URL]: types.maybe(types.string),
    [Deck_Fields.PAID_IMPORTED]: types.maybe(types.boolean),
    [Deck_Fields.GLOBAL_DECK_ID]: types.maybe(types.string), //id of the global deck that this deck is cloned from
    [Deck_Fields.LAST_GLOBAL_SYNC]: types.maybe(types.Date), //this is used for global deck syncing
    selectedFlashcard: types.maybe(types.safeReference(FlashcardModel)),
    sessionCards: types.maybe(types.array(types.safeReference(FlashcardModel))),
    customPrompts: types.optional(CustomPromptModel, {}),
    //customPromptLanguages: types.optional(CustomPromptLanguageModel, {}),
    soundOption: types.optional(types.enumeration(soundOptionArray), SoundOptions.FRONT),
    playSoundAutomatically: types.optional(types.boolean, true),
    addNewCardsPerDay: types.optional(types.boolean, true),
    startMode: types.optional(types.enumeration(startOptions), StartOption.RANDOM),
    flipFlashcard: types.optional(types.boolean, false),
    aiGeneratedResponse: types.optional(AiGenerationResponseModel, {
      errors: [],
      success: [],
    }),
    playSoundLanguage: types.optional(
      types.enumeration(playSoundLanguageArray),
      SoundLanguage.ENGLISH,
    ),

    queuedQueries: types.optional(types.array(QueryModel), []),
    translateLanguage: types.optional(
      types.enumeration(translateLanguageArray),
      TranslateLanguage.ENGLISH,
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
    get activeCardsCount() {
      return self.flashcards.reduce((prev, card) => {
        return prev + (!!card?.next_shown ? 1 : 0)
      }, 0)
    },
    get passedTodaysCardProgress() {
      return self.flashcards.reduce((prev, card) => {
        return prev + card.passedTodaysCardProgress.length
      }, 0)
    },

    get overdueCards() {
      const now = new Date()
      return self.flashcards.filter((card) => {
        if (!card.next_shown) {
          return false
        }
        const lastProgress = card?.mostRecentProgress
        if (!lastProgress) return false
        const setElapsed = lastProgress.time_elapsed
        const currentElapsed = differenceInMinutes(now, lastProgress.created_at)
        return setElapsed * 1.5 < currentElapsed
      })
    },
    get cardProgressToday() {
      return self.flashcards.reduce((prev, card) => {
        return (
          prev +
          card.todaysCardProgresses.filter(
            (progress) =>
              isToday(progress.created_at) && isAfter(progress.next_shown, endOfDay(new Date())),
          ).length
        )
      }, 0)
    },
    getFlashcardById: (id: string) => {
      return self.flashcards.find((card) => card.id === id)
    },
    doesDeckAlreadyContainFlashcard(front: String) {
      if (!front) return false
      return !!self.flashcards.find((flashcard) => flashcard.front === front)
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    addToQueuedQueries(query: QuerySnapshotIn) {
      const newQuery = QueryModel.create(query)
      self.queuedQueries.push(newQuery)
      return newQuery
    },
    removeFromQueries(query: QuerySnapshotIn) {
      const queryIndex = self.queuedQueries.findIndex((curr) => curr.id === query.id)
      if (queryIndex != -1) {
        self.queuedQueries.splice(queryIndex, 1)
        console.log("we removed from the quuery", queryIndex)
      }
    },
    removeFromQueriesByProgressId(id: string) {
      const queryIndex = self.queuedQueries.findIndex(
        (curr) => JSON.parse(curr.variables).id === id,
      )
      if (queryIndex != -1) {
        self.queuedQueries.splice(queryIndex, 1)
        console.log("we removed from the quuery", queryIndex)
      }
    },
    setTranslateLanguage(language: TranslateLanguage) {
      self.translateLanguage = language
    },
    setSoundOption(option: SoundOptions) {
      self.soundOption = option
    },
    setStartMode(option: StartOption) {
      self.startMode = option
    },
    setPlaySoundLanguage(language: SoundLanguage) {
      self.playSoundLanguage = language
    },
    toggleFlipFlashcard() {
      self.flipFlashcard = !self.flipFlashcard
    },
    togglePlaySoundAutomatically() {
      self.playSoundAutomatically = !self.playSoundAutomatically
    },
    toggleAddNewCardsPerDay() {
      self.addNewCardsPerDay = !self.addNewCardsPerDay
    },
    addFlashcard: (flashcard: FlashcardSnapshotIn) => {
      if (!flashcard) {
        return null
      }
      const model = FlashcardModel.create(flashcard)
      self.flashcards.push(model)
      return model
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
    deleteCardProgress: (cardProgress: CardProgressSnapshotIn) => {
      const flashcard = self?.flashcards?.find((card) => card.id === cardProgress.flashcard_id)
      const progress = flashcard?.card_progress?.find((progress) => progress.id === cardProgress.id)
      //ideally we would want to set our next_shown to the last card progress in the list if it doesnt
      if (progress) {
        destroy(progress)
        if (flashcard?.mostRecentProgress && flashcard?.mostRecentProgress?.next_shown) {
          flashcard.next_shown = flashcard?.mostRecentProgress?.next_shown
        } else {
          flashcard.next_shown = new Date()
        }
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
    updateDeck: (deck: Partial<DeckSnapshotIn>) => {
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
    updatePaidImport: (imported: boolean) => {
      self.paid_imported = imported
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Deck extends Instance<typeof DeckModel> {}
export interface DeckSnapshotOut extends SnapshotOut<typeof DeckModel> {}
export interface DeckSnapshotIn extends SnapshotIn<typeof DeckModel> {}
export const createDeckDefaultModel = () => types.optional(DeckModel, {})
