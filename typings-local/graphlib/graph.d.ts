// TODO pull request generic-less version
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/graphlib/index.d.ts

declare module 'cinea-graphlib' {
  export interface IEdge {
    v: string
    w: string
    name?: string
  }

  export interface IOptions {
    directed?: boolean
    compound?: boolean
    multigraph?: boolean
  }

  export class Graph<Node, Edge, Graph, EdgeName> {
    _nodes: { [v: string]: Node }
    _edgeLabels: { [id: string]: Edge }
    _edgeObjs: { [id: string]: IEdge }
    constructor(opts?: IOptions)
    isDirected(): boolean
    isMultigraph(): boolean
    isCompound(): boolean
    setGraph(label: Graph): this
    graph(): Graph
    setDefaultNodeLabel(newDefault: (v: string) => Node): this
    nodeCount(): number
    nodes(): string[]
    // TODO
    sources(): any
    // TODO
    sinks(): any
    // TODO
    setNodes(vs: any, value: any): this
    setNode(v: string, value: Node): this
    node(v: string): Node
    hasNode(v: string): boolean
    removeNode(v: string): this
    setParent(v: string, parent: string): this
    protected _removeFromParentsChildList(v: string): void
    parent(v: string): string
    children(v: string): any
    predecessors(v: string): any
    successors(v: string): any
    neighbors(v: string): any
    filterNodes(filter: (v: string) => boolean): this
    setDefaultEdgeLabel(newDefault: (v: string) => string): this
    edgeCount(): number
    edges(): IEdge[]
    setPath(vs: any, value: any): this
    setEdge(edge: IEdge, label?: Edge): this
    setEdge(v: string, w: string, label?: Edge, name?: EdgeName): this
    edge(v: string, w: string, name?: EdgeName): Edge
    edge(v: IEdge): Edge
    hasEdge(v: string, w: any, name?: EdgeName): boolean
    hasEdge(v: IEdge): boolean
    removeEdge(v: string, w: any, name?: EdgeName): this
    inEdges(v: string, u?: string): IEdge[]
    outEdges(v: string, w?: string): IEdge[]
    nodeEdges(v: string, w?: string): IEdge[]
  }
}

declare module 'graphlib' {
  export * from 'cinea-graphlib'
}
