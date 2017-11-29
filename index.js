const osu = require('node-os-utils')
const cpu = osu.cpu
const pretty = require('prettysize');

let drive = osu.drive
let osCmd = osu.osCmd

// osCmd.diskUsage().then(info => {
//     console.log("df: ", info)
// })
let cp = require('child_process')

cp.exec('df -kPh', { shell: true }, function (err, stdout, stderr) {
    if (err || !stdout) {
        console.error("err: ", err)
    }

    // console.log("Disks: ", parseDfStdout(stdout))
})

let mem = osu.mem

let openfiles = osu.openfiles;

let DISK_PATTERN = /^(\S+)\n?\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\n/mg

function createDiskInfo (headlineArgs, args) {
    let info = {}

    headlineArgs.forEach(function (h, i) {
        info[h] = args[i]
    })

    return info
}

function parseDfStdout (stdout) {
    let dfInfo = []
    let headline

    stdout.replace(DISK_PATTERN, function () {
        let args = Array.prototype.slice.call(arguments, 1, 7)

        if (arguments[7] === 0) {
            headline = args
            return
        }
        dfInfo.push(createDiskInfo(headline, args))
    })

    return dfInfo
}

const express = require('express')
const app = express()
const wrap = require('co-express');
app.get('/', wrap(function* (req, res) {
    let cpu_usage = yield cpu.usage();
    let drive_info = yield drive.info();
    let CpuCount = cpu.count() // 8
    let cpu_avg = yield cpu.average()
    let mem_info = yield mem.info()
    let openFd = yield openfiles.openFd()
    let hostname = osCmd.hostname
    // render a regular page
    res.send({
        "hostname": hostname,
        "cpu_count": CpuCount,
        "cpu_avg": cpu_avg,
        "cpu_usage": cpu_usage,
        "memory": mem_info,
        "drive": drive_info,
        "fd": openFd,

    })
}))
// app.use(function *(){
//     let cpu_usage = yield cpu.usage();
//     console.log(cpu_usage)
//     next();
// });
app.listen(3001, () => console.log('Example app listening on port 3000!'))