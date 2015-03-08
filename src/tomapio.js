tomapio.Tomapio = (function(win, undefined){

    var Constructor = function(googleMaps){

        var _this = this;

        _.extend(this, {
            _reporters: [new tomapio.ConsoleReporter()],
            _trackers: []
        });

        _([googleMaps])
            .flatten()
            .compact()
            .map(function(mapData){
                _this.registerMap(mapData["id"], mapData["map"]);
            });
    };

    Constructor.prototype = {

        registerMap: function(id, map){
            var _this = this,
                tracker = new tomapio.GoogleMapTracker({ map: map });

            tracker.on('publish', function(data){
                _(_this._reporters).map(function(reporter){
                    reporter.dispatch(id, data);
                });
            });
        }
    };

    return Constructor;

})(global, undefined);

global["tomapio"] = { Tomapio: tomapio.Tomapio };