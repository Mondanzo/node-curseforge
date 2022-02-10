import { Category, ModFile } from ".";
import { Curseforge } from "..";
import { ModStatus } from "./enums";
import { CFObject } from "./interfaces";
import { FileIndex, ModAsset, ModAuthor, ModLinks, Pagination, PagingOptions } from "./types";

export class Mod extends CFObject {

    public readonly id: number;
    public readonly gameId: number;
    public readonly name: string;
    public readonly slug: string;
    public readonly links: ModLinks;
    public readonly summary: string;
    public readonly status: ModStatus;
    public readonly downloadCount: number;
    public readonly isFeatured: boolean;
    public readonly primaryCategoryId: number;
    public readonly categories: Category[];
    public readonly authors: ModAuthor[];
    public readonly logo: ModAsset;
    public readonly thumbnails: ModAsset[];
    public readonly mainFileId: number;
    public readonly latestFiles: File[];
    public readonly latestFilesIndexes: FileIndex[];
    public readonly dateCreated: Date;
    public readonly dateModified: Date;
    public readonly dateReleased: Date;
    public readonly allowedModDistribution: boolean | null;

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

    public get_files(searchOptions?: {gameVersionTypeId?: number} & PagingOptions): Promise<ModFile[] & {"paging": Pagination}> {
        return this._client.get_files(this.id, searchOptions);
    }

    public get_description(): Promise<string> {
        return this._client.get_mod_description(this.id);
    }

    public get_file(fileId: number): Promise<ModFile> {
        return this._client.get_file(this, fileId);
    }
}