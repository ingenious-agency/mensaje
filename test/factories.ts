import { Prisma } from "@prisma/client"
import faker from "faker"
import { merge } from "lodash"

export function getMessageAttributes(
  attrs: Partial<Prisma.MessageCreateArgs> = {}
): Prisma.MessageCreateArgs {
  const defaults = {
    data: {
      body: faker.lorem.paragraphs(3),
      createdAt: new Date(),
      updatedAt: new Date(),
      title: faker.lorem.word(10),
      slackChannelId: faker.lorem.slug(),
      user: {
        create: {
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
      },
    },
    include: { user: true },
  }
  return merge(defaults, attrs)
}

export function getUserAttributes(
  attrs: Partial<Prisma.UserCreateArgs> = {}
): Prisma.UserCreateArgs {
  const defaults = {
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
  }
  return merge(defaults, attrs)
}
