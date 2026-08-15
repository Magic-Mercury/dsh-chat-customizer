//#region lib/types/invariant.js
/**
* Package-owned invariant companion for `dsh-chat-customizer`.
* @module dsh-chat-customizer/invariant
*/
const PACKAGE_NAME = "dsh-chat-customizer";
/** Cordis companion plugin name. */
const name = "dsh-chat-customizer-invariant";
/** Service required before the companion can reserve package ownership. */
const inject = ["invariants"];
/**
* No runtime invariant: a pure-consumer plugin deriving its rows in-component
* from injected roster/session observables — it emits no cordis events and
* owns no cross-plugin mutable state beyond its own snapshot store.
*/
const install = () => {};
/**
* Register this package's invariant companion.
* @param ctx - Cordis context carrying the invariant service.
* @returns the installed registration's disposer after setup succeeds.
*/
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
