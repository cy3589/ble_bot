/**
 * Hardware
 *  - MAC ADDRESS: 88:25:83:F4:DD:9D
 *  - LOCAL NAME: MLT-BT05
 * Telegram
 *  - Bot Token : 5593353604:AAEp8W8IUnUGZoD34vB113HM-xccxApUFCk
 *  - chatId: 5463612881
 *  - Get Chat ID: Visit `https://api.telegram.org/bot${BotToken}/getUpdates`
 */

const noble = require("@abandonware/noble");
const axios = require('axios').default;

const MAC_ADDRESS = "88:25:83:F4:DD:9D";
const LOCAL_NAME = "MLT-BT05";

const telegramBotToken = "5593353604:AAEp8W8IUnUGZoD34vB113HM-xccxApUFCk";
const telegramChatId = "5463612881";
const sendMessage = async (text) => {
    const sendUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${telegramChatId}&text=${text}`;
    await axios.get(encodeURI(sendUrl));
};

noble.on("stateChange", async (state) => {
    if(state==='poweredOn') await noble.startScanningAsync();
});
const connectCallback = async () => {
    // console.log('connect Callback');
    try {
        await sendMessage("집 도착");
    } catch (error) {
        console.error(error);
    } 
};
const disconnectCallback = async () => {
    // console.log('disconnect Callback');
    await noble.startScanningAsync();
    try {
        await sendMessage("외출");
    } catch (error) {
        console.error(error);
    } 
};
noble.on("discover", async (discover) => {
    if(discover.address.toUpperCase() === MAC_ADDRESS && discover.advertisement.localName === LOCAL_NAME){
        if(discover.listenerCount("connect") === 0) discover.prependListener("connect", connectCallback);
        if(discover.listenerCount("disconnect") === 0) discover.prependListener("disconnect", disconnectCallback);
        await discover.connectAsync();
        await noble.stopScanningAsync();
    }
})      
