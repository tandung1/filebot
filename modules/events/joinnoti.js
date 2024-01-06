module.exports.config = {
  name: "joinnoti",
  eventType: ["log:subscribe"],
  version: "1.0.0",
  credits: "Vtuan",
  description: "Thông báo bot hoặc người vào nhóm",
};

module.exports.run = async function({ api, event, Threads }) {
  const request = require('request');
  const moment = require('moment-timezone');
  const { threadID } = event;
  const threadInfo = await api.getThreadInfo(threadID);
  const threadData = (await Threads.getData(threadID)).data || {};
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    await api.changeNickname(`☆ ${global.config.BOTNAME || "𝙼𝚊𝚛𝚒𝚜<3"}`, threadID, api.getCurrentUserID());
    return api.sendMessage(`Kết nối thành công! Mình là bot của ${global.config.ADMIN_NAME || "Vtuan"}, sử dụng ${global.config.PREFIX}menu để xem danh sách lệnh.`, threadID); 
  } else {
    if (threadData.joinNoti === false) return;
    const addedByUserID = event.logMessageData.administratorFbId || event.author;
    const userInfo = await api.getUserInfo(addedByUserID);
    const addedByName = userInfo[addedByUserID].name;
    for (let participant of event.logMessageData.addedParticipants) {
      const userName = participant.fullName;
      const userFbId = participant.userFbId;
      let typeJoin;
      if (addedByUserID === userFbId || addedByName === userName) {
        typeJoin = "đã tự tham gia nhóm";
      } else {
        typeJoin = `được thêm vào nhóm bởi ${addedByName}`;
      }
      
      const numMembers = threadInfo.participantIDs.length;
      const time = moment.tz("Asia/Ho_Chi_Minhh").format("HH:mm:ss DD/MM/YYYY");
      let msg = "====『 Welcome 』====\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n" +
                `→ Xin chào ${userName}.\n` +  
                `→ Chào mừng bạn đã đến với ${threadInfo.threadName}.\n` +
                `→ Bạn đã ${typeJoin}\n` +
                `→ Bây giờ bạn là thành viên thứ ${numMembers} của nhóm ${threadInfo.threadName}!\n` +
                "[ ! ] • Hãy tương tác nhiều vào nếu không muốn ra đảo chơi với cá mập nhé 🙂." +
                "\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n" +
                `==『 ${time} 』==`;
      api.sendMessage({ body: msg }, threadID);
    }
  }
};