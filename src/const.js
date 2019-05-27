const getHost =()=>{
  return process.env.NODE_ENV === 'production'?
    "http://landmark-remark.info":
    "http://localhost:3000"
};

module.exports.getHost = getHost;
