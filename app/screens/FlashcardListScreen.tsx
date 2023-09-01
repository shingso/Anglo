import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, TouchableOpacity, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import {
  BottomSheet,
  Button,
  Card,
  CustomModal,
  CustomText,
  Dot,
  EditFlashcard,
  FlashcardListItem,
  Header,
  Icon,
  IconTypes,
  LineWord,
  Screen,
  StatusLabel,
  Text,
  TextField,
} from "app/components"
import { Deck, Flashcard, FlashcardModel, useStores } from "app/models"
import { spacing, custom_colors, custom_palette } from "app/theme"
import { format } from "date-fns"
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
import { deleteFlashcard } from "app/utils/flashcardUtils"
import { removeFlashcardFromDeck } from "app/utils/deckUtils"
import { borderRadius } from "app/theme/borderRadius"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface FlashcardListScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"FlashcardList">> {}

export const FlashcardListScreen: FC<FlashcardListScreenProps> = observer(
  function FlashcardListScreen() {
    const { deckStore } = useStores()
    const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
    const theme = useTheme()
    const flashcards = deckStore?.selectedDeck?.flashcards
      ? deckStore?.selectedDeck?.flashcards
      : []
    const [searchTerm, setSearchTerm] = useState("")
    const [flashcardEditSheetIndex, setFlashcardEditSheetIndex] = useState(0)
    const [sortOption, setSortOption] = useState(null)
    const sortOptions = [SortType.DATE_ADDDED, SortType.ACTIVE, SortType.ALPHABETICAL]
    const sortModalRef = useRef<BottomSheetModal>()
    const [deleteFlashcardModalVisible, setDeleteFlashcardModalVisible] = useState(false)
    const selectedFlashcardModalRef = useRef<BottomSheetModal>()
    const selectedFlashcard = deckStore?.selectedDeck?.selectedFlashcard

    useEffect(
      () =>
        navigation.addListener("beforeRemove", (e) => {
          console.log("current index is", flashcardEditSheetIndex)
          if (true) {
            return
          }
          e.preventDefault()
          selectedFlashcardModalRef?.current?.close()
          setFlashcardEditSheetIndex(-1)
        }),
      [navigation],
    )

    const removeFlashcard = async (flashcard: Flashcard, deck: Deck) => {
      const deleted = await removeFlashcardFromDeck(flashcard, deck)
      if (deleted) {
        selectedFlashcardModalRef.current.close()
      }
      setDeleteFlashcardModalVisible(false)
    }

    const openAddNewFlashcard = () => {
      deckStore.selectedDeck.removeSelectedFlashcard()
      selectedFlashcardModalRef?.current.present()
    }

    const goToGlobalFlashcards = () => {
      navigation.navigate(AppRoutes.GLOBAL_FLASHCARDS)
    }

    const selectFlashcard = (flashcard: Flashcard) => {
      deckStore.selectedDeck.selectFlashcard(flashcard)
      selectedFlashcardModalRef?.current.present()
    }

    return (
      <Screen style={$root}>
        <Header
          leftIcon="caret_left"
          onLeftPress={() => navigation.goBack()}
          title={deckStore.selectedDeck?.title}
          customHeader={
            <View style={{ flexDirection: "row", gap: spacing.size200 }}>
              <Icon
                icon="fluent_add_circle"
                color={theme.colors.foreground1}
                onPress={() => openAddNewFlashcard()}
                size={22}
              ></Icon>
              <Icon
                color={theme.colors.foreground1}
                icon="fluent_globe_search"
                onPress={() => openAddNewFlashcard()}
                size={22}
              ></Icon>
            </View>
          }
        ></Header>
        <View style={$container}>
          {/*        <View style={{ flexDirection: "row", gap: spacing.size60 }}>
            <Button
              style={{ marginBottom: spacing.size120 }}
              onPress={() => openAddNewFlashcard()}
              preset="custom_secondary_small"
            >
              Add new
            </Button>
            <Button
              style={{ marginBottom: spacing.size120 }}
              onPress={() => goToGlobalFlashcards()}
              preset="custom_default_small"
            >
              Online
            </Button>
          </View> */}

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
            onChangeText={setSearchTerm}
          ></TextField>
          {/* <Icon
            style={{ marginVertical: spacing.size120 }}
            icon="fluent_sort"
            onPress={() => sortModalRef?.current?.present()}
            size={24}
          ></Icon> */}
          {flashcards?.length > 0 ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: spacing.size80,
                marginHorizontal: spacing.size120,
              }}
            >
              <CustomText preset="caption1Strong">{flashcards.length}</CustomText>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.size40 }}>
                <CustomText
                  onPress={() => sortModalRef?.current?.present()}
                  style={{ color: theme.colors.brandBackground1 }}
                  preset="caption1Strong"
                >
                  Status
                </CustomText>
                <Icon
                  icon="fluent_sort"
                  onPress={() => sortModalRef?.current?.present()}
                  color={theme.colors.brandBackground1}
                  size={14}
                ></Icon>
              </View>
            </View>
          ) : null}
          <FlatList
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            data={getSnapshot(flashcards as IStateTreeNode).filter(
              (card) => card?.front && card.front.includes(searchTerm),
            )}
            renderItem={({ item, index }) => (
              <FlashcardListItem
                key={item.id}
                flashcard={item}
                RightComponent={
                  item?.next_shown ? <StatusLabel text={"Active"}></StatusLabel> : null
                }
                onPress={() => selectFlashcard(FlashcardModel.create(item))}
              ></FlashcardListItem>
            )}
          ></FlatList>
          {flashcards?.length === 0 && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CustomText style={{ marginBottom: spacing.size200 }} preset="title3">
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

              <LineWord text="or"></LineWord>
              <Icon
                color={theme.colors.foreground1}
                icon="fluent_globe_search"
                style={{ marginBottom: spacing.size40 }}
                onPress={() => openAddNewFlashcard()}
                size={22}
              ></Icon>
              <CustomText style={{ marginBottom: spacing.size200 }} preset="caption1">
                Search premade flashcards
              </CustomText>
            </View>
          )}
        </View>

        <BottomSheet ref={sortModalRef} customSnap={["50%"]}>
          <CustomText style={{ marginVertical: spacing.size120 }} preset="body1Strong">
            Sort by
          </CustomText>
          <View>
            {sortOptions.map((option) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    deckStore?.selectedDeck?.sortFlashcardsByType(option)
                    sortModalRef?.current.dismiss()
                  }}
                  key={option}
                >
                  <View style={$sort_option}>
                    <Icon
                      icon={SortTypeIcon[option]}
                      size={20}
                      style={{ marginRight: spacing.size120 }}
                      color={custom_colors.foreground1}
                    ></Icon>
                    <CustomText preset="body2Strong">{SortTypeLabels[option]}</CustomText>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </BottomSheet>
        <BottomSheet
          onChange={(index) => setFlashcardEditSheetIndex(index)}
          onDismiss={() => deckStore.selectedDeck.removeSelectedFlashcard()}
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
          header={"Warning"}
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
}

const $sort_option: ViewStyle = {
  paddingVertical: spacing.size120,
  flexDirection: "row",
  alignItems: "center",
}
