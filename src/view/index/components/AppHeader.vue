<template>
	<div class="appHeader">
		<div class="leftBox" @click="leftClick">
			<i :class="['fa',leftIconName]"></i>
		</div>
		<div class="centerBox"><h5 @click="centerClick">{{centerTitle}}</h5></div>
		<div class="rightBox" @clcik="rightClick">
			<i :class="['fa',rightIconName]"></i>
		</div>
	</div>
</template>

<script>
	export default {
    name:'appHeader',
    props:{
      leftIconName:{
        type:String,
        default:'fa-arrow-left'
      },
      rightIconName:{
        type:String,
        default: 'fa-paper-plane'
      },
      centerTitle:{
        type:String,
        default:'App Header Title'
      }
    },
    methods:{
    	leftClick(){
    		this.$emit('goBack')
    	},
    	rightClick(){
    		this.$emit('goShare')
    	},
    	centerClick(){
    		this.$emit('clickTitle')
    	}
    }
	}
</script>

<style scoped lang="scss">
.appHeader {
  background: transparent;
  width: 100%;
  height: 60px;
  display: flex;
  color: #fff;
  top: 0;
  left: 0;
  border-bottom: 1px solid rgba(144, 137, 137, 0.8);
  box-sizing: border-box;
  z-index: 333;
  .leftBox,
  .rightBox {
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    i {
      font-size: 20px;
    }
  }
  .centerBox {
    flex: 1;
    line-height: 60px;
    h5 {
      font-size: 18px;
      max-width: 300px;
      height: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>