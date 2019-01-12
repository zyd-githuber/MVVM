class Compile {
    constructor(el,vm){
        this.el = this.isElementNode(el)?el:document.querySelector(el);
        this.vm = vm;
        if(this.el){
            //dom存在fragment 内存中访问会比较快 
          let fragment =  this.dom2fragment(this.el);
            //开始编译 
          this.compile(fragment)
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
        let fragment = document.createDocumentFragment();
        while (el.firstChild){
            fragment.appendChild(el.firstChild)
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
    getVal(vm,expr){
        expr = expr.split('.');
        return expr.reduce((prev,next)=>{
            return prev[next]
        },vm.$data)
    },
    text(node,vm,expr){//文本处理
        let updateFn = this.updater['TextUpdater'];
        console.log(expr)
        let value = expr.replace(/\{\{([^}]+)\}\}/g,(res)=>{
            console.log(res)
        });
        console.log(value)
        updateFn&&updateFn(node,this.getVal(vm,expr))
    },
    model(node,vm,expr){//输入框处理
        let updateFn = this.updater['modelUpdater'];
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
