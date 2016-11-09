declare module 'cinea-graphlib' {
    export interface IEdge {
        v: string,
        w: string,
        name?: string
    }

    export interface IOptions {
        directed?: boolean,
        compound?: boolean,
        multigraph?: boolean
    }

    class Graph<T> {
        constructor(opts?: IOptions);
        isDirected(): boolean;
        isMultigraph(): boolean;
        isCompound(): boolean;
        setGraph(label: T): this;
        graph(): T;
        setDefaultNodeLabel(newDefault: (v: string) => T): this;
        nodeCount(): number;
        nodes(): string[];
        sources(): any;
        sinks(): any;
        setNodes(vs: any, value: any): this;
        setNode(v: string, value: any): this;
        node(v: string): string[];
        hasNode(v: string): any;
        removeNode(v: string): this;
        setParent(v: string, parent: string): this;
        _removeFromParentsChildList(v: string): void;
        parent(v: string): string;
        children(v: string): any;
        predecessors(v: string): any;
        successors(v: string): any;
        neighbors(v: string): any;
        filterNodes(filter: (v: string) => boolean): this;
        setDefaultEdgeLabel(newDefault: (v: string) => string): this;
        edgeCount(): number;
        edges(): IEdge[];
        setPath(vs: any, value: any): this;
        setEdge(edge: IEdge, value?: number): this;
        setEdge(v: string, w: string, label: string, value?: number): this;
        edge(v: string, w: any, name: string): any;
        hasEdge(v: string, w: any, name: string): any;
        removeEdge(v: string, w: any, name: any): this;
        inEdges(v: string, u: any): any;
        outEdges(v: string, w: any): any;
        nodeEdges(v: string, w: any): any;
    }

    export default Graph;
}

declare module 'graphlib' {
    export * from 'cinea-graphlib'
}
