define({
    GREATER:"GREATER",
    GEQUAL:"GEQUAL",
    LESS:"LESS",
    LEQUAL:"LEQUAL",

    isBool:function(v){
        return typeof v == "boolean";
    },

    isNumber:function(v){
        return typeof v == "number";
    },

    isInteger:function(v){
        var isInt = false;
        var isNum = this.isNumber(v);
        if(isNum){
            var numFloat = parseFloat(v);
            var numInt = parseInt(v);
            if(numFloat == numInt){
                isInt = true;
            }
            else{
                isInt = false;
            }
        }
        else{
            isInt = false;
        }
        return isInt;
    },

    judgeNumberBoundary:function(num,operator,boundry){
        if(!this.isNumber(num)){
            throw "num is not number";
        }
        if(operator != this.GREATER && operator != this.GEQUAL && operator != this.LESS && operator != this.LEQUAL){
            throw "operator is invalid";
        }
        if(!this.isNumber(boundry)){
            throw "boundry is not number";
        }
        var b;
        if(operator == this.GREATER){
            b = num > boundry;
        }
        else if(operator == this.GEQUAL){
            b = num >= boundry;
        }
        else if(operator == this.LESS){
            b = num < boundry;
        }
        else if(operator == this.LEQUAL){
            b = num <= boundry;
        }
        return b;
    },

    isPositive:function(v){
        return this.judgeNumberBoundary(v,this.GREATER,0);
    },

    isNegative:function(v){
        return this.judgeNumberBoundary(v,this.LESS,0);
    },

    isNonNegative:function(v){
        return this.judgeNumberBoundary(v,this.GEQUAL,0);
    },

    isNonPositive:function(v){
        return this.judgeNumberBoundary(v,this.LEQUAL,0);
    },

    isPositiveInteger:function(v){
        return this.isPositive(v) && this.isInteger(v);
    },

    isNonNegativeInteger:function(v){
        return this.isNonNegative(v) && this.isInteger;
    },

    isString:function(v){
        return typeof v == "string";
    },

    isArray:function(v){
        return Object.prototype.toString.call(v) === '[object Array]';
    },

    isFunction:function(v){
        return typeof v == "function";
    },

    isNull:function(v){
        return v === null;
    },

    isUndefined:function(v){
        return typeof v == "undefined";
    },

    isNullOrUndefined:function(v){
        return this.isNull(v)||this.isUndefined(v);
    },

    isJsonObject:function(v){
        return typeof v == "object" && !this.isNull(v) && !this.isArray(v);
    },

    isDom:function(v){
        return v instanceof HTMLElement;
    },

    forEach:function(arr,func){
        if(!(this.isArray(arr))){
            throw "invalid arr";
        }
        if(!(this.isFunction(func))){
            throw "invalid func";
        }
        if(this.isFunction(Array.prototype.forEach)){
            arr.forEach(func);
        }
        else{
            for(var i=0;i<arr.length;i++){
                func(arr[i],i,arr);
            }
        }
    },

    filter:function(arr,func){
        if(!(this.isArray(arr))){
            throw "invalid arr";
        }
        if(!(this.isFunction(func))){
            throw "invalid func";
        }
        var result = [];
        if(this.isFunction(Array.prototype.filter)){
            result = arr.filter(func);
        }
        else{
            for(var i=0;i<arr.length;i++){
                if(func(arr[i],i,arr)){
                    result.push(arr[i]);
                }
            }
        }
        return result;
    },

    map:function(arr,func){
        if(!(this.isArray(arr))){
            throw "invalid arr";
        }
        if(!(this.isFunction(func))){
            throw "invalid func";
        }
        var result = [];
        if(this.isFunction(Array.prototype.map)){
            result = arr.map(func);
        }
        else{
            for(var i=0;i<arr.length;i++){
                result.push(func(arr[i],i,arr));
            }
        }
        return result;
    },

    some:function(arr,func){
        if(!(this.isArray(arr))){
            throw "invalid arr";
        }
        if(!(this.isFunction(func))){
            throw "invalid func";
        }
        if(this.isFunction(Array.prototype.some)){
            return arr.some(func);
        }
        else{
            for(var i=0;i<arr.length;i++){
                if(func(arr[i],i,arr)){
                    return true;
                }
            }
            return false;
        }
    },

    every:function(arr,func){
        if(!(this.isArray(arr))){
            throw "invalid arr";
        }
        if(!(this.isFunction(func))){
            throw "invalid func";
        }
        if(this.isFunction(Array.prototype.every)){
            return arr.every(func);
        }
        else{
            for(var i=0;i<arr.length;i++){
                if(!func(arr[i],i,arr)){
                    return false;
                }
            }
            return true;
        }
    },

    //过滤掉数组中重复的元素
    filterRepeatArray:function(arr){
        if(!this.isArray(arr)){
            throw "invalid arr: not Array";
        }
        var cloneArray = this.map(arr,function(item){
            return item;
        });
        var simplifyArray = [];
        while(cloneArray.length > 0){
            var e = cloneArray[0];
            var exist = this.some(simplifyArray,function(item){
                return e.equals(item);
            });
            if(!exist){
                simplifyArray.push(e);
            }
            cloneArray.splice(0,1);
        }
        return simplifyArray;
    }
});