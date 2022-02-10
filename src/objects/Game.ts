import { GameAssets, GameVersionType, Pagination, PagingOptions, SearchOptions } from "./types";
import { CoreStatus, CoreApiStatus } from "./enums";
import { Curseforge } from "..";
import { CFObject } from "./interfaces";
import { Mod } from "./Mod";
import { Category } from ".";

export class Game extends CFObject {
    public readonly id: number = undefined;
    public readonly name: string = undefined;
    public readonly slug: string = undefined;
    public readonly dateModified: Date = undefined;
    public readonly assets: GameAssets = undefined;
    public readonly status: CoreStatus = undefined;
    public readonly apiStatus: CoreApiStatus = undefined;

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

    public get_categories(classId?: number): Promise<Category[]> {
        return this._client.get_categories(this.id, classId);
    }

    public search_mods(options?: SearchOptions & PagingOptions): Promise<Mod[] & {paging: Pagination}> {
        return this._client.search_mods(this.id, options);
    }

    public get_featured(gameVersionType?: number | GameVersionType, excludedMods?: number[]): Promise<{featured: Mod[], popular: Mod[], recentlyUpdated: Mod[]}> {
        return this._client.get_featured_mods(this.id, gameVersionType, excludedMods);
    }
}