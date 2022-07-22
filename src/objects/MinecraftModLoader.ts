import Curseforge from "..";
import { CFObject } from "./interfaces";
import { ModLoaderType, ModLoaderInstallMethod, GameVersionStatus, GameVersionTypeStatus } from "./enums";

export default class MinecraftModLoader extends CFObject {
    public readonly name: string;
    public readonly gameVersion?: string;
    public readonly gameVersionId?: number;
    public readonly forgeVersion?: string;
    public readonly latest: boolean;
    public readonly recommended: boolean;
    public readonly dateModified: Date;
    public readonly type: ModLoaderType;
    public readonly downloadUrl?: string;
    public readonly filename?: string;
    public readonly installMethod?: ModLoaderInstallMethod;
    public readonly approved?: boolean;
    public readonly mavenVersionString?: string;
    public readonly versionJson?: string;
    public readonly librariesInstallLocation?: string;
    public readonly minecraftVersion?: string;
    public readonly additionalFilesJson?: string;
    public readonly modLoaderGameVersionId?: number;
    public readonly modLoaderGameVersionTypeId?: number;
    public readonly modLoaderGameVersionStatus?: GameVersionStatus;
    public readonly modLoaderGameVersionTypeStatus?: GameVersionTypeStatus;
    public readonly mcGameVersionId?: number;
    public readonly mcGameVersionTypeId?: number;
    public readonly mcGameVersionTypeStatus?: number;
    public readonly installProfileJson?: string;

    public constructor(curseforge: Curseforge, data: any) {
        super(curseforge);
        this.name = data.name;
        this.gameVersion = data.gameVersion;
        this.gameVersionId = data.gameVersionId;
        this.forgeVersion = data.forgeVersion;
        this.latest = data.latest;
        this.recommended = data.recommended;
        this.dateModified = new Date(data.dateModified);
        this.type = data.type;
        // The official Curseforge API only return a downloadUrl for a Dummy file
        this.downloadUrl = `https://maven.minecraftforge.net/net/minecraftforge/forge/${data.minecraftVersion}-${data.forgeVersion}/forge-${data.minecraftVersion}-${data.forgeVersion}-installer.jar` || data.downloadUrl;
        this.filename = data.filename;
        this.installMethod = data.installMethod;
        this.approved = data.approved;
        this.mavenVersionString = data.mavenVersionString;
        this.versionJson = data.versionJson;
        this.librariesInstallLocation = data.librariesInstallLocation;
        this.minecraftVersion = data.minecraftVersion;
        this.additionalFilesJson = data.additionalFilesJson;
        this.modLoaderGameVersionId = data.modLoaderGameVersionId;
        this.modLoaderGameVersionTypeId = data.modLoaderGameVersionTypeId;
        this.modLoaderGameVersionStatus = data.modLoaderGameVersionStatus;
        this.modLoaderGameVersionTypeStatus = data.modLoaderGameVersionTypeStatus;
        this.mcGameVersionId = data.mcGameVersionId;
        this.mcGameVersionTypeId = data.mcGameVersionTypeId;
        this.mcGameVersionTypeStatus = data.mcGameVersionTypeStatus;
        this.installProfileJson = data.installProfileJson;
    }
}