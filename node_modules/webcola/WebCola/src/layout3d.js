/**
 * Use cola to do a layout in 3D!! Yay.
 * Pretty simple for the moment.
 */
var cola;
(function (cola) {
    var Link3D = (function () {
        function Link3D(source, target) {
            this.source = source;
            this.target = target;
        }
        Link3D.prototype.actualLength = function (x) {
            var _this = this;
            return Math.sqrt(x.reduce(function (c, v) {
                var dx = v[_this.target] - v[_this.source];
                return c + dx * dx;
            }, 0));
        };
        return Link3D;
    })();
    cola.Link3D = Link3D;
    var Node3D = (function () {
        function Node3D(x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            this.x = x;
            this.y = y;
            this.z = z;
        }
        return Node3D;
    })();
    cola.Node3D = Node3D;
    var Layout3D = (function () {
        function Layout3D(nodes, links, idealLinkLength) {
            var _this = this;
            if (idealLinkLength === void 0) { idealLinkLength = 1; }
            this.nodes = nodes;
            this.links = links;
            this.idealLinkLength = idealLinkLength;
            this.constraints = null;
            this.useJaccardLinkLengths = true;
            this.result = new Array(Layout3D.k);
            for (var i = 0; i < Layout3D.k; ++i) {
                this.result[i] = new Array(nodes.length);
            }
            nodes.forEach(function (v, i) {
                for (var _i = 0, _a = Layout3D.dims; _i < _a.length; _i++) {
                    var dim = _a[_i];
                    if (typeof v[dim] == 'undefined')
                        v[dim] = Math.random();
                }
                _this.result[0][i] = v.x;
                _this.result[1][i] = v.y;
                _this.result[2][i] = v.z;
            });
        }
        ;
        Layout3D.prototype.linkLength = function (l) {
            return l.actualLength(this.result);
        };
        Layout3D.prototype.start = function (iterations) {
            var _this = this;
            if (iterations === void 0) { iterations = 100; }
            var n = this.nodes.length;
            var linkAccessor = new LinkAccessor();
            if (this.useJaccardLinkLengths)
                cola.jaccardLinkLengths(this.links, linkAccessor, 1.5);
            this.links.forEach(function (e) { return e.length *= _this.idealLinkLength; });
            // Create the distance matrix that Cola needs
            var distanceMatrix = (new cola.shortestpaths.Calculator(n, this.links, function (e) { return e.source; }, function (e) { return e.target; }, function (e) { return e.length; })).DistanceMatrix();
            var D = cola.Descent.createSquareMatrix(n, function (i, j) { return distanceMatrix[i][j]; });
            // G is a square matrix with G[i][j] = 1 iff there exists an edge between node i and node j
            // otherwise 2.
            var G = cola.Descent.createSquareMatrix(n, function () { return 2; });
            this.links.forEach(function (_a) {
                var source = _a.source, target = _a.target;
                return G[source][target] = G[target][source] = 1;
            });
            this.descent = new cola.Descent(this.result, D);
            this.descent.threshold = 1e-3;
            this.descent.G = G;
            //let constraints = this.links.map(e=> <any>{
            //    axis: 'y', left: e.source, right: e.target, gap: e.length*1.5
            //});
            if (this.constraints)
                this.descent.project = new cola.vpsc.Projection(this.nodes, null, null, this.constraints).projectFunctions();
            for (var i = 0; i < this.nodes.length; i++) {
                var v = this.nodes[i];
                if (v.fixed) {
                    this.descent.locks.add(i, [v.x, v.y, v.z]);
                }
            }
            this.descent.run(iterations);
            return this;
        };
        Layout3D.prototype.tick = function () {
            this.descent.locks.clear();
            for (var i = 0; i < this.nodes.length; i++) {
                var v = this.nodes[i];
                if (v.fixed) {
                    this.descent.locks.add(i, [v.x, v.y, v.z]);
                }
            }
            return this.descent.rungeKutta();
        };
        Layout3D.dims = ['x', 'y', 'z'];
        Layout3D.k = Layout3D.dims.length;
        return Layout3D;
    })();
    cola.Layout3D = Layout3D;
    var LinkAccessor = (function () {
        function LinkAccessor() {
        }
        LinkAccessor.prototype.getSourceIndex = function (e) { return e.source; };
        LinkAccessor.prototype.getTargetIndex = function (e) { return e.target; };
        LinkAccessor.prototype.getLength = function (e) { return e.length; };
        LinkAccessor.prototype.setLength = function (e, l) { e.length = l; };
        return LinkAccessor;
    })();
})(cola || (cola = {}));
//# sourceMappingURL=layout3d.js.map