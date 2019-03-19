class MVVM {
    constructor(options){
        this.$el = options.el;//保存挂载的元素
        this.$data = options.data;
        //如果有要编译的模板 我就开始编译
        if(this.$el){
            //数据劫持
            new Observer(this.$data);
            this.proxyData(this.$data);
            //编译模板
            new Compile(this.$el,this);
        }
    }
    proxyData(data){
        Object.key(data).forEach((key)=>{
            object.defineProperty(this,key,{
                get(){
                    return data[key]
                },
                set(newValue){
                    data[key] = newValue;
                }
            })
        })
    }
}