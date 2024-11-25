const admin = require("../config/firebase");
const User = require("../model/User");

const sendNotification = async (req, res) => {
    const { token, title, description, imageUrl } = req.body;

    try {
        const responce = await admin.messaging().send({
            token: token,
            data: {
                title: title,
                description: description,
                imageUrl: imageUrl,
            },
        });

        res.status(200).send(`Notification sent successfully : ${JSON.stringify(responce)}`);
    } catch (error) {
        res.status(500).send(`Error Sending notification: ${error.message}`);
    }
}


const broadcastNotification = async (req, res) => {
    const { title, description, imageUrl } = req.body;

    try {
        const users = await User.find().select('device_token -_id');
        const deviceTokens = users?.map((user) => user.device_token)

        const responce = await admin.messaging().sendEachForMulticast({
            tokens: deviceTokens,
            data: {
                title: title,
                description: description,
                imageUrl: imageUrl,
            },
        });

        res.status(200).send(`Notification broadcasted successfully : ${JSON.stringify(responce)}`);
    } catch (error) {
        res.status(500).send(`Error boradcasting notification: ${error.message}`);
    }
}


const registerToken = async (req, res) => {
    const { device_token } = req.body;

    try {
        const user = await User.findOne({ device_token });
        if (user) {
            return res.status(200).send('Device token already registered')
        }
        user = new User({ device_token })

        await user.save();
        res.status(201).send(`Device token registered successfully`);
    } catch (error) {
        res.status(500).send(`Error registering device token: ${error.message}`);
    }
}

module.exports = { sendNotification, broadcastNotification, registerToken };