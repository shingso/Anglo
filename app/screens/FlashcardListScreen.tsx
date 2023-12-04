import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, TouchableOpacity, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import {
  BottomSheet,
  CustomModal,
  CustomText,
  EditFlashcard,
  FlashcardListItem,
  Header,
  Icon,
  Screen,
  StatusLabel,
  TextField,
} from "app/components"
import { Deck, Flashcard, FlashcardModel, QueryFunctions, useStores } from "app/models"
import { spacing, custom_colors, custom_palette } from "app/theme"
import { getSnapshot, IStateTreeNode } from "mobx-state-tree"
import {
  AppRoutes,
  AppStackParamList,
  SortType,
  SortTypeIcon,
  SortTypeLabels,
} from "app/utils/consts"
import { useNavigation, useTheme } from "@react-navigation/native"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { showErrorToast } from "app/utils/errorUtils"
import { deleteFlashcard, calculateFlashcardProgress } from "app/utils/flashcardUtils"
import { v4 as uuidv4 } from "uuid"
interface FlashcardListScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"FlashcardList">> {}

export const FlashcardListScreen: FC<FlashcardListScreenProps> = observer(
  function FlashcardListScreen() {
    const { deckStore, settingsStore } = useStores()
    const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
    const theme = useTheme()
    const flashcards = deckStore?.selectedDeck?.flashcards
      ? deckStore?.selectedDeck?.flashcards
      : []
    const [searchTerm, setSearchTerm] = useState("")
    const [sortOption, setSortOption] = useState(SortType.ACTIVE)
    const sortOptions = [
      SortType.DATE_ADDDED,
      SortType.ACTIVE,
      SortType.ALPHABETICAL,
      SortType.DIFFICULTY,
    ]
    const SortOptionLabels = {
      [SortType.DATE_ADDDED]: "Date added",
      [SortType.ACTIVE]: "Active",
      [SortType.ALPHABETICAL]: "Alphabetical",
      [SortType.DIFFICULTY]: "Difficulty",
    }

    const sortingFunction = (sortType) => {
      switch (sortType) {
        case SortType.ACTIVE:
          return (a: Flashcard, b: Flashcard) => {
            if (!a?.next_shown) {
              return 1
            }
            if (!b?.next_shown) {
              return -1
            }

            return new Date(b.next_shown).getTime() - new Date(a.next_shown).getTime()
          }
        case SortType.ALPHABETICAL:
          return (a: Flashcard, b: Flashcard) => {
            return a?.front.localeCompare(b?.front)
          }
        case SortType.DATE_ADDDED:
          return (a, b) => {
            if (!a?.created_at) {
              return 1
            }
            if (!b?.created_at) {
              return -1
            }
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          }
        case SortType.DIFFICULTY:
          return (a, b) => {
            return a.easeFactor - b.easeFactor
          }
        default:
          return (a: Flashcard, b: Flashcard) => {
            return a?.front.localeCompare(b?.front)
          }
      }
    }
    const sortModalRef = useRef<BottomSheetModal>()
    const [deleteFlashcardModalVisible, setDeleteFlashcardModalVisible] = useState(false)
    const selectedFlashcardModalRef = useRef<BottomSheetModal>()
    const selectedFlashcard = deckStore?.selectedDeck?.selectedFlashcard
    const [editFlashcardVisible, setEditFlashcardVisible] = useState(false)

    useEffect(() => {
      const res = navigation.addListener("beforeRemove", (e) => {
        if (!editFlashcardVisible) {
          return
        }
        e.preventDefault()
        selectedFlashcardModalRef?.current?.close()
      })
      return res
    }, [navigation, editFlashcardVisible])

    const onBottomSheetDismiss = () => {
      deckStore.selectedDeck.removeSelectedFlashcard()
      setEditFlashcardVisible(false)
    }

    const openEditFlashcard = () => {
      setEditFlashcardVisible(true)
      selectedFlashcardModalRef?.current.present()
    }

    const removeFlashcard = async (flashcard: Flashcard, deck: Deck) => {
      if (settingsStore.isOffline) {
        const deleteQuery = {
          id: uuidv4(),
          variables: JSON.stringify(flashcard),
          function: QueryFunctions.DELETE_FLASHCARD,
        }
        deck.addToQueuedQueries(deleteQuery)
      }
      deck.deleteFlashcard(flashcard)
      const isCardDeleted = await deleteFlashcard(flashcard)
      selectedFlashcardModalRef.current.close()
      setDeleteFlashcardModalVisible(false)
    }

    const openAddNewFlashcard = () => {
      deckStore.selectedDeck.removeSelectedFlashcard()
      openEditFlashcard()
    }

    const selectFlashcard = (flashcard: Flashcard) => {
      deckStore.selectedDeck.selectFlashcard(flashcard)
      openEditFlashcard()
    }

    const flashcardStatistics = useMemo(() => {
      return calculateFlashcardProgress(selectedFlashcard)
    }, [selectedFlashcard])

    const searchSnapshotFlashcards = getSnapshot(flashcards as IStateTreeNode)
      .filter((card) => card?.front && card.front?.toLowerCase().includes(searchTerm))
      .sort(sortingFunction(sortOption))

    return (
      <Screen style={$root}>
        <Header title={deckStore.selectedDeck?.title}></Header>
        <View style={$container}>
          <TextField
            value={searchTerm}
            autoCorrect={false}
            autoCapitalize={"none"}
            autoComplete={"off"}
            placeholder="Search"
            containerStyle={{
              marginBottom: spacing.size120,
            }}
            LeftAccessory={(props) => (
              <Icon
                containerStyle={props.style}
                icon="search"
                color={custom_colors.foreground3}
                size={20}
              ></Icon>
            )}
            RightAccessory={(props) => (
              <Icon
                containerStyle={props.style}
                icon="dismiss"
                onPress={() => setSearchTerm("")}
                color={custom_colors.foreground3}
                size={18}
              ></Icon>
            )}
            onChangeText={setSearchTerm}
          ></TextField>
          {flashcards?.length > 0 ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: spacing.size80,
                marginHorizontal: spacing.size120,
              }}
            >
              <CustomText preset="caption1Strong">{searchSnapshotFlashcards?.length}</CustomText>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.size40 }}>
                <CustomText
                  onPress={() => sortModalRef?.current?.present()}
                  style={{ color: theme.colors.brandBackground1 }}
                  preset="caption1Strong"
                >
                  Sorted by: {SortOptionLabels[sortOption]}
                </CustomText>
              </View>
            </View>
          ) : null}
          {!!flashcards && flashcards?.length !== 0 ? (
            <FlatList
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: spacing.size200 }}
              showsVerticalScrollIndicator={false}
              data={flashcards
                .slice()
                .sort(sortingFunction(sortOption))
                .filter((card) => card?.front && card.front?.toLowerCase().includes(searchTerm))}
              renderItem={({ item, index }) => (
                <FlashcardListItem
                  key={item.id}
                  flashcard={item}
                  RightComponent={
                    item?.next_shown ? <StatusLabel text={"Active"}></StatusLabel> : null
                  }
                  // RightComponent={<CustomText>{item.easeFactor.toString()}</CustomText>}
                  onPress={() => selectFlashcard(item)}
                ></FlashcardListItem>
              )}
            ></FlatList>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CustomText style={{ marginBottom: spacing.size120 }} preset="title3">
                Add some cards
              </CustomText>
              <CustomText style={{ marginBottom: spacing.size200 }} preset="body2">
                Get started by adding some flashcards
              </CustomText>
              <Icon
                icon="fluent_add_circle"
                color={theme.colors.foreground1}
                onPress={() => openAddNewFlashcard()}
                style={{ marginBottom: spacing.size40 }}
                size={22}
              ></Icon>
              <CustomText style={{ marginBottom: spacing.size200 }} preset="caption1">
                Add new flashcard
              </CustomText>
            </View>
          )}
        </View>
        <BottomSheet ref={sortModalRef} customSnap={["60%"]}>
          <View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: spacing.size120,
                paddingTop: spacing.size80,
              }}
            >
              <CustomText preset="caption1" presetColors="secondary">
                Sort flashcards by
              </CustomText>
            </View>
            <View
              style={{
                height: 0.2,
                backgroundColor: theme.colors.foreground3,
                marginHorizontal: -16,
                marginBottom: spacing.size120,
              }}
            ></View>
          </View>
          <View>
            {sortOptions.map((option) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setSortOption(option)
                  }}
                  key={option}
                >
                  <View style={$sort_option}>
                    <Icon
                      icon={SortTypeIcon[option]}
                      size={20}
                      style={{ marginRight: spacing.size120 }}
                    ></Icon>
                    <CustomText preset="body2Strong">{SortTypeLabels[option]}</CustomText>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </BottomSheet>
        <BottomSheet
          onDismiss={() => onBottomSheetDismiss()}
          ref={selectedFlashcardModalRef}
          customSnap={["85"]}
        >
          <EditFlashcard
            onDelete={() => setDeleteFlashcardModalVisible(true)}
            flashcard={selectedFlashcard}
            deck={deckStore.selectedDeck}
          ></EditFlashcard>
        </BottomSheet>
        <CustomModal
          mainAction={() => removeFlashcard(selectedFlashcard, deckStore.selectedDeck)}
          mainActionLabel={"Delete"}
          secondaryAction={() => setDeleteFlashcardModalVisible(false)}
          visible={deleteFlashcardModalVisible}
          header={"Delete flashcard"}
          body={"Are you sure you want to delete this flashcard? This action cannot be undone"}
        ></CustomModal>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  paddingHorizontal: spacing.size160,
  height: "100%",
}

const $sort_option: ViewStyle = {
  paddingVertical: spacing.size120,
  flexDirection: "row",
  alignItems: "center",
}
