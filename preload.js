const { contextBridge } = require('electron');
const getHTML = require('html-get');
const { execSync } = require('child_process');

function getVersions(packagename) {
  return getHTML(
    'https://www.npmjs.com/package/' + packagename + '?activeTab=versions',
    {
      getBrowserless: true,
    }
  ).then(({ html }) => {
    const data = html.match(/v\/\d+.\d+.\d+/g);
    const versions = [];
    for (let item of data) {
      let v = item.split('/')[1];
      if (!versions.includes(v)) {
        versions.push(v);
      }
    }
    return versions;
  });
}

contextBridge.exposeInMainWorld('mycode', {
  getNpmVersions: (pkgname) => {
    return getVersions(pkgname);
  },
  npmview: (name, version1, version2 = '') => {
    let command = '';
    if (version2) {
      command = `npm view ${name}@">=${version1} <=${version2}" dependencies`;
    } else {
      command = `npm view ${name}@${version1} dependencies`;
    }
    return execSync(command, {
      encoding: 'utf8',
    });
  },
});

window.addEventListener('DOMContentLoaded', () => {
  
});
