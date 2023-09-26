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
const fs = require('fs');
const httpClientService_1 = require("./Services/httpClientService");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const https = require('https');
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        // Uygulama kodunuz
        const requestParameter = {
            fullEndPoint: 'https://raw.githubusercontent.com/bilalozdemir/tr-word-list/master/files/words.json',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const wordsFromApiArray = [];
        var client = new httpClientService_1.httpsClientService();
        var response = yield client.get({ requestParameter });
        response.forEach((item) => {
            wordsFromApiArray.push(item.word);
        });
        while (true) {
            const randomIndex = Math.floor(Math.random() * wordsFromApiArray.length);
            const selectedWord = wordsFromApiArray[randomIndex].word;
            fs.appendFileSync('ApiWords.txt', selectedWord + '\n', 'utf8');
            const path = 'ApiWords.txt';
            const stats = fs.statSync(path);
            const fileSize = stats.size;
            const GB = fileSize / (1024 * 1024 * 1024);
            if (GB >= 4) {
                console.log('Dosya 4 GB veya daha b�y�k.');
                break; // D�ng�y� burada sonland�r�n
            }
        }
        rl.question('Uygulama sonland�. ��kmak i�in Enter tu�una bas�n...', () => {
            rl.close();
        });
    });
}
main();
//# sourceMappingURL=app.js.map