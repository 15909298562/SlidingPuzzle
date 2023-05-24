<template>
    <div class="loginContainer">
        <div>
            <div class="usernameSpan">
                账号：<input name="username" class="username"/>
            </div>
            <div class="passwordSpan">
                密码：<input name="password" class="password"/>
            </div>
        </div>
        <div class="messageDiv" :style="{backgroundColor:messageDivBackgroundColor,visibility:messageDivVisibility}">
            <span class="messageSpan">{{ this.message }}</span>
        </div>
        <sliding-puzzle @success="success" @error="error"></sliding-puzzle>
    </div>
</template>

<script>
import SlidingPuzzle from '@/components/slidingPuzzle'
export default {
    name:'Login',
    components:{
        SlidingPuzzle: SlidingPuzzle
    },
    data(){
        return{
            message: "", //验证成功/失败的消息
            messageDivBackgroundColor: 'white', //验证成功/失败时的背景颜色
            messageDivVisibility: 'hidden', //验证成功/失败时消息是否显示
        }
    },
    methods:{
        /**
         * 验证成功
         * @param {*} message 
         */
        success(message){
            this.message = message + "!"
            this.messageDivBackgroundColor = '#8CDC8B'
            this.messageDivVisibility = 'visible'
            this.setMessageHidden()
        },
        /**
         * 验证失败
         * @param {*} message 
         */
        error(message){
            this.message = message + "!"
            this.messageDivBackgroundColor = '#FAA09D'
            this.messageDivVisibility = 'visible'
            this.setMessageHidden()
        },
        /**
         * 设置消息隐藏
         */
        setMessageHidden(){
            let target = this
            let timeout = window.setTimeout(function(){
                target.messageDivVisibility = 'hidden'
                clearTimeout(timeout)
            },800)
        }
    }
};
</script>

<style scoped>
    .loginContainer{
        margin-top: 100px;
    }
    .usernameSpan,.passwordSpan{
        margin: auto;
        width: 300px;
        margin-bottom: 20px;
    }
    .username,.password{
        width: 230px;
        height: 25px;
    }
    .messageDiv{
        position: absolute;
        margin-left: 525px;
        margin-top: -90px;
        width: 300px;
        height: 25px;
        text-align: center;
        z-index: 5;
    }
    .messageSpan{
        color: white;
    }
</style>
