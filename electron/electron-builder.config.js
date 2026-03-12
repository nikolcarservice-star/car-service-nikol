// Путь для готовых .exe можно задать через переменную BUILD_OUTPUT (например D:\nikol-crm-build\dist)
const path = require('path');
const buildOutput = process.env.BUILD_OUTPUT;

module.exports = {
  appId: 'pl.carservice.nikol.crm',
  productName: 'Nikol CRM',
  directories: {
    output: buildOutput ? path.resolve(buildOutput) : 'dist'
  },
  win: {
    target: ['nsis', 'portable']
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true
  }
};
