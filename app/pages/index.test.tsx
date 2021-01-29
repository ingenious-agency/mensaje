import React from "react"
import { render } from "test/utils"
import faker from "faker"
import Home from "./index"
import { useCurrentUser } from "app/hooks/useCurrentUser"

jest.mock("app/hooks/useCurrentUser")
const mockUseCurrentUser = useCurrentUser as jest.MockedFunction<typeof useCurrentUser>

describe("Home Page", () => {
  describe("when user is logged in", () => {
    it("shows a welcome message", () => {
      mockUseCurrentUser.mockReturnValue({
        id: faker.random.alphaNumeric(32),
        email: faker.internet.email(),
        name: "The User",
        role: "user",
        slackUserId: faker.git.shortSha(),
        isInstalled: true,
      })
      const { getByText } = render(<Home />)
      const linkElement = getByText(/The User/i)
      expect(linkElement).toBeInTheDocument()
    })
  })
})
