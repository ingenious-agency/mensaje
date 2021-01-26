import { AuthorizationError, NotFoundError } from "blitz"
import db, { Message, User } from "db"
import faker from "faker"
import { getSession } from "test/utils"
import getMessage from "./getMessage"

jest.mock("app/channels/lib/getUserChannels")

import getUserChannels from "app/channels/lib/getUserChannels" // eslint-disable-line

describe("getMessage", () => {
  let message: Message
  let user: User
  beforeEach(async () => {
    user = await db.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.name.findName(),
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "user",
        slackAccessToken: faker.internet.password(),
        slackUserId: faker.git.shortSha(),
        isInstalled: true,
        avatarUrl: faker.image.imageUrl(),
      },
    })
    message = await db.message.create({
      data: {
        body: faker.lorem.paragraphs(3),
        createdAt: new Date(),
        updatedAt: new Date(),
        title: faker.lorem.word(10),
        slackChannelId: faker.lorem.slug(),
        user: { connect: { id: user.id } },
      },
    })
  })
  afterEach(async () => {
    await db.$executeRaw('TRUNCATE "User", "Message" CASCADE')
    await db.$disconnect()
  })

  describe("when user is not authorized", () => {
    it("throws an AuhtorizationError", async () => {
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
        await getMessage({ where: { id: "not a valid id" } }, getSession({ user }))
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
        ;(getUserChannels as any).mockReturnValue([])
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
    ;(getUserChannels as any).mockReturnValue([
      { id: message.slackChannelId, name: message.slackChannelId },
    ])
    const returnedValue = await getMessage({ where: { id: message.id } }, getSession({ user }))
    expect(returnedValue.id).toEqual(message.id)
  })
})
