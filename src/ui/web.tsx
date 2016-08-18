import renderLayout from './layout'
import Graph from './joint'
import * as io from 'socket.io-client'


export default function() {
  var graph;
  var socket = io('http://localhost:3030/client');
  var layout

  document.addEventListener('DOMContentLoaded', () => {
      // render the main layout
      layout = renderLayout(document.getElementById('app'))

      socket.once('loggers', function(ids) {
          socket.emit('join', {
              loggerId: ids[0]
          })
      })

      socket.once('full-sync', (data) => {
          console.log('full-sync', data)
          graph = new Graph(data)
          graph.render(document.getElementById('graph'))
      })
      
      socket.on('diff-sync', function(diff) {
          graph.patch(diff)
          console.log(diff)
      })
  })
}
