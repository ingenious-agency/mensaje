import { AuthorizationError } from "blitz"
import db from "db"
import faker from "faker"
import { getUserAttributes } from "test/factories"
import { getSession } from "test/utils"
import createMessage from "./createMessage"

beforeAll(async () => {
  await db.message.deleteMany({})
  await db.user.deleteMany({})
})

afterAll(async () => {
  await db.$disconnect()
})

describe("createMessage", () => {
  describe("when user is not authorized", () => {
    it("throws an AuhtorizationError", async () => {
      try {
        await createMessage(
          {
            data: {
              body: faker.lorem.paragraphs(),
              title: faker.lorem.word(10),
              slackChannelId: faker.lorem.slug(),
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

  it("creates the message", async () => {
    const user = await db.user.create(getUserAttributes())
    const previousCount = await db.message.count()
    const returnedValue = await createMessage(
      {
        data: {
          body: faker.lorem.paragraphs(),
          title: faker.lorem.word(10),
          slackChannelId: faker.lorem.slug(),
        },
      },
      getSession({ user })
    )
    const currentCount = await db.message.count()
    expect(currentCount).toEqual(previousCount + 1)
    expect(returnedValue.id).not.toBeNull()
  })
})
