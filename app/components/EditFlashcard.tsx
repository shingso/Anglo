import * as React from "react"
import { StyleProp, TextInput, TextStyle, View, ViewStyle, Image } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, custom_colors, spacing, typography } from "app/theme"
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
import { showSuccessToast } from "app/utils/errorUtils"
import { Deck } from "../models/Deck"
import { GlobalDeck } from "app/models"
import { Dot } from "./Dot"
import { CustomText } from "./CustomText"
import { StatusLabel } from "./StatusLabel"
export interface EditFlashcardProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  flashcard: Flashcard
  onDelete?: Function
  onAddCallBack?: Function
  deck?: Deck | GlobalDeck
  customSaveFlashcard?: Function
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
      [Flashcard_Fields.EXTRA_ARRAY]: flashcard?.extra_array ? flashcard?.extra_array : [],
      [Flashcard_Fields.PICTURE_URL]: flashcard?.picture_url,
    }
  }

  const { style, flashcard, onDelete, onAddCallBack, deck, customSaveFlashcard } = props
  const $styles = [$container, style]
  const [selectedFlashcardReference, setSelectedFlashcard] = useState(
    mapToEditableFlashcard(flashcard),
  )

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

  const isSelectedFlashcardSame = () => {
    const deckStoreSelected = flashcard
    if (!deckStoreSelected || !selectedFlashcardReference) {
      //TODO this is a wordaround, for some reason if we click on flashcards while its loading it bugs
      return true
    }
    const storeFlashcard = mapToEditableFlashcard(deckStoreSelected)
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

  const startFlashcard = async (flashcard: Flashcard) => {
    if (!flashcard?.id) {
      return
    }

    const updatedFlashcard = {
      [Flashcard_Fields.ID]: flashcard.id,
      [Flashcard_Fields.NEXT_SHOWN]: new Date(),
    }
    const updateReponse = await updateFlashcard(updatedFlashcard)
    if (updateReponse) {
      flashcard.updateFlashcard(updateReponse)
      setSelectedFlashcard((prev) => ({
        ...prev,
        [Flashcard_Fields.NEXT_SHOWN]: updateReponse?.next_shown,
      }))
    } else {
      flashcard.updateFlashcard(updatedFlashcard)
    }
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
        console.log(supabseStorageUrl + res + ".jpg", "uploaded url")
        updateSelectedFlashcard(Flashcard_Fields.PICTURE_URL, supabseStorageUrl + res + ".jpg")
        return supabseStorageUrl + res + ".jpg"
      }
    }
    return null
  }

  const updateSelectedFlashcard = (key: string, value: any) => {
    setSelectedFlashcard((prev) => ({ ...prev, [key]: value }))
  }

  const saveFlashcard = async (
    original: Flashcard,
    flashcardRef: FlashcardSnapshotIn,
    deck: Partial<Deck>,
  ) => {
    const flashcardReference = flashcardRef
    if (!flashcardReference?.id) {
      flashcardReference.deck_id = deck.id
      const addedFlashcard = await addFlashcard(flashcardReference)
      if (addedFlashcard) {
        deck.addFlashcard(addedFlashcard)
      }
      showSuccessToast("Flashcard Added", `${addedFlashcard.front} has been added to ${deck.title}`)
      onAddCallBack ? onAddCallBack() : null
    } else {
      const updatedFlashcard = await updateFlashcard(flashcardReference)
      console.log("the card was updated here!!")
      original?.updateFlashcard(flashcardReference)
      setSelectedFlashcard(flashcardReference)
    }
  }
  const [focusBack, setFocusBack] = useState(false)
  const [focusCaption, setFocusCaption] = useState(false)
  const [focusExtra, setFocusExtra] = useState(false)
  const extraArrayRef = useRef<TextInput>()
  const onSubmitFront = (value: string) => {
    updateSelectedFlashcard("front", value)
    if (!flashcard) {
      setFocusBack(true)
    }
  }
  const onSubmitBack = (value: string) => {
    updateSelectedFlashcard("back", value)
    if (!flashcard) {
      setFocusCaption(true)
    }
  }
  const onSubmitCaption = (value: string) => {
    updateSelectedFlashcard("sub_header", value)
    if (!flashcard) {
      setFocusExtra(true)
    }
  }
  const onSubmitExtra = (value: string) => {
    updateSelectedFlashcard("extra", value)
    if (!flashcard) {
      extraArrayRef.current.focus()
    }
  }

  return (
    <View style={$styles}>
      {flashcard?.next_shown ? (
        <View style={{ position: "absolute", top: 0, left: 0 }}>
          <StatusLabel text={"Active"}></StatusLabel>
        </View>
      ) : null}
      <View style={$modal_header}>
        <View
          style={{
            flexDirection: "row",
            gap: spacing.size280,
            alignSelf: "flex-end",
            flex: 1,
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
              onPress={() => startFlashcard(flashcard)}
              icon="fluent_play_outline"
            ></Icon>
          ) : null}
          <View>
            {!isFlashcardSame && (
              <View style={$saveBadge}>
                <Dot style={{ backgroundColor: custom_colors.dangerForeground1 }}></Dot>
              </View>
            )}
            <Icon
              size={28}
              onPress={() =>
                customSaveFlashcard
                  ? customSaveFlashcard(selectedFlashcardReference, deck)
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
        placeholder="Front (tap to edit)"
        testID="front"
        onSubmit={(value) => onSubmitFront(value)}
        initialValue={selectedFlashcardReference?.front}
      ></EditableText>

      <EditableText
        preset="body2"
        testID="back"
        focus={focusBack}
        style={{ marginBottom: spacing.size120 }}
        onSubmit={(value) => onSubmitBack(value)}
        multiline={true}
        placeholder="back (tap to edit)"
        initialValue={selectedFlashcardReference?.back}
      ></EditableText>

      <EditableText
        style={{ marginBottom: spacing.size120 }}
        preset="caption1"
        testID="sub_header"
        focus={focusCaption}
        placeholder="caption (tap to edit)"
        onSubmit={(value) => onSubmitCaption(value)}
        initialValue={selectedFlashcardReference?.sub_header}
      ></EditableText>

      <EditableText
        style={{ marginBottom: spacing.size120 }}
        preset="caption2"
        testID="extra"
        focus={focusExtra}
        placeholder="Extra (tap to edit)"
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
            color: custom_colors.foreground1,
            alignSelf: "flex-start",
            borderRadius: borderRadius.corner40,
            paddingHorizontal: 0,
            paddingVertical: spacing.size20,
          }}
          placeholderTextColor={custom_colors.foreground3}
          testID="extra_array_edit"
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
          placeholder="Tags (tap to edit)"
          onSubmitEditing={handleAddTag}
          blurOnSubmit={false}
        />
      </View>
      {selectedFlashcardReference?.picture_url ? (
        <Image
          style={{ height: 150, width: 150, borderRadius: borderRadius.corner80 }}
          source={{
            uri: selectedFlashcardReference?.picture_url,
          }}
        ></Image>
      ) : null}
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
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
