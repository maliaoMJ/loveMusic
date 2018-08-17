<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .cube-slide-dots{
    bottom:10px;
  }
  .cube-dialog-btn{
    color:#6f6966!important;
  }
  .cubeic-like{
    color:red!important;
  }
  .cube-slide-dots>span{
      display:inline-block;
      width:10px!important;
      height:8px!important;
      border-radius: 5px;
      margin: 2px;
      background:rgba(249, 249, 248, 0.7)!important;
      &.active{
        width:15px!important;
        background:#fff!important;
      }
	}
}
</style>
