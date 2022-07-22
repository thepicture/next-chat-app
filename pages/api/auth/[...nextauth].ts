import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
const Database = require('sqlite-async')
import seed from './../../../db/db'
export default NextAuth({
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Email" },
                password: { label: "Password", type: "password", placeholder: "Password" },
            },
            async authorize(credentials) {
                const db = await Database.open('chatsdb.db')
                await seed(db)
                const user = await db.get(`SELECT [id], [username], [email]
                                             FROM [users]
                                            WHERE [users].[email] = ? 
                                              AND [users].[password] = ?
                                            LIMIT 1`, [credentials?.email, credentials?.password])
                if (user) {
                    return user
                } else {
                    return null
                }
            }
        })
    ]
})