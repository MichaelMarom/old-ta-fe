self.addEventListener("push", (event) => {
  const data = event.data.json();
  const title = data.title;
  const body = data.body;
  const icon = data.icon;
  const url = data.data.url;

  const notificationOptions = {
    body: body,
    tag: "unique-tag", // Use a unique tag to prevent duplicate notifications
    icon: icon,
    data: {
      url: url, // Replace with the desired URL for redirecting user to the desired page
    },
  };
  self.registration.showNotification(title, notificationOptions)
  // self.registration.sendNotification("My notifcaton", {
  //   title: "New Notification",
  //   body: "This is a new notification",
  //   icon: "https://rsfunctionapp9740.blob.core.windows.net/tutoring-academy-tutor-imgs/asiyab4dfa73-b2841097-0760-4929-afe8-1218f8fb7aac-4-thispersondoesnotexist.png",
  //   data: {
  //     url: "https://tutoring-academy.com",
  //   }
  // });
});