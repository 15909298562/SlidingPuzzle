<template>
    <div ref="container" class="container" @mouseover="sliderBoxMousOver">
        <div class="canvasGraphical" :style="{display:canvasGraphicalDisplay}">
            <span>
                <img class="refreshImage" :src="refreshImge" @click="initCanvas"/>
            </span>
            <canvas id="leftGraphical" :style="{marginLeft:leftGraphicalMarginLeft+'px'}" class="leftGraphical" ref="leftGraphical"/>
            <canvas id="rightGraphical" class="rightGraphical" ref="rightGraphical"/>
        </div>
        <div ref="sliderBox" class="sliderBox">
            <div class="statusDiv" :style="{backgroundColor:statusDivBackgroundColor,width: statusDivWidth+'px'}"></div>
            <div ref="sliderBoxBlock" :style="{marginLeft:sliderBoxBlockMarginLeft+'px'}" class="sliderBox-block" @mousedown="listenMouseMove">
                <img class="sliderBox-block-img" :src="directionImg" draggable="false"/>
            </div>
            <span class="prompt" :style="{visibility:promptVisibility}">向右拖动滑块填充拼图</span>
        </div>
    </div>
</template>

<script>
export default {
    name:'MyDemo',
    data(){
        return{
            imags:[
                require('@/assets/backgroundImg/1.jpg'),
                require('@/assets/backgroundImg/2.jpg'),
                require('@/assets/backgroundImg/3.jpg'),
                require('@/assets/backgroundImg/4.jpg'),
                require('@/assets/backgroundImg/5.jpg'),
            ],
            directionImg: require('@/assets/direction.png'), //滑块图标
            refreshImge: require('@/assets/refresh.png'), //刷新按钮
            mouseClickScreenX: 0, //鼠标在滑块上按下的刹那距离屏幕左侧的位置
            mouseMove: 0, //鼠标移动的距离（鼠标当前位置-鼠标在滑块上按下时的位置就是鼠标移动的距离）
            leftGraphical: undefined, //左侧的canvas
            rightGraphical: undefined, //右侧的canvas
            sliderBoxBlock: undefined, //滑块
            sliderBox: undefined, //滑块容器
            container: undefined, //顶层容器
            sliderBoxBlockCanBind: true, //滑块能不能绑定监听事件
            imageWidth: 300, //canvas图片宽
            imageHeight: 150, //canvas图片高
            sliderBoxBlockMarginLeft: 0, //滑块margin-left属性
            leftGraphicalMarginLeft: 0, //左侧canvas的margin-left属性
            statusDivWidth: 0, //状态栏的宽度
            statusDivBackgroundColor: '#A2A6FA', //状态栏的颜色
            leftGraphicalPosition: 0, //左侧canvas初始化时距离容器左侧边界的距离
            rightGraphicalPosition: 0, //左侧canvas初始化时距离容器右侧边界的距离
            promptVisibility: 'visible', //提示是否显示
            xPosition: 0, //右侧canvas生成时的x坐标
            yPosition: 0, //右侧canvas生成时的y坐标
            canvasGraphicalDisplay: 'none', //canvas默认影藏掉,
        }
    },
    mounted() {
        this.leftGraphical = this.$refs.leftGraphical
        this.rightGraphical = this.$refs.rightGraphical
        this.sliderBoxBlock = this.$refs.sliderBoxBlock
        this.sliderBox = this.$refs.sliderBox
        this.container = this.$refs.container
        this.container.addEventListener('mouseout',this.sliderBoxMouseOut)
        this.initCanvas()
    },
    methods:{
        /**
         * 监听鼠标移动
         * @param {*} event 
         */
        listenMouseMove(event){
            this.mouseClickScreenX = event.screenX
            //加这个判断是为了防止鼠标松开的瞬间再次点击滑块出现的问题
            if(this.sliderBoxBlockCanBind){
                //鼠标也要绑定要document元素上面，如果鼠标移动到滑块外面了就移动不了了
                document.addEventListener('mousemove',this.sliderMove)
                /**
                 * 绑定鼠标松开的方法一定要在document上面绑，因为如果用户把鼠标移动到了滑块的外面
                 * 那么就监听不到鼠标松开的动作了，因为动作绑定在滑块上，而此时动作发生在滑块之外
                 */
                document.addEventListener('mouseup',this.removeListenMouseMove)
            }
        },
        /**
         * 鼠标移动的方法
         * @param {*} event 
         */
        sliderMove(event){
            this.container.removeEventListener('mouseout',this.sliderBoxMouseOut)
            if(this.leftGraphicalMarginLeft > 0){
                this.promptVisibility = 'hidden'
            }
            if(this.leftGraphicalMarginLeft == 0){
                this.promptVisibility = 'visible'
            }
            let currentMouseScreenX = event.screenX
            this.mouseMove = currentMouseScreenX - this.mouseClickScreenX
            if(this.mouseMove >= 0 && this.mouseMove <= 260){
                this.sliderBoxBlockMarginLeft = this.mouseMove
                this.statusDivWidth = this.mouseMove
            }
            /**
             * 下面两个if比较重点，是为了解决当鼠标移动过快mousemove反应不过来的办法，当鼠标的范围在滑块的范围之外的时候
             * 空白区域还是比较大的，mousemove总会有一次执行的时候吧，执行就把缺失的距离给补上
             */
            if(this.mouseMove < 0 && this.sliderBoxBlockMarginLeft > 0){
                this.sliderBoxBlockMarginLeft = 0
                this.statusDivWidth = 0
            }
            if(this.mouseMove >260 && this.sliderBoxBlockMarginLeft < 260){
                this.sliderBoxBlockMarginLeft = 260
                this.statusDivWidth = 260
            }
            //左侧canvas移动的距离
            let leftGraphicalPositionMove = this.imageWidth - 50 - this.leftGraphicalPosition
            let leftGraphicalMove = this.mouseMove/260*leftGraphicalPositionMove
            let leftGraphicalMarginLeft = leftGraphicalMove < 0 ? 0 : (leftGraphicalMove > leftGraphicalPositionMove ? leftGraphicalPositionMove : leftGraphicalMove)
            this.leftGraphicalMarginLeft = leftGraphicalMarginLeft
            if(this.leftGraphicalMarginLeft > 0){
                this.canvasGraphicalDisplay = 'block'
            }
        },
        /**
         * 移除鼠标移动的方法
         */
        removeListenMouseMove(){
            document.removeEventListener('mousemove',this.sliderMove)
            document.removeEventListener('mouseup',this.removeListenMouseMove)
            //判断左右canvas图形是否重合，有5像素的容错空间,+2是因为左侧canvas挖图的时候向左挪动了2像素，-3是因为边框的宽度，5是容错空间
            this.xPosition == this.leftGraphicalMarginLeft+this.leftGraphicalPosition
            let status = 0
            //当滑块移动了大于0个像素时才执行，防止在没有移动纯粹单击鼠标时造成的问题
            if(this.leftGraphicalMarginLeft > 0 && this.yPosition - 15 == this.rightGraphicalPosition){
                this.sliderBoxBlockCanBind = false
                let minXPosition = this.leftGraphicalMarginLeft + this.leftGraphicalPosition + 2 - 3 - 5
                let maxXPosition = this.leftGraphicalMarginLeft + this.leftGraphicalPosition + 2 + + 3 + 5
                if(minXPosition <= this.xPosition && maxXPosition >= this.xPosition){
                    this.directionImg = require('@/assets/prompt/success.png')
                    this.statusDivBackgroundColor = '#68E06E'
                    this.$emit("success","验证成功")
                }else{
                    this.promptVisibility = 'hidden'
                    this.directionImg = require('@/assets/prompt/error.png')
                    this.statusDivBackgroundColor = '#E6564E'
                    this.$emit("error","验证失败")
                }
                status = 1
            }
            let target = this
            let timeout = window.setTimeout(function(){
                target.container.addEventListener('mouseout',target.sliderBoxMouseOut)
                if(status == 1){
                    target.mouseMove = 0
                    target.sliderBoxBlockMarginLeft = target.mouseMove
                    target.leftGraphicalMarginLeft = target.mouseMove
                    target.statusDivWidth = target.mouseMove
                    target.promptVisibility = 'visible'
                    target.directionImg = require('@/assets/direction.png')
                    target.statusDivBackgroundColor = '#A2A6FA'
                    target.sliderBoxBlockCanBind = true
                    target.initCanvas()
                    clearTimeout(timeout)
                }
            },1000)
            this.mouseMove = 0
        },
        /**
         * 初始化canvas
         */
        initCanvas(){
            let target = this
            let img = new Image()
            img.setAttribute("crossOrigin", "anonymous");
            img.src = this.randomImage()
            img.width = target.imageWidth
            img.height = target.imageHeight
            img.onload = function(){
                target.xPosition = Math.floor(Math.random()*71) + 150
                target.yPosition = Math.floor(Math.random()*51) + 40

                //右边图形
                let rightContext = target.rightGraphical.getContext('2d')
                target.rightGraphical.width = target.imageWidth
                rightContext.beginPath()
                rightContext.moveTo(target.xPosition,target.yPosition)
                rightContext.lineTo(target.xPosition+10,target.yPosition)
                rightContext.arc(target.xPosition+20,target.yPosition,10,1*Math.PI,2*Math.PI)
                rightContext.lineTo(target.xPosition+40,target.yPosition)
                rightContext.lineTo(target.xPosition+40,target.yPosition+10)
                rightContext.arc(target.xPosition+40,target.yPosition+20,10,1.5*Math.PI,0.5*Math.PI)
                rightContext.lineTo(target.xPosition+40,target.yPosition+40)
                rightContext.lineTo(target.xPosition+30,target.yPosition+40)
                rightContext.bezierCurveTo(target.xPosition+30,target.yPosition+30,target.xPosition+10,target.yPosition+30,target.xPosition+10,target.yPosition+40)
                rightContext.lineTo(target.xPosition,target.yPosition+40)
                rightContext.closePath()
                rightContext.lineWidth = 2
                rightContext.strokeStyle = "white"
                rightContext.stroke()
                rightContext.fillStyle = "rgba(0, 0, 0, 0.6)"
                rightContext.fill()
                rightContext.globalCompositeOperation="destination-over"
                rightContext.drawImage(img,0,0,target.imageWidth,target.imageHeight);

                //左边图形
                let leftContext = target.leftGraphical.getContext('2d')
                leftContext.beginPath()
                leftContext.moveTo(target.xPosition,target.yPosition)
                leftContext.lineTo(target.xPosition+10,target.yPosition)
                leftContext.arc(target.xPosition+20,target.yPosition,10,1*Math.PI,2*Math.PI)
                leftContext.lineTo(target.xPosition+40,target.yPosition)
                leftContext.lineTo(target.xPosition+40,target.yPosition+10)
                leftContext.arc(target.xPosition+40,target.yPosition+20,10,1.5*Math.PI,0.5*Math.PI)
                leftContext.lineTo(target.xPosition+40,target.yPosition+40)
                leftContext.lineTo(target.xPosition+30,target.yPosition+40)
                leftContext.bezierCurveTo(target.xPosition+30,target.yPosition+30,target.xPosition+10,target.yPosition+30,target.xPosition+10,target.yPosition+40)
                leftContext.lineTo(target.xPosition,target.yPosition+40)
                leftContext.closePath()
                leftContext.strokeStyle = "white"
                leftContext.lineWidth = 3
                leftContext.stroke()
                leftContext.clip()
                leftContext.drawImage(img,0,0,target.imageWidth,target.imageHeight)
                let imgData = leftContext.getImageData(target.xPosition-2,target.yPosition-15,60,60)
                target.leftGraphical.width = target.imageWidth
                target.leftGraphicalPosition = Math.floor(Math.random()*11)+40
                target.rightGraphicalPosition = target.yPosition-15
                leftContext.putImageData(imgData,target.leftGraphicalPosition,target.rightGraphicalPosition)
            }
        },
        /**
         * 随机背景图片
         */
        randomImage(){
            let index = Math.floor(Math.random()*5)
            return this.imags[index]
        },
        /**
         * 鼠标放在滑块容器上时执行的方法
         */
        sliderBoxMousOver(){
            //为什么要在这个地方绑定鼠标移出事件呢，因为当其他组件引用这个组件的时候，当鼠标移动到canvas上面时右键释放了
            //刚好上层组件有个元素把这个canvas遮住了，那么就会触发移出事件，这样canvas就被隐藏了
            //this.container.addEventListener('mouseout',this.sliderBoxMouseOut)
            this.canvasGraphicalDisplay = 'block'
        },
        /**
         * 鼠标移出滑块容器上时执行的方法
         */
        sliderBoxMouseOut(event){
            let minX = this.sliderBox.offsetLeft
            let maxX = minX + 300
            let minY = this.sliderBox.offsetTop - 5 - 150
            let maxY = minY + 150 + 5 + 40
            let clientX = event.clientX
            let clientY = event.clientY
            console.log("minx="+minX+",maxx="+maxX+";miny="+minY+",maxy="+maxY)
            console.log("clientx="+clientX+";clienty="+clientY)
            if(clientX <= minX || clientX >= maxX || clientY <= minY || clientY >= maxY){
                this.canvasGraphicalDisplay = 'none'
            }
        }
    }
};
</script>

<style scoped>
    .container{
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        width: 300px;
        margin: auto;
    }
    .sliderBox{
        border: 1px;
        width: 300px;
        height: 40px;
        margin: auto;
        border-style: solid;
        margin-top: 5px;
        background-color: rgb(230, 226, 226);
    }
    .sliderBox-block{
        width: 40px;
        height: 40px;
        background-color: rgb(156, 156, 241);
        margin-top: -40px;
    }
    .sliderBox-block-img{
        width: 30px;
        height: 30px;
        display: block;
        margin: auto;
        padding-top: 5px;
        padding-bottom: 5px;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .canvasGraphical{
        width: 300px;
        height: 150px;
        margin-top: -155px;
        display: none;
    }
    .leftGraphical{
        position: absolute;
        z-index: 2;
    }
    .statusDiv{
        height: 40px;
    }
    .prompt{
        position: absolute;
        margin-top: -28px;
        margin-left: 100px;
        font-size: 12px;
    }
    .refreshImage{
        position: absolute;
        height: 30px;
        width: 30px;
        z-index: 3;
        margin-left: 265px;
    }
</style>
