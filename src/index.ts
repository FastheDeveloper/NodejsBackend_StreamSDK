import express from 'express';
import { PrismaClient } from '@prisma/client';
import { StreamChat } from 'stream-chat';

// const{STREAM_API_KEY = '',STREAM_API_SECRET}=process.env;
const STREAM_API_KEY='c3wrkh8sxfj5'
const STREAM_API_SECRET='ns54fqn6u3kv22eczwb9zb6asddtgztzj43b3mzztuhuzhu2n7zcdr8bbh8jd6ab'
const client=StreamChat.getInstance(STREAM_API_KEY,STREAM_API_SECRET);

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.post('/login', async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is missing' });
  }

  const user = await prisma.user.upsert({
    where: { username },
    create: {
      username,
      name: username,
    },
    update: {
      username,
    },
  });

  return res.json({
    ...user,
    streamToken: client.createToken(user.id.toString()),
  });
});

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();

  return res.json(users);
});

app.listen(3000, () => {
  console.log(`Server ready at: http://192.168.43.31:3000`);
});
