import log from "@/next/log";
import { apiOrigin } from "@/next/origins";
import { CustomError, handleUploadError } from "@ente/shared/error";
import HTTPService from "@ente/shared/network/HTTPService";
import { EnteFile } from "types/file";
import { retryHTTPCall } from "./uploadHttpClient";
import { MultipartUploadURLs, UploadFile, UploadURL } from "./uploadService";

const MAX_URL_REQUESTS = 50;

class PublicUploadHttpClient {
    private uploadURLFetchInProgress = null;

    async uploadFile(
        uploadFile: UploadFile,
        token: string,
        passwordToken: string,
    ): Promise<EnteFile> {
        try {
            if (!token) {
                throw Error(CustomError.TOKEN_MISSING);
            }
            const response = await retryHTTPCall(
                () =>
                    HTTPService.post(
                        `${apiOrigin()}/public-collection/file`,
                        uploadFile,
                        null,
                        {
                            "X-Auth-Access-Token": token,
                            ...(passwordToken && {
                                "X-Auth-Access-Token-JWT": passwordToken,
                            }),
                        },
                    ),
                handleUploadError,
            );
            return response.data;
        } catch (e) {
            log.error("upload public File Failed", e);
            throw e;
        }
    }

    async fetchUploadURLs(
        count: number,
        urlStore: UploadURL[],
        token: string,
        passwordToken: string,
    ): Promise<void> {
        try {
            if (!this.uploadURLFetchInProgress) {
                try {
                    if (!token) {
                        throw Error(CustomError.TOKEN_MISSING);
                    }
                    this.uploadURLFetchInProgress = HTTPService.get(
                        `${apiOrigin()}/public-collection/upload-urls`,
                        {
                            count: Math.min(MAX_URL_REQUESTS, count * 2),
                        },
                        {
                            "X-Auth-Access-Token": token,
                            ...(passwordToken && {
                                "X-Auth-Access-Token-JWT": passwordToken,
                            }),
                        },
                    );
                    const response = await this.uploadURLFetchInProgress;
                    for (const url of response.data["urls"]) {
                        urlStore.push(url);
                    }
                } finally {
                    this.uploadURLFetchInProgress = null;
                }
            }
            return this.uploadURLFetchInProgress;
        } catch (e) {
            log.error("fetch public upload-url failed ", e);
            throw e;
        }
    }

    async fetchMultipartUploadURLs(
        count: number,
        token: string,
        passwordToken: string,
    ): Promise<MultipartUploadURLs> {
        try {
            if (!token) {
                throw Error(CustomError.TOKEN_MISSING);
            }
            const response = await HTTPService.get(
                `${apiOrigin()}/public-collection/multipart-upload-urls`,
                {
                    count,
                },
                {
                    "X-Auth-Access-Token": token,
                    ...(passwordToken && {
                        "X-Auth-Access-Token-JWT": passwordToken,
                    }),
                },
            );

            return response.data["urls"];
        } catch (e) {
            log.error("fetch public multipart-upload-url failed", e);
            throw e;
        }
    }
}

export default new PublicUploadHttpClient();
