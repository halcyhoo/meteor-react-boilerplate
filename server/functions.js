import { HTTP } from 'meteor/http';
import crypto from 'crypto';
var convert = require('xml-js');

export const createHmac = (baseUrl, endpoint, params, secret, method) => {
  let queryString = Object.keys(params).sort().map(param => {
    return `${param}=${encodeURIComponent(params[param])}`;
  }).join('&');
  let unsigned = `${method}\n${baseUrl}\n${endpoint}\n${queryString}`;
  return crypto.createHmac('sha256', secret).update(unsigned).digest('base64');
}

export const parseCSV = data => {
  let rows = data.split('\n');
  for(let r = 0; r<rows.length;r++){
    rows[r] = rows[r].split(',').map(cell=>{
      return cell.slice(1,-1);
    });
  }
  return rows;
}

export const ISODateString = d => {
    function pad(n) {return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
         + pad(d.getUTCMonth()+1)+'-'
         + pad(d.getUTCDate())+'T'
         + pad(d.getUTCHours())+':'
         + pad(d.getUTCMinutes())+':'
         + pad(d.getUTCSeconds())+'Z'
}

export const orderKeys = obj => {

  var keys = Object.keys(obj).sort(function keyOrder(k1, k2) {
      if (k1 < k2) return -1;
      else if (k1 > k2) return +1;
      else return 0;
  });

  var i, after = {};
  for (i = 0; i < keys.length; i++) {
    after[keys[i]] = obj[keys[i]];
    delete obj[keys[i]];
  }

  for (i = 0; i < keys.length; i++) {
    obj[keys[i]] = after[keys[i]];
  }
  return obj;
}
