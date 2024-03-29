import * as React from "react"
import {
  StyleProp,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
  Image,
  ActivityIndicator,
  Keyboard,
} from "react-native"
import { observer } from "mobx-react-lite"
import { colors, custom_colors, custom_palette, spacing, typography } from "app/theme"
import { Text } from "app/components/Text"
import { borderRadius } from "app/theme/borderRadius"
import { CustomTag } from "./CustomTag"
import { EditableText } from "./EditableText"
import { Icon } from "./Icon"
import { useEffect, useMemo, useRef, useState } from "react"

import {
  Flashcard_Fields,
  addFlashcard,
  createFormData,
  mapReponseToFlashcard,
  updateFlashcard,
  uploadPictureFile,
} from "app/utils/flashcardUtils"
import * as ImagePicker from "expo-image-picker"
import { supabseStorageUrl } from "app/services/supabase/supabase"
import isEqual from "lodash/isEqual"
import { Flashcard, FlashcardSnapshotIn } from "../models/Flashcard"
import { useStores } from "../models/helpers/useStores"
import { showErrorToast, showSuccessToast } from "app/utils/errorUtils"
import { Deck } from "../models/Deck"
import { QueryFunctions } from "app/models"
import { Dot } from "./Dot"
import { StatusLabel } from "./StatusLabel"
import { useTheme } from "@react-navigation/native"
import { getAIDefintionWithDeckPrompts } from "app/utils/openAiUtils"
import { CustomModal } from "./CustomModal"
import { v4 as uuidv4 } from "uuid"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Loading } from "./Loading"

export interface EditFlashcardProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  flashcard: Flashcard
  onDelete?: Function
  onAddCallBack?: Function
  deck?: Deck
}

/**
 * Describe your component here
 */
export const EditFlashcard = observer(function EditFlashcard(props: EditFlashcardProps) {
  const mapToEditableFlashcard = (flashcard: FlashcardSnapshotIn): FlashcardSnapshotIn => {
    return {
      [Flashcard_Fields.ID]: flashcard?.id,
      [Flashcard_Fields.FRONT]: flashcard?.front,
      [Flashcard_Fields.BACK]: flashcard?.back,
      [Flashcard_Fields.SUB_HEADER]: flashcard?.sub_header,
      [Flashcard_Fields.EXTRA]: flashcard?.extra,
      [Flashcard_Fields.EXTRA_ARRAY]: flashcard?.extra_array ? [...flashcard?.extra_array] : [],
      [Flashcard_Fields.PICTURE_URL]: flashcard?.picture_url,
    }
  }

  const { style, flashcard, onDelete, onAddCallBack, deck } = props
  const $styles = [$container, style]
  const { settingsStore } = useStores()
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [duplicateModalVisible, setDuplicateModalVisibleModalVisible] = useState(false)
  const [selectedFlashcardReference, setSelectedFlashcard] = useState(
    mapToEditableFlashcard(flashcard),
  )

  useEffect(() => {
    setSelectedFlashcard(mapToEditableFlashcard(flashcard))
  }, [flashcard])

  /*   useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      extraArrayRef?.current?.blur()
    })
    return () => {
      keyboardDidHideListener.remove()
    }
  }, []) */
  //we want to go to tthe next input, but we dont want

  const [inputValue, setInputValue] = useState("")

  const handleAddTag = () => {
    if (inputValue.trim() !== "") {
      updateSelectedFlashcard("extra_array", [
        ...selectedFlashcardReference.extra_array,
        inputValue,
      ])
      setInputValue("")
    }
  }

  const resetFlashcard = async (flashcard: Flashcard, deck: Deck) => {
    const updatedFlashcard: FlashcardSnapshotIn = {
      id: flashcard?.id,
      [Flashcard_Fields.NEXT_SHOWN]: null,
    }
    flashcard.updateFlashcard(updatedFlashcard)
    if (settingsStore.isOffline) {
      deck.addToQueuedQueries({
        id: uuidv4(),
        variables: JSON.stringify(updatedFlashcard),
        function: QueryFunctions.UPSERT_FLASHCARDS,
      })
      return updatedFlashcard
    }
    const res = await updateFlashcard(updatedFlashcard)
    return updatedFlashcard
  }

  const useAIDefinition = async () => {
    if (settingsStore.isOffline) {
      showErrorToast("Currently offline", "Go online to use AI to generate a flashcards")
      return
    }

    if (!selectedFlashcardReference?.front) {
      showErrorToast("Enter a word on the front field to use AI to generate a flashcard")
      return
    }

    if (selectedFlashcardReference?.front) {
      setLoading(true)
      const { data, error } = await getAIDefintionWithDeckPrompts(
        deck,
        selectedFlashcardReference?.front,
      )
      if (!data || !!data?.error) {
        setErrorMessage(
          data.remaining === 0
            ? "AI generation limit reached for the month. Subscribe to raise limit to 1000."
            : "Error occured while generating AI flashcard.",
        )
        setErrorModalVisible(true)
        setLoading(false)
        return
      }

      if (data) {
        setSelectedFlashcard((prev) => ({
          ...prev,
          back: data?.back,
          extra: data?.extra,
          sub_header: data?.sub_header,
          extra_array: [...(data?.extra_array || [])],
        }))
      }
    }
    setLoading(false)
  }

  const isSelectedFlashcardSame = () => {
    // const deckStoreSelected = flashcard
    if (!flashcard || !selectedFlashcardReference) {
      //TODO this is a wordaround, for some reason if we click on flashcards while its loading it bugs
      return true
    }
    const storeFlashcard = mapToEditableFlashcard(flashcard)
    const stateFlashcard = mapToEditableFlashcard(selectedFlashcardReference)
    return isEqual(storeFlashcard, stateFlashcard)
  }

  const isFlashcardSame = useMemo(() => {
    return isSelectedFlashcardSame()
  }, [selectedFlashcardReference])

  const handleRemoveTag = (tag: string) => {
    updateSelectedFlashcard("extra_array", [
      ...selectedFlashcardReference?.extra_array.filter((item) => item !== tag),
    ])
  }

  const startFlashcard = async (flashcard: Flashcard, deck: Deck) => {
    if (!flashcard?.id) {
      return
    }
    const now = new Date()
    const updatedFlashcard = {
      [Flashcard_Fields.ID]: flashcard.id,
      [Flashcard_Fields.NEXT_SHOWN]: now,
    }
    flashcard.updateFlashcard(updatedFlashcard)
    setSelectedFlashcard((prev) => ({
      ...prev,
      [Flashcard_Fields.NEXT_SHOWN]: now,
    }))
    if (settingsStore.isOffline) {
      deck.addToQueuedQueries({
        id: uuidv4(),
        variables: JSON.stringify(updatedFlashcard),
        function: QueryFunctions.UPDATE_FLASHCARD,
      })
      return
    }
    const updateReponse = await updateFlashcard(updatedFlashcard)
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3,
    })

    if (result?.assets) {
      const res = await uploadPictureFile(createFormData(result.assets[0].uri))
      if (res) {
        updateSelectedFlashcard(Flashcard_Fields.PICTURE_URL, supabseStorageUrl + res + ".jpg")
        return supabseStorageUrl + res + ".jpg"
      }
    }
    return null
  }

  const removeImage = () => {
    updateSelectedFlashcard(Flashcard_Fields.PICTURE_URL, "")
  }

  const updateSelectedFlashcard = (key: string, value: any) => {
    setSelectedFlashcard((prev) => ({ ...prev, [key]: value }))
  }

  const saveFlashcard = async (
    flashcard: Flashcard,
    flashcardRef: FlashcardSnapshotIn,
    deck: Partial<Deck>,
  ) => {
    const flashcardReference = flashcardRef
    if (!flashcardReference?.id) {
      // if there isnt a front or a back throw an error
      if (!flashcardReference?.front || !flashcardReference?.back) {
        showErrorToast(
          `Missing ${!flashcardReference?.front ?? "front"} ${
            !flashcardReference?.front && !flashcardReference?.back && "and"
          } ${!flashcardReference?.back && "back"}`,
        )
        return
      }
      flashcardReference.deck_id = deck.id
      flashcardReference.id = uuidv4()
      flashcardReference.created_at = new Date()
      const flashcardModel = deck.addFlashcard(flashcardReference)
      if (!deck?.selectedFlashcard) {
        deck.selectFlashcard(flashcardModel)
      }
      showSuccessToast(`${flashcardReference.front} added to ${deck.title}`)

      onAddCallBack ? onAddCallBack() : null
      if (settingsStore.isOffline) {
        deck.addToQueuedQueries({
          id: uuidv4(),
          variables: JSON.stringify(flashcardReference),
          function: QueryFunctions.INSERT_FLASHCARD,
        })
        return
      }
      const addedFlashcard = await addFlashcard(flashcardReference)
    } else {
      flashcard?.updateFlashcard(flashcardReference)
      setSelectedFlashcard({ ...flashcardReference })
      if (settingsStore.isOffline) {
        deck.addToQueuedQueries({
          id: uuidv4(),
          variables: JSON.stringify(flashcardReference),
          function: QueryFunctions.UPDATE_FLASHCARD,
        })
        return
      }
      const updatedFlashcard = await updateFlashcard(flashcardReference)
    }
  }
  //check if flashcard exists -> if it does display a modal else dont

  const [focusBack, setFocusBack] = useState(false)
  const [focusCaption, setFocusCaption] = useState(false)
  const [focusExtra, setFocusExtra] = useState(false)
  const extraArrayRef = useRef<TextInput>()
  const backRef = useRef<TextInput>()
  const subheaderRef = useRef<TextInput>()
  const extraRef = useRef<TextInput>()
  const onSubmitFront = (value: string) => {
    updateSelectedFlashcard("front", value)
    if (!flashcard && !selectedFlashcardReference?.back) {
      //setFocusBack(true)
      backRef?.current?.focus()
    }
  }
  const onSubmitBack = (value: string) => {
    updateSelectedFlashcard("back", value)
    if (!flashcard && !selectedFlashcardReference?.sub_header) {
      subheaderRef?.current?.focus()
    }
  }
  const onSubmitCaption = (value: string) => {
    updateSelectedFlashcard("sub_header", value)
    if (!flashcard && !selectedFlashcardReference?.extra) {
      extraRef?.current?.focus()
    }
  }
  const onSubmitExtra = (value: string) => {
    updateSelectedFlashcard("extra", value)
    if (
      !flashcard &&
      selectedFlashcardReference?.extra_array &&
      selectedFlashcardReference?.extra_array?.length <= 0
    ) {
      extraArrayRef.current.focus()
    }
  }

  const confirmSaveDuplicate = () => {
    saveFlashcard(flashcard, selectedFlashcardReference, deck)
    setDuplicateModalVisibleModalVisible(false)
  }

  return (
    <View style={$styles} key={flashcard?.id}>
      {loading && (
        <View
          style={{
            zIndex: 1,
            position: "absolute",
            top: 0,
            bottom: 0,
            right: -spacing.size160,
            left: -spacing.size160,
          }}
        >
          <Loading></Loading>
        </View>
      )}
      {flashcard?.next_shown ? (
        <View style={{ position: "absolute", top: 0, left: 0 }}>
          <TouchableOpacity onPress={() => resetFlashcard(flashcard, deck)}>
            <StatusLabel
              RightComponent={
                <Icon
                  icon="x"
                  color={custom_colors.successForeground1}
                  style={{ marginLeft: spacing.size40 }}
                  size={15}
                ></Icon>
              }
              text={"Active"}
            ></StatusLabel>
          </TouchableOpacity>
        </View>
      ) : null}
      <View style={$modal_header}>
        <View
          style={{
            flexDirection: "row",
            gap: spacing.size280,
            alignSelf: "flex-end",
            flex: 1,
            marginTop: spacing.size40,
            justifyContent: "flex-end",
          }}
        >
          {onDelete && flashcard?.id && (
            <Icon size={28} onPress={() => onDelete()} icon="fluent_delete"></Icon>
          )}
          <Icon onPress={() => pickImage()} size={28} icon="fluent_camera_add"></Icon>
          {!flashcard?.next_shown && flashcard?.deck_id ? (
            <Icon
              size={28}
              onPress={() => startFlashcard(flashcard, deck)}
              icon="fluent_play_outline"
            ></Icon>
          ) : null}
          <Icon size={28} onPress={() => useAIDefinition()} icon="robot"></Icon>
          <View>
            {!isFlashcardSame && (
              <View style={$saveBadge}>
                <Dot style={{ backgroundColor: custom_colors.dangerForeground1 }}></Dot>
              </View>
            )}
            <Icon
              size={28}
              onPress={() =>
                deck.doesDeckAlreadyContainFlashcard(selectedFlashcardReference?.front) &&
                !selectedFlashcardReference?.id
                  ? setDuplicateModalVisibleModalVisible(true)
                  : saveFlashcard(flashcard, selectedFlashcardReference, deck)
              }
              icon="fluent_save"
            ></Icon>
          </View>
        </View>
      </View>
      <EditableText
        style={{ marginBottom: spacing.size120 }}
        preset="title1"
        placeholder="Front"
        testID="front"
        onSubmit={(value) => onSubmitFront(value)}
        initialValue={selectedFlashcardReference?.front}
      ></EditableText>

      <EditableText
        preset="body2"
        testID="back"
        customRef={backRef}
        focus={focusBack}
        style={{ marginBottom: spacing.size120 }}
        onSubmit={(value) => onSubmitBack(value)}
        multiline={true}
        placeholder="back"
        initialValue={selectedFlashcardReference?.back}
      ></EditableText>

      <EditableText
        style={{ marginBottom: spacing.size120 }}
        preset="caption1"
        customRef={subheaderRef}
        testID="subheader"
        focus={focusCaption}
        placeholder="caption"
        onSubmit={(value) => onSubmitCaption(value)}
        initialValue={selectedFlashcardReference?.sub_header}
      ></EditableText>

      <EditableText
        style={{ marginBottom: spacing.size120 }}
        preset="caption2"
        testID="extra"
        customRef={extraRef}
        focus={focusExtra}
        placeholder="Extra"
        onSubmit={(value) => onSubmitExtra(value)}
        initialValue={selectedFlashcardReference?.extra}
      ></EditableText>

      <View
        style={{
          alignItems: "center",
          flexWrap: "wrap",
          flexDirection: "row",
          gap: 8,
          marginBottom: spacing.size200,
        }}
      >
        {selectedFlashcardReference?.extra_array?.map((tag, index) => (
          <CustomTag onPress={() => handleRemoveTag(tag)} key={tag + index} text={tag}></CustomTag>
        ))}
        <TextInput
          ref={extraArrayRef}
          style={{
            color: theme.colors.foreground1,
            alignSelf: "flex-start",
            borderRadius: borderRadius.corner40,
            paddingHorizontal: 0,
            paddingVertical: spacing.size20,
          }}
          placeholderTextColor={custom_colors.foreground3}
          testID="extra_array_edit"
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
          placeholder="Tags"
          onSubmitEditing={handleAddTag}
          blurOnSubmit={inputValue === "" ? true : false}
        />
      </View>
      {selectedFlashcardReference?.picture_url ? (
        <View style={{ position: "relative" }}>
          <View
            style={{
              position: "absolute",
              right: 4,
              top: 4,
              zIndex: 20,
              backgroundColor: theme.colors.background4,
              justifyContent: "center",
              alignItems: "center",
              width: 24,
              height: 24,
              borderRadius: 40,
            }}
          >
            <Icon onPress={() => removeImage()} icon="x" size={16}></Icon>
          </View>

          <Image
            style={{ height: 250, width: "100%", borderRadius: borderRadius.corner80 }}
            source={{
              uri: selectedFlashcardReference?.picture_url,
            }}
          ></Image>
        </View>
      ) : null}

      <CustomModal
        mainAction={() => setErrorModalVisible(false)}
        //secondaryAction={() => setErrorModalVisible(false)}
        //TODO fix this error
        mainActionLabel={"Close"}
        visible={errorModalVisible}
        header={"Error generating flashcard"}
        body={errorMessage}
      ></CustomModal>
      <CustomModal
        mainAction={() => confirmSaveDuplicate()}
        mainActionLabel={"Add"}
        secondaryAction={() => setDuplicateModalVisibleModalVisible(false)}
        visible={duplicateModalVisible}
        header={"Duplicate flashcard"}
        body={
          "A flashcard with this front already exists, would you like to add this card anyways?"
        }
      ></CustomModal>
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  paddingBottom: spacing.size200,
}

const $modal_header: ViewStyle = {
  marginBottom: spacing.size160,
  flexDirection: "row",
  gap: spacing.size320,
  justifyContent: "space-between",
  paddingHorizontal: spacing.size80,
  alignItems: "center",
}

const $saveBadge: ViewStyle = {
  opacity: 1,
  zIndex: 2,
  right: -1,
  top: 0,
  position: "absolute",
}
