import Curseforge from "..";

/**
 * @hidden
 */
export abstract class CFObject {

    /**
     * @hidden
     */
    _client: Curseforge;
    constructor(_client: Curseforge) {
        this._client = _client;
    };
}