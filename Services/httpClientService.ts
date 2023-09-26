import * as https from 'https'; // veya kullanmak istediðiniz https kütüphanesini import edin
import * as http from 'http'; // veya kullanmak istediðiniz https kütüphanesini import edin
import { AppConfig } from '../config';
 
  
export class httpsClientService {
  

    constructor( ) {
       
    }
    private baseUrl: string = AppConfig.baseUrl;
    private url({ requestParameter }: { requestParameter: RequestParameters; }) {
        return `${requestParameter.baseUrl ? requestParameter.baseUrl : this.baseUrl
            }/${requestParameter.controller}${requestParameter.action ? `/${requestParameter.action}` : ""
            }`;
    }

    async get<T>(
        { requestParameter, id }: { requestParameter: RequestParameters; id?: string; }): Promise<T> {
        const reqUrl = requestParameter.fullEndPoint
            ? requestParameter.fullEndPoint
            : `${this.url({ requestParameter })}${id ? `/${id}` : ""}${requestParameter.queryString ? `?${requestParameter.queryString}` : ""}`;



        try {
            const response = await this.makeRequest(reqUrl, requestParameter.headers);

            if (response.statusCode === 200) {
                  
                var jsonData = JSON.parse(response.body)  as T;



                return jsonData
            } else {
                throw new Error(`https isteði baþarýsýz. Durum Kodu: ${response.statusCode}`);
            }
        } catch (error) {
            throw error; // Hata yakalandýðýnda yeniden fýrlat
        }
    }
    private async makeRequest(url: string, headers?: http.IncomingHttpHeaders): Promise<{ statusCode: number; body: string }> {
        return new Promise<{ statusCode: number; body: string }>((resolve, reject) => {
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
    }
}
 
     

 

    export type RequestParameters = {
        controller?: string;
        action?: string;
        queryString?: string;
        headers?: http.IncomingHttpHeaders;
        baseUrl?: string;
        fullEndPoint?: string;
    }
