import { ModFile, Category } from ".";
import { FileHashAlgorithms, FileRelationType, FileReleaseType, ModLoaderType, ModsSearchSortField } from "./enums";

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
    algo: FileHashAlgorithms
}

export type SortableGameVersion = {
    gameVersionName: string,
    gameVersionPadded: string,
    gameVersion: string,
    gameVersionReleaseDate: Date,
    gameVersionTypeId: number | null
}

export type FileIndex = {
    gameVersion: string,
    fileId: number,
    filename: string,
    releaseType: FileReleaseType,
    gameVersionTypeId: number | null,
    modLoader: ModLoaderType | null
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

export type PagingOptions = {
    index?: number,
    pageSize?: number
}

export type SearchOptions = {
    classId?: number | Category,
    categoryId?: number | Category,
    gameVersion?: string,
    searchFilter?: string,
    sortField?: ModsSearchSortField,
    sortOrder?: "asc" | "desc",
    modLoaderType?: string,
    gameVersionTypeId?: number
}

export type ModLinks = {
    websiteUrl: string,
    wikiUrl: string,
    issuesUrl: string,
    sourceUrl: string
}

export type ModAuthor = {
    id: number,
    name: string,
    url: string
}

export type ModAsset = {
    id: number,
    modId: number,
    title: string,
    description: string,
    thumbnailUrl: string,
    url: string
}

export type GameVersionsByType = {
    type: number,
    versions: string[]
}

export type GameVersionType = {
    id: number,
    gameId: number,
    name: string,
    slug: string
}

export type FingerprintMatch = {
    id: number,
    file: ModFile,
    latestFiles: ModFile[]
}

export type FingerprintMatchResult = {
    isCacheBuilt: boolean,
    exactMatches: FingerprintMatch[],
    exactFingerprints: number[],
    partialMatches: FingerprintMatch[],
    partialMatchFingerprints: object,
    additionalProperties?: number[],
    installedFingerprints: number[],
    unmatchedFingerprints: number[]
}

export type FingerprintFuzzyMatch = {
    id: number,
    file: ModFile,
    latestFiles: ModFile[],
    fingerprints: number[]
}

export type FolderFingerprints = {
    foldername: string,
    fingerprints: number[]
}