const axios = require('axios');
const config = require('./config.json');

/**
 * WebSender integration module for Minecraft server
 * Executes commands on the Minecraft server via WebSender plugin
 */

async function executeCommand(command) {
  if (!config.websender.enabled) {
    console.log('WebSender disabled. Command would have been:', command);
    return { success: true, message: 'Command logged (WebSender disabled)' };
  }

  const url = `http://${config.websender.host}:${config.websender.port}${config.websender.endpoint}`;
  
  try {
    const response = await axios.post(url, {
      command: command
    }, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return {
      success: true,
      message: 'Command executed successfully',
      data: response.data
    };
  } catch (error) {
    console.error('WebSender execution failed:', error.message);
    throw new Error('Failed to execute command on Minecraft server');
  }
}

/**
 * Execute multiple commands in sequence
 */
async function executeCommands(commands) {
  const results = [];
  
  for (const command of commands) {
    try {
      const result = await executeCommand(command);
      results.push(result);
    } catch (error) {
      results.push({ success: false, error: error.message });
    }
  }
  
  return results;
}

module.exports = {
  executeCommand,
  executeCommands
};
