import type { NextApiRequest, NextApiResponse } from 'next'

import db from './../../db/db'

export type User = {
  email: string;
  username: string;
  password: string;
}

export type LoginData = {
  message: string;
  username?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginData>
) {
  const { email, password } = req.body;
  db.get(`SELECT [username]
            FROM [users]
           WHERE [users].[email] = ? 
             AND [users].[password] = ?
           LIMIT 1`, [email, password], (err: Error | null, row: User) => {
    if (err)
      return res.status(500).send({ message: "Internal server error" })
    else
      if (row)
        return res.status(200).json({ message: 'OK', username: row.username })
      else
        return res.status(401).send({ message: "Unauthorized" })
  })
}
