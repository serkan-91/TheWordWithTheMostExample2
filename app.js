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
const httpClientService_1 = require("./Services/httpClientService");
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const readline = require('readline');
const os = require('os');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const outputPath = 'output.txt';
const numCores = os.cpus().length;
const requestParameter = {
    fullEndPoint: 'https://raw.githubusercontent.com/bilalozdemir/tr-word-list/master/files/words.json',
    headers: {
        'Content-Type': 'application/json',
    },
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new httpClientService_1.httpsClientService();
        const response = yield client.get({ requestParameter });
        const wordsFromApiArray = response.map(item => item.word);
        const filteredWords = wordsFromApiArray.filter(word => word.length >= 4);
        const uniqueWords = Array.from(new Set(filteredWords));
        return uniqueWords;
    });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const getFileSize = (path) => {
    try {
        const stats = fs.statSync(path);
        return stats.size; // Dosya boyutunu d�nd�r
    }
    catch (error) {
        console.error('Dosya boyutu �l�me hatas�:', error);
        return -1; // Hata durumunda -1 d�nd�r
    }
};
const doesFileExist = (path) => {
    try {
        fs.accessSync(path); // E�er dosya varsa bu sat�r hata vermez
        return true; // Dosya var
    }
    catch (error) {
        return false; // Dosya yok
    }
};
const getSelectRandomWords = (words) => {
    try {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        return randomWord || '';
    }
    catch (error) {
        console.error('getSelectRandomWords error:', error);
        return '';
    }
};
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const words = yield main();
        const outputFile = "output.txt";
        const startTime = Date.now();
        yield sleep(100);
        let fileSize = 0;
        if (isMainThread) {
            console.log(`Ana i� par�ac��� ba�lad�: ${new Date().toISOString()}`);
            const worker = new Worker(__filename, { workerData: { outputPath: outputFile, words } });
            // Yard�mc� i� par�ac���ndan mesaj al�nd���nda
            worker.on('message', data => {
                if (data != "completed") {
                    console.log(`Dosya Boyutu: ${data}`);
                }
                else {
                }
            });
            // Yard�mc� i� par�ac���ndan hata al�nd���nda
            worker.on('error', error => {
                console.error(`Ana i� par�ac���: Yard�mc� i� par�ac��� hatas�: ${error.message}`);
            });
            // Yard�mc� i� par�ac���ndan ��k�� al�nd���nda
            worker.on('exit', exitCode => {
                console.log(`Ana i�  parcacigi bitti  `);
            });
        }
        else {
            const { outputPath, words } = workerData || {};
            if (outputPath) {
                let totalData = '';
                while (fileSize < 4 * 1024 * 1024 * 1024) {
                    const randomWord = getSelectRandomWords(words);
                    // Veriyi biriktir
                    totalData += randomWord + '\n';
                    fs.writeFileSync(outputFile, totalData, { encoding: 'utf8', flag: 'a+' });
                    if (doesFileExist(outputFile)) {
                        fileSize = getFileSize(outputFile);
                        if (fileSize !== -1) {
                            parentPort.postMessage(fileSize);
                        }
                    }
                }
                // Yard�mc� i� par�ac���ndan ��k�� yap
                process.exit(0);
            }
            else {
                console.error('workerData i�inde start ve end bulunamad�.');
            }
        }
    });
}
run();
//# sourceMappingURL=app.js.map