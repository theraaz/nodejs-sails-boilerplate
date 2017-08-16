/**
 * a helper method to process error object and return apporpriate message based on status if err = instance of CustomError
 * @param {CustomError|Error} err - standard error
 * @param res - sails response object
 * @param {string} [responseFormat] - possible values: xml, json
 */
module.exports.errorResponse = function(err, res, responseFormat){
  sails.log.debug(err);
  let rsp = {}, _status = 500;
  if(err instanceof CustomError){
    rsp = {err: err.message};
    _status = err.status || 500;

  }else if(err instanceof Error){
    rsp = {err: err.message};
  }else{
    rsp = err;
  }

  // if(responseFormat && responseFormat == 'xml'){
  //   const jstoxml = require('jstoxml');
  //   res.setHeader("Content-type", "text/xml");
  //   return res.send(jstoxml.toXML(rsp, { header: true, indent: '    ' }), _status);
  // }else{
    res.send(rsp, _status);
  // }

};
