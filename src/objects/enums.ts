export enum CoreStatus {
    DRAFT = 1,
    TEST = 2,
    PENDING_REVIEW = 3,
    REJECTED = 4,
    APPROVED = 5,
    LIVE = 6
}

export enum CoreApiStatus {
    PRIVATE = 1,
    PUBLIC = 2
}

export enum FileReleaseType {
    RELEASE = 1,
    BETA = 2,
    ALPHA = 3
}

export enum FileStatus {
    PROCESSING = 1,
    CHANGES_REQUIRED = 2,
    UNDER_REVIEW = 3,
    APPROVED = 4,
    REJECTED = 5,
    MALWARE_DETECTED = 6,
    DELETED = 7,
    ARCHIVED = 8,
    TESTING = 9,
    RELEASED = 10,
    READY_FOR_REVIEW = 11,
    DEPRECATED = 12,
    BAKING = 13,
    AWAITING_PUBLISHING = 14,
    FAILED_PUBLISHING = 155
}

export enum FileRelationType {
    EMBEDDED_LIBRARY = 1,
    OPTIONAL_DEPENDENCY = 2,
    REQUIRED_DEPENDENCY = 3,
    TOOL = 4,
    INCOMPATIBLE = 5,
    INCLUDE = 6
}

export enum ModsSearchSortField {
    FEATURED = 1,
    POPULARITY = 2,
    LAST_UPDATED = 3,
    NAME = 4,
    AUTHOR = 5,
    TOTAL_DOWNLOADS = 6,
    CATEGORY = 7,
    GAME_VERSION = 8
}

export enum ModStatus {
    NEW = 1,
    CHANGES_REQUIRED = 2,
    UNDER_SOFT_REVIEW = 3,
    APPROVED = 4,
    REJECTED = 5,
    CHANGES_MADE = 6,
    INACTIVE = 7,
    ABANDONED = 8,
    DELETED = 9,
    UNDER_REVIEW = 10
}

export enum ModLoaderType {
    ANY = 0,
    FORGE = 1,
    CAULDRON = 2,
    LITE_LOADER = 3,
    FABRIC = 4
}

export enum FileHashAlgorithms {
    SHA1 = 1,
    MD5 = 2
}