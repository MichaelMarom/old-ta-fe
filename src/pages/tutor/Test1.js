import React, { useState, useEffect } from 'react';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
// import { CommunicationAccessToken } from '@azure/communication-signaling';
import { apiClient } from '../../axios/config';

const CallWithChatExperience = () => {
    const [chatClient, setChatClient] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [userId, setUserId] = useState(null);
    // const [meetingLink, setMeetingLink] = useState(null);

    console.log(chatClient)
    useEffect(() => {
        // Function to fetch user token and create chat client
        const initializeChatClient = async () => {
            try {
                // Initialize Communication Identity Client
                const communicationIdentityClient = new CommunicationIdentityClient('endpoint=https://smstutoingacademy.unitedstates.communication.azure.com/;accesskey=1lnFDblTzTOwzwYK0hoZ80AeLfhhYpxFo0CqwoKNBie2ra3yJtz6oAJzLC5sBdSp0jx5d+XjLfnwMSX/7eWvMg==');

                // Create User
                const user = await communicationIdentityClient.createUser();

                // Generate token for the user
                const tokenResponse = await communicationIdentityClient.getToken(user, ['voip']);

                // Set user ID and token
                setUserId(user.communicationUserId);
                setUserToken(tokenResponse.token);

                // Create chat client
                const chatClient = new ChatClient('https://smstutoingacademy.unitedstates.communication.azure.com', new AzureCommunicationTokenCredential(tokenResponse.token));
                setChatClient(chatClient);

                apiClient.get(`/api/teamsMeetingLinkFunction/${user.communicationUserId}`)

                // Generate Meeting Link
                // const meetingToken = new CommunicationAccessToken(tokenResponse.token);
                // console.log(meetingToken)
                // const meetingLink = `https://teams.microsoft.com/l/meetup-join/${meetingToken.user.communicationUserId}`;
                // setMeetingLink(meetingLink);
            } catch (error) {
                console.error('Error initializing chat client:', error);
            }
        };

        initializeChatClient();
    }, []);

    return (
        <div>
            <h1>Azure Communication Services Example</h1>
            <p>User ID: {userId}</p>
            <p>User Token: {userToken}</p>
            <p>Meeting Link:</p>
            {/* Add more UI components as needed */}
        </div>
    );
};

export default CallWithChatExperience;
