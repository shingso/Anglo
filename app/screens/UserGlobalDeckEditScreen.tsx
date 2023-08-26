import React, { FC, useRef } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, TouchableOpacity, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import {
  BottomSheet,
  Button,
  Card,
  CustomText,
  EditFlashcard,
  Header,
  Screen,
  Text,
} from "app/components"
import { FlashcardModel, useStores } from "app/models"
import { custom_colors, spacing } from "app/theme"
import { getSnapshot, IStateTreeNode } from "mobx-state-tree"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { useNavigation } from "@react-navigation/native"
import { addToPrivateGlobalFlashcard } from "app/utils/globalDecksUtils"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface UserGlobalDeckEditScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"UserGlobalDeckEdit">> {}

export const UserGlobalDeckEditScreen: FC<UserGlobalDeckEditScreenProps> = observer(
  function UserGlobalDeckEditScreen() {
    // Pull in one of our MST stores
    const { globalDeckStore } = useStores()
    const selectedGlobalDeck = globalDeckStore.selectedDeck
    const flashcards = selectedGlobalDeck.private_global_flashcards
    const selectedFlashcardModalRef = useRef<BottomSheetModal>()
    const navigation = useNavigation()

    const openAddNewFlashcard = () => {
      selectedFlashcardModalRef?.current.present()
    }

    const addGlobalFlashcard = async (flashcardReference, deck_id) => {
      const response = await addToPrivateGlobalFlashcard(flashcardReference, deck_id)
      if (response) {
        selectedGlobalDeck.addFlashcard(response)
      }
    }

    return (
      <Screen style={$root}>
        <Header
          leftIcon="caretLeft"
          onLeftPress={() => navigation.goBack()}
          title={selectedGlobalDeck?.title + "(Public)"}
        ></Header>
        <View style={$container}>
          <Button
            style={{ marginBottom: spacing.size200 }}
            onPress={() => openAddNewFlashcard()}
            preset="custom_default_small"
          >
            Add card
          </Button>
          <CustomText
            style={{ marginBottom: spacing.size120, color: custom_colors.foreground2 }}
            preset="title2"
          >
            Cards
          </CustomText>
          {/*     <CustomText
            style={{ marginBottom: spacing.size120, color: custom_colors.foreground1 }}
            preset="body1"
          >
            {flashcards.length}
          </CustomText> */}
          <FlatList
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            data={getSnapshot(flashcards as IStateTreeNode)}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{ paddingVertical: spacing.size20 }}
                key={item.id}
                children={
                  <Card
                    style={{
                      width: "100%",
                      padding: 0,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      elevation: 0,
                      borderRadius: 4,
                      paddingHorizontal: spacing.size160,
                      paddingVertical: spacing.size120,
                      minHeight: 0,
                    }}
                    ContentComponent={<CustomText preset="body2">{item.front}</CustomText>}
                  ></Card>
                }
              ></TouchableOpacity>
            )}
          ></FlatList>
        </View>
        <BottomSheet ref={selectedFlashcardModalRef} customSnap={["85"]}>
          <EditFlashcard
            deck={selectedGlobalDeck}
            customSaveFlashcard={(flashcardReference, deck) =>
              addGlobalFlashcard(flashcardReference, deck?.id)
            }
            flashcard={null}
          ></EditFlashcard>
        </BottomSheet>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: custom_colors.background5,
}
const $container: ViewStyle = {
  padding: spacing.size200,
}
