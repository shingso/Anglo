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
import { colors, custom_colors, custom_palette, spacing, typography } from "../theme"
import { useNavigation, useRoute } from "@react-navigation/native"
import {
  getConfirmedRemoteId,
  getPendingRemoteFunctions,
  returnRemoteAndLocalConflicts,
  returnRemoteAndLocalMostRecent,
} from "../utils/remote_sync/remoteSyncUtils"
import format from "date-fns/format"
import isEqual from "lodash/isEqual"
import { wordsApi } from "../services/dictionaryApi/wordsApi"
import { vocabulary_words } from "../../assets/words"
import { AppRoutes, AppStackParamList, SortType } from "../utils/consts"
import { AppStackScreenProps } from "app/navigators"
import { getTutorialSeen, saveTutorialSeen } from "app/utils/storage/tutorialUtils"

export const HomeScreen: FC<StackScreenProps<AppStackScreenProps<"Home">>> = observer(
  function HomeScreen() {
    const { deckStore, boughtDeckStore, subscriptionStore } = useStores()
    const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
    const [conflictModalVisibile, setConflictModalVisible] = useState(false)

    useEffect(() => {
      //getGlobalDeckConflicts()
      addNewCardsToShowToDecks()
      //TODO Figure these out we do always want to go to tutorail check and getUserBought deck/subscription status
      // getMostRecentCardProgress()

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
        if (deck?.addNewCardsPerDay) {
          addNewDailyCardsToShow(deck)
        }
      })
    }

    const getGlobalDeckConflicts = () => {
      deckStore.decks.forEach((deck) => {
        deck.getConflicts()
      })
    }

    return (
      <Screen safeAreaEdges={["bottom", "top"]} style={$root}>
        <View style={$container}>
          {/*   <Header
            onLeftPress={() => navigation.openDrawer()}
            title={"Home"}
            leftIcon="menu"
            // rightIcon={deckStore?.selectedDeck ? "home" : null}
            // onRightPress={() => (deckStore?.selectedDeck ? deckStore.removeSelectedDeck() : null)}
          ></Header> */}

          <View
            style={{
              paddingHorizontal: spacing.size200,
              marginVertical: spacing.size160,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                backgroundColor: custom_palette.grey74,
                //borderWidth: 1.2,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon
                onPress={() => navigation.openDrawer()}
                icon="menu"
                color={custom_palette.white}
                size={22}
              ></Icon>
            </View>
            {/* <CustomText
              preset="title3"
              style={{ marginLeft: spacing.size200, fontFamily: typography.fonts.roboto.light }}
            >
              Good Afternoon
            </CustomText> */}
          </View>
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
}
