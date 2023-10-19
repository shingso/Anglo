import { useNavigation } from "@react-navigation/native"
import { HAS_SUBSCRIPTION_TITLE, SubscribeScreen } from "../SubscribeScreen"
import { SubscriptionModel, SubscriptionStoreModel, useStores } from "app/models"
import { render } from "@testing-library/react-native"
import MockedNavigator from "./MockedNavigator"
import { mockSubscriptionStoreHasSubCreate } from "app/components/mock/mock"

jest.mock("../../models/helpers/useStores", () => ({
  useStores: () => ({
    subscriptionStore: mockSubscriptionStoreHasSubCreate,
  }),
}))

test("subscribe screen works", async () => {
  const navigation = useNavigation()
  const { subscriptionStore } = useStores()
  console.log(subscriptionStore.hasActiveSubscription(), "current has subscriotion")
  const screen = render(<MockedNavigator component={SubscribeScreen} />)
  //check if the correct subscribe buttons are on the screen
  //after a success we need to show the other screen

  expect(screen.getByText(HAS_SUBSCRIPTION_TITLE)).toBeTruthy()

  expect(screen).toBeTruthy()
})
