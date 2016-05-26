interface Graph<T> extends Set<T> {
	link(from: T, to: T);
	unlink(from: T, to: T);
	unlinkAll(node: T);
	from(from: T): Set<T>;
	to(to: T): Set<T>;
	visit(root: T, fn: (T) => void, visited: Map<T, T>);
	visitFrom(root, fn, visited, previous);
	visitAll(fn: (T) => void, visited: Map<T, T>);
	traverse(from: T, fn: (T, T) => void);
	traverse(from: (T, T) => void);
	traverseFrom(from: T, fn: (T) => void, visited: Map<T, T>);
	traverseAll(fn: (T, T) => void);
	set: Set<T>;
}


declare var Graph: {
	new<T>(): Graph<T>;
}

export default Graph;