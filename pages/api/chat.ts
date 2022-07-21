import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import Database from 'sqlite-async'
import seed from './../../db/db'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession({ req })
    let userId
    if (!session)
        return res.status(401).json({ message: 'Unauthorized' })
    else {
        const db = await Database.open('chatsdb.db')
        await seed(db)
        const user = await db.get(`SELECT [id]
                                     FROM [users]
                                    WHERE email = ?
                                    LIMIT 1`, [session.user!.email]);
        userId = user.id;
    }
    if (req.method === 'POST') {
        await post(req, res, userId)
    } else if (req.method === 'GET') {
        await get(req, res);
    }
}

async function post(req: NextApiRequest, res: NextApiResponse<any>, userId: number) {
    const { text } = req.body
    const db = await Database.open('chatsdb.db')
    await seed(db)
    try {
        await db.run(`INSERT INTO [messages] ([userId], [dateTime], [text])
                           VALUES (?, ?, ?)`, [userId, + new Date(), text])
        return res.status(201).json({ message: 'Created' })
    } catch (error) {
        console.log("Post chat error: " + error)
        return res.status(500).send({ message: "Internal server error" })
    }
}
async function get(_req: NextApiRequest, res: NextApiResponse<any>) {
    const db = await Database.open('chatsdb.db')
    await seed(db)
    try {
        const messages = await db.all(`SELECT [userId], [dateTime], [text], [email]
                                         FROM [messages]
                                  INNER JOIN [users] ON [users].id = [messages].[userId]`)
        return res.json(JSON.stringify({ messages: messages }))
    } catch (error) {
        console.log("Get chat error: " + error)
        return res.status(500).send({ message: "Internal server error" })
    }
}

