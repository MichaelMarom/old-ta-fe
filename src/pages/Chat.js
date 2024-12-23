import React, { useEffect, useState } from "react";
import Chats from "../components/Chat/Chats";
import Messages from "../components/Chat/Messages";
import "../styles/chat.css";
import SendMessage from "../components/Chat/SendMessage";
import { Header } from "../components/Chat/Header";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { NoChatSelectedScreen } from "../components/Chat/NoChatSelectedScreen";
import { useDispatch, useSelector } from "react-redux";
import {
  get_chat_message,
  post_message,
  set_online_status,
} from "../axios/chat";
import { socket } from "../config/socket";
import { setChats } from "../redux/chat/chat";
import Actions from "../components/common/Actions";
import Loading from "../components/common/Loading";
import Recomendation from "../components/Chat/Recomendation";
import { send_temaplted_email } from "../axios/admin";

function Chat() {
  const [selectedChat, setSelectedChat] = useState({});
  const navigate = useNavigate();
  const [files, setFiles] = useState({ images: [], pdfs: [] })
  const params = useParams();
  const location = useLocation();
  const { student } = useSelector((state) => state.student);
  const { tutor } = useSelector((state) => state.tutor);
  const studentLoggedIn = location.pathname.split("/")[1] === "student";
  const loggedInUserDetail = studentLoggedIn ? student : tutor;
  const { chats, isLoading } = useSelector((state) => state.chat);
  const [messages, setMessages] = useState([]);
  const [arrivalMsg, setArrivalMsg] = useState(null);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const loggedInRole = studentLoggedIn ? "student" : "tutor";
  const [isTyping, setIsTyping] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const setStatus = async () => {
      if (loggedInUserDetail.AcademyId) {
        await set_online_status(
          1,
          loggedInUserDetail.AcademyId,
          studentLoggedIn ? "student" : "tutor"
        );
        socket.emit("online", loggedInUserDetail.AcademyId, loggedInRole);
      }
    };
    setStatus();
    return () => {
      const setStatus = async () => {
        if (loggedInUserDetail.AcademyId) {
          await set_online_status(
            0,
            loggedInUserDetail.AcademyId,
            studentLoggedIn ? "student" : "tutor"
          );
          socket.emit("offline", loggedInUserDetail.AcademyId, loggedInRole);
        }
      };
      setStatus();
    };
  }, [loggedInUserDetail, loggedInRole, studentLoggedIn]);

  useEffect(() => {
    if (loggedInUserDetail.AcademyId && selectedChat.id) {
      socket.emit("add-user", selectedChat.id);
    }
  }, [loggedInUserDetail, selectedChat.id]);

  const sendMessagesToEmail = (messages, files) => {
    send_temaplted_email({ email: 'asiyabat123@gmail.com', messages, files, subject: "You recieved a new message." });
  }

  const sendMessage = async (text, type, files) => {
    const messagesToSend = [];
    const currentDate = new Date();
    let textAttached = false;

    if (text.trim() !== "" && type === "text") {
      const newMessage = {
        screenName: selectedChat.screenName,
        senderId: loggedInUserDetail.AcademyId,
        date: currentDate,
        text,
        photo: loggedInUserDetail.Photo,
        to: selectedChat.AcademyId,
        room: selectedChat.id,
      };
      messagesToSend.push({ ...newMessage });

      const body = {
        Text: text,
        Date: currentDate,
        Sender: loggedInUserDetail.AcademyId,
        ChatID: selectedChat.id,
      };

      await post_message(body);
      delete newMessage.photo;
      socket.emit("send-msg", newMessage);
    } else {
      const filePromises = [];

      files.images.forEach((file, index) => {
        filePromises.push(new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = function (e) {
            const base64 = e.target.result;

            const fileMessage = {
              screenName: selectedChat.screenName,
              senderId: loggedInUserDetail.AcademyId,
              date: currentDate,
              text: !textAttached && text.trim() !== "" ? text : null,
              fileName: file.name,
              fileUrl: base64,
              fileType: 'image',
              photo: loggedInUserDetail.Photo,
              to: selectedChat.AcademyId,
              room: selectedChat.id,
            };

            if (!textAttached && text.trim() !== "") {
              textAttached = true;
            }

            messagesToSend.push({ ...fileMessage });

            const body = {
              Text: fileMessage.text,
              Date: fileMessage.date,
              Sender: fileMessage.senderId,
              ChatID: fileMessage.room,
              FileName: fileMessage.fileName,
              FileUrl: fileMessage.fileUrl,
              Type: fileMessage.fileType,
            };

            post_message(body).then(() => {
              delete fileMessage.photo;
              socket.emit("send-msg", fileMessage);
              resolve();
            });
          };
          reader.readAsDataURL(file);
        }));
      });

      files.pdfs.forEach((file, index) => {
        filePromises.push(new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const fileMessage = {
              screenName: selectedChat.screenName,
              senderId: loggedInUserDetail.AcademyId,
              date: currentDate,
              text: !textAttached && text.trim() !== "" ? text : null,
              fileName: file.name,
              fileUrl: null,
              fileType: 'pdf',
              photo: loggedInUserDetail.Photo,
              to: selectedChat.AcademyId,
              room: selectedChat.id,
            };

            if (!textAttached && text.trim() !== "") {
              textAttached = true;
            }

            messagesToSend.push({ ...fileMessage });

            const body = {
              Text: fileMessage.text,
              Date: fileMessage.date,
              Sender: fileMessage.senderId,
              ChatID: fileMessage.room,
              FileName: fileMessage.fileName,
              FileUrl: fileMessage.fileUrl,
              Type: fileMessage.fileType,
            };

            post_message(body).then(() => {
              delete fileMessage.photo;
              socket.emit("send-msg", fileMessage);
              resolve();
            });
          };
          reader.readAsDataURL(file);
        }));
      });

      await Promise.all(filePromises);
    }

    if (messagesToSend?.length > 0) {
      sendMessagesToEmail(messagesToSend, files)

      setMessages((prevMessages) => [...prevMessages, ...messagesToSend]);
    }
  };

  useEffect(() => {
    arrivalMsg &&
      arrivalMsg.senderId === selectedChat.AcademyId &&
      setMessages((prev) => [
        ...prev,
        { ...arrivalMsg, photo: selectedChat.avatarSrc },
      ]);
  }, [arrivalMsg, selectedChat]);

  useEffect(() => {
    if (socket) {
      socket.off("msg-recieve");
      socket.off("userTyping");
      // socket.off("stop-typing");
      socket.off("online");
      socket.off("offline");

      // Attach new event listeners
      socket.on("msg-recieve", (msgObj) => {
        setArrivalMsg(msgObj);
      });

      socket.on("userTyping", (data) => {
        console.log(loggedInUserDetail, data)
        if (loggedInUserDetail.AcademyId &&
          data.typingUserId !== loggedInUserDetail.AcademyId &&
          data.chatId === selectedChat.id) {
          setIsTyping(data.isTyping);
        }
      });

      // socket.on("stop-typing", (chatId) => {
      //   if (chatId === selectedChat.id) {
      //     setIsTyping(false);
      //   }
      // });

      socket.on("online", (id) => {
        dispatch(setChats(loggedInUserDetail.AcademyId, loggedInRole));
      });

      socket.on("offline", (id, role, action) => {
        set_online_status(0, id, role);
        dispatch(setChats(loggedInUserDetail.AcademyId, loggedInRole));
      });

      return () => {
        socket.off("msg-recieve");
        socket.off("userTyping");
        // socket.off("stop-typing");
        socket.off("online");
        socket.off("offline");
      };
    }
  }, [loggedInUserDetail, loggedInRole, socket, selectedChat.id]);

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
      setFiles({ images: [], pdfs: [] })
    }
  }, [selectedChat.id, studentLoggedIn, loggedInRole]);

  useEffect(() => {
    // eslint-disable-next-line
    const foundChat = chats.find((chat) => chat.id == params.id) || {};
    setSelectedChat(foundChat);
  }, [params.id, chats]);

  if (isLoading) return <Loading height="100vh" />;
  return (
    <div role={loggedInRole}>
      <div className="container" style={{ height: "calc(100vh - 200px)" }}>
        <div className="h-100 m-4">
          <div className="ks-page-content-body h-100">
            <div className="border ks-messenger shadow" >
              <Chats
                isLoading={isLoading}
                setSelectedChat={setSelectedChat}
                fetchingMessages={fetchingMessages}
                discussionData={chats}
                selectedChat={selectedChat}
              />
              <div className="ks-messages  ks-messenger__messages" style={{ width: "50%" }}>
                {!params.id ? (
                  <NoChatSelectedScreen />
                ) : (
                  <>
                    <Header selectedChat={selectedChat} isTyping={isTyping} />
                    <Messages
                      selectedChat={selectedChat}
                      files={files}
                      messages={messages}
                      fetchingMessages={fetchingMessages}
                    />
                    <SendMessage
                      selectedChat={selectedChat}
                      loggedInUserDetail={loggedInUserDetail}
                      messages={messages}
                      setMessages={setMessages}
                      files={files}
                      setFiles={setFiles}
                      sendMessage={sendMessage}
                    />
                  </>
                )}
              </div>
              {params.id && loggedInRole === "student" && (
                <Recomendation AcademyId={selectedChat.AcademyId} />
              )}
            </div>
          </div>
        </div>
      </div>
      <Actions editDisabled={true} saveDisabled={true} />
    </div>
  );
}

export default Chat;
