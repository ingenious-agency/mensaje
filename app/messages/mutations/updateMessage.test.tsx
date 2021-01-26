import { AuthorizationError, NotFoundError } from "blitz"
import db, { Message, User } from "db"
import faker from "faker"
import { getSession } from "test/utils"
import updateMessage from "./updateMessage"

describe("updateMessage", () => {
  let user: User
  let message: Message
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
      try {
        await updateMessage(
          { data: { title: faker.lorem.word(10) }, where: { id: message.id } },
          getSession()
        )
      } catch (e) {
        let error = e as AuthorizationError
        expect(error.statusCode).toEqual(403)
        expect(error.name).toEqual("AuthorizationError")
      }
    })
  })

  describe("when updating the wrong message", () => {
    it("throws an AuhtorizationError", async () => {
      const anotherUser = await db.user.create({
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
      try {
        await updateMessage(
          { data: { title: faker.lorem.word(10) }, where: { id: message.id } },
          getSession({ user: anotherUser })
        )
      } catch (e) {
        let error = e as AuthorizationError
        expect(error.statusCode).toEqual(403)
        expect(error.name).toEqual("AuthorizationError")
      }
    })
  })

  describe("when updating a not existing message", () => {
    it("throws an NotFoundError", async () => {
      try {
        await updateMessage(
          { data: { title: faker.lorem.word(10) }, where: { id: "a message id" } },
          getSession({ user })
        )
      } catch (e) {
        let error = e as NotFoundError
        expect(error.statusCode).toEqual(404)
        expect(error.name).toEqual("NotFoundError")
      }
    })
  })

  it("updates the message", async () => {
    const title = faker.lorem.word(10)
    const returnedValue = await updateMessage(
      { data: { title }, where: { id: message.id } },
      getSession({ user })
    )
    expect(returnedValue.title).toEqual(title)
  })
})
