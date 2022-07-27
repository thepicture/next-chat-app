import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";
import seed from "../../db/db";
// @ts-ignore
import Database from "sqlite-async";
import { getToken } from "next-auth/jwt";

let onlineUserEmails: string[] = [];

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const token = await getToken({ req });
    if (!token)
        return res.status(401).json({ message: 'Unauthorized' });
    if (!(<any>res!.socket)!.server.io) {
        const io = new Server((<any>res.socket).server);
        (<any>res.socket).server.io = io;
        io.on('connection', async socket => {
            setTimeout(() => {
                socket.emit('expired');
                socket.disconnect();
            }, parseInt(process.env.SESSION_EXPIRES_IN_MILLISECONDS!));
            if (!onlineUserEmails.includes(socket.handshake.query.email as string))
                onlineUserEmails = [...onlineUserEmails, socket.handshake.query.email as string];
            socket.broadcast.emit('user connect', { email: socket.handshake.query.email });
            socket.on('disconnect', () => {
                onlineUserEmails = onlineUserEmails.filter(email => email !== socket.handshake.query.email);
                socket.broadcast.emit('user disconnect', { email: socket.handshake.query.email });
            });
            const db = await Database.open('chatsdb.db');
            await seed(db);
            const messages = await db.all(`SELECT [messages].[id], [dateTime], [text], [email]
                                             FROM [messages]
                                       INNER JOIN [users] ON [users].id = [messages].[userId]
                                         ORDER BY [messages].[id] DESC`);
            socket.emit('get all messages', { messages: messages.reverse(), onlineUsers: onlineUserEmails });
            socket.on('post message', async message => {
                const db = await Database.open('chatsdb.db');
                await seed(db);
                try {
                    const user = await db.get(`SELECT [id]
                                                 FROM [users]
                                                WHERE email = ?
                                                LIMIT 1`, [socket.handshake.query.email]);
                    await db.run(`INSERT INTO [messages] ([userId], [dateTime], [text])
                                       VALUES (?, ?, ?)`, [user.id, + new Date(), message]);
                    socket.broadcast.emit('new message', {
                        email: socket.handshake.query.email, text: message
                    });
                } catch (error) {
                    console.log("Post chat error: " + error);
                }
            });
            socket.on("typing", () => {
                socket.broadcast.emit("typing", { email: socket.handshake.query.email });
            });
        });
    }
    res.end();
}

export default handler;