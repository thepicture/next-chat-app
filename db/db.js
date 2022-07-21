export default async function seed(db) {
    await db.run(`CREATE TABLE IF NOT EXISTS [users] 
    (
        [id] INTEGER PRIMARY KEY AUTOINCREMENT, 
        [email] TEXT NOT NULL, 
        [username] TEXT NOT NULL, 
        [password] TEXT NOT NULL
    )`)
    await db.run(`CREATE TABLE IF NOT EXISTS [messages] 
    (
        [id] INTEGER PRIMARY KEY AUTOINCREMENT, 
        [userId] INTEGER NOT NULL REFERENCES [users](id), 
        [dateTime] TIMESTAMP NOT NULL, 
        [text] TEXT NOT NULL
    )`)
}