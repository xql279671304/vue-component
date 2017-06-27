/**
 * Created by apple on 2017/6/27.
 */

var scheme = {
    //惰性单例
    getSingle(fn) {
        var result;
        return function() {
            return result || fn.apply(this, arguments);
        }
    },
    // 绑定事件
    bindEvent(elem, type, handler) {
        if (window.addEventListener) {
            this.bindEvent = function(elem, type, handler) {
                elem.addEventListener(type, handler, false)
            }
        } else if (window.attactEvent) {
            this.bindEvent = function(elem, type, handler) {
                elem.attactEvent('on' + type, handler)
            }
        }
        this.bindEvent(elem, type, handler)
    }
};

export default scheme