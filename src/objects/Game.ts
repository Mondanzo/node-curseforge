import { GameAssets, GameVersionType, Pagination, PagingOptions, SearchOptions } from "./types";
import { CoreStatus, CoreApiStatus } from "./enums";
import Curseforge from "..";
import { CFObject } from "./interfaces";
import { Mod } from ".";
import { Category } from ".";
import { cleanse } from "../utils";

export default class Game extends CFObject {

    /**
     * The id of the game.
     */
    public readonly id: number;

    /**
     * The name of the game.
     */
    public readonly name: string;

    /**
     * The slug of the game.
     * a slug is a string identifier.
     */
    public readonly slug: string;

    /**
     * the Date when the game got last modified. Does not include changes in the mods.
     */
    public readonly dateModified: Date;

    /**
     * Assets related to the game.
     */
    public readonly assets: GameAssets;

    /**
     * The game status.
     */
    public readonly status: CoreStatus;

    /**
     * The api status for the game.
     */
    public readonly apiStatus: CoreApiStatus;

    constructor(_client: Curseforge, data: any) {
        super(_client);

        this.id = data.id;
        this.name = data.name;
        this.slug = data.slug;
        this.dateModified = new Date(data.dateModified);
        this.assets = data.assets;
        this.status = data.status;
        this.apiStatus = data.apiStatus;
    }

    /**
     * Get the categories for this game.
     * @param classId Optional TopLevel id of the category to get from.
     * @returns a list of categories.
     */
    public get_categories(classId?: number | Category): Promise<Category[]> {
        return this._client.get_categories(this.id, cleanse(classId));
    }

    /**
     * Search for "mods" related to this game.
     * Mods also by default includes things like Resource packs / mod packs / custom worlds. Make sure to use the proper Top-Level Category if you only wants to find game modifications.
     * @param options Optional Options for searching and Paging.
     * @returns a list of found [[Mod]] as well as a paging value for Pagination.
     */
    public search_mods(options?: SearchOptions & PagingOptions): Promise<Mod[] & {paging: Pagination}> {
        return this._client.search_mods(this.id, options);
    }

    /**
     * 
     * @param gameVersionType Optional game version type to look for.
     * @param excludedMods a list of mods to not include.
     * @returns an object with multiple lists of [[Mod]]
     */
    public get_featured(gameVersionType?: number | GameVersionType, excludedMods?: number[]): Promise<{featured: Mod[], popular: Mod[], recentlyUpdated: Mod[]}> {
        return this._client.get_featured_mods(this.id, gameVersionType, excludedMods);
    }
}