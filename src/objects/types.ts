import { FileRelationType } from "./enums"

export type GameAssets = {
    iconUrl: string;
    tileUrl: string;
    coverUrl: string;
}

export type Pagination = {
    index: number,
    pageSize: number,
    resultCount: number,
    totalCount: number
}

export type FileHash = {
    value: string,
    algo: {Sha1: 1, Md5: 2}
}

export type SortableGameVersion = {
    gameVersionName: string,
    gameVersionPadded: string,
    gameVersion: string,
    gameVersionReleaseDate: Date,
    gameVersionTypeId: number | null
}

export type FileDependency = {
    modId: number,
    fileId: number,
    relationType: FileRelationType
}

export type FileModule = {
    name: string,
    fingerprint: bigint
}