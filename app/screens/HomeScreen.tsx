import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  TextStyle,
  View,
  ViewStyle,
  Image,
  TextInput,
} from "react-native"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"
import {
  BottomModal,
  BottomSheet,
  Button,
  Card,
  CustomModal,
  CustomText,
  DeckHome,
  Header,
  HomeForecast,
  Icon,
  Screen,
  Text,
  TextField,
} from "../components"
import { addDeck, addNewDailyCardsToShow } from "../utils/deckUtils"
import { supabase, supabseStorageUrl } from "../services/supabase/supabase"
import { Deck, useStores } from "../models"
import { colors, custom_colors, spacing, typography } from "../theme"
import { useNavigation, useRoute } from "@react-navigation/native"
import {
  FunctionTypes,
  applyRemoteSync,
  autoResolveCardProgresses,
  getConfirmedRemoteId,
  getPendingRemoteFunctions,
  getRemoteRecentUpdate,
  returnRemoteAndLocalConflicts,
  returnRemoteAndLocalMostRecent,
  updateConfirmedRemoteId,
} from "../utils/remote_sync/remoteSyncUtils"
import { borderRadius } from "../theme/borderRadius"
import { BottomSheetModal, TouchableOpacity } from "@gorhom/bottom-sheet"

import format from "date-fns/format"
import isEqual from "lodash/isEqual"
import { wordsApi } from "../services/dictionaryApi/wordsApi"
import { vocabulary_words } from "../../assets/words"
import { AppRoutes, AppStackParamList, SortType } from "../utils/consts"
import { showErrorToast, showSuccessToast } from "../utils/errorUtils"
import { AppStackScreenProps } from "app/navigators"
import { dictionaryApi } from "app/services/dictionaryApi/dictionaryApi"
import { getDay } from "date-fns"
import formatDistance from "date-fns/fp/formatDistance/index.js"
import { getUserBoughtDecks } from "../utils/boughtDecksUtils"
import { getTutorialSeen } from "app/utils/storage/tutorialUtils"

export const HomeScreen: FC<StackScreenProps<AppStackScreenProps<"Home">>> = observer(
  function HomeScreen() {
    const { deckStore, boughtDeckStore, subscriptionStore } = useStores()
    const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
    const [deckTitle, setDeckTitle] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const [conflictModalVisibile, setConflictModalVisible] = useState(false)

    const goToTutorial = async () => {
      //const response = await deckStore.getDecks()
      const res = await getTutorialSeen()
      if (res === null && !(deckStore?.decks?.length > 0)) {
        navigation.navigate(AppRoutes.TUTORIAL)
      }
    }

    useEffect(() => {
      const getUserDecks = async () => {}
      //getUserDecks()
      //getGlobalDeckConflicts()

      addNewCardsToShowToDecks()

      //TODO Figure these out we do always want to go to tutorail check and getUserBought deck/subscription status
      // getMostRecentCardProgress()
      // goToTutorial()
      // boughtDeckStore.getUserBoughtDecks()
    }, [])

    useEffect(() => {
      //check for remote state against local state
      const checkRemoteForConflict = async () => {
        const { remoteId, localId } = await returnRemoteAndLocalMostRecent()
        if ((!remoteId && !localId) || remoteId === localId) {
          return
        }
        const confirmedRemoteId = await getConfirmedRemoteId() // this represents what is confirmed in the most recent remote
        const saveRemoteFunctions = await getPendingRemoteFunctions()

        //If we have something in remote functions theres a local conflict, possibly better way to represent this
        const hasLocalConflict = !!saveRemoteFunctions && saveRemoteFunctions?.length > 0
        //Assuming a response is given and confirmedRemoteId is accurate
        const hasRemoteConflict = confirmedRemoteId !== remoteId

        if (hasRemoteConflict && !hasLocalConflict) {
          //have remote conflict but no local - means that remote is ahead - simple fetch the remote state
          //deckStore.getDecks()
        }

        if (!hasRemoteConflict && hasLocalConflict) {
          //we have local conflict but no remote conflict - local is ahead - apply functions
          //applyRemoteSync(saveRemoteFunctions)
          console.log("we have a remove function", saveRemoteFunctions.toString())
        }

        if (hasRemoteConflict && hasLocalConflict) {
          //go to the resolutions page// or maybe we should check for the real conflicts
          const { conflictedProgresses, nonConflictProgresses } =
            await returnRemoteAndLocalConflicts()
        }

        //after we have reconclided we can retreieve the decks again

        /* 
        if (remoteId && !localId) {
          resetStateUsingRemote()
          updateMostRecentLocalId(remoteId)
        } */
      }

      checkRemoteForConflict()
    }, [])

    const addNewCardsToShowToDecks = () => {
      deckStore.decks.forEach((deck) => {
        addNewDailyCardsToShow(deck)
      })
    }

    const getGlobalDeckConflicts = () => {
      deckStore.decks.forEach((deck) => {
        deck.getConflicts()
      })
    }

    const goToDeckSettings = () => {
      navigation.navigate(AppRoutes.DECK_SETTINGS)
    }

    const startSession = (deck: Deck) => {
      if (deck?.todaysCards && deck?.todaysCards.length > 0) {
        deckStore.selectDeck(deck)
        deckStore.selectedDeck.setSessionCards()
        navigation.navigate(AppRoutes.SESSION)
      } else {
        showSuccessToast("Good Job!", "There are no more cards for today")
      }
    }

    const purchaseDeck = async () => {
      const userBoughtDecks = await getUserBoughtDecks()
      console.log(userBoughtDecks)
    }

    return (
      <Screen safeAreaEdges={["bottom"]} style={$root}>
        <View style={$container}>
          <Header
            onLeftPress={() => navigation.openDrawer()}
            title={deckStore?.selectedDeck?.title || "Home"}
            leftIcon="menu"
            rightIcon={deckStore?.selectedDeck ? "home" : null}
            onRightPress={() => (deckStore?.selectedDeck ? deckStore.removeSelectedDeck() : null)}
          ></Header>

          <HomeForecast></HomeForecast>

          <CustomModal
            header={"Conflict Detected!"}
            body={
              "There a difference between your current progress against what we have saved remotely."
            }
            secondaryAction={() => setConflictModalVisible(false)}
            mainAction={() => setConflictModalVisible(false)}
            visible={conflictModalVisibile}
          ></CustomModal>
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  height: "100%",
  backgroundColor: custom_colors.background5,
}

const $modal_text_field: ViewStyle = {
  marginVertical: spacing.medium,
}

const $text_input_wrapper: ViewStyle = {
  backgroundColor: "white",
}

const $button_container: ViewStyle = {
  flexDirection: "row",
}
