// Tracker code
tomapio.GoogleMapTracker = (function(win, undefined){

    var GOOGLE_MAP_EVENTS = [
        "bounds_changed",
        "center_changed",
        "click",
        "dblclick",
        "drag",
        "dragend",
        "dragstart",
        "heading_changed",
        "idle",
        "maptypeid_changed",
        "mousemove",
        "mouseout",
        "mouseover",
        "projection_changed",
        "resize",
        "rightclick",
        "tilesloaded",
        "tilt_changed",
        "zoom_changed"
    ];

    var addListener = _.eval(win || {}, 'google.maps.event.addListener', _.noop),
        removeListener = _.eval(win || {}, 'google.maps.event.removeListener', _.noop);

    // Events handlers
    var latLngToArray = function(latLng){
        return _(["lat", "lng"]).map(function(name){ return latLng[name](); }).value();
    };

    var baseEvent = function(){
        return {
            timestamp: (new Date).getTime()
        };
    };

    var pointEvent = function(map, eventData){
        return {
            "position": latLngToArray(eventData["latLng"])
        };
    };

    var boundsEvent = function(map){
        var bounds = map.getBounds();
        return bounds ? {
            "rect": _([bounds.getSouthWest(), bounds.getNorthEast()]).map(latLngToArray).value()
        } : {};
    };

    // Event normalizers
    var eventMappers = {
        "click": [
            baseEvent,
            pointEvent,
            function(map, eventData){
                return {
                    "type": "mouse_click",
                    "button": "left"
                };
            }],
        "rightclick": [
            baseEvent,
            pointEvent,
            function(map, eventData){
                return {
                    "type": "mouse_click",
                    "button": "right"
                };
            }],
        "mouseout": [
            baseEvent,
            pointEvent,
            function(map, eventData){
                return {
                    "type": "mouse_out"
                };
            }],
        "mouseover": [
            baseEvent,
            pointEvent,
            function(map, eventData){
                return {
                    "type": "mouse_over"
                };
            }],
        "mousemove": [
            baseEvent,
            pointEvent,
            function(map, eventData){
                return {
                    "type": "mouse_move"
                };
            }],
        "bounds_changed": [
            baseEvent,
            boundsEvent,
            function(map){
                return {
                    "type": "map_move"
                };
            }
        ],
        "zoom_changed": [
            baseEvent,
            function(map){
                return {
                    "type": "map_zoom",
                    "level": map.zoom
                }
            }
        ]
    };

    var Tracker = function(options){
        // A tracker hooks into a specific map API, normalizes it's relevant events and relays them to the hosting controller via the "tracked_event" event
        _.extend(this, {
            _mapEventListeners: [],
            _map: undefined
        });

        this._dispatcher = (function(){
            var STATES = {
                SCAN: function(map, eventData, eventName){
                    var _this = this;
                    eventName === "idle" && (function(){
                        currentState = STATES.DISPATCH;
                        _(["zoom_changed", "bounds_changed"]).map(_.partial(currentState, [map, {}, _], _this));
                    })();
                },
                DISPATCH: function(map, eventData, eventName){
                    var nEvent = _(eventMappers[eventName] || []).reduce(function(a, f){
                        a = _.extend(a || {}, f(map, eventData, eventName));
                        return a;
                    }, null);

                    nEvent && this.trigger('publish', nEvent);
                }
            };

            var currentState = STATES.SCAN;

            return function(){
                currentState.apply(this, _(arguments).toArray());
            }
        })();

        this.setMap(options["map"]);
    };

    Tracker.prototype = _.extend({
        setMap: function(map){
            var _this = this;
            _(this._mapEventListeners).map(removeListener);
            !!(this._map = map) && (this._mapEventListeners = _(GOOGLE_MAP_EVENTS).map(function(eventName){
                return addListener(map, eventName, _.partial(_this._dispatcher, [map, _, eventName], _this));
            }).value());
        }
    }, _.Events);

    return Tracker;

})(global, undefined);