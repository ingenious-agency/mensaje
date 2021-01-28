import { AuthorizationError, NotFoundError } from "blitz"
import db, { Message, User } from "db"
import faker from "faker"
import { getMessageAttributes } from "test/factories"
import { getSession } from "test/utils"
import updateMessage from "./updateMessage"

beforeAll(async () => {
  await db.message.deleteMany({})
  await db.user.deleteMany({})
})

afterAll(async () => {
  await db.$disconnect()
})

describe("updateMessage", () => {
  describe("when user is not authorized", () => {
    it("throws an AuhtorizationError", async () => {
      try {
        const message = (await db.message.create(getMessageAttributes())) as Message & {
          user: User | null
        }
        await updateMessage(
          { data: { title: faker.lorem.word(10) }, where: { id: message.id } },
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

  describe("when updating the wrong message", () => {
    it("throws an AuhtorizationError", async () => {
      const message = (await db.message.create(getMessageAttributes())) as Message & {
        user: User | null
      }
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
        fail("This call should throw an exception")
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
        const message = (await db.message.create(getMessageAttributes())) as Message & {
          user: User | null
        }
        await updateMessage(
          { data: { title: faker.lorem.word(10) }, where: { id: "a message id" } },
          getSession({ user: message?.user as User })
        )
        fail("This call should throw an exception")
      } catch (e) {
        let error = e as NotFoundError
        expect(error.statusCode).toEqual(404)
        expect(error.name).toEqual("NotFoundError")
      }
    })
  })

  it("updates the message", async () => {
    const message = (await db.message.create(getMessageAttributes())) as Message & {
      user: User | null
    }
    const title = faker.lorem.word(10)
    const returnedValue = await updateMessage(
      { data: { title }, where: { id: message.id } },
      getSession({ user: message?.user as User })
    )
    expect(returnedValue.title).toEqual(title)
  })
})
