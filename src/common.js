// Common functions, name-spaced "_"
var _ = function(val){
    return {
        map: function(func){
            var ou = [];
            for(var i=0; i < val.length; i++){
                ou.push(func(val[i], i, val));
            }
            return _(ou);
        },
        value: function(){ return val; },
        filter: function(func){
            var ou = [],
                inp = _(val).map(func).value();
            for(var i=0; i < val.length; i++) {
                !!inp[i] && ou.push(val[i]);
            };
            return _(ou);
        },
        reduce: function(func, ac){
            _(val).map(function(v, i, a){ ac = func(ac, v, i, a); });
            return ac;
        },
        compact: function(){
            return _(val).filter(Boolean);
        },
        flatten: function(){
            var mapToFlat = function(arr, outArr){
                for(var i=0; i < arr.length; i++){
                    arr[i] instanceof Array ? mapToFlat(arr[i], outArr) : outArr.push(arr[i]);
                };
                return outArr;
            };

            return _(mapToFlat(val, []));
        },
        toArray: function(){ return Array.prototype.slice.call(val); }
    }
};

_.partial = function(func, args, context){
    return function(){
        var locArgs = _(arguments).toArray();
        return func.apply(context || this, _(args).map(function(ar){
            return ar === _ ? locArgs.shift() : ar;
        }).value().concat(locArgs));
    };
};

_.extend = function(){
    var args = _(arguments).toArray();

    return _(args).reduce(function(o, e){
        for(var i in e){ e.hasOwnProperty(i) && (o[i] = e[i]); }
        return o;
    }, args.shift());
};

_.bind = function(func, context){
    return _.partial(func, [], context);
};

_.eval = function(obj, path, def){
    return _(path.split('.')).reduce(function(a,v){ return (a !== def) && (a[v] !== undefined) ? a[v] : def; }, obj);
};

_.debounce = function(func, delay){
    var ref, memo;
    return function(){
        var args = _(arguments).toArray();
        clearTimeout(ref);
        ref = setTimeout(function(){
            ref = undefined;
            memo = func.apply(this, args)
        }, delay);

        return memo;
    };
};

_.noop = function(){};

_.once = function(func){
    var memo = false;
    return function(){
        return !memo && (memo = func.apply(this, _(arguments).toArray()) || true);
    };
};

_.Events = {
    on: function(eventName, func){
        (function(eventsHash){
            (function(eventsArray){
                eventsArray.push(func);
            })(eventsHash[eventName] = eventsHash[eventName] || []);
        })(this._events = this._events || {});
    },
    off: function(eventName, func){
        (function(eventsArray){
            eventsArray.splice(eventsArray.indexOf(func), 1);
        })((this._events || {})[eventName] || []);
    },
    trigger: function(eventName, data){
        _((this._events || {})[eventName] || []).map(function(func){ func.call(this, data); });
    }
};