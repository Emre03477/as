const axios = require('axios');

/**
 * Discord Webhook Service for notifications
 */
class DiscordService {
  constructor(webhookUrl) {
    this.webhookUrl = webhookUrl;
  }

  async sendPurchaseNotification(orderData) {
    if (!this.webhookUrl) return;

    const embed = {
      title: '🎉 New Purchase!',
      color: 0x10b981,
      fields: [
        {
          name: '🎮 Minecraft Username',
          value: orderData.minecraftUsername,
          inline: true
        },
        {
          name: '📦 Product',
          value: orderData.productName,
          inline: true
        },
        {
          name: '💰 Price',
          value: `$${orderData.price.toFixed(2)}`,
          inline: true
        },
        {
          name: '👤 User',
          value: orderData.userEmail,
          inline: true
        },
        {
          name: '🆔 Order ID',
          value: orderData.orderId,
          inline: true
        },
        {
          name: orderData.status === 'completed' ? '🟢 Status' : '🔴 Status',
          value: orderData.status.toUpperCase(),
          inline: true
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Minecraft Store'
      }
    };

    try {
      await axios.post(this.webhookUrl, { embeds: [embed] });
    } catch (error) {
      console.error('Discord webhook error:', error.message);
    }
  }

  async sendErrorLog(errorData) {
    if (!this.webhookUrl) return;

    const embed = {
      title: '⚠️ Error Log',
      color: 0xef4444,
      fields: [
        {
          name: 'Error Type',
          value: errorData.type || 'Unknown'
        },
        {
          name: 'Message',
          value: errorData.message || 'No message'
        },
        {
          name: 'Timestamp',
          value: new Date().toISOString()
        }
      ]
    };

    try {
      await axios.post(this.webhookUrl, { embeds: [embed] });
    } catch (error) {
      console.error('Discord webhook error:', error.message);
    }
  }

  async sendAdminLog(action, admin, details) {
    if (!this.webhookUrl) return;

    const embed = {
      title: '🔧 Admin Action',
      color: 0x3b82f6,
      fields: [
        {
          name: 'Admin',
          value: admin,
          inline: true
        },
        {
          name: 'Action',
          value: action,
          inline: true
        },
        {
          name: 'Details',
          value: details || 'None'
        },
        {
          name: 'Timestamp',
          value: new Date().toISOString()
        }
      ]
    };

    try {
      await axios.post(this.webhookUrl, { embeds: [embed] });
    } catch (error) {
      console.error('Discord webhook error:', error.message);
    }
  }
}

module.exports = DiscordService;
