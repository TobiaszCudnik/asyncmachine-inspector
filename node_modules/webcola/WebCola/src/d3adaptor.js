///<reference path="../extern/d3.d.ts"/>
///<reference path="layout.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var cola;
(function (cola) {
    var D3StyleLayoutAdaptor = (function (_super) {
        __extends(D3StyleLayoutAdaptor, _super);
        function D3StyleLayoutAdaptor() {
            _super.call(this);
            this.event = d3.dispatch(cola.EventType[cola.EventType.start], cola.EventType[cola.EventType.tick], cola.EventType[cola.EventType.end]);
            // bit of trickyness remapping 'this' so we can reference it in the function body.
            var d3layout = this;
            var drag;
            this.drag = function () {
                if (!drag) {
                    var drag = d3.behavior.drag()
                        .origin(function (d) { return d; })
                        .on("dragstart.d3adaptor", cola.Layout.dragStart)
                        .on("drag.d3adaptor", function (d) {
                        d.px = d3.event.x, d.py = d3.event.y;
                        d3layout.resume(); // restart annealing
                    })
                        .on("dragend.d3adaptor", cola.Layout.dragEnd);
                }
                if (!arguments.length)
                    return drag;
                // this is the context of the function, i.e. the d3 selection
                this //.on("mouseover.adaptor", colaMouseover)
                    .call(drag);
            };
        }
        D3StyleLayoutAdaptor.prototype.trigger = function (e) {
            var d3event = { type: cola.EventType[e.type], alpha: e.alpha, stress: e.stress };
            this.event[d3event.type](d3event); // via d3 dispatcher, e.g. event.start(e);
        };
        // iterate layout using a d3.timer, which queues calls to tick repeatedly until tick returns true
        D3StyleLayoutAdaptor.prototype.kick = function () {
            var _this = this;
            d3.timer(function () { return _super.prototype.tick.call(_this); });
        };
        // a function for binding to events on the adapter
        D3StyleLayoutAdaptor.prototype.on = function (eventType, listener) {
            if (typeof eventType === 'string') {
                this.event.on(eventType, listener);
            }
            else {
                this.event.on(cola.EventType[eventType], listener);
            }
            return this;
        };
        return D3StyleLayoutAdaptor;
    })(cola.Layout);
    cola.D3StyleLayoutAdaptor = D3StyleLayoutAdaptor;
    /**
     * provides an interface for use with d3:
     * - uses the d3 event system to dispatch layout events such as:
     *   o "start" (start layout process)
     *   o "tick" (after each layout iteration)
     *   o "end" (layout converged and complete).
     * - uses the d3 timer to queue layout iterations.
     * - sets up d3.behavior.drag to drag nodes
     *   o use `node.call(<the returned instance of Layout>.drag)` to make nodes draggable
     * returns an instance of the cola.Layout itself with which the user
     * can interact directly.
     */
    function d3adaptor() {
        return new D3StyleLayoutAdaptor();
    }
    cola.d3adaptor = d3adaptor;
})(cola || (cola = {}));
//# sourceMappingURL=d3adaptor.js.map