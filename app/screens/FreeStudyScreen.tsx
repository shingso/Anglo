import React, { FC, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { FlashList, FlashListProps } from "@shopify/flash-list"
import {
  BottomSheet,
  Button,
  CustomText,
  FlashcardListItem,
  Icon,
  ModalHeader,
  Screen,
  Text,
  Option,
  TextField,
  Header,
  BottomMainAction,
} from "app/components"
import { FlashcardModel, useStores } from "app/models"
import { getSnapshot, IStateTreeNode } from "mobx-state-tree"
import { useNavigation } from "@react-navigation/native"
import { custom_colors, custom_palette, spacing } from "app/theme"
import { AppRoutes, AppStackParamList } from "app/utils/consts"
import { StackNavigationProp } from "@react-navigation/stack"
import { ScrollView } from "react-native-gesture-handler"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { showDefaultToast } from "app/utils/errorUtils"

enum SelectType {
  ACTIVE = "Active",
  ALL = "All",
  INACTIVE = "Inactive",
  DIFFICULT = "Difficult",
  NONE = "NONE",
}

interface FreeStudyScreenProps extends NativeStackScreenProps<AppStackScreenProps<"FreeStudy">> {}

export const FreeStudyScreen: FC<FreeStudyScreenProps> = observer(function FreeStudyScreen() {
  const { deckStore } = useStores()
  const flashcards = deckStore?.selectedDeck?.flashcards ? deckStore?.selectedDeck?.flashcards : []
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
  const [unselectedFlashcards, setUnselectedFlashcards] = useState([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectType, setSelectType] = useState<string>(SelectType.ALL)
  const quickSelectModalRef = useRef<BottomSheetModal>()
  const addToUnselectedFlashcards = (flashcardId: string) => {
    setUnselectedFlashcards((prev) => {
      return [...prev, flashcardId]
    })
  }

  const removeFromUnselectedFlashcards = (flashcardId: string) => {
    setUnselectedFlashcards((prev) => {
      return [...prev.filter((id) => id != flashcardId)]
    })
  }

  const clearUnselectedFlashcards = () => {
    setUnselectedFlashcards([])
    setSelectType(SelectType.ALL)
  }

  const setActiveFlashcards = () => {
    const activeFlashcards = flashcards.filter((card) => !card?.next_shown).map((card) => card.id)
    setUnselectedFlashcards(activeFlashcards)
    setSelectType(SelectType.ACTIVE)
  }

  const setInactiveFlashcards = () => {
    const inactiveFlashcards = flashcards
      .filter((card) => !!card?.next_shown)
      .map((card) => card.id)
    setUnselectedFlashcards(inactiveFlashcards)
    setSelectType(SelectType.INACTIVE)
  }

  const removeAllFlashcards = () => {
    const allCards = flashcards.map((card) => card.id)
    setUnselectedFlashcards(allCards)
    setSelectType(SelectType.NONE)
  }

  const goToFreeStudySession = () => {
    const selectedFlashcards = flashcards.filter((card) => !unselectedFlashcards.includes(card.id))
    if (selectedFlashcards?.length <= 0) {
      showDefaultToast("No cards selected")
      return
    }
    deckStore.selectedDeck.setCustomSessioncards(selectedFlashcards)
    navigation.navigate(AppRoutes.FREE_STUDY_SESSION)
  }

  const setDifficultCards = () => {
    const easyFlashcards = flashcards.filter((card) => card.easeFactor > 2).map((card) => card.id)
    console.log(easyFlashcards.length)
    if (easyFlashcards?.length === flashcards?.length) {
      showDefaultToast("No difficult cards")
    }
    setUnselectedFlashcards(easyFlashcards)
    setSelectType(SelectType.DIFFICULT)
  }

  return (
    <Screen contentContainerStyle={{ flexGrow: 1 }} style={$root} preset="fixed">
      <Header title={"Free study"}></Header>
      <View style={$container}>
        <ScrollView
          style={{ flexGrow: 0, marginBottom: spacing.size160 }}
          contentContainerStyle={{ gap: spacing.size80 }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <Button
            onPress={() => clearUnselectedFlashcards()}
            preset={
              selectType === SelectType.ALL ? "custom_default_small" : "custom_secondary_small"
            }
          >
            All
          </Button>
          <Button
            onPress={() => setActiveFlashcards()}
            preset={
              selectType === SelectType.ACTIVE ? "custom_default_small" : "custom_secondary_small"
            }
          >
            Active
          </Button>
          <Button
            onPress={() => setInactiveFlashcards()}
            preset={
              selectType === SelectType.INACTIVE ? "custom_default_small" : "custom_secondary_small"
            }
          >
            Inactive
          </Button>
          <Button
            onPress={() => setDifficultCards()}
            preset={
              selectType === SelectType.DIFFICULT
                ? "custom_default_small"
                : "custom_secondary_small"
            }
          >
            Difficult
          </Button>
          <Button
            onPress={() => removeAllFlashcards()}
            preset={
              selectType === SelectType.NONE ? "custom_default_small" : "custom_secondary_small"
            }
          >
            None
          </Button>
        </ScrollView>
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
        <CustomText style={{ marginBottom: spacing.size80 }}>
          Selected flashcards: {flashcards.length - unselectedFlashcards.length}
        </CustomText>
        <FlashList
          showsVerticalScrollIndicator={false}
          estimatedItemSize={47}
          data={getSnapshot(flashcards as IStateTreeNode)
            .filter((card) => card?.front && card.front?.toLowerCase().includes(searchTerm))
            .sort((a, b) =>
              unselectedFlashcards.includes(a.id) === unselectedFlashcards.includes(b.id)
                ? 0
                : unselectedFlashcards.includes(a.id)
                ? 1
                : -1,
            )}
          renderItem={({ item }) => (
            <FlashcardListItem
              onPress={() =>
                !unselectedFlashcards.includes(item.id)
                  ? addToUnselectedFlashcards(item.id)
                  : removeFromUnselectedFlashcards(item.id)
              }
              LeftComponent={
                !unselectedFlashcards.includes(item.id) ? (
                  <Icon
                    size={20}
                    color={custom_colors.successForeground1}
                    icon="circle_check_filled"
                  ></Icon>
                ) : (
                  <Icon size={20} color={custom_palette.grey50} icon="circle"></Icon>
                )
              }
              flashcard={item}
            ></FlashcardListItem>
          )}
        ></FlashList>
      </View>
      <BottomMainAction label="Start" onPress={() => goToFreeStudySession()}></BottomMainAction>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  padding: spacing.size200,
  paddingTop: 0,
  flex: 1,
}
