import logger from './logger.js';

export const sendLiveNotification = (userId, title, desc, type = 'info') => {
  if (global.io) {
    global.io.to(userId.toString()).emit('notification', {
      title,
      desc,
      type,
      date: new Date()
    });
    logger.info(`Live socket notification pushed to user ${userId}: "${title}"`);
  }
};

export default sendLiveNotification;
