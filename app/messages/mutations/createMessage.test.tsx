/**
 * @jest-environment ../../../test/prisma-test-environment
 */

import { AuthorizationError } from "blitz"
import db, { User } from "db"
import faker from "faker"
import { getSession } from "test/utils"
import createMessage from "./createMessage"

describe("createMessage", () => {
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
  })
  afterEach(async () => {
    await db.$executeRaw('TRUNCATE "User", "Message" CASCADE')
    await db.$disconnect()
  })

  describe("when user is not authorized", () => {
    it("throws an AuhtorizationError", async () => {
      try {
        await createMessage(
          {
            data: {
              body: faker.lorem.paragraphs(),
              title: faker.lorem.text(),
              slackChannelId: faker.lorem.slug(),
            },
          },
          getSession()
        )
      } catch (e) {
        let error = e as AuthorizationError
        expect(error.statusCode).toEqual(403)
        expect(error.name).toEqual("AuthorizationError")
      }
    })
  })

  it("creates the message", async () => {
    const previousCount = await db.message.count()
    const returnedValue = await createMessage(
      {
        data: {
          body: faker.lorem.paragraphs(),
          title: faker.lorem.text(),
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
