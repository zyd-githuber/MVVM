class Observer {
    constructor(data){
        this.observe(data);
    }
    observe(data){
        //要对这个data数据将原有的属性改成个set和set的形式
        if(!data|| typeof data !== 'object'){
            return '';
        };
        // 开始数据的劫持
        Object.keys(data).forEach((key)=>{
            //劫持
            this.defineReactive(data,key,data[key]);
            this.observe(data[key])
        });
    }
    //定义响应式
    defineReactive(obj,key,value){
        let that = this;
        let dep = new Dep();//每个变化的数据都会对应一个数组，是存放所有更新的操作
        Object.defineProperty(obj,key,{
            configurable:true,// configurable 为 true 时，该属性可操作
            enumerable:true,//可枚举
            get(){
                Dep.target && dep.addSub(Dep.target);
                return value
            },
            set(newValue){//当给data属性设置值的时候，更改获取的属性的值
                if(newValue !== value){
                    that.observe(newValue);//如果是对象
                    value = newValue
                    dep.notify();//通知所有人 数据更新了
                }
            }
        })
    }
}
class Dep {
    constructor(){
        //订阅的数组
        this.subs = [];
    }
    addSub(watcher){
        this.subs.push(watcher);
    }
    notify(){
        this.subs.forEach((watcher)=>{
            watcher.update()
        })
    }
}
