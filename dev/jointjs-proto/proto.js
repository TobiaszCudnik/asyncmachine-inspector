var graph = new joint.dia.Graph();

var paper = new joint.dia.Paper({
    el: $('#graph'),
    width: 1600,
    height: 600,
    gridSize: 1,
    model: graph
});

function state(label) {

    var cell = new joint.shapes.fsa.State({
        attrs: {
            text: { text: label, fill: '#000000', 'font-weight': 'normal' },
            'circle': {
                fill: '#f6f6f6',
                stroke: '#000000',
                'stroke-width': 2
            }
        }
    });
    graph.addCell(cell);
    return cell;
}

function link(source, target, label, vertices) {

    var cell = new joint.shapes.fsa.Arrow({
        source: { id: source.id },
        target: { id: target.id },
        labels: [{ position: 0.5, attrs: { text: { text: label || '', 'font-weight': 'bold' } } }],
        vertices: vertices || []
    });
    graph.addCell(cell);
    return cell;
}

// var code  = state('code');
// var slash = state('slash');
// var star  = state('star');
// var line  = state('line');
// var block = state('block');

// link(code,  slash, '/');
// link(slash, code,  'other');
// link(slash, line,  '/');
// link(line,  code,  'new\n line');
// link(slash, block, '*');
// link(block, star,  '*');
// link(star,  block, 'other');
// link(star,  code,  '/');
// // link(line,  line,  'other', [{x: 115,y: 100}, {x: 250, y: 50}]);
// // link(block, block, 'other', [{x: 485,y: 140}, {x: 620, y: 90}]);
// // link(code,  code,  'other', [{x: 180,y: 500}, {x: 305, y: 450}]);

// // groups

// var uml = joint.shapes.uml



// var states = {

//     s1: new uml.State({
//         position: { x:100  , y: 100 },
//         size: { width: 200, height: 100 },
//         name: "state 1",
//         attrs: {
//             '.uml-state-body': {
//                 fill: 'rgba(48, 208, 198, 0.1)',
//                 stroke: 'rgba(48, 208, 198, 0.5)',
//                 'stroke-width': 1.5
//             },
//             '.uml-state-separator': {
//                 stroke: 'rgba(48, 208, 198, 0.4)'
//             }
//         }
//     }),

//     s2: new uml.State({
//         position: { x:400  , y: 200 },
//         size: { width: 300, height: 300 },
//         name: "state 2",
//         attrs: {
//             '.uml-state-body': {
//                 fill: 'rgba(48, 208, 198, 0.1)',
//                 stroke: 'rgba(48, 208, 198, 0.5)',
//                 'stroke-width': 1.5
//             },
//             '.uml-state-separator': {
//                 stroke: 'rgba(48, 208, 198, 0.4)'
//             }
//         }
//     })

// };
// graph.addCells(states);


// states.s2.embed(block);
// states.s2.embed(star);


// states.s1.embed(code);
// states.s1.embed(line);
// states.s1.embed(slash);

graph.fromJSON({"cells":[{"type":"uml.State","id":"1","name":"1","embeds":["1:Exception","1:A","1:B","1:C","1:D"],"z":1},{"type":"fsa.State","id":"1:Exception","parent":"1","attrs":{"text":{"text":"Exception"}},"z":3},{"type":"fsa.State","id":"1:A","parent":"1","attrs":{"text":{"text":"A"}},"z":3},{"type":"fsa.State","id":"1:B","parent":"1","attrs":{"text":{"text":"B"}},"z":3},{"type":"fsa.State","id":"1:C","parent":"1","attrs":{"text":{"text":"C"}},"z":3},{"type":"fsa.State","id":"1:D","parent":"1","attrs":{"text":{"text":"D"}},"z":3},{"type":"uml.State","id":"2","name":"2","embeds":["2:Exception","2:E","2:F","2:G"],"z":1},{"type":"fsa.State","id":"2:Exception","parent":"2","attrs":{"text":{"text":"Exception"}},"z":3},{"type":"fsa.State","id":"2:E","parent":"2","attrs":{"text":{"text":"E"}},"z":3},{"type":"fsa.State","id":"2:F","parent":"2","attrs":{"text":{"text":"F"}},"z":3},{"type":"fsa.State","id":"2:G","parent":"2","attrs":{"text":{"text":"G"}},"z":3},{"type":"uml.State","id":"3","name":"3","embeds":["3:Exception","3:E","3:F"],"z":1},{"type":"fsa.State","id":"3:Exception","parent":"3","attrs":{"text":{"text":"Exception"}},"z":3},{"type":"fsa.State","id":"3:E","parent":"3","attrs":{"text":{"text":"E"}},"z":3},{"type":"fsa.State","id":"3:F","parent":"3","attrs":{"text":{"text":"F"}},"z":3},{"type":"uml.State","id":"4","name":"4","embeds":["4:Exception","4:E","4:F"],"z":1},{"type":"fsa.State","id":"4:Exception","parent":"4","attrs":{"text":{"text":"Exception"}},"z":3},{"type":"fsa.State","id":"4:E","parent":"4","attrs":{"text":{"text":"E"}},"z":3},{"type":"fsa.State","id":"4:F","parent":"4","attrs":{"text":{"text":"F"}},"z":3},{"type":"uml.State","id":"5","name":"5","embeds":["5:Exception","5:E","5:F"],"z":1},{"type":"fsa.State","id":"5:Exception","parent":"5","attrs":{"text":{"text":"Exception"}},"z":3},{"type":"fsa.State","id":"5:E","parent":"5","attrs":{"text":{"text":"E"}},"z":3},{"type":"fsa.State","id":"5:F","parent":"5","attrs":{"text":{"text":"F"}},"z":3},{"type":"fsa.Arrow","smooth":true,"source":{"id":"1:A"},"target":{"id":"1:B"},"id":"1:A-1:B-0","labels":[{"position":0.5,"attrs":{"text":{"text":"REQUIRES"}}}],"z":2},{"type":"fsa.Arrow","smooth":true,"source":{"id":"1:A"},"target":{"id":"2:E"},"id":"1:A-2:E-4","labels":[{"position":0.5,"attrs":{"text":{"text":"PIPED_IN"}}}],"z":2},{"type":"fsa.Arrow","smooth":true,"source":{"id":"1:C"},"target":{"id":"1:B"},"id":"1:C-1:B-1","labels":[{"position":0.5,"attrs":{"text":{"text":"BLOCKS"}}}],"z":2},{"type":"fsa.Arrow","smooth":true,"source":{"id":"1:D"},"target":{"id":"1:C"},"id":"1:D-1:C-0","labels":[{"position":0.5,"attrs":{"text":{"text":"REQUIRES"}}}],"z":2},{"type":"fsa.Arrow","smooth":true,"source":{"id":"2:E"},"target":{"id":"2:F"},"id":"2:E-2:F-1","labels":[{"position":0.5,"attrs":{"text":{"text":"BLOCKS"}}}],"z":2},{"type":"fsa.Arrow","smooth":true,"source":{"id":"2:E"},"target":{"id":"1:B"},"id":"2:E-1:B-4","labels":[{"position":0.5,"attrs":{"text":{"text":"PIPED_IN"}}}],"z":2},{"type":"fsa.Arrow","smooth":true,"source":{"id":"2:E"},"target":{"id":"3:F"},"id":"2:E-3:F-1","labels":[{"position":0.5,"attrs":{"text":{"text":"BLOCKS"}}}],"z":2},{"type":"fsa.Arrow","smooth":true,"source":{"id":"2:F"},"target":{"id":"1:B"},"id":"2:F-1:B-4","labels":[{"position":0.5,"attrs":{"text":{"text":"PIPED_IN"}}}],"z":2},{"type":"fsa.Arrow","smooth":true,"source":{"id":"3:E"},"target":{"id":"3:F"},"id":"3:E-3:F-1","labels":[{"position":0.5,"attrs":{"text":{"text":"BLOCKS"}}}],"z":2},{"type":"fsa.Arrow","smooth":true,"source":{"id":"4:E"},"target":{"id":"4:F"},"id":"4:E-4:F-1","labels":[{"position":0.5,"attrs":{"text":{"text":"BLOCKS"}}}],"z":2},{"type":"fsa.Arrow","smooth":true,"source":{"id":"2:G"},"target":{"id":"4:F"},"id":"2:G-4:F-4","labels":[{"position":0.5,"attrs":{"text":{"text":"PIPED_IN"}}}],"z":2},{"type":"fsa.Arrow","smooth":true,"source":{"id":"5:E"},"target":{"id":"5:F"},"id":"5:E-5:F-1","labels":[{"position":0.5,"attrs":{"text":{"text":"BLOCKS"}}}],"z":2}]})

joint.layout.DirectedGraph.layout(graph, {
    // setLinkVertices: true,
    // setVertices: function(link, points) {
    //     points[0] = link.findView(paper).sourcePoint
    //     points[points.length-1] = link.findView(paper).targetPoint
    //     link.set('vertices', points);
    // },
    rankDir: 'TB',
    marginX: 50,
    marginY: 50,
    clusterPadding: { top: 30, left: 10, right: 10, bottom: 10 }
});

console.log(graph.toJSON())