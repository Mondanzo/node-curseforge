import {Game, Mod, Category, ModFile, types, exceptions, enums} from "./objects";
import * as utils from "./utils";
import { URL } from "url";
import { ErrorBadRequest, ErrorInternalServer, ErrorNotFound } from "./objects/exceptions";
import { FingerprintFuzzyMatch, FingerprintMatchResult, FolderFingerprints, GameVersionsByType, GameVersionType, Pagination, PagingOptions, SearchOptions } from "./objects/types";
import { ModLoaderType } from "./objects/enums";

export {Game, Mod, Category, ModFile, types as Types, exceptions as Exceptions, enums as Enums};

/**
 * the default exported class of the package.
 */
class Curseforge {

    /**
     * @ignore
     */
    private api_token: string;

    /**
     * @ignore
     */
    private API_URL = new URL("https://api.curseforge.com/v1/");

    /**
     * Set the token for this instance.
     * @param token the CFCore token.
     */
    public set_token(token: string): void {
        utils.set_option(token);
    }


    // []============================[]
    // ||    Game Related Methods    ||
    // []============================[]

    /**
     * Get a game specified by `game_id`
     * @param game_id Game id or slug to use.
     */
    public get_game(game_id: number | string): Promise<Game> {
        return new Promise(async (resolve, reject) => {
            if(typeof(game_id) == "number"){
                let res = await utils.get(this.API_URL + "games/" + game_id);
                switch(res.code){
                    case 200:
                        resolve(new Game(this, res.data.data));
                        break;
                    case 404:
                        reject(new ErrorNotFound());
                        break;
                    case 500:
                        reject(new ErrorInternalServer());
                        break;
                }
            } else {
                let _game: Game;
                try {
                 while(_game == undefined){
                        let _games = await this.get_games();
                        _game = _games.find(g => {return g.slug == game_id});
                        if(_game){
                            resolve(_game);
                            break;
                        } else if(_games.paging.pageSize * (_games.paging.index + 1) >= _games.paging.totalCount) {
                            reject(new ErrorNotFound());
                            break;
                        }
                    }
                } catch (error) {
                    reject(error);
                }
            }
        });
    }

    /**
     * Get multiple available games.
     * @param index Optional index to use for paging.
     * @param pageSize Size to show per page. Maximum is 50.
     * @returns A Promise with a paging property filled with the Pagination.
     */
    public get_games(index?: number, pageSize?: number): Promise<Game[] & {paging: Pagination}> {
        return new Promise(async (resolve, reject) => {
            let url = new URL(this.API_URL + "games");
            if(index) url.searchParams.set("index", index.toString());
            if(pageSize) url.searchParams.set("pageSize", Math.max(pageSize, 50).toString());
            let res = await utils.get(url.href);

            switch(res.code){
                case 200:
                    let games: Array<Game> & {paging: Pagination} = Object.assign([], {paging: res.data.pagination});
                    for (const game_data of res.data.data) {
                        games.push(new Game(this, game_data));
                    }

                    resolve(games);
                    break;
                case 500:
                    reject(new ErrorInternalServer());
                    break;
            }

        });
    }

    /**
     * Get the different game versions supported by CFCore.
     * @param game Game to request the versions for.
     * @returns Array of Game Versions
     */
    public get_game_versions(game: number | Game): Promise<GameVersionsByType[]> {
        return new Promise(async (resolve, reject) => {
            let res = await utils.get(this.API_URL + "games/" + utils.cleanse(game) + "/versions");

            switch(res.code){
                case 200:
                    resolve(res.data.data);
                    break;
                case 404:
                    reject(new ErrorNotFound("Game could not be found."));
                    break;
                case 500:
                    reject(new ErrorInternalServer());
                    break;
            }
        });
    }

    
    /**
     * Return a list of version types.
     */
    public get_game_versions_type(game: number | Game): Promise<GameVersionType[]> {
        return new Promise(async (resolve, reject) => {
            let res = await utils.get(this.API_URL + "games/" + utils.cleanse(game) + "/version-types");

            switch(res.code){
                case 200:
                    resolve(res.data.data);
                    break;
                case 404:
                    reject(new ErrorNotFound("Game could not be found."));
                    break;
                case 500:
                    reject(new ErrorInternalServer());
                    break;
            }
        });
    }

    /**
     * Return a list of categories associated for a game.
     * @param game the game id or game object.
     * @param classId optional root category (for example. Resourcepacks, Savegames, Mods)
     * @returns list of Categories fitting the game (and also classId)
     */
    public get_categories(game: number | Game, classId?: number): Promise<Category[]> {
        return new Promise(async (resolve, reject) => {
            let uri = new URL(this.API_URL + "categories");

            uri.searchParams.set("gameId", utils.cleanse(game).toString());
            if(classId) uri.searchParams.set("classId", classId.toString());

            let res = await utils.get(uri.href);

            switch(res.code){
                case 200:
                    let categories = [];

                    for(let cat of res.data.data){
                        categories.push(new Category(this, cat));
                    }

                    resolve(categories);
                    break;
                case 404:
                    reject(new ErrorNotFound());
                    break;
                case 500:
                    reject(new ErrorInternalServer());
                    break;
            }
        });
    }

    // []============================[]
    // ||    Mods Related Methods    ||
    // []============================[]


    public search_mods(game: number | Game, options?: SearchOptions & PagingOptions): Promise<Mod[] & {paging: Pagination}> {
        return new Promise(async (resolve, reject) => {
            let uri = new URL(this.API_URL + "mods/search");

            uri.searchParams.set("gameId", utils.cleanse(game).toString());
            if(options) {
                for(let key of Object.keys(options)){
                    if(options[key] instanceof Category) uri.searchParams.set(key, options[key].id);
                    else uri.searchParams.set(key, options[key]);
                }
            }

            let res = await utils.get(uri.href);

            switch(res.code) {
                case 200:
                    let mods: Array<Mod> & {paging: Pagination} = Object.assign([], {paging: res.data.pagination});
                    for(let mod of res.data.data){
                        mods.push(new Mod(this, mod));
                    }

                    resolve(mods);
                    
                    break;
                case 404:
                    reject(new ErrorBadRequest("The client send request is malformed."));
                    break;
                case 500:
                    reject(new ErrorInternalServer());
                    break;
            }

        });
    }

    public get_mod(mod_id: number): Promise<Mod> {
        return new Promise(async (resolve, reject) => {
            let res = await utils.get(this.API_URL + "mods/" + mod_id.toString());

            switch(res.code) {
                case 200:
                    resolve(new Mod(this, res.data.data));
                    break;
                case 404:
                    reject(new ErrorNotFound("Mod not found."));
                    break;
                case 500:
                    reject(new ErrorInternalServer());
                    break;
            }

        });
    }

    public get_mods(mod: number, ...mods: number[]): Promise<Mod[]> {
        return new Promise(async (resolve, reject) => {
        	mods.push(mod);

            let res = await utils.get(this.API_URL + "mods", {modIds: mods});
            switch(res.code){
                case 200:
                    let mods = [];
                    for(let mod of res.data.data){
                        mods.push(new Mod(this, mod));
                    }
                    resolve(mods);
                    break;
                case 400:
                    reject(new ErrorBadRequest("Malformed request body."));
                    break;
                case 500:
                    reject(new ErrorInternalServer());
                    break;
            }
        });
    }

    public get_featured_mods(game: Game | number, gameVersionType?: number | GameVersionType, excludedMods?: number[]): Promise<{featured: Mod[], popular: Mod[], recentlyUpdated: Mod[]}>{
        return new Promise(async (resolve, reject) => {
            let res = await utils.post(this.API_URL + "mods/featured", {
                "gameId": utils.cleanse(game),
                "gameVersionTypeId": gameVersionType ? gameVersionType : undefined,
                "excludedMods": excludedMods ? excludedMods : []
            });

            switch(res.code) {
                case 200:
                    let result = {featured: [], popular: [], recentlyUpdated: []};
                    for(let mods of Object.keys(res.data.data)){
                        for(let mod of res.data.data[mods][1]){
                            result[mods].push(new Mod(this, mod));
                        }
                    }
                    resolve(result);
                    break;
                case 400:
                    reject(new ErrorBadRequest());
                    break;
                case 404:
                    reject(new ErrorNotFound());
                    break;
                case 500:
                    reject(new ErrorInternalServer());
                    break;
            }
        });
    }

    public get_mod_description(mod: Mod | number): Promise<string> {
        return new Promise(async (resolve, reject) => {
            let res = await utils.get(this.API_URL + "mods/" + utils.cleanse(mod) + "/description");
            switch(res.code){
                case 200:
                    resolve(res.data.data);
                    break;
                case 404:
                    reject(new ErrorNotFound());
                    break;
                case 500:
                    reject(new ErrorInternalServer());
                    break;
            }
        });
    }

    // []=============================[]
    // ||  Mod Files Related Methods  ||
    // []=============================[]

    public get_file(mod: Mod | number, fileId: number): Promise<ModFile> {
        return new Promise(async (resolve, reject) => {
            let res = await utils.get(this.API_URL + "mods/" + utils.cleanse(mod) + "/files/" + fileId);
            switch(res.code){
                case 200:
                    resolve(new ModFile(this, res.data.data));
                    break;
                case 404:
                    reject(new ErrorNotFound());
                    break;
                case 500:
                    reject(new ErrorInternalServer());
                    break;
            }
        });
    }

    public get_files(mod: Mod | number, searchOptions?: {gameVersion?: string, modLoaderType?: ModLoaderType | number, gameVersionTypeId?: number} & PagingOptions): Promise<ModFile[] & {"paging": Pagination}> {
        return new Promise(async (resolve, reject) => {
            let uri = new URL(this.API_URL + "mods/" + utils.cleanse(mod) + "/files");

            if(searchOptions){
                if(searchOptions.gameVersion) uri.searchParams.set("gameVersion", searchOptions.gameVersion);
                if(searchOptions.modLoaderType) uri.searchParams.set("modLoaderType", searchOptions.modLoaderType.toString())
                if(searchOptions.gameVersionTypeId) uri.searchParams.set("gameVersionTypeId", searchOptions.gameVersionTypeId.toString());
                if(searchOptions.index) uri.searchParams.set("index", searchOptions.index.toString());
                if(searchOptions.pageSize) uri.searchParams.set("pageSize", searchOptions.pageSize.toString());
            }

            let res = await utils.get(uri.href);
            switch(res.code) {
                case 200:
                    let files = Object.assign([], {"paging": res.data.pagination});

                    for(let file of res.data.data){
                        files.push(new ModFile(this, file));
                    }

                    resolve(files);
                    break;
                case 404:
                    reject(new ErrorNotFound());
                    break;
                case 500:
                    reject(new ErrorInternalServer());
                    break;
            }
        });
    }

    public get_file_changelog(mod: Mod | number, file: ModFile | number): Promise<string> {
        return new Promise(async (resolve, reject) => {
            let res = await utils.get(this.API_URL + "mods/" + utils.cleanse(mod) + "/files/" + utils.cleanse(file));
            switch(res.code){
                case 200:
                    resolve(res.data.data);
                    break;
                case 404:
                    reject(new ErrorNotFound());
                    break;
                case 500:
                    reject(new ErrorInternalServer());
                    break;
            }
        });
    }

    public get_file_download(mod: Mod | number, file: ModFile | number): Promise<string> {
        return new Promise(async (resolve, reject) => {
            let res = await utils.get(this.API_URL + "mods/" + utils.cleanse(mod) + "/files/" + utils.cleanse(file) + "/download-url");
            switch(res.code){
                case 200:
                    resolve(res.data.data);
                    break;
                case 404:
                    break;
                case 500:
                    break;
            }
        });
    }

    // []=============================[]
    // || Fingerprint Related Methods ||
    // []=============================[]

    public get_fingerprints(fingerprints: number[]): Promise<FingerprintMatchResult> {
        return new Promise(async (resolve, reject) => {
            let res = await utils.post(this.API_URL + "fingerprints", {fingerprints: fingerprints});
            switch(res.code) {
                case 200:
                    resolve(res.data.data);
                    break;
                case 400:
                    reject(new ErrorBadRequest());
                    break;
                case 500:
                    reject(new ErrorNotFound());
                    break;
            }
        });
    }

    public get_fingerprints_fuzzy(game: Game | number, fingerprints: FolderFingerprints[]): Promise<FingerprintFuzzyMatch[]> {
        return new Promise(async (resolve, reject) => {
            let res = await utils.post(this.API_URL + "fingerprints/fuzzy", {game: utils.cleanse(game), fingerprints: fingerprints});
            switch(res.code) {
                case 200:
                    resolve(res.data.data.fuzzyMatches);
                    break;
                case 400:
                    reject(new ErrorBadRequest());
                    break;
                case 500:
                    reject(new ErrorNotFound());
                    break;
            }
        });
    }

    /**
     * Create a new curseforge client.
     * 
     * @param token - The API Token from Curseforge. You can receive one from https://console.curseforge.com/#/api-keys
     */
    constructor(token: string) {
        this.set_token(token);
    }
}

export default Curseforge;
export {Curseforge};