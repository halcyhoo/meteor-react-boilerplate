export const formatDate = date => {
  const monthsShort = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec'
  ]
  return `${monthsShort[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const uniqueId = prefix => {
  if(!prefix) prefix = '';
  let idStr = String.fromCharCode(Math.floor((Math.random()*25)+65));
  do {
      let ascicode=Math.floor((Math.random()*42)+48);
      if (ascicode<58 || ascicode>64){
          // exclude all chars between : (58) and @ (64)
          idStr += String.fromCharCode(ascicode);
      }
  } while (idStr.length<32);
  return (prefix+idStr);
}
