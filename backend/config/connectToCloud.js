import {v2 as cloudinary} from "cloudinary";
import puppeteer from "puppeteer"; 

cloudinary.config({
    cloud_name: 'dgo1zpavt', 
    api_key: '127891497395984',
    api_secret: '8LMDwxs2TTLaO4_wgDn6QVxFXZ4',
})
/*
const getWebtoonImages = async () => {
    try{
        const browser = await puppeteer.launch(); 
        const page = await browser.newPage(); 
       await page.setRequestInterception(true);

        page.on('request', (request) => {
        const headers = {
            ...request.headers(),
            referer: 'https://www.webtoons.com/', 
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 
        };

        request.continue({ headers });
        });
        await page.goto('https://www.webtoons.com/en/originals'
        );
        
        await page.locator('img[loading=lazy]').wait()
        const images = await page.$$eval('img[loading=lazy]', imgs => imgs.map(img => img.getAttribute("src")));
        /*
        for(const image of images) {
            console.log("hi");
            const result = await cloudinary.uploader.upload(image);
            console.log(result.secure_url);
        }
       for(const image of images) {
        const response = await axios.get(image, {
            responseType: 'arraybuffer',
            headers: {
            referer: 'https://www.webtoons.com/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            }
        })
       }
    } catch(err) 
    {
        console.log(err);
    }
}
getWebtoonImages();
export{cloudinary};

*/