import type { NextApiRequest, NextApiResponse } from 'next'

import Database from 'sqlite-async'
import seed from './../../db/db'

export type User = {
  email: string
  username: string
  password: string
}

export type LoginData = {
  message: string
  username?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginData>
) {
  const { email, password } = req.body
  const db = await Database.open('chatsdb.db')
  await seed(db)
  try {
    const row = await db.get(`SELECT [username]
                                FROM [users]
                               WHERE [users].[email] = ? 
                                 AND [users].[password] = ?
                               LIMIT 1`, [email, password])
    if (row)
      return res.status(200).json({ message: 'OK', username: row.username })
    else
      return res.status(401).send({ message: "Unauthorized" })
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" })
  }
}
