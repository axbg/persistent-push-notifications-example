
//activates when receiving a push notification
self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Receieved...");
  self.registration.showNotification(data.title, {
    body: "Notification test!",
    icon: "https://banner2.kisspng.com/20171217/8a2/envelope-png-5a3744625f6bf9.6827994515135714263909.jpg",
    //uniquely identifies a notification
    //if there are more notifications with the same tag received at the same time
    //only the latest one will be displayed
    tag: '1',
    data: 'Hello there',
    actions: [
      { action: 'view', title: 'View it', /*icon:*/ },
      { action: 'later', title: 'See later', /*icon:*/ }
    ]
  });
});

self.addEventListener('notificationclick', e => {
  console.log('Notification clicked!');
  //you can also handle the click on actions here
  e.notification.close();
})
