tomapio.ConsoleReporter = (function(win, undefined){

    var Reporter = function(options){};

    Reporter.prototype = {
        dispatch: function(id, event){
            console.log(id, event);
        }
    };

    return Reporter;

})(global, undefined);