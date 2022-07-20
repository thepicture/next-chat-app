import type { NextApiRequest, NextApiResponse } from 'next'

import Database from 'sqlite-async'
import seed from './../../db/db'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { email, username, password } = req.body
    const db = await Database.open('chatsdb.db')
    await seed(db)
    if (await doesUserExistWith(email, username))
        return res.status(409).send({ message: "User with the given email or username exists" })
    try {
        await db.run(`INSERT INTO [users] (email, username, password)
                           VALUES (?, ?, ?)`, [email, username, password])
        return res.status(201).json({ message: 'Created', user: { ...req.body } })
    } catch (error) {
        return res.status(500).send({ message: "Internal server error" })
    }

}
async function doesUserExistWith(email: any, username: any) {
    const db = await Database.open('chatsdb.db')
    await seed(db)
    const row = await db.get(`SELECT COUNT(*)
                                FROM [users]
                               WHERE [users].[email] = ?
                                  OR [users].[username] = ?
                               LIMIT 1`, [email, username])
    if (row)
        return false
    else
        return !!row
}

