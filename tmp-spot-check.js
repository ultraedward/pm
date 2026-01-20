import { getSpotPrice } from './lib/getSpotPrice.ts';

console.log('gold:', await getSpotPrice('gold'));
console.log('silver:', await getSpotPrice('silver'));
