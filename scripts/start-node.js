const { spawn } = require('child_process');

const node = spawn('npx', ['hardhat', 'node'], {
  stdio: 'ignore',
  detached: true,
  shell: true
});

node.unref();
console.log(`Hardhat node started with PID: ${node.pid}`);
