const osu = require('node-os-utils')
const cpu = osu.cpu
const express = require('express')
const pretty = require('prettysize');
const drive = osu.drive
const osCmd = osu.osCmd
const mem = osu.mem
const openfiles = osu.openfiles;
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
let port = process.env.PORT || 8087;
app.listen(port, () => console.log('App listening on port ' + port))