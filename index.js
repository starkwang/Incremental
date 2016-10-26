var JsDiff = require('diff');
var fs = require('fs');

function minimizeDiffInfo(originalInfo) {
    var result = originalInfo.map(info => {
        if (info.added) {
            return '+' + info.value;
        }
        if (info.removed) {
            return '-' + info.count;
        }
        return info.count;
    });
    return JSON.stringify(result);
}

function mergeDiff(oldString, diffInfo) {
    var newString = '';
    var diffInfo = JSON.parse(diffInfo);
    var p = 0;
    for (var i = 0; i < diffInfo.length; i++) {
        var info = diffInfo[i];
        if (typeof(info) == 'number') {
            newString += oldString.slice(p, p + info);
            p += info;
            continue;
        }
        if (typeof(info) == 'string') {
            if (info[0] === '+') {
                var addedString = info.slice(1, info.length);
                newString += addedString;
            }
            if (info[0] === '-') {
                var removedCount = parseInt(info.slice(1, info.length));
                p += removedCount;
            }
        }
    }
    return newString;
}

var newFile = fs.readFileSync('a.js', 'utf-8');
var oldFile = fs.readFileSync('b.js', 'utf-8');
console.log('New File Length: ', newFile.length);
console.log('Old File Length: ', oldFile.length);
var diffInfo = minimizeDiffInfo(JsDiff.diffChars(oldFile, newFile));
console.log('diffInfo Length: ', diffInfo.length);
console.log(diffInfo);
var result = mergeDiff(oldFile, diffInfo);
console.log(result == newFile);