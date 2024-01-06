module.exports = function ({ Users, Threads, Currencies }) {
    const logger =require("../../utils/log.js");
    return async function ({ event }) {
        const { allUserID, allCurrenciesID, allThreadID, userName, threadInfo } = global.data; 
        const { autoCreateDB } = global.config;
        if (autoCreateDB == ![]) return;
        var { senderID, threadID } = event;
        senderID = String(senderID);
        var threadID = String(threadID);
        try {
            if (!allThreadID.includes(threadID) && event.isGroup == !![]) {
                const threadIn4 = await Threads.getInfo(threadID);
                const setting = {};

                setting.threadName = threadIn4.threadName
                setting.adminIDs = threadIn4.adminIDs
                setting.participantIDs = threadIn4.participantIDs
                setting.isGroup = threadIn4.isGroup

                const dataThread = setting;
                allThreadID.push(threadID)
                threadInfo.set(threadID, dataThread);
                const setting2 = {};
                setting2.threadInfo = dataThread
                setting2.data = {}
                await Threads.setData(threadID, setting2);
                const dataUser = global.data.allUserID
                for (singleData of threadIn4.userInfo) {
                    if(singleData.gender != undefined) {
                        var gender = singleData.gender
                        userName.set(String(singleData.id), singleData.name);
                        try {
                            dataUser.includes(String(singleData.id)) ? (await Users.setData(String(singleData.id), {
                                'name': singleData.name,
                            }), 
                            dataUser.push(singleData.id)) : (await Users.createData(singleData.id, 
                            {
                                'name': singleData.name,
                                'gender': gender,
                                'data': {}
                            }), 
                            dataUser.push(String(singleData.id)), 
                            logger(global.getText('handleCreateDatabase', 'newUser', singleData.id), 'USER'));
                        } catch(e) { console.log(e) };
                    }
                }
                logger(global.getText('handleCreateDatabase', 'newThread', threadID), 'THREAD');
            }
            if (!allUserID.includes(senderID) || !userName.has(senderID)) {
                const infoUsers = await Users.getInfo(senderID)
                var gender = infoUsers.gender
                var setting3 = {};
                setting3.name = infoUsers.name
                setting3.gender = gender
                await Users.createData(senderID, setting3)
                allUserID.push(senderID) 
                userName.set(senderID, infoUsers.name)
                logger(global.getText('handleCreateDatabase', 'newUser', senderID), 'USER');
            }
            if (!allCurrenciesID.includes(senderID)) {
                const setting4 = {};
                setting4.data = {}
                await Currencies.createData(senderID, setting4) 
                allCurrenciesID.push(senderID);
            }
            return;
        } catch (err) {
            return console.log(err);
        }
    };
}