import { NextApiRequest, NextApiResponse } from "next"

export default async function slack(req: NextApiRequest, res: NextApiResponse) {
  res.write(
    `👉 <${process.env.NEXT_PUBLIC_WEBSITE_URL}/messages/new?channel=${req.body.channel_id}|Follow me>`
  )
  res.end()
}
