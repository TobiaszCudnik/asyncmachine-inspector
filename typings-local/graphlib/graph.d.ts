// TODO pull request generic-less version
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/graphlib/index.d.ts

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

    export class Graph<T, L, GL> {
        constructor(opts?: IOptions);
        isDirected(): boolean;
        isMultigraph(): boolean;
        isCompound(): boolean;
        setGraph(label: GL): this;
        graph(): GL;
        setDefaultNodeLabel(newDefault: (v: string) => T): this;
        nodeCount(): number;
        nodes(): string[];
        sources(): any;
        sinks(): any;
        setNodes(vs: any, value: any): this;
        setNode(v: string, value: T): this;
        node(v: string): T;
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
        setEdge(edge: IEdge, label?: L): this;
        setEdge(v: string, w: string, label?: L, name?: string): this;
        edge(v: string, w: any, name: string): L;
        edge(v: IEdge): L;
        hasEdge(v: string, w: any, name?: string): boolean;
        hasEdge(v: IEdge): boolean;
        removeEdge(v: string, w: any, name?: string): this;
        inEdges(v: string, u: any): any;
        outEdges(v: string, w: any): any;
        nodeEdges(v: string, w: any): any;
    }
}

declare module 'graphlib' {
    export * from 'cinea-graphlib'
}
