var graph = new joint.dia.Graph();

var paper = new joint.dia.Paper({
    el: $('#graph'),
    width: 800,
    height: 600,
    gridSize: 1,
    model: graph
});

function state(label) {
    
    var cell = new joint.shapes.fsa.State({
        attrs: {
            text : { text: label, fill: '#000000', 'font-weight': 'normal' },
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

var code  = state('code');
var slash = state('slash');
var star  = state('star');
var line  = state('line');
var block = state('block');

link(code,  slash, '/');
link(slash, code,  'other');
link(slash, line,  '/');
link(line,  code,  'new\n line');
link(slash, block, '*');
link(block, star,  '*');
link(star,  block, 'other');
link(star,  code,  '/');
// link(line,  line,  'other', [{x: 115,y: 100}, {x: 250, y: 50}]);
// link(block, block, 'other', [{x: 485,y: 140}, {x: 620, y: 90}]);
// link(code,  code,  'other', [{x: 180,y: 500}, {x: 305, y: 450}]);

// groups

var uml = joint.shapes.uml



var states = {

    s1: new uml.State({
        position: { x:100  , y: 100 },
        size: { width: 200, height: 100 },
        name: "state 1",
        attrs: {
            '.uml-state-body': {
                fill: 'rgba(48, 208, 198, 0.1)',
                stroke: 'rgba(48, 208, 198, 0.5)',
                'stroke-width': 1.5
            },
            '.uml-state-separator': {
                stroke: 'rgba(48, 208, 198, 0.4)'
            }
        }
    }),

    s2: new uml.State({
        position: { x:400  , y: 200 },
        size: { width: 300, height: 300 },
        name: "state 2",
        attrs: {
            '.uml-state-body': {
                fill: 'rgba(48, 208, 198, 0.1)',
                stroke: 'rgba(48, 208, 198, 0.5)',
                'stroke-width': 1.5
            },
            '.uml-state-separator': {
                stroke: 'rgba(48, 208, 198, 0.4)'
            }
        }
    })

};
graph.addCells(states);


states.s2.embed(block);
states.s2.embed(star);


states.s1.embed(code);
states.s1.embed(line);
states.s1.embed(slash);

joint.layout.DirectedGraph.layout(graph, {
    setLinkVertices: true,
    setVertices: function(link, points) {
        points[0] = link.findView(paper).sourcePoint
        points[points.length-1] = link.findView(paper).targetPoint
        link.set('vertices', points);
    },
    rankDir: 'TB',
    marginX: 50,
    marginY: 50,
    clusterPadding: { top: 30, left: 10, right: 10, bottom: 10 }
});

console.log(graph.toJSON())