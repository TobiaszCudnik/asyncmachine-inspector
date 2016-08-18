/// <reference path="../../typings/globals/socket.io-client/index.d.ts" />

import Ui from './joint'
import * as io from 'socket.io-client'

export default function(container = '#graph') {
    
    var ui;
    var socket = io('http://localhost:3030/client');

    document.addEventListener('DOMContentLoaded', function() {
        socket.once('loggers', function(ids) {
            socket.emit('join', {
                loggerId: ids[0]
            })
        })
        socket.once('full-sync', function(data) {
            console.log('full-sync', data)
            ui = new Ui(data)
            ui.render(container)
        })
        socket.on('diff-sync', function(diff) {
            ui.patch(diff)
            console.log(diff)
        })
    })

    return { socket, ui }
}