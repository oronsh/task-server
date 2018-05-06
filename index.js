const express = require('express');
const Scheduler = require('./scheduler');
const app = express();

const PORT = 3000;

const scheduler = new Scheduler();

app.post('/task', (req, res) => {
    // set manual task
    scheduler.set('ManualTask', () => {
        console.log("Hello Manual Task!");
    }, { auto: false }).then(data => {
        res.json({ success: true });
    }).catch(err => {
        res.status(400);
        res.json({ success: false, message: err });
    })
});

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);

    // set automatic task
    scheduler.set('Heartbeat', () => {
        console.log('Hello Auto Task!');
    });
    
});

