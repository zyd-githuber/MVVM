class Compile {
    constructor(el,vm){
        this.el = this.isElementNode(el)?el:document.querySelector(el);
        this.vm = vm;
        if(this.el){
            //开始编译 1.dom存在fragment 内存中访问会比较快 2.
          let fragment =  this.dom2fragment(this.el);
          this.compile(fragment)
        }
    }
    //辅助方法
    isElementNode(node){
        return node.nodeType === 1;
    }

    //核心方法
    dom2fragment(el){
        let fragment = document.createDocumentFragment();
        while (el.firstChild){
            fragment.appendChild(el.firstChild)
        };
        return fragment
    }
    compile(fragment){
        //递归去处理节点嵌套
        let childNodes = fragment.childNodes;
        Array.from(childNodes).forEach(node=>{
            if(this.isElementNode(node)){
                this.compile(node)
                console.log(node)
            }else {
                console.log(node)
            }
        })
    }
}
