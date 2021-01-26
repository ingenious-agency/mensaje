/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path")
require("dotenv").config({ path: path.join(process.cwd(), ".env.test.local") })

const { Client } = require("pg")
const JSDOMEnvironment = require("jest-environment-jsdom-fourteen")
const { nanoid } = require("nanoid")
const util = require("util")
const exec = util.promisify(require("child_process").exec)
const url = require("url")

const prismaBinary = "./node_modules/.bin/prisma"

class PrismaTestEnvironment extends JSDOMEnvironment {
  constructor(config) {
    super(config)

    // Generate a unique schema identifier for this test context
    this.schema = `test_${nanoid(4)}`

    // Generate the pg connection string for the test schema
    this.connectionString = `${process.env.DATABASE_URL}?schema=${this.schema}`
  }

  async setup() {
    // Set the required environment variable to contain the connection string
    // to our database test schema
    process.env.DATABASE_URL = this.connectionString
    this.global.process.env.DATABASE_URL = this.connectionString

    try {
      // Run the migrations to ensure our schema has the required structure
      await exec(`${prismaBinary} migrate up --experimental`)
    } catch (e) {
      console.error(e)
    }

    return super.setup()
  }

  async teardown() {
    // Drop the schema after the tests have completed
    const client = new Client({
      connectionString: this.connectionString,
    })
    await client.connect()
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`)
    await client.end()

    // Reset the DATABASE_URL so next setup doesn't fail
    this.connectionString = `${this.connectionString.split("?")[0]}`
    this.global.process.env.DATABASE_URL = this.connectionString
    process.env.DATABASE_URL = this.connectionString
  }
}

module.exports = PrismaTestEnvironment
