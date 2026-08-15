//#region lib/types/invariant.js
/**
* Package-owned invariant companion for `@deepseek-ai/dsh-client-ui-contacts`.
* @module @deepseek-ai/dsh-client-ui-contacts/invariant
*/
const PACKAGE_NAME = "@deepseek-ai/dsh-client-ui-contacts";
/** Cordis companion plugin name. */
const name = "client-ui-contacts-invariant";
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
