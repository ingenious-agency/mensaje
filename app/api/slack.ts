import { NextApiRequest, NextApiResponse } from "next"

export default async function slack(req: NextApiRequest, res: NextApiResponse) {
  res.write(
    `👉 <http://${process.env.WEBSITE_URL}/messages/new?channel=${req.body.channel_id}|Follow me>`
  )
  res.end()
}
