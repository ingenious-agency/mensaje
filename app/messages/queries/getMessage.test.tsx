import { AuthorizationError, NotFoundError } from "blitz"
import db, { Message, User } from "db"
import { getSession } from "test/utils"
import getMessage from "./getMessage"
import { getMessageAttributes } from "test/factories"

jest.mock("app/channels/lib/getUserChannels")

import getUserChannels from "app/channels/lib/getUserChannels" // eslint-disable-line

const mockGetUserChannels = getUserChannels as jest.MockedFunction<typeof getUserChannels>

beforeAll(async () => {
  await db.message.deleteMany({})
  await db.user.deleteMany({})
})

afterAll(async () => {
  await db.$disconnect()
})

describe("getMessage", () => {
  describe("when user is not authorized", () => {
    it("throws an AuhtorizationError", async () => {
      const message = (await db.message.create(getMessageAttributes())) as Message & {
        user: User | null
      }
      const criteria = { where: { id: message.id } }
      try {
        await getMessage(criteria, getSession())
      } catch (e) {
        let error = e as AuthorizationError
        expect(error.statusCode).toEqual(403)
        expect(error.name).toEqual("AuthorizationError")
      }
    })
  })

  describe("when message doesn't exist", () => {
    it("throws a NotFoundError", async () => {
      try {
        const message = (await db.message.create(getMessageAttributes())) as Message & {
          user: User | null
        }
        await getMessage(
          { where: { id: "not a valid id" } },
          getSession({ user: message?.user as User })
        )
      } catch (e) {
        let error = e as NotFoundError
        expect(error.statusCode).toEqual(404)
        expect(error.name).toEqual("NotFoundError")
      }
    })
  })

  describe("when message user doesn't exist", () => {
    it("throws an AuhtorizationError", async () => {
      try {
        const message = (await db.message.create(getMessageAttributes())) as Message & {
          user: User | null
        }
        await getMessage(
          { where: { id: message.id } },
          getSession({ session: { userId: "some other user" } } as any)
        )
      } catch (e) {
        let error = e as AuthorizationError
        expect(error.statusCode).toEqual(403)
        expect(error.name).toEqual("AuthorizationError")
      }
    })
  })

  describe("when user is not part of the message channel", () => {
    it("throws an AuhtorizationError", async () => {
      try {
        const message = (await db.message.create(getMessageAttributes())) as Message & {
          user: User | null
        }
        mockGetUserChannels.mockReturnValue(Promise.resolve([]))
        await getMessage(
          { where: { id: message.id } },
          getSession({ session: { userId: "some other user" } } as any)
        )
      } catch (e) {
        let error = e as AuthorizationError
        expect(error.statusCode).toEqual(403)
        expect(error.name).toEqual("AuthorizationError")
      }
    })
  })

  it("returns the message", async () => {
    const message = (await db.message.create(getMessageAttributes())) as Message & {
      user: User | null
    }
    mockGetUserChannels.mockReturnValue(
      Promise.resolve([{ id: message.slackChannelId, name: message.slackChannelId }])
    )
    const returnedValue = await getMessage(
      { where: { id: message.id } },
      getSession({ user: message?.user as User })
    )
    expect(returnedValue.id).toEqual(message.id)
  })
})
