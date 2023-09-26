import React, { FC, useEffect, useState } from "react"
import { Observer, observer } from "mobx-react-lite"
import { FlatList, Switch, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Button, Header, Screen, Text } from "app/components"
import { spacing } from "app/theme"
import { useNavigation } from "@react-navigation/native"
import {
  applyConflictResolution,
  clearRemoteSync,
  getConfirmedRemoteId,
  returnRemoteAndLocalConflicts,
} from "app/utils/remote_sync/remoteSyncUtils"
import { CardProgress } from "../models/CardProgress"

interface ProgressConflictScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"ProgressConflict">> {}

export const ProgressConflictScreen: FC<ProgressConflictScreenProps> = observer(
  function ProgressConflictScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()
    const [conflicts, setConflicts] = useState([])
    const [selectedConflict, setSelectedConflict] = useState({})
    // Pull in navigation via hook

    useEffect(() => {
      const getConflicts = async () => {
        const { conflictedProgresses } = await returnRemoteAndLocalConflicts()
        if (conflictedProgresses) {
          const mappedConflicts = Object.entries(conflictedProgresses).reduce(
            (prev, [key, value]) => {
              return [...prev, { [key]: value }]
            },
            [],
          )
          const selectedMap: { [key: string]: boolean } = Object.entries(
            conflictedProgresses,
          ).reduce((prev, [id, val]) => {
            return {
              ...prev,
              [id]: true,
            }
          }, {})

          setConflicts(mappedConflicts)
          setSelectedConflict(selectedMap)
          console.log("mapped conflicts", mappedConflicts)
          console.log("selected map", selectedMap)
        }
      }
      getConflicts()
    }, [])

    const toggleConflict = (toggle: boolean, id: string) => {
      setSelectedConflict((prev) => {
        return {
          ...prev,
          [id]: toggle,
        }
      })
    }

    const resolveConflicts = async () => {
      const confirmedRemoteId = await getConfirmedRemoteId()
      if (confirmedRemoteId) {
        const userResolvedConflicts: CardProgress[] = []
        conflicts.forEach((entry) => {
          const id = Object.keys(entry)[0]
          const values = Object.values(entry)[0]
          const firstValues = values[0]
          const secondValues = values[1]
          selectedConflict[id] === true
            ? userResolvedConflicts.push(firstValues)
            : userResolvedConflicts.push(secondValues)
        })
        console.log("user resolved conflicts", userResolvedConflicts)
        //applyConflictResolution(confirmedRemoteId, userResolvedConflicts)
        clearRemoteSync()
        //clear all pending functions
      }

      /*   const mockCardProgress: any = {
        flashcard_id: "fb8ae42e-f328-4fdb-ba39-ec892567ff6a",
        time_elapsed: Math.random() * 2000,
        passed: true,
        mem_level: 10,
        next_shown: new Date(),
      }
      const res = applyConflictResolution("6049dcf4-efcf-4167-b58e-0cc026a14dd3", [
        mockCardProgress,
        mockCardProgress,
        mockCardProgress,
      ])
      console.log("resolution applied", res) */
    }

    const navigation = useNavigation()
    return (
      <Screen style={$root}>
        <Header title={"Progress Sync"}></Header>
        <View style={$container}>
          <FlatList
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            data={conflicts}
            renderItem={({ item, index }) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                {Object.entries(item).map(([key, value], i) => {
                  const localConflict = value[0][0] as any
                  const remoteConflict = value[1][0] as any
                  return (
                    <View key={key}>
                      <Switch
                        value={selectedConflict[key]}
                        onValueChange={(value) => toggleConflict(value, key)}
                      />
                      <Text>{localConflict.id}</Text>
                      <Text>{localConflict.time_elapsed}</Text>
                      <Text>{remoteConflict.id}</Text>
                      <Text>{remoteConflict.time_elapsed}</Text>
                    </View>
                  )
                })}
              </View>
            )}
          ></FlatList>
          <Button preset="custom_default" onPress={() => resolveConflicts()}>
            Confirm
          </Button>
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  padding: spacing.size200,
}
