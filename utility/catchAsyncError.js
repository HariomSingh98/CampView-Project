module.exports =  fun => {
  return (req,res,next) => {
    fun(req,res,next).catch(next);
  }
};
//take a function as argument and call the function with handling error with catch