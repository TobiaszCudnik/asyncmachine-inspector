/**
 * @module cola
 */
var cola;
(function (cola) {
    // compute the size of the union of two sets a and b
    function unionCount(a, b) {
        var u = {};
        for (var i in a)
            u[i] = {};
        for (var i in b)
            u[i] = {};
        return Object.keys(u).length;
    }
    // compute the size of the intersection of two sets a and b
    function intersectionCount(a, b) {
        var n = 0;
        for (var i in a)
            if (typeof b[i] !== 'undefined')
                ++n;
        return n;
    }
    function getNeighbours(links, la) {
        var neighbours = {};
        var addNeighbours = function (u, v) {
            if (typeof neighbours[u] === 'undefined')
                neighbours[u] = {};
            neighbours[u][v] = {};
        };
        links.forEach(function (e) {
            var u = la.getSourceIndex(e), v = la.getTargetIndex(e);
            addNeighbours(u, v);
            addNeighbours(v, u);
        });
        return neighbours;
    }
    // modify the lengths of the specified links by the result of function f weighted by w
    function computeLinkLengths(links, w, f, la) {
        var neighbours = getNeighbours(links, la);
        links.forEach(function (l) {
            var a = neighbours[la.getSourceIndex(l)];
            var b = neighbours[la.getTargetIndex(l)];
            la.setLength(l, 1 + w * f(a, b));
        });
    }
    /** modify the specified link lengths based on the symmetric difference of their neighbours
     * @class symmetricDiffLinkLengths
     */
    function symmetricDiffLinkLengths(links, la, w) {
        if (w === void 0) { w = 1; }
        computeLinkLengths(links, w, function (a, b) { return Math.sqrt(unionCount(a, b) - intersectionCount(a, b)); }, la);
    }
    cola.symmetricDiffLinkLengths = symmetricDiffLinkLengths;
    /** modify the specified links lengths based on the jaccard difference between their neighbours
     * @class jaccardLinkLengths
     */
    function jaccardLinkLengths(links, la, w) {
        if (w === void 0) { w = 1; }
        computeLinkLengths(links, w, function (a, b) {
            return Math.min(Object.keys(a).length, Object.keys(b).length) < 1.1 ? 0 : intersectionCount(a, b) / unionCount(a, b);
        }, la);
    }
    cola.jaccardLinkLengths = jaccardLinkLengths;
    /** generate separation constraints for all edges unless both their source and sink are in the same strongly connected component
     * @class generateDirectedEdgeConstraints
     */
    function generateDirectedEdgeConstraints(n, links, axis, la) {
        var components = stronglyConnectedComponents(n, links, la);
        var nodes = {};
        components.forEach(function (c, i) {
            return c.forEach(function (v) { return nodes[v] = i; });
        });
        var constraints = [];
        links.forEach(function (l) {
            var ui = la.getSourceIndex(l), vi = la.getTargetIndex(l), u = nodes[ui], v = nodes[vi];
            if (u !== v) {
                constraints.push({
                    axis: axis,
                    left: ui,
                    right: vi,
                    gap: la.getMinSeparation(l)
                });
            }
        });
        return constraints;
    }
    cola.generateDirectedEdgeConstraints = generateDirectedEdgeConstraints;
    /**
     * Tarjan's strongly connected components algorithm for directed graphs
     * returns an array of arrays of node indicies in each of the strongly connected components.
     * a vertex not in a SCC of two or more nodes is it's own SCC.
     * adaptation of https://en.wikipedia.org/wiki/Tarjan%27s_strongly_connected_components_algorithm
     */
    function stronglyConnectedComponents(numVertices, edges, la) {
        var nodes = [];
        var index = 0;
        var stack = [];
        var components = [];
        function strongConnect(v) {
            // Set the depth index for v to the smallest unused index
            v.index = v.lowlink = index++;
            stack.push(v);
            v.onStack = true;
            // Consider successors of v
            for (var _i = 0, _a = v.out; _i < _a.length; _i++) {
                var w = _a[_i];
                if (typeof w.index === 'undefined') {
                    // Successor w has not yet been visited; recurse on it
                    strongConnect(w);
                    v.lowlink = Math.min(v.lowlink, w.lowlink);
                }
                else if (w.onStack) {
                    // Successor w is in stack S and hence in the current SCC
                    v.lowlink = Math.min(v.lowlink, w.index);
                }
            }
            // If v is a root node, pop the stack and generate an SCC
            if (v.lowlink === v.index) {
                // start a new strongly connected component
                var component = [];
                while (stack.length) {
                    w = stack.pop();
                    w.onStack = false;
                    //add w to current strongly connected component
                    component.push(w);
                    if (w === v)
                        break;
                }
                // output the current strongly connected component
                components.push(component.map(function (v) { return v.id; }));
            }
        }
        for (var i = 0; i < numVertices; i++) {
            nodes.push({ id: i, out: [] });
        }
        for (var _i = 0; _i < edges.length; _i++) {
            var e = edges[_i];
            var v_1 = nodes[la.getSourceIndex(e)], w = nodes[la.getTargetIndex(e)];
            v_1.out.push(w);
        }
        for (var _a = 0; _a < nodes.length; _a++) {
            var v = nodes[_a];
            if (typeof v.index === 'undefined')
                strongConnect(v);
        }
        return components;
    }
    cola.stronglyConnectedComponents = stronglyConnectedComponents;
})(cola || (cola = {}));
//# sourceMappingURL=linklengths.js.map