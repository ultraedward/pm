import { getSpotPrice } from './lib/getSpotPrice';

(async () => {
  console.log('gold:', await getSpotPrice('gold'));
  console.log('silver:', await getSpotPrice('silver'));
})();
