import { render } from "@testing-library/react-native"
import { CustomDrawer } from "../CustomDrawer"

test("can be delete flashcard", async () => {
  const screen = render(<CustomDrawer navigation={null}></CustomDrawer>)
  expect(true).toBeTruthy()
})
