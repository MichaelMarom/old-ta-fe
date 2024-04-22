import React, { useEffect, useState } from 'react';
import Chats from '../components/Chat/Chats';
import Messages from '../components/Chat/Messages';
import '../styles/chat.css'
import SendMessage from '../components/Chat/SendMessage';
import { Header } from '../components/Chat/Header';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CommonLayout from '../layouts/CommonLayout';
import { NoChatSelectedScreen } from '../components/Chat/NoChatSelectedScreen';
import { useDispatch, useSelector } from 'react-redux';
import { get_chat_message, post_message, set_online_status } from '../axios/chat';
import { socket } from '../config/socket'
import { setChats } from '../redux/chat/chat';
import Actions from '../components/common/Actions';
import Loading from '../components/common/Loading';
import Recomendation from '../components/Chat/Recomendation';

function Chat() {
    const [selectedChat, setSelectedChat] = useState({});
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation()
    const { shortlist } = useSelector(state => state.shortlist);
    const { student } = useSelector(state => state.student);
    const { tutor } = useSelector(state => state.tutor);
    const studentLoggedIn = location.pathname.split('/')[1] === 'student';
    const loggedInUserDetail = studentLoggedIn ? student : tutor;
    const { chats, isLoading } = useSelector(state => state.chat);
    const [messages, setMessages] = useState([])
    const [arrivalMsg, setArrivalMsg] = useState(null);
    const [fetchingMessages, setFetchingMessages] = useState(false)
    const loggedInRole = studentLoggedIn ? 'student' : 'tutor';
    const dispatch = useDispatch()

    useEffect(() => {
        const setStatus = async () => {
            if (loggedInUserDetail.AcademyId) {
                await set_online_status(1, loggedInUserDetail.AcademyId, studentLoggedIn ? "student" : 'tutor');
                socket.emit('online', loggedInUserDetail.AcademyId, loggedInRole)
            }
        }
        setStatus();
        return () => {
            const setStatus = async () => {
                if (loggedInUserDetail.AcademyId) {
                    await set_online_status(0, loggedInUserDetail.AcademyId, studentLoggedIn ? "student" : 'tutor');
                    socket.emit('offline', loggedInUserDetail.AcademyId)
                }
            }
            setStatus();
        }
    }, [loggedInUserDetail, loggedInRole, studentLoggedIn])

    useEffect(() => {
        if (loggedInUserDetail.AcademyId && selectedChat.id) {
            socket.emit("add-user", selectedChat.id);
        }

    }, [loggedInUserDetail, selectedChat.id]);

    const sendMessage = async (text) => {
        if (text.trim() !== '') {
            const newMessage = {
                screenName: selectedChat.screenName,
                senderId: loggedInUserDetail.AcademyId,
                date: new Date(),
                text,
                photo: loggedInUserDetail.Photo,
                to: selectedChat.AcademyId,
                room: selectedChat.id
            }
            setMessages([...messages, newMessage]);
            const body = {
                Text: text,
                Date: new Date(),
                Sender: loggedInUserDetail.AcademyId,
                ChatID: selectedChat.id
            };

            await post_message(body)
            delete newMessage.photo;
            socket.emit("send-msg", newMessage);
        }
    }

    useEffect(() => {
        arrivalMsg && arrivalMsg.senderId === selectedChat.AcademyId && setMessages((prev) => [...prev, { ...arrivalMsg, photo: selectedChat.avatarSrc }]);
    }, [arrivalMsg, selectedChat]);

    useEffect(() => {
        if (socket) {
            socket.on("msg-recieve", (msgObj) => {
                setArrivalMsg(msgObj);
            });
            socket.on("online", (id) => {
                loggedInUserDetail.AcademyId && dispatch(setChats(loggedInUserDetail.AcademyId, loggedInRole))
            })
            socket.on("offline", (id, role, action) => {
                // chats.map(chat => chat.AcademyId === id ? { ...chat, online: false } : chat)
                id && action === 'disconn' && set_online_status(0, id, role)
                loggedInUserDetail.AcademyId && dispatch(setChats(loggedInUserDetail.AcademyId, loggedInRole))
            })
        }
    }, [loggedInUserDetail, loggedInRole]);

    useEffect(() => {
        setFetchingMessages(true);
        const getMessages = async () => {
            if (params.id) {
                const data = await get_chat_message(params.id);
                !data?.response?.data && setMessages(data);
            }
            setFetchingMessages(false);
        };

        getMessages();
    }, [navigate, params.id, studentLoggedIn]);

    useEffect(() => {
        if (selectedChat.id) {
            const currentPath = `/${loggedInRole}/chat/${selectedChat.id}`;
            navigate(currentPath);
        }
    }, [selectedChat.id, navigate, studentLoggedIn, loggedInRole])

    useEffect(() => {
        // eslint-disable-next-line
        const foundChat = chats.find(chat => chat.id == params.id) || {};
        setSelectedChat(foundChat);

    }, [params.id, shortlist, chats]);

    if (isLoading)
        return <Loading height='100vh' />
    return (
        <CommonLayout role={loggedInRole} >
            <div className="container" style={{ height: "65vh" }}>
                <div className="h-100 m-4">
                    <div className="ks-page-content-body h-100">
                        <div className="border ks-messenger shadow">
                            <Chats
                                isLoading={isLoading}
                                setSelectedChat={setSelectedChat}
                                fetchingMessages={fetchingMessages}
                                discussionData={chats}
                                selectedChat={selectedChat}
                            />
                            <div className="ks-messages  ks-messenger__messages">
                                {!params.id ? <NoChatSelectedScreen /> :
                                    <>
                                        <Header selectedChat={selectedChat} />
                                        <Messages selectedChat={selectedChat} messages={messages}
                                            fetchingMessages={fetchingMessages} />
                                        <SendMessage selectedChat={selectedChat}
                                            messages={messages} setMessages={setMessages} sendMessage={sendMessage} />

                                    </>
                                }
                            </div>
                            {(params.id && loggedInRole === 'student') &&
                                <Recomendation AcademyId={selectedChat.AcademyId} />
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Actions editDisabled={true}
                saveDisabled={true}
            />
        </CommonLayout>
    );
}

export default Chat;
