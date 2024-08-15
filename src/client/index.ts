import { LiveChat } from 'youtube-chat';
import { createClient } from 'redis';
import { USERNAME } from '../config';

const redisClient = createClient();
const liveChat = new LiveChat({ liveId: 'yq8er94_OrY' });

const init = async () => {
    await redisClient.connect();

    liveChat.on('chat', async (chat) => {
        try { 
        const data = {
            streamy: {
                platform: 'youtube',
                account: {
                    username: USERNAME,
                }
            },
            sender: {
                username: chat.author.name,
                displayName: chat.author.name,

            },
            message: {
                content: (chat.message[0] as any).text!, 
                createdAd: chat.timestamp,
                id: chat.id
            }
        };
        await redisClient.publish('chat', JSON.stringify(data));
        console.log(chat)
    } catch(err) {}
    });

    liveChat.start();
};

export default { init };
