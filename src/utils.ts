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
 * 
 * @param { "GET" | "POST" } method - http method to use for request.
 * @param {string} url - url to request.
 * @param { object | string | number } [body] - Optional request data to send along.
 * @returns 
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

export function get(url: string, body?: any): AsyncRequestResponse {
    return rq("GET", url, body);
}

export function post(url: string, body?: any): AsyncRequestResponse {
    return rq("POST", url, body);
}

export function cleanse(object: CFObject & {id: number} | number): number {
    return object instanceof CFObject ? object.id : object;
}