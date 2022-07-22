import Curseforge from "..";
import { CFObject } from "./interfaces";
import { GameVersionStatus, GameVersionTypeStatus } from "./enums";

export default class MinecraftVersion extends CFObject {
    public readonly id: number;
    public readonly gameVersionId: number;
    public readonly versionString: string;
    public readonly jarDownloadUrl: string;
    public readonly jsonDownloadUrl: string;
    public readonly approved: boolean;
    public readonly dateModified: Date;
    public readonly gameVersionTypeId: number;
    public readonly gameVersionStatus: GameVersionStatus;
    public readonly gameVersionTypeStatus: GameVersionTypeStatus;

    public constructor(curseforge: Curseforge, data: any) {
        super(curseforge);
        this.id = data.id;
        this.gameVersionId = data.gameVersionId;
        this.versionString = data.versionString;
        this.jarDownloadUrl = data.jarDownloadUrl;
        this.jsonDownloadUrl = data.jsonDownloadUrl;
        this.approved = data.approved;
        this.dateModified = new Date(data.dateModified);
        this.gameVersionTypeId = data.gameVersionTypeId;
        this.gameVersionStatus = data.gameVersionStatus;
        this.gameVersionTypeStatus = data.gameVersionTypeStatus;
    }
}