<template>
	<div class="homePage">
      <div class="lvBox"></div>
	  <div class="contentBox">
		  <app-header centerTitle="明若清渊"></app-header>
		  <div class="swiperBox">
			  <cube-slide ref="slide" class="swiper" :initial-index="1" :loop="false" :auto-play="false">
				<cube-slide-item>
				  <div class="musicWrpper">
                     <img src="./love.jpg" alt="">
				  </div>
				</cube-slide-item>
				<cube-slide-item>
				  <div class="musicLrc">
                    <scroll class="lyric_scroll" :data="currentSongLyric?currentSongLyric&&currentSongLyric.lines:[]" ref="lyric">
                 <div>
                   <p ref="lyricLine" v-for="(line,index) in (currentSongLyric?currentSongLyric.lines:[])" :class="[currentLineNum===index?'active':'','default']">
                     {{currentSongLyric?line.txt:'暂无歌词数据'}}
                   </p>
                 </div>
               </scroll>
				  </div>
				</cube-slide-item>
				<cube-slide-item>
				  <div class="musicWrpper">
                     <img src="./test.jpg" alt="">
				  </div>
				</cube-slide-item>
			  </cube-slide>
		  </div>
		  <div class="toolBox">
			  <div class="prograssBox">
				  <div class="beginTime">{{_format(currentTime)}}</div>
				  <div class="prograss"><prograss
				  :percent="percent"
				  @percentChange="onProgressBarChange"
				  ></prograss></div>
				  <div class="totalTime">{{_format(durationTime)}}</div>
			  </div>
			  <div class="buttonBox">
				  <div class="favorite">
					  <i class="fa fa-heart"></i>
					  </div>
				  <div class="controlBox">
					  <div class="item">
						  <i class="fa fa-backward"></i>
					  </div>
					  <div class="item" @click="palyMusic">
						  <i class="fa fa-play" v-show="!flag" ></i>
						  <i class="fa fa-pause" v-show="flag" ></i>
					  </div>
					  <div class="item">
						  <i class="fa fa-forward"></i>
					  </div>
				  </div>
				  <div class="list">
					  <li class="fa fa-list"></li>
				  </div>
			  </div>
		  </div>
	  </div>
	      <audio src="love.mp3" hidden ref="audio" @canplay="_canReady" @timeupdate="_timeUpDate"
      @ended="songEnd"
      ></audio>
	</div>
</template>
<script>
	import scroll from './components/scroll'
	import appHeader from './components/AppHeader'
	import prograss from './components/prograss'
	import Lyric from 'lyric-parser'
	import lyricData from './components/lyric.json'
import { setTimeout } from 'timers';
	export default {
		name:"index",
		components: {
			appHeader,
			prograss,
			scroll
		},
		data() {
			return {
				flag: false,
				currentTime: '-- | --',
				durationTime: '-- | --',
				songReady: false,
				percent: 0,
				timer: '',
				currentSongLyric: null,
				currentLineNum: 0,
				currentLineText: ''
			}
    },
    computed:{
      palyMusicWatch(){
        return this.flag
      },
      nowTime(){
        return this.currentTime
      }
    },
		methods:{
			percentChange(value){
				console.log(value)
			},
			palyMusic(){
				if(this.flag){
					this.$refs.audio.pause()
           this.flag = false
           if(this.currentSongLyric){
             this.currentSongLyric.stop()
           }
				}else{
					if(!this.songReady) return false
					this.$refs.audio.play()
					this.flag = true
					this.getSongLyric()
					setTimeout(()=> {
            this.$refs.lyric.refresh()
          // this.currentSongLyric.seek(this.currentTime * 1000)
          },200)
          if(this.currentSongLyric){
            this.onProgressBarChange(this.percent)
          }
				}
			},
      _showFull() {
            this.flag = true
            // this._initHeight()
            this.$nextTick(() => {
              if (this.$refs.lyric && this.flag) {
                this.$refs.lyric.refresh()
              }
            })
          },
        handlerLyric({lineNum, txt}) {
          this.currentLineNum = lineNum
          this.currentLineText = txt
          if (lineNum > 7) {
            let lineEl = this.$refs.lyricLine[lineNum - 7]
            this.$refs.lyric.scrollToElement(lineEl, 1000)
          } else {
            this.$refs.lyric.scrollTo(0, 0, 1000)
          }
        },
        getSongLyric() {
          this.currentSongLyric = new Lyric(lyricData.lrc.lyric, this.handlerLyric)
        },
        _canReady() {
              this.songReady = true
            },
        _timeUpDate() {
              this.currentTime = this.$refs.audio.currentTime
              this.durationTime = this.$refs.audio.duration
              if (this.currentTime && this.durationTime) {
                this.percent = this.currentTime / this.durationTime
              }
            },
        _pad(num, n = 2) {
          let len = num.toString().length
          while (len < n) {
            num = '0' + num
            len++
          }
          return num
        },
        _format(interval) {
          interval = interval | 0
          const minute = interval / 60 | 0
          const second = this._pad(interval % 60)
          return `${minute}:${second}`
        },
        onProgressBarChange(percent) {
          const CurrentTime = percent * this.$refs.audio.duration
          this.$refs.audio.currentTime = CurrentTime
          if (this.currentSongLyric) {
            this.currentSongLyric.seek(CurrentTime * 1000)
          }
        },
        _pause(){
          this.$refs.audio.pause();
          this.currentSongLyric.stop();
          this.onProgressBarChange(0);
        },
        songEnd() {
          this.$refs.audio.currentTime = 0
          this.percent = 0
          this._pause()
        }
  },
  watch:{
 
  }
}
</script>
<style lang="scss" scoped>
.homePage {
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  .lvBox {
    width: 120%;
    height: 120%;
    position: absolute;
    top: -10%;
    left: -10%;
    background-image: url('./love.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    -webkit-filter: blur(5px);
    -moz-filter: blur(5px);
    -o-filter: blur(5px);
    -ms-filter: blur(5px);
    filter: blur(15px);
    background-color: rgba(0, 0, 0, 0.5);
    overflow: hidden;
    z-index: 10;
  }
  .contentBox {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 20;
    background-color: rgba(0, 0, 0, 0.3);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .swiperBox {
      width: 100%;
      flex: 1;
      max-height: 70vh;
      .swiper {
        width: 100%;
        height: 100%;
        .musicLrc {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
          padding-top: 20px;
          padding-bottom: 20px;
          box-sizing: border-box;
        }
        .lyric_scroll {
          width: 100%;
          height: 100%;
          // overflow: hidden;
          font-size: 14px;
          .default {
            line-height: 28px;
            height: auto;
            z-index: 10;
            font-size: 16px;
            color: #e2e2e2;
            &.active {
              color: red;
            }
          }
        }
        .musicWrpper {
          width: 100%;
          height: 100%;
          position: relative;
        }
        img {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          border: 50px solid black;
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          animation: myrotate 8s linear infinite forwards;
        }
      }
    }
    .toolBox {
      width: 100%;
      height: 110px;
      position: absolute;
      bottom: 0;
      padding-top: 10px;
      .prograssBox {
        height: 30px;
        width: 100%;
        display: flex;
        flex-direction: row;
        .beginTime,
        .totalTime {
          width: 50px;
          height: 30px;
          font-size: 10px;
          color: #fff;
          line-height: 30px;
        }
        .prograss {
          flex: 1;
        }
      }
      .buttonBox {
        margin-top: 10px;
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: row;
        .favorite,
        .list {
          width: 50px;
          height: 50px;
          line-height: 50px;
          color: #fff;
          font-size: 18px;
        }
        .controlBox {
          flex: 1;
          display: flex;
          flex-direction: row;
          .item {
            flex: 1;
            line-height: 50px;
            color: #fff;
          }
        }
      }
    }
  }
}
@keyframes myrotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>