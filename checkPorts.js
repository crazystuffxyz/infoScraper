import net from 'net';

/**
 * Check if a single TCP port is open
 * @param {string} host - IP or hostname
 * @param {number} port - TCP port
 * @param {number} timeout - optional timeout in ms
 * @returns {Promise<boolean>}
 */
function isPortOpen(host, port, timeout = 1000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    let status = null; // true=open, false=closed

    socket.setTimeout(timeout);

    socket.on('connect', () => {
      status = true;
      socket.destroy();
    });

    socket.on('timeout', () => {
      status = false;
      socket.destroy();
    });

    socket.on('error', () => {
      status = false;
    });

    socket.on('close', () => {
      resolve(status);
    });

    socket.connect(port, host);
  });
}

/**
 * Check multiple ports
 * @param {string} host
 * @param {number[]} ports
 */
async function checkPorts(host, ports) {
  const results = {};
  const promises = [];
  for (const port of ports) {
    promises.push(isPortOpen(host, port));
  }
  var data = await Promise.all(promises);
  for (var i = 0; i < ports.length; i++) {
    results[ports[i]] = data[i];
  }
  return results;
}
export default checkPorts;