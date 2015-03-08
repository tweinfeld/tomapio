tomapio.ExternalReporter = (function(win, undefined){

    var Reporter = function(options){
        this.reporterFunction = (options||{})["reporter"] || _.noop;
    };

    Reporter.prototype = {
        dispatch: function(id, event){
            this.reporterFunction.call(this, id, event);
        }
    };

    return Reporter;

})(global, undefined);