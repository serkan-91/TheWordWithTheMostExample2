
const fs = require('fs');
import { waitForDebugger } from "inspector";
import { WordJsonModel } from "./Models/WordJsonModel";
import { httpsClientService, RequestParameters } from "./Services/httpClientService";
import { WordsFromApi } from "./Models/Words";
async function main() {

    const https = require('https');

    const readline = require('readline');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    // Uygulama kodunuz
    const requestParameter: RequestParameters = {
        fullEndPoint: 'https://raw.githubusercontent.com/bilalozdemir/tr-word-list/master/files/words.json',
        headers: {
            'Content-Type': 'application/json',
        },
    };
        const wordsFromApiArray = [];
    var client = new httpsClientService(); 
    var response = await client.get<WordJsonModel[]>({ requestParameter });
     
    response.forEach((item) => {
         wordsFromApiArray.push(item.word)
    });

    while (true) {
        const randomIndex = Math.floor(Math.random() * wordsFromApiArray.length);
        const selectedWord = wordsFromApiArray[randomIndex];
        fs.appendFileSync('ApiWords2.txt', selectedWord + '\n', 'utf8');

        const path = 'ApiWords2.txt';
        const stats = fs.statSync(path);  

        const fileSize = stats.size;
        const MB = fileSize / (1024 * 1024 );

        

        if (MB >= 2) {
            console.log('Dosya 2 MB veya daha büyük.');
            break; // Döngüyü burada sonlandýrýn
        }
    }



   
 
    rl.question('Uygulama sonlandý. Çýkmak için Enter tuþuna basýn...', () => {
        rl.close();
    });
            
}
main();