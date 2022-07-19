// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const users: Array<User> = [
  {
    email: "example@example.com",
    username: "example",
    password: "123"
  },
];

type User = {
  email: string;
  username: string;
  password: string;
}

type LoginData = {
  message: string;
  username?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginData>
) {
  const { email, password } = req.body;
  const user = users.find(user => user.email === email && user.password === password);
  if (user)
    return res.status(200).json({ message: "OK", username: user.username })
  else
    return res.status(401).send({ message: "Unauthorized" });
}
