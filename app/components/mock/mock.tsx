import {
  FlashcardSnapshotIn,
  DeckSnapshotIn,
  DeckStoreSnapshotIn,
  DeckModel,
  DeckStoreModel,
  SettingsStoreSnapshotIn,
  SettingsStoreModel,
  SubscriptionStoreModel,
  SubscriptionModel,
} from "app/models"
import { SoundOptions } from "app/utils/consts"
import { subDays, addDays } from "date-fns"
import { v4 as uuidv4 } from "uuid"

export default {
  height: 100,
  width: 100,
  scale: 2.0,
  uri: "https://placekitten.com/200/200",
}

const mockDeckTitles = [
  "LorumTitle",
  "nostrudTitle",
  "fugiatTitle",
  "laborumTitle",
  "LorumTiatle",
  "nostrudTaitle",
  "fugiatTsitle",
  "laborumTbitle",
]
const mockFrontValues = [
  "Lorum",
  "nostrud",
  "fugiat",
  "laboruma",
  "nostruda",
  "fugiata",
  "laboruma",
  "nostrudb",
  "fugiatb",
  "laborumb",
]
const mockBackValues = [
  "occcat cupidaat non prodent",
  "occacat cupidtat non",
  "mollit anim id est lborum",
  "occaeca cupidatat non proent",
  "occaet cupidatat non",
  "molt anim id est lorum",
  "mlit anm id estlbrum",
  "ocaeca cupdtat non prent",
  "occaet cupdatat non",
  "molt anim id est lrum",
]

const mockExtraValues = [
  "occcats cupidaat non prodent",
  "occacate cupidteet non",
  "mollitexa anim id est lborum",
  "occaecaexa cupidasdatat non proent",
  "occaesasdt cupiasddatat non",
  "molt ansaadim id est laseorum",
  "mlit asnm id estlbasrum",
  "ocaecea cupdasetat non prent",
  "occaet cupextrradatat non extsd",
  "molest anism id ests lrum extra",
]

export const generateMockFlashcards = (number: number, deckId?: string): FlashcardSnapshotIn[] => {
  const mockFlashcards = []
  for (var i = 0; i < number; i++) {
    const flashcard: FlashcardSnapshotIn = {
      id: uuidv4(),
      front: uuidv4(), //mockFrontValues[Math.floor(Math.random() * mockBackValues.length)],
      back: mockBackValues[Math.floor(Math.random() * mockBackValues.length)],
      extra: mockExtraValues[Math.floor(Math.random() * mockExtraValues.length)],
      extra_array: [],
      next_shown:
        Math.random() > 0.5
          ? subDays(
              addDays(new Date(), Math.floor(Math.random() * 6)),
              Math.floor(Math.random() * 6),
            )
          : undefined,
      sub_header: mockFrontValues[Math.floor(Math.random() * mockFrontValues.length)],
    }
    if (deckId) {
      flashcard.deck_id = deckId
    }

    mockFlashcards.push(flashcard)
  }
  return mockFlashcards
}

export const mockDeckModel: DeckSnapshotIn = {
  id: "41b3a893-b270-4595-bf0c-6518d38e6c64",
  title: mockDeckTitles[Math.floor(Math.random() * mockDeckTitles.length)],
  flashcards: [...generateMockFlashcards(60, "41b3a893-b270-4595-bf0c-6518d38e6c64")],
  last_added: new Date(),
  new_per_day: Math.floor(Math.random() * 20),
  last_global_sync: new Date(),
  global_deck_id: "41b3a893-b270-4595-bf0c-6518d38e6c6",

  //soundOption: SoundOptions.FRONT,
}

export const mockDeckModelCreate = DeckModel.create(mockDeckModel)

export const mockDeckStoreCreate = DeckStoreModel.create({
  decks: [mockDeckModel],
})

export const mockSubscriptionStoreHasSubCreate = SubscriptionStoreModel.create({
  subscription: SubscriptionModel.create({
    end_date: addDays(new Date(), 5),
  }),
})

export const mockSubscriptionStoreNoSubCreate = SubscriptionStoreModel.create({
  subscription: SubscriptionModel.create({
    end_date: undefined,
    subscription_id: undefined,
  }),
})

export const mockDeckStoreModel: DeckStoreSnapshotIn = {
  decks: [mockDeckModel],
}

export const mockSettingStore: SettingsStoreSnapshotIn = {
  isOffline: true,
  isDarkMode: false,
}

export const mockSettingStoreCreate = SettingsStoreModel.create(mockSettingStore)
