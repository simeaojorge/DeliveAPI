const Nexmo = require('nexmo');

class Sms {

    constructor(){
    
        this.nexmo = new Nexmo({
            apiKey: '7b4799cb',
            apiSecret: 'gJEprMBOfl1Jricm'
        }, {debug: true});

    }

    send(to, msg) {
        this.nexmo.message.sendSms("NEXMO", to, msg, { type: 'unicode' }, (err, resp) => {
            if(err){
                throw err;
            }else {
                console.log(resp);
            }
        })
    }
}

module.exports = Sms;