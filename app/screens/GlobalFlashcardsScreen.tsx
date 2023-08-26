import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  TextStyle,
  View,
  ViewStyle,
  Image,
  ImageStyle,
  Animated,
  Easing,
  useWindowDimensions,
  ImageBackground,
} from "react-native"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"

import {
  BottomModal,
  Button,
  EmptyState,
  Flashcard,
  Icon,
  ImageSearch,
  LibraryImagePicker,
  ListItem,
  Screen,
  Header,
  Text,
  TextField,
  BottomSheet,
  CustomModal,
  CustomText,
  CustomTag,
  EditableText,
  EditFlashcard,
} from "../components"
import { colors, custom_colors, spacing, typography } from "../theme"
import { addGlobalFlashcard, searchGlobalFlashcards } from "../utils/globalFlashcardsUtils"
import { useNavigation } from "@react-navigation/native"
import { CardProgress, useStores } from "../models"
import { Flashcard_Fields, addFlashcard, mapReponseToFlashcard } from "../utils/flashcardUtils"
import { dictionaryApi } from "../services/dictionaryApi/dictionaryApi"
import { vocabulary_words } from "../../assets/words"
import debounce from "lodash.debounce"
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { AppStackParamList } from "../utils/consts"
import Tags from "react-native-tags"
import { borderRadius } from "../theme/borderRadius"
// STOP! READ ME FIRST!

// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `GlobalFlashcards: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="GlobalFlashcards" component={GlobalFlashcardsScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const GlobalFlashcardsScreen: FC<StackScreenProps<AppStackScreenProps, "GlobalFlashcards">> =
  observer(function GlobalFlashcardsScreen() {
    const { deckStore } = useStores()
    const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()

    const [searchTerm, setSearchTerm] = useState("")
    const [flashcards, setFlashcards] = useState([])
    const [selectedFlashcard, setSelectedFlashcard] = useState(null)
    const addFlashcardModalRef = useRef<BottomSheetModal>(null)
    const [duplicateModalVisible, setDuplicateModalVisbile] = useState(false)
    const [searchDefinition, setSearchDefinition] = useState(null)

    useEffect(() => {
      const getFlashcards = async (searchTerm) => {
        const data = await searchGlobalFlashcards(searchTerm)
        const searchResponse = await dictionaryApi.getEntry(searchTerm)
        if (searchResponse != null) {
          setFlashcards((prev) => [...data, searchResponse])
        } else {
          setFlashcards((prev) => [...data])
        }

        console.log("we set the response")
      }

      if (searchTerm) {
        getFlashcards(searchTerm).catch((error) => {
          console.log(error, "search for word failed")
        })
      } else {
        setFlashcards([])
      }
    }, [searchTerm])

    const getOnlineDictionaryDefintion = async (searchTerm: string) => {
      const searchResponse = await dictionaryApi.getEntry(searchTerm)
      setSearchDefinition((prev) => searchResponse)
    }

    //should automatically run if there isnt a flashcard with the exact word or if there is none
    const getWordDefinition = async (searchTerm): Promise<string> => {
      const data = await dictionaryApi.getEntry(searchTerm)
      if (data) {
        console.log("data this is the entry", data)
        const res = addGlobalFlashcard(data)
      }
      return null
    }

    const insertManyWords = async () => {
      vocabulary_words.forEach((word) => {
        getWordDefinition(word)
      })
    }

    const showAddNewFlashcardModal = () => {
      addFlashcardModalRef?.current.present()
    }

    const selectFlashcard = (flashcard) => {
      setSelectedFlashcard(flashcard)
      addFlashcardModalRef?.current.present()
    }

    const checkIfFlashcardExists = (front: string) => {
      return deckStore.selectedDeck.doesDeckAlreadyContainFlashcard(front)
    }

    const confirmAddFlashcard = (card: any) => {
      if (checkIfFlashcardExists(card?.front)) {
        setDuplicateModalVisbile(true)
      }
    }

    return (
      <Screen safeAreaEdges={["bottom"]} style={$root}>
        <Header
          leftIcon="caretLeft"
          onLeftPress={() => navigation.goBack()}
          title={deckStore.selectedDeck.title}
        ></Header>
        <View style={$container}>
          <TextField
            autoCapitalize={"none"}
            containerStyle={$modal_text_field}
            value={searchTerm}
            placeholder="Search"
            LeftAccessory={(props) => (
              <Icon
                containerStyle={props.style}
                icon="search"
                color={custom_colors.foreground3}
                size={24}
              ></Icon>
            )}
            onChangeText={setSearchTerm}
          ></TextField>

          <Button
            style={{ width: 170, marginBottom: spacing.size200 }}
            onPress={() => getOnlineDictionaryDefintion(searchTerm)}
            preset="custom_default_small"
          >
            Search for definition
          </Button>
          {searchDefinition && (
            <View style={$search_definition}>
              <CustomText preset="caption1Strong">Dictionary search results:</CustomText>
              <TouchableOpacity onPress={() => selectFlashcard(searchDefinition)}>
                <View style={{ paddingVertical: spacing.size320 }}>
                  <CustomText style={$flashcard_front} preset="body1strong">
                    {searchDefinition.front}
                  </CustomText>
                  <CustomText style={$flashcard_back} preset="body2">
                    {searchDefinition.back}
                  </CustomText>
                  {searchDefinition?.extra && (
                    <CustomText preset="caption1" style={$flashcard_extra}>
                      {searchDefinition.extra}
                    </CustomText>
                  )}
                  <View style={$extra_array}>
                    {searchDefinition?.extra_array.map((extra, i) => (
                      <CustomTag text={extra}></CustomTag>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}

          <ScrollView showsVerticalScrollIndicator={false} style={$route_container}>
            {flashcards && flashcards.length > 0 ? (
              flashcards.map((flashcard) => {
                return (
                  <TouchableOpacity key={flashcard.id} onPress={() => selectFlashcard(flashcard)}>
                    <View style={$flashcard}>
                      <CustomText style={$flashcard_front} preset="body1strong">
                        {flashcard.front}
                      </CustomText>
                      <CustomText style={$flashcard_back} preset="body2">
                        {flashcard.back}
                      </CustomText>
                      {flashcard?.extra && (
                        <CustomText preset="caption1" style={$flashcard_extra}>
                          {flashcard.extra}
                        </CustomText>
                      )}
                      {flashcard?.extra_array && (
                        <View>
                          <View style={$extra_array}>
                            {flashcard?.extra_array.map((extra, i) => (
                              <CustomTag text={extra} key={i}></CustomTag>
                            ))}
                          </View>
                        </View>
                      )}
                      {/* {flashcard.picture_url && (
                          <View style={{ flexShrink: 1 }}>
                            <Image
                              source={{ uri: flashcard.picture_url }}
                              style={$flashcard_image}
                            />
                          </View>
                        )} */}
                    </View>
                  </TouchableOpacity>
                )
              })
            ) : (
              <View>
                {searchTerm.length == 0 ? (
                  <CustomText style={{ marginBottom: spacing.medium }} preset="body1">
                    Search for premade flashcards or dictionary defintions
                  </CustomText>
                ) : (
                  <CustomText style={{ marginBottom: spacing.medium }} preset="body1">
                    There aren't any premade cards found for {searchTerm}
                  </CustomText>
                )}
              </View>
            )}
          </ScrollView>
          <CustomModal
            mainAction={() => null}
            secondaryAction={() => setDuplicateModalVisbile(false)}
            mainActionLabel={"Add"}
            visible={duplicateModalVisible}
            header={"Duplicate flashcard"}
            body={
              "You already have a flashcard with this front, are you sure you want to add this?"
            }
          ></CustomModal>
        </View>
        <BottomSheet ref={addFlashcardModalRef} customSnap={["80%"]}>
          <EditFlashcard
            deck={deckStore.selectedDeck}
            flashcard={{ ...selectedFlashcard, id: undefined }}
          ></EditFlashcard>
        </BottomSheet>
      </Screen>
    )
  })

const $modal: ViewStyle = {
  backgroundColor: "white",
  padding: 0,
  borderRadius: 8,
  //animationIn="zoomIn"
  //animationOut="zoomOut"
}

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  paddingHorizontal: spacing.size160,
  height: "100%",
}

const $flashcard: ViewStyle = {
  flexDirection: "column",
  marginVertical: spacing.extraSmall,
  minHeight: 120,
}

const $modal_text_field: ViewStyle = {
  marginVertical: spacing.medium,
}

const $flashcard_image: ImageStyle = {
  width: 60,
  height: 60,
  marginLeft: spacing.small,
  borderRadius: 8,
}

const $flashcard_front: TextStyle = {
  fontWeight: "bold",
}

const $flashcard_back: TextStyle = {}

const $flashcard_extra: TextStyle = {
  fontStyle: "italic",
  fontSize: 12,
}

const $search_image: ImageStyle = {
  width: 120,
  height: 120,
  borderRadius: 10,
}

const $route_container: ViewStyle = {
  flex: 1,
}

const $extra_text: TextStyle = {
  marginRight: spacing.small,
  paddingVertical: 4,
  paddingHorizontal: 12,
  borderRadius: 8,
  backgroundColor: colors.background,
}

const $extra_array: ViewStyle = {
  flexDirection: "row",
  gap: 8,
  flexWrap: "wrap",
}

const $search_definition: ViewStyle = {
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderColor: custom_colors.background5,
  paddingVertical: spacing.size120,
}
