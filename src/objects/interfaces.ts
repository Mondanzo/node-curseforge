import Curseforge from "..";

/**
 * @internal
 */
export abstract class CFObject {
    _client: Curseforge;
    constructor(_client: Curseforge) {
        this._client = _client;
    };
}