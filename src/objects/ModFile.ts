import { Mod } from ".";
import { Curseforge } from "..";
import { FileHashAlgorithms, FileRelationType, FileReleaseType, FileStatus } from "./enums";
import { CFObject } from "./interfaces";
import { FileDependency, FileHash, FileModule, SortableGameVersion } from "./types";
import * as https from "https";
import { PathLike, createWriteStream, createReadStream } from "fs";
import { createHash } from "crypto";
import { rejects } from "assert";

export class ModFile extends CFObject {
    public readonly id: number;
    public readonly gameId: number;
    public readonly modId: number;
    public readonly isAvailable: boolean;
    public readonly displayName: string;
    public readonly fileName: string;
    public readonly releaseType: FileReleaseType;
    public readonly fileStatus: FileStatus;
    public readonly hashes: FileHash[];
    public readonly fileDate: Date;
    public readonly fileLength: bigint;
    public readonly downloadCount: bigint;
    public readonly downloadUrl: string;
    public readonly gameVersion: string[];
    public readonly sortableGameVersions: SortableGameVersion[];
    public readonly dependencies: FileDependency[];
    public readonly exposeAsAlternative: boolean | null;
    public readonly parentProjectFileId: number | null;
    public readonly alternateFileId: number | null;
    public readonly isServerPack: boolean | null;
    public readonly serverPackFileId: number | null;
    public readonly fileFingerprint: bigint;
    public readonly modules: FileModule[];

    constructor(_client: Curseforge, data: any) {
        super(_client);
        
        this.id = data.id;
        this.gameId = data.gameId;
        this.modId = data.modId;
        this.isAvailable = data.isAvailable;
        this.displayName = data.displayName;
        this.fileName = data.fileName;
        this.releaseType = data.releaseType;
        this.fileStatus = data.fileStatus;
        this.hashes = data.hashes;
        this.fileDate = new Date(data.fileDate);
        this.fileLength = data.fileLength;
        this.downloadCount = data.downloadCount;
        this.downloadUrl = data.downloadUrl;
        this.gameVersion = data.gameVersion;
        this.sortableGameVersions = data.sortableGameVersions;
        this.dependencies = data.dependencies;
        this.exposeAsAlternative = data.exposeAsAlternative;
        this.parentProjectFileId = data.parentProjectFileId;
        this.alternateFileId = data.alternateFileId;
        this.isServerPack = data.isServerPack;
        this.serverPackFileId = data.serverPackFileId;
        this.fileFingerprint = data.fileFingerprint;
        this.modules = data.modules;
    }

    private _download(url: string | URL, path: PathLike, verify: boolean): Promise<boolean> {
        return new Promise((resolve, reject) => {
            console.log("Download Url:", url);
            let req = https.get(url);
            req.on("response", (res) => {
                if(res.statusCode == 200){

                    let hash: undefined | FileHash = undefined;

                    if(verify){
                        hash = this.hashes.find((hash) => hash.algo == FileHashAlgorithms.SHA1);
                    
                        if(!hash) hash = this.hashes.find((hash) => hash.algo == FileHashAlgorithms.MD5);
                    
                    
                        // No hash available. Can't verify. Sad.
                        if(!hash) verify = false;
                    }

                    // File exists!
                    let stream = createWriteStream(path);

                    res.on("end", () => {
                        stream.close();
                        if(hash) {
                            let fileStream = createReadStream(path);
                            let h = createHash(hash.algo == FileHashAlgorithms.SHA1 ? "sha1" : "md5");

                            fileStream.on("end", () => {
                                fileStream.close();
                                let hashRes = h.digest("hex");
                                resolve(hashRes == hash.value);
                            });

                            fileStream.pipe(h);    
                        } else {
                            resolve(true);
                        }
                    });

                    res.pipe(stream);
                } else if (res.statusCode == 302) {
                    console.log(res.headers);
                    resolve(this._download(res.headers.location, path, verify));
                } else {
                    reject("Error! No idea what happened");
                }
            });

            req.end();
        });
    }

    public download(path: PathLike, verify: boolean = true): Promise<boolean> {
        return this._download(this.downloadUrl, path, verify);
    }

    public get_mod(): Promise<Mod> {
        return this._client.get_mod(this.modId);
    }

    public get_dependencies(relations: FileRelationType[] = [FileRelationType.REQUIRED_DEPENDENCY]): Promise<ModFile[]> {
        return new Promise(async (resolve, reject) => {
            let mods = [];
            for(let dependency of this.dependencies){
                if(relations.includes(dependency.relationType)){
                    mods.push(await this._client.get_file(dependency.modId, dependency.fileId));
                }
            }

            resolve(mods);
        });
    }

    public get_changelog(): Promise<string> {
        return this._client.get_file_changelog(this.modId, this.id);
    }
}