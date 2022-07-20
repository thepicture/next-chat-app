import sqlite3 from 'sqlite3'
const db = new sqlite3.Database('chatsdb.db', (err) => {
    if (!err) {
        console.log('Database is opened or created')
        db.run(`CREATE TABLE IF NOT EXISTS [users] 
                    (
                        [id] INTEGER PRIMARY KEY AUTOINCREMENT, 
                        [email] TEXT NOT NULL, 
                        [username] TEXT NOT NULL, 
                        [password] TEXT NOT NULL
                    )`);
    }
    else {
        console.log('Database open/connect error: ' + err)
    }
});
export default db;