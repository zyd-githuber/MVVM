class Compile {
    constructor(el,vm){
        this.el = this.isElementNode(el)?el:document.querySelector(el);
        this.vm = vm;
        if(this.el){//如果可以获取到元素，我们才开始编译
            //1.将el的元素，存放在内存中。dom存在fragment 内存中访问会比较快
          let fragment =  this.dom2fragment(this.el);
            //2.开始编译,提取想要的元素节点 v-model 和文本节点 {{}}
                this.compile(fragment)
            //3编译完成 放回页面
                 this.el.appendChild(fragment)
        }
    }
    //辅助方法
    isElementNode(node){
        return node.nodeType === 1;
    }
    isDirective(name){
        return name.includes('v-')
    }

    //核心方法
    dom2fragment(el){
        //新建一个文档碎片容器
        let fragment = document.createDocumentFragment();
        let firstChild;
        while (el.firstChild){
            firstChild = el.firstChild
            fragment.appendChild(firstChild)
        };
        return fragment
    }
    compileElement(node){
        // v-model
        let attrs = node.attributes;
        Array.from(attrs).forEach((attr)=>{
            if(this.isDirective(attr.name)){
                let expr = attr.value;
                let type = attr.name.split("-")[1];
                CompileUtil[type](node,this.vm,expr)
            }
        })
    }
    compileText(node){
        // {{}}
        let text = node.textContent;
        let reg = /\{\{([^}]+)\}\}/g;
        if(reg.test(text)){
            CompileUtil['text'](node,this.vm,text)
        }
    }
    compile(fragment){
        //递归去处理节点嵌套
        let childNodes = fragment.childNodes;
        Array.from(childNodes).forEach(node=>{
            if(this.isElementNode(node)){
                //编译元素
                this.compileElement(node)
                //递归处理元素嵌套
                this.compile(node)
                console.log(node)
            }else {
                //编译文本
                this.compileText(node)
                console.log(node)
            }
        })
    }
}
CompileUtil = {
    getVal(vm,expr){//获取实例上对应的数据
        expr = expr.split('.');
        return expr.reduce((prev,next)=>{
            return prev[next]
        },vm.$data)
    },
    getTextVal(vm,expr) {
        return expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
            return this.getVal(vm, arguments[1])
        })
    },
    text(node,vm,expr){//文本处理
        let updateFn = this.updater['TextUpdater'];
        let value = this.getTextVal(vm,expr);
        expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
            new Watcher(vm,arguments[1],()=>{
                //如果数据变化了，文本节点需要重新取最新的值，更新文本的内容
                updateFn&&updateFn(node,this.getTextVal(vm,expr))
            });
        });
        updateFn&&updateFn(node,value)
    },
    setVal(vm,expr,value){
        expr = expr.split('.');
        return expr.reduce((prev,next,currentIndex)=>{
            if(currentIndex === expr.length -1){
                return prev[next] = value
            }
            return prev[next];
        },vm.$data)
    },
    model(node,vm,expr){//输入框处理
        let updateFn = this.updater['modelUpdater'];
        new Watcher(vm,expr,(newValue)=>{
            updateFn&&updateFn(node,this.getVal(vm,expr))
        })
        node.addEventListener('input',(e)=>{
            let newValue = e.target.value;
            this.setVal(vm,expr,newValue)
        })
        updateFn&&updateFn(node,this.getVal(vm,expr))
    },
    updater:{
        TextUpdater(node,val){
            // console.log(node.textContent,val)
            node.textContent = val
        },
        modelUpdater(node,val){
            node.value = val
        }
    }
}
