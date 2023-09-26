"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpsClientService = void 0;
const https = require("https"); // veya kullanmak istedi�iniz https k�t�phanesini import edin
const config_1 = require("../config");
class httpsClientService {
    constructor() {
        this.baseUrl = config_1.AppConfig.baseUrl;
    }
    url({ requestParameter }) {
        return `${requestParameter.baseUrl ? requestParameter.baseUrl : this.baseUrl}/${requestParameter.controller}${requestParameter.action ? `/${requestParameter.action}` : ""}`;
    }
    get({ requestParameter, id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqUrl = requestParameter.fullEndPoint
                ? requestParameter.fullEndPoint
                : `${this.url({ requestParameter })}${id ? `/${id}` : ""}${requestParameter.queryString ? `?${requestParameter.queryString}` : ""}`;
            try {
                const response = yield this.makeRequest(reqUrl, requestParameter.headers);
                if (response.statusCode === 200) {
                    var jsonData = JSON.parse(response.body);
                    return jsonData;
                }
                else {
                    throw new Error(`https iste�i ba�ar�s�z. Durum Kodu: ${response.statusCode}`);
                }
            }
            catch (error) {
                throw error; // Hata yakaland���nda yeniden f�rlat
            }
        });
    }
    makeRequest(url, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const req = https.get(url, { headers }, (res) => {
                    let data = '';
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    res.on('end', () => {
                        resolve({ statusCode: res.statusCode || 500, body: data });
                    });
                });
                req.on('error', (error) => {
                    reject(error);
                });
                req.end();
            });
        });
    }
}
exports.httpsClientService = httpsClientService;
//# sourceMappingURL=httpClientService.js.map