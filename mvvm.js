class MVVM {
    constructor(options){
        this.$el = options.el;
        this.$data = options.data;
        //如果有要编译的模板 我就开始编译
        if(this.$el){
            //编译模板
             new Compile(this.$el,this)
        }
    }
}