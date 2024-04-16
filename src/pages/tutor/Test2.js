// Contoso server to create a new user and thread.

import { GroupCallLocator } from '@azure/communication-calling';
import { ChatClient, ChatParticipant } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { v1 as createGUID } from 'uuid';

const createNewChatThread = async (chatClient, participants) => {
    const chatThreadResponse = await chatClient.createChatThread(
        { topic: 'Meeting with a friendly bot' },
        { participants }
    );
    if (chatThreadResponse.invalidParticipants && chatThreadResponse.invalidParticipants.length > 0) {
        throw 'Server could not add participants to the chat thread';
    }

    const chatThread = chatThreadResponse.chatThread;
    if (!chatThread || !chatThread.id) {
        throw 'Server could not create chat thread';
    }

    return chatThread.id;
};

export const createCallWithChat = async () => {
    const props = {
        token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjYwNUVCMzFEMzBBMjBEQkRBNTMxODU2MkM4QTM2RDFCMzIyMkE2MTkiLCJ4NXQiOiJZRjZ6SFRDaURiMmxNWVZpeUtOdEd6SWlwaGsiLCJ0eXAiOiJKV1QifQ.eyJza3lwZWlkIjoiYWNzOjc3YmFjMWM0LWNmNTUtNGI5MS1iNjBjLTVhMzk2ZGY5OGIxY18wMDAwMDAxZS1mMGE5LTY3NDktODBmNS04YjNhMGQwMDU5OGIiLCJzY3AiOjE3OTIsImNzaSI6IjE3MTA3NTIyNTIiLCJleHAiOjE3MTA4Mzg2NTIsInJnbiI6ImFtZXIiLCJhY3NTY29wZSI6ImNoYXQsdm9pcCIsInJlc291cmNlSWQiOiI3N2JhYzFjNC1jZjU1LTRiOTEtYjYwYy01YTM5NmRmOThiMWMiLCJyZXNvdXJjZUxvY2F0aW9uIjoidW5pdGVkc3RhdGVzIiwiaWF0IjoxNzEwNzUyMjUyfQ.PTfG2kp_QjsJQwwjJQtP5es5xyDmV_BsSNQOOxz1foEZ4NB79aSFwg5M2EMuLHECPhLd__ozww8NOQcoHpkl0uoBNdAYQVdroEsWedOZsHja1se7g9-jM31SEKD9ULREpQ9qrYrKuQ1zTYHuMZMJRsY8ILTXzczcZnRmm7rUjkdA1zxPc4r0a9iXRROdxM5oGrOE4P7_k2OlgHqAmo0IkfU7-2PsvCcUhDVOQ6zHPat-mYXjseFt6y0319_vOAsKETcknjuZYggu8O14EGXcBYyX_3JFCzYQ8wt5ec292oNRMA1R0NC1Fz9foqxw2CM_V0F6eyIh6rRiJxmsbcqp7w',
        userId: '8:acs:77bac1c4-cf55-4b91-b60c-5a396df98b1c_0000001e-f0a9-6749-80f5-8b3a0d00598b',
        endpointUrl: 'https://smstutoingacademy.unitedstates.communication.azure.com/',
        displayName: "asiya123"
    }

    const { userId, token, endpointUrl, displayName } = props;
    
    const locator = { groupId: createGUID() };
    const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(token));
    const threadId = await createNewChatThread(chatClient, [
        { id: { communicationUserId: userId }, displayName: displayName }
    ]);

    return {
        callLocator: locator,
        chatThreadId: threadId
    };
};