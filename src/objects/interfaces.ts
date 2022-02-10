import { Curseforge } from "..";

export abstract class CFObject {
    _client: Curseforge;
    constructor(_client: Curseforge) {
        this._client = _client;
    };
}