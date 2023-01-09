export class Debounce {
    /**
     * 
     * @param {Function} callback 延迟执行的回调
     * @param {Number} duration 延迟执行回调的时间
     */
    constructor(callback, duration) {
        this.callback = callback;
        this.duration = duration;
        this.timer_stamp = null;
        this.enable = true;
    }
    launch(...args) {
        if (!!this.timer_stamp) clearTimeout(this.timer_stamp);
        this.timer_stamp = setTimeout(this.callback, this.duration, ...args);
    }
}