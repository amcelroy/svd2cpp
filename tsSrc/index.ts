import { SVD } from './svd';
import path from 'path';

(async () => {
    let svd = new SVD(path.join(__dirname, "output"));

    let svd_path = path.join(__dirname, '..', 'TM4C123GH6PM.svd');


    await svd.load(svd_path);
    
    svd.generate();

    svd.toCPP();


})();