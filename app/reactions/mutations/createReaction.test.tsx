import { AuthorizationError, NotFoundError } from "blitz"
import db, { Message, User } from "db"
import { getMessageAttributes } from "test/factories"
import { getSession } from "test/utils"
import createReaction from "./createReaction"
import { emojis } from "app/reactions/types"

jest.mock("app/channels/lib/getUserChannels")

import getUserChannels from "app/channels/lib/getUserChannels" // eslint-disable-line

const mockGetUserChannels = getUserChannels as jest.MockedFunction<typeof getUserChannels>

let message: Message & {
  user: User | null
}

beforeAll(async () => {
  await db.message.deleteMany({})
  await db.user.deleteMany({})
  message = (await db.message.create(getMessageAttributes())) as Message & {
    user: User | null
  }
})

afterAll(async () => {
  await db.$disconnect()
})

describe("createReaction", () => {
  describe("when user is not authorized", () => {
    it("throws an AuhtorizationError", async () => {
      try {
        await createReaction(
          {
            data: {
              user: { connect: { id: message?.userId as string } },
              message: { connect: { id: message.id } },
              emoji: Object.keys(emojis)[0],
              alt: Object.values(emojis)[0],
            },
          },
          getSession()
        )
        fail("This call should throw an exception")
      } catch (e) {
        let error = e as AuthorizationError
        expect(error.statusCode).toEqual(403)
        expect(error.name).toEqual("AuthorizationError")
      }
    })
  })

  describe("when associating to a not existing message", () => {
    it("throws an NotFoundError", async () => {
      try {
        await createReaction(
          {
            data: {
              user: { connect: { id: message?.userId as string } },
              message: { connect: { id: "a message id" } },
              emoji: Object.keys(emojis)[0],
              alt: Object.values(emojis)[0],
            },
          },
          getSession({ user: message.user as User })
        )
        fail("This call should throw an exception")
      } catch (e) {
        let error = e as NotFoundError
        expect(error.statusCode).toEqual(404)
        expect(error.name).toEqual("NotFoundError")
      }
    })
  })

  describe("when reacting to a message in a channel I don't belong to", () => {
    it("throws an AuhtorizationError", async () => {
      try {
        mockGetUserChannels.mockReturnValue(Promise.resolve([]))
        await createReaction(
          {
            data: {
              user: { connect: { id: message?.userId as string } },
              message: { connect: { id: message.id } },
              emoji: Object.keys(emojis)[0],
              alt: Object.values(emojis)[0],
            },
          },
          getSession({ user: message.user as User })
        )
        fail("This call should throw an exception")
      } catch (e) {
        let error = e as AuthorizationError
        expect(error.statusCode).toEqual(403)
        expect(error.name).toEqual("AuthorizationError")
      }
    })
  })

  it("creates the reaction", async () => {
    const message = (await db.message.create(getMessageAttributes())) as Message & {
      user: User | null
    }
    mockGetUserChannels.mockReturnValue(
      Promise.resolve([{ name: message.slackChannelId, id: message.slackChannelId }])
    )
    const previousCount = await db.reaction.count()
    await createReaction(
      {
        data: {
          user: { connect: { id: message?.userId as string } },
          message: { connect: { id: message.id } },
          emoji: Object.keys(emojis)[0],
          alt: Object.values(emojis)[0],
        },
      },
      getSession({ user: message.user as User })
    )
    const currentCount = await db.reaction.count()
    expect(currentCount).toEqual(previousCount + 1)
  })
})
