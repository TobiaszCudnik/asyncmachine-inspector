import am from 'asyncmachine'

class Remotable {


    bindStates() {

    }
}

class Base extends am.AsyncMachine {


}

class Example extends Base implements Remotable {
    constructor() {
        super
        this.StateA
    }

}
applyMixins(Example, Remotable)




























function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        })
    });
}