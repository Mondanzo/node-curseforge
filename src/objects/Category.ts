import Curseforge from "..";
import { CFObject } from "./interfaces";

/**
 * Represents a Category from Curseforge.
 */
export default class Category extends CFObject {
    public readonly id: number;
    public readonly gameId: number;
    public readonly name: string;
    public readonly slug: string;
    public readonly url: string;
    public readonly iconUrl: string;
    public readonly dateModified: Date;
    public readonly isClass: boolean | null;
    public readonly classId: number | null;
    public readonly parentCategoryId: number | null;

    constructor(_client: Curseforge, data: any) {
        super(_client);

        this.id = data.id;
        this.gameId = data.gameId;
        this.name = data.name;
        this.slug = data.slug;
        this.url = data.url;
        this.dateModified = new Date(data.dateModified);
        this.isClass = data.isClass;
        this.classId = data.classId;
        this.parentCategoryId = data.parentCategoryId;
    }
}