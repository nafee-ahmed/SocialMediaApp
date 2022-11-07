function pagenate(model, pageNumber, limit){  // pass in query of all records, pageNum, and limit
    const startIndex = (pageNumber - 1) * limit; // page-1 is because page 1 is index 0 
    const endIndex = pageNumber * limit;
    let nextIndex = false; // indicates if there are more records of model
    if(endIndex < model.length){
        nextIndex = true;
    }
    return {pagenatedModel: model.slice(startIndex, endIndex), nextIndex};
}

module.exports.pagenate = pagenate;