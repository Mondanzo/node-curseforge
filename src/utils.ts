import {request} from "https";
import { IncomingMessage, OutgoingHttpHeaders } from "http";
import { URL } from "url";
import { Game } from "./objects";
import { CFObject } from "./objects/interfaces";
import { Pagination } from "./objects/types";

export type RequestResponse = {code: number, data?: {"data": any, "pagination"?: Pagination}};
export type AsyncRequestResponse = Promise<RequestResponse>;

var https_headers: OutgoingHttpHeaders;

export function set_option(header: string) {
    https_headers = {
        "x-api-key": header
    }
}

/**
 * @hidden
 * @param method - http method to use for request.
 * @param url - url to request.
 * @param body - Optional request data to send along.
 */
function rq(method: "GET" | "POST", url: string, body?: object | string | number): AsyncRequestResponse {
    return new Promise(function (resolve, reject) {
        let body_headers = {};
        let body_data = body ? JSON.stringify(body) : null;

        if(body_data) {
            body_headers = {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(body_data)
            }
        }

        let req = request(url, {
            method: method,
            headers: {
                "Accept": "application/json",
                ...https_headers,
                ...body_headers
            }
        });

        
        req.on("response", (res: IncomingMessage) => {
            let data = "";
            res.on("data", (chunk) => {data += chunk});
            res.on("end", () => {
                if(data == "" || data == undefined) resolve({"code": res.statusCode})
                else 
                resolve({
                    "code": res.statusCode,
                    "data": JSON.parse(data)
                });
            });
        });

        if (body_data) { req.write(body_data) }

        req.end();
    });
}

/**
 * @hidden
 */
export function get(url: string, body?: any): AsyncRequestResponse {
    return rq("GET", url, body);
}

/**
 * @hidden
 */
export function post(url: string, body?: any): AsyncRequestResponse {
    return rq("POST", url, body);
}

/**
 * @hidden
 */
export function cleanse(object: CFObject & {id: number} | number): number {
    return object instanceof CFObject ? object.id : object;
}