import express from 'express';

import Pusher from 'pusher';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const app_id = process.env.APP_ID;
const key = process.env.APP_KEY;
const secret = process.env.APP_SECRET;
const cluster = process.env.APP_CLUSTER;

const pusher = new Pusher({
  key,
  appId: app_id,
  secret,
  cluster,
  useTLS: true, // disable TLS for localhost
});

app.post('/pusher/auth', (req, res) => {
  console.log('Pusher');
  console.log(pusher);

  console.log(req.body);
  console.log('[LOG] Headers:', req.headers);

  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;

  console.log(socketId);
  console.log(channel);

  const auth = pusher.authorizeChannel(socketId, channel);

  console.log('Auth  : ', auth);

  res.send(auth);
});

app.post('/send-event', (req, res) => {
  // const { channel, event, data } = req.body;

  console.log('send event');

  pusher
    .trigger('tekramapp', 'new-message', { userID: '123' })
    .then(() => {
      console.log('Trigger event work');
    })
    .catch((err) => {
      console.error('Pusher trigger error:', err);
      res.status(500).json({ error: 'Failed to trigger event' });
    });

  pusher
    .trigger('myapp', 'new-message', { userID: '123', test: true })
    .then(() => {
      console.log('Trigger event work');
    })
    .catch((err) => {
      console.error('Pusher trigger error:', err);
      res.status(500).json({ error: 'Failed to trigger event' });
    });

  res.send({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
