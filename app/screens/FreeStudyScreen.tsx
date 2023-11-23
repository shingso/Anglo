import React, { FC, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
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
} from "app/components"
import { FlashcardModel, useStores } from "app/models"
import { getSnapshot, IStateTreeNode } from "mobx-state-tree"
import { useNavigation } from "@react-navigation/native"
import { custom_colors, custom_palette, spacing } from "app/theme"
import { AppRoutes, AppStackParamList } from "app/utils/consts"
import { StackNavigationProp } from "@react-navigation/stack"
import { ScrollView } from "react-native-gesture-handler"
import { BottomSheetModal } from "@gorhom/bottom-sheet"

interface FreeStudyScreenProps extends NativeStackScreenProps<AppStackScreenProps<"FreeStudy">> {}

export const FreeStudyScreen: FC<FreeStudyScreenProps> = observer(function FreeStudyScreen() {
  // Pull in one of our MST stores

  const { deckStore } = useStores()
  const flashcards = deckStore?.selectedDeck?.flashcards ? deckStore?.selectedDeck?.flashcards : []
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
  const [unselectedFlashcards, setUnselectedFlashcards] = useState([])
  const [searchTerm, setSearchTerm] = useState<string>("")
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
  }

  const setActiveFlashcards = () => {
    const activeFlashcards = flashcards.filter((card) => !card?.next_shown).map((card) => card.id)
    setUnselectedFlashcards(activeFlashcards)
  }

  const setInactiveFlashcards = () => {
    const inactiveFlashcards = flashcards
      .filter((card) => !!card?.next_shown)
      .map((card) => card.id)
    setUnselectedFlashcards(inactiveFlashcards)
  }

  const goToFreeStudySession = () => {
    const selectedFlashcards = flashcards.filter((card) => !unselectedFlashcards.includes(card.id))
    deckStore.selectedDeck.setCustomSessioncards(selectedFlashcards)
    navigation.navigate(AppRoutes.FREE_STUDY_SESSION)
  }

  const setDifficultCards = () => {
    const easyFlashcards = flashcards.filter((card) => card.easeFactor > 2).map((card) => card.id)
    setUnselectedFlashcards(easyFlashcards)
  }

  return (
    <Screen style={$root} preset="fixed">
      <Header title={"Free study"}></Header>
      <View style={$container}>
        <View style={{ flexDirection: "row", gap: spacing.size100, flexWrap: "wrap" }}>
          {/*       <Button
            style={{ marginBottom: spacing.size120 }}
            onPress={() => clearUnselectedFlashcards()}
            preset="custom_default_small"
          >
            All
          </Button>
          <Button
            style={{ marginBottom: spacing.size120 }}
            onPress={() => setActiveFlashcards()}
            preset="custom_secondary_small"
          >
            Active
          </Button>
          <Button
            style={{ marginBottom: spacing.size120 }}
            onPress={() => setDifficultCards()}
            preset="custom_secondary_small"
          >
            Difficult
          </Button>
          <Button
            style={{ marginBottom: spacing.size120 }}
            onPress={() => setInactiveFlashcards()}
            preset="custom_secondary_small"
          >
            Inactive
          </Button> */}
          <Button
            style={{ marginBottom: spacing.size120 }}
            onPress={() => quickSelectModalRef.current.present()}
            preset="custom_default_small"
          >
            Select
          </Button>
          <Button
            style={{ marginBottom: spacing.size120 }}
            onPress={() => goToFreeStudySession()}
            preset="custom_secondary_small"
          >
            Start
          </Button>
        </View>
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
        <FlatList
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          data={getSnapshot(flashcards as IStateTreeNode)
            .filter((card) => card?.front && card.front?.toLowerCase().includes(searchTerm))
            .sort((a, b) =>
              unselectedFlashcards.includes(a.id) === unselectedFlashcards.includes(b.id)
                ? 0
                : unselectedFlashcards.includes(a.id)
                ? 1
                : -1,
            )}
          renderItem={({ item, index }) => (
            <FlashcardListItem
              // onPress={() =>
              //   !unselectedFlashcards.includes(item.id)
              //     ? addToUnselectedFlashcards(item.id)
              //     : removeFromUnselectedFlashcards(item.id)
              // }
              onPress={() => console.log(item)}
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
              key={item.id}
              flashcard={item}
            ></FlashcardListItem>
          )}
        ></FlatList>
      </View>

      <BottomSheet ref={quickSelectModalRef} customSnap={["85"]}>
        <ModalHeader title={"Select cards for free study based on"}></ModalHeader>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 240 }}
          showsVerticalScrollIndicator={false}
        >
          <Button
            style={{ marginBottom: spacing.size120 }}
            onPress={() => clearUnselectedFlashcards()}
            preset="custom_default_small"
          >
            All
          </Button>
          <Button
            style={{ marginBottom: spacing.size120 }}
            onPress={() => setActiveFlashcards()}
            preset="custom_secondary_small"
          >
            Active
          </Button>
          <Button
            style={{ marginBottom: spacing.size120 }}
            onPress={() => setDifficultCards()}
            preset="custom_secondary_small"
          >
            Difficult
          </Button>
          <Button
            style={{ marginBottom: spacing.size120 }}
            onPress={() => setInactiveFlashcards()}
            preset="custom_secondary_small"
          >
            Inactive
          </Button>
        </ScrollView>
      </BottomSheet>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  padding: spacing.size200,
}
