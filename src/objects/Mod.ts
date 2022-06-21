import { Category, ModFile } from ".";
import Curseforge from "..";
import { ModLoaderType, ModStatus } from "./enums";
import { CFObject } from "./interfaces";
import { FileIndex, ModAsset, ModAuthor, ModLinks, Pagination, PagingOptions } from "./types";

/**
 * Class for working with a specific mod from the CF-Core api.
 * Use the Curseforge class to get mod objects.
 */
export default class Mod extends CFObject {

    /**
    * the id of the mod.
    */
    public readonly id: number;

    /**
    * the id of the game of the mod.
    */
    public readonly gameId: number;

    /**
    * the name of this mod.
    */
    public readonly name: string;

    /**
    * the slug (string-id) of the mod.
    */
    public readonly slug: string;

    /**
     * Additional links related to the mod.
     */
    public readonly links: ModLinks;

    /**
     * A brief summary of the mod. (Think of it as the Github Repo description)
     */
    public readonly summary: string;

    /**
     * The curseforge approval status of the mod.
     */
    public readonly status: ModStatus;

    /**
     * The amount this mod got downloaded according to curseforge.
     */
    public readonly downloadCount: number;

    /**
     * if this mod is a featured mod.
     */
    public readonly isFeatured: boolean;

    /**
     * The root category id of the mod. (Can be a modification or another associated file with the game like a resource pack or a savegame)
     */
    public readonly primaryCategoryId: number;

    /**
     * Categories of this mod (also contains root category.)
     */
    public readonly categories: Category[];

    /**
     * Authors of this mod.
     */
    public readonly authors: ModAuthor[];

    /**
     * The [[ModAsset]] for the logo of this mod. (doesn't need to be in square format)
     */
    public readonly logo: ModAsset;

    /**
     * Thumbnails / Screenshots uploaded for this mod.
     */
    public readonly thumbnails: ModAsset[];

    /**
     * the file id for the main file (latest release)
     */
    public readonly mainFileId: number;

    /**
     * list of latest files from this mod.
     */
    public readonly latestFiles: ModFile[];

    public readonly latestFilesIndexes: FileIndex[];

    /** 
     * the date when the mod page got created.
     */
    public readonly dateCreated: Date;

    /**
     * the date when the mod page got updated or files got updated.
     */
    public readonly dateModified: Date;

    /**
     * the date when the mod got released. (not the same as created)
     */
    public readonly dateReleased: Date;

    /**
     * boolean saying if distribution is allowed or null.
     */
    public readonly allowedModDistribution: boolean | null;

    /** @hidden */
    constructor(_client: Curseforge, data: any) {
        super(_client);

        this.id = data.id;        
        this.gameId = data.gameId;
        this.name = data.name;
        this.slug = data.slug;
        this.links = data.links;
        this.summary = data.summary;
        this.status = data.status;
        this.downloadCount = data.downloadCount;
        this.isFeatured = data.isFeatured;
        this.primaryCategoryId = data.primaryCategoryId;
        this.categories = data.categories;
        this.authors = data.authors;
        this.logo = data.logo;
        this.thumbnails = data.thumbnails;
        this.mainFileId = data.mainFileId;
        this.latestFiles = data.latestFiles;
        this.latestFilesIndexes = data.latestFilesIndexes;
        this.dateCreated = new Date(data.dateCreated);
        this.dateModified = new Date(data.dateModified);
        this.dateReleased = new Date(data.dateReleased);
        this.allowedModDistribution = data.allowedModDistribution;
    }

    /**
     * 
     * @param searchOptions Options to use when getting the files for this mod.
     * @returns mod files found using this method.
     */
    public get_files(searchOptions?: {gameVersion?: string, modLoaderType?: ModLoaderType | number, gameVersionTypeId?: number} & PagingOptions): Promise<ModFile[] & {"paging": Pagination}> {
        return this._client.get_files(this.id, searchOptions);
    }

    /**
     * Get the description for this mod in html.
     * @returns html string.
     */
    public get_description(): Promise<string> {
        return this._client.get_mod_description(this.id);
    }

    /**
     * Return a specific file from this mod.
     * @param fileId the id of the file to query.
     * @returns [[ModFile]] associated for this file or throws an error.
     */
    public get_file(fileId: number): Promise<ModFile> {
        return this._client.get_file(this, fileId);
    }
}