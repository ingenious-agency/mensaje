import { AuthorizationError, NotFoundError } from "blitz"
import db, { Message, Reaction, User } from "db"
import { getMessageAttributes, getUserAttributes } from "test/factories"
import { getSession } from "test/utils"
import { emojis } from "app/reactions/types"
import deleteReaction from "./deleteReaction"

jest.mock("app/channels/lib/getUserChannels")

import getUserChannels from "app/channels/lib/getUserChannels" // eslint-disable-line

const mockGetUserChannels = getUserChannels as jest.MockedFunction<typeof getUserChannels>

let message: Message & {
  user: User | null
}
let reaction: Reaction

beforeAll(async () => {
  await db.message.deleteMany({})
  await db.user.deleteMany({})
  message = (await db.message.create(getMessageAttributes())) as Message & {
    user: User | null
  }
  reaction = await db.reaction.create({
    data: {
      user: { connect: { id: message?.userId as string } },
      message: { connect: { id: message.id } },
      emoji: Object.keys(emojis)[0],
      alt: Object.values(emojis)[0],
    },
  })
})

afterAll(async () => {
  await db.$disconnect()
})

describe("deleteReaction", () => {
  describe("when user is not authorized", () => {
    it("throws an AuhtorizationError", async () => {
      try {
        await deleteReaction({ where: { id: reaction.id } }, getSession())
        fail("This call should throw an exception")
      } catch (e) {
        let error = e as AuthorizationError
        expect(error.statusCode).toEqual(403)
        expect(error.name).toEqual("AuthorizationError")
      }
    })
  })

  describe("when deleting a non existing reaction", () => {
    it("throws an NotFoundError", async () => {
      try {
        await deleteReaction({ where: { id: "an id" } }, getSession({ user: message.user as User }))
        fail("This call should throw an exception")
      } catch (e) {
        let error = e as NotFoundError
        expect(error.statusCode).toEqual(404)
        expect(error.name).toEqual("NotFoundError")
      }
    })
  })

  describe("when deleting a reaction I'm not the creator", () => {
    it("throws an AuhtorizationError", async () => {
      const anotherUser = await db.user.create(getUserAttributes())
      const anotherReaction = await db.reaction.create({
        data: {
          user: { connect: { id: anotherUser.id } },
          message: { connect: { id: message.id } },
          emoji: Object.keys(emojis)[0],
          alt: Object.values(emojis)[0],
        },
      })
      try {
        await deleteReaction(
          { where: { id: anotherReaction.id } },
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

  describe("when deleting a reaction for a message in a channel I don't belong", () => {
    it("throws an AuhtorizationError", async () => {
      try {
        mockGetUserChannels.mockReturnValue(Promise.resolve([]))
        await deleteReaction(
          { where: { id: reaction.id } },
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

  it("deletes the reaction", async () => {
    mockGetUserChannels.mockReturnValue(
      Promise.resolve([{ name: message.slackChannelId, id: message.slackChannelId }])
    )
    const previousCount = await db.reaction.count()
    await deleteReaction({ where: { id: reaction.id } }, getSession({ user: message.user as User }))
    const currentCount = await db.reaction.count()
    expect(currentCount).toEqual(previousCount - 1)
  })
})
