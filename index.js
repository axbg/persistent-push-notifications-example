const express = require('express')
const app = express();
const port = 3001;
const sequelize = require('./db.js');
const User = require('./db.js').User;
const webpush = require('web-push');


//init
app.use(express.static('front'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


sequelize.db.sync();


//vapid keys generated on https://tools.reactpwa.com/vapid
const publicVapidKey = "BDYayurZsWidgCREw_ck9GKJfd45UjU8yryZUqcCsPiMaU1A_zIghkNwX8jmvmGNUXcoa1y9W3fWO7cTWeBQNWo";
const privateVapidKey = "8gh8z1ilHnB77DAK5M1CXQOA7ULP-59nMs90KxbYujE";
webpush.setVapidDetails('mailto:bisagalexstefan@gmail.com', publicVapidKey, privateVapidKey);


//defining routes
//registers a user in the db with its unqiue Push API credentials
app.post("/subscribe", (req, res) => {

    const subscription = req.body.subscription;
    const name = req.body.name;

    User.findOne({
        where: {
            endpoint: subscription.endpoint,
            p256: subscription.keys.p256dh,
            auth: subscription.keys.auth
        },
        raw: true
    }).then((result) => {
        if (!result) {
            User.create({
                name: req.body.name,
                token: "asd",
                endpoint: subscription.endpoint,
                p256: subscription.keys.p256dh,
                auth: subscription.keys.auth
            }).then((rest) => {
                res.status(200).send({ message: "User Created" });
            })
        } else {
            res.status(200).send({ message: "User Created" });
        }
    });
});


//push notification endpoint
app.post("/send", async (req, res) => {

    //resolve request because the next jobs doesn't depend on it
    res.status(200).send();

    let subscriptionReceived = req.body;

    //the payload will contain data to be displayed inside the notification
    const payload = JSON.stringify({ title: "Testing push" });

    let users = await User.findAll({ raw: true });

    //send to every user registered
    //notifications can be send from anywhere, even when not initiated by a client request
    users.forEach(user => {

        let keys = { p256dh: user.p256, auth: user.auth };
        let subscription = { endpoint: user.endpoint, expirationTime: null, keys: keys };

        //push the notification
        webpush
            .sendNotification(subscription, payload)
            .catch(err => console.error(err));

        //push the notification to anyone but the person who initiated it
        /*
        if (subscriptionReceived.keys.auth != subscription.keys.auth) {
            webpush
            .sendNotification(subscription, payload)
            .catch(err => console.error(err));
        }
        */
    })
})


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})


app.listen(port, () => {
    console.log("app started on http://localhost:" + port);
});

