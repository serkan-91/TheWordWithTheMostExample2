import { WordJsonModel } from "./Models/WordJsonModel";
import { httpsClientService, RequestParameters } from "./Services/httpClientService";
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

const requestParameter: RequestParameters = {
    fullEndPoint: 'https://raw.githubusercontent.com/bilalozdemir/tr-word-list/master/files/words.json',
    headers: {
        'Content-Type': 'application/json',
    },
};


async function main() {
    const client = new httpsClientService();
    const response = await client.get<WordJsonModel[]>({ requestParameter });

    const wordsFromApiArray = response.map(item => item.word);
    const filteredWords = wordsFromApiArray.filter(word => word.length >= 4);
    const uniqueWords = Array.from(new Set(filteredWords));

    return uniqueWords;
}



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}




const getFileSize = (path: string): number => {
    try {
        const stats = fs.statSync(path);
        return stats.size; // Dosya boyutunu döndür
    } catch (error) {
        console.error('Dosya boyutu ölçme hatasý:', error);
        return -1; // Hata durumunda -1 döndür
    }
};



const doesFileExist = (path: string): boolean => {
    try {
        fs.accessSync(path); // Eðer dosya varsa bu satýr hata vermez
        return true; // Dosya var
    } catch (error) {
        return false; // Dosya yok
    }
};

const getSelectRandomWords = (words: string[]) => {
    try {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        return randomWord || '';
    } catch (error) {
        console.error('getSelectRandomWords error:', error);
        return '';
    }

};
async function run() {
    const words = await main();
    const outputFile: string = "output.txt";
    const startTime = Date.now();
    await sleep(100);
    let fileSize = 0;

    if (isMainThread) {
        console.log(`Ana iþ parçacýðý baþladý: ${new Date().toISOString()}`);


        const worker = new Worker(__filename, { workerData: { outputPath: outputFile, words } });




        // Yardýmcý iþ parçacýðýndan mesaj alýndýðýnda
        worker.on('message', data => {
            if (data != "completed") {
                console.log(`Dosya Boyutu: ${data}`);
            } else {

            }

        });


        // Yardýmcý iþ parçacýðýndan hata alýndýðýnda
        worker.on('error', error => {
            console.error(`Ana iþ parçacýðý: Yardýmcý iþ parçacýðý hatasý: ${error.message}`);
        });


        // Yardýmcý iþ parçacýðýndan çýkýþ alýndýðýnda
        worker.on('exit', exitCode => {
            console.log(`Ana iþ  parcacigi bitti  `);
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

            // Yardýmcý iþ parçacýðýndan çýkýþ yap
            process.exit(0);


        }
        else {
            console.error('workerData içinde start ve end bulunamadý.');
        }



    }



}

run();

