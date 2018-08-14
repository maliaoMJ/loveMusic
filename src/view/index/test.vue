<template>
    <div class="playControl"  ref="playcontrol">
      <transition name="fade">
       <div v-show="flag"  class="fullControl">
       <div class="blur" :style="{background:'url('+currentSong.imgUrl+')'}">
       </div>
        <div class="box">
          <div class="header_full_control">
           <div class="left_icon" @click="_hiddenFull"><icon class="icon" name="chevron-down"></icon></div>
           <div class="name"><h3>{{currentSong.name?currentSong.name:'网易云听见好音乐'}}{{currentSong.singer?'-'+currentSong.singer:''}}</h3></div>
           <div class="left_icon" @click="_shareMusic"><icon class="icon" name="share-alt"></icon></div>
          </div>
          <div class="full_content_box">
             <div v-show="!lyricFlag" class="full_img_box" ref="fullimgbox">
               <img @click="lyricFlag=!lyricFlag" :src="currentSong.imgUrl?currentSong.imgUrl:'http://wanzao2.b0.upaiyun.com/14758515678631475754541_400x400.gif-460.gif'" alt="">
             </div>
             <div v-show="lyricFlag" @click="lyricFlag=!lyricFlag" class="full_lyic_box">
               <scroll class="lyric_scroll" :data="currentSongLyric?currentSongLyric&&currentSongLyric.lines:[]" ref="lyric">
                 <div>
                   <p ref="lyricLine" v-for="(line,index) in (currentSongLyric?currentSongLyric.lines:[])" :class="[currentLineNum===index?'active':'','default']">
                     {{currentSongLyric?line.txt:'暂无歌词数据'}}
                   </p>
                 </div>
               </scroll>
             </div>
          </div>
          <div class="full_control_box">
            <div class="process_box">
              <div class="left_time">{{_format(currentTime)}}</div>
              <div class="prograss">
                <prograss :percent="percent" @percentChange="onProgressBarChange"></prograss>
              </div>
              <div class="right_time">{{durationTime?_format(durationTime):'-- | --'}}</div>
            </div>
            <div class="control_menu_box">
              <div class="full_control_item"><div @click="collection=!collection"><icon name="heartbeat" :class="[collection?'collection':'','menu_list_item_icon']"></icon></div></div>
              <div class="full_control_item"><div class="needclick" @click="preMusic"><icon name="step-backward" class="menu_list_item_icon"></icon></div></div>
              <div class="full_control_item">
                <div v-show="play" @click="_pause"><icon  name="play" class="menu_list_item_icon play"></icon></div>
                <div v-show="!play" @click="_playing"><icon  name="pause" class="menu_list_item_icon play"></icon></div>
              </div>
              <div class="full_control_item"><div class="needclick" @click="nextMusic"><icon name="step-forward" class="menu_list_item_icon"></icon></div></div>
              <div class="full_control_item"><div><icon name="outdent" class="menu_list_item_icon"></icon></div></div>
            </div>
            <div class="full_control_bottom">
<!--版权-->
            </div>
          </div>
        </div>
      </div>
      </transition>
      <transition name="fade">
       <div v-show="!flag" class="minControl">
        <div class="min_img" ref="minimg">
          <img :src="currentSong.imgUrl?currentSong.imgUrl:'http://wanzao2.b0.upaiyun.com/14758515678631475754541_400x400.gif-460.gif'" alt="">
        </div>
        <div class="text" @click="_showFull">
          <h3 class="title">{{currentSong.name?currentSong.name:'网易云听见好音乐'}}{{currentSong.singer?'-'+currentSong.singer:''}}</h3>
          <p class="sub">{{currentLineText}}</p>
        </div>
        <div class="play_stop_icon_box">
          <div class="item_icon" v-show="play" @click="_pause"><icon class="play_icon" name="play-circle-o" ></icon></div>
          <div class="item_icon" v-show="!play" @click="_playing"><icon name="pause-circle-o" class="play_icon" ></icon></div>
        </div>
        <div class="play_list_music">
          <div class="list"><icon class="outdent" name="outdent"></icon></div>
        </div>
      </div>
      </transition>
      <audio :src="currentSong.MP3URL?currentSong.MP3URL:'no can music url'" hidden ref="audio" @canplay="_canReady" @timeupdate="_timeUpDate"
      @ended="songEnd"
      ></audio>
    </div>
</template>

<script>
    import scroll from '../../base/scroll/scroll.vue'
    import prograss from '../../base/prograss/prograss.vue'
    import Lyric from 'lyric-parser'
    export default {
      name: 'playControl',
      components: {
        prograss,
        scroll
      },
      data() {
        return {
          flag: false,
          collection: false,
          currentTime: '-- | --',
          durationTime: '-- | --',
          songReady: false,
          percent: 0,
          play: false,
          timer: '',
          lyricFlag: true,
          currentSongLyric: null,
          currentLineNum: 0,
          currentLineText: ''
        }
      },
      computed: {
        playMusic() {
          return this.$store.getters.getPlayState
        },
        fullFlag() {
          this.$nextTick(() => {
            if (this.$refs.lyric && this.flag) {
              this.$refs.lyric.refresh()
            }
          })
          return this.flag
        },
        playList() {
          return this.$store.getters.getPlayList
        },
        currentSong() {
          if (this.$store.getters.getPlayList[this.$store.getters.getPlayCurrentMusic]) {
            return this.$store.getters.getPlayList[this.$store.getters.getPlayCurrentMusic]
          } else {
            return {}
          }
        }
      },
      methods: {
        _initHeight() {
          if (this.flag) {
            this.$refs.playcontrol.style.height = '100%'
          } else {
            this.$refs.playcontrol.style.height = 'auto'
          }
        },
        _showFull() {
          this.flag = true
          this._initHeight()
          this.$nextTick(() => {
            if (this.$refs.lyric && this.flag) {
              this.$refs.lyric.refresh()
            }
          })
        },
        _pause() {
          this.$refs.lyric.refresh()
          clearTimeout(this.timer)
          if (!this.songReady) {
            return
          }
          if (this.$store.getters.getPlayList[this.$store.getters.getPlayCurrentMusic].MP3URL === null) {
            console.log('未获取MUSIC URL')
            return
          }
          this.$store.commit('setPlayState', false)
          this.play = false
          this.$refs.minimg.style.animationPlayState = `paused`
          this.$refs.fullimgbox.style.animationPlayState = `paused`
          this.$refs.audio.pause()
          this.currentSongLyric.togglePlay()
        },
        _playing() {
          clearTimeout(this.timer)
          if (!this.songReady) {
            this.songReady = true
            return
          }
          if (this.$store.getters.getPlayList[this.$store.getters.getPlayCurrentMusic].MP3URL === null) {
            console.log('未获取MUSIC URL')
            return
          }
          this.$store.commit('setPlayState', true)
          this.play = true
          this.$refs.minimg.style.animationPlayState = `running`
          this.$refs.fullimgbox.style.animationPlayState = `running`
          this.$refs.audio.play()
          this.currentSongLyric.togglePlay()
        },
        _hiddenFull() {
          this.flag = false
        },
        _shareMusic() {
          alert('This function has not been developed yet. Please wait for it By KaSa')
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
          this.$store.commit('setPlayState', true)
        },
        songEnd() {
          this.$refs.audio.currentTime = 0
          this.percent = 0
          this._pause()
          this.nextMusic()
        },
        preMusic() {
          this.$refs.lyric.refresh()
          let index = this.$store.getters.getPlayCurrentMusic
          if (index === 0) {
            index = this.$store.getters.getPlayList.length
          }
          this.$store.commit('setPlayCurrentMusic', index - 1)
        },
        nextMusic() {
          this.$refs.lyric.refresh()
          let index = this.$store.getters.getPlayCurrentMusic
          if (index === this.$store.getters.getPlayList.length - 1) {
            index = 0
            this.$store.commit('setPlayCurrentMusic', index)
          } else {
            this.$store.commit('setPlayCurrentMusic', index + 1)
          }
        },
        handlerLyric({lineNum, txt}) {
          this.currentLineNum = lineNum
          this.currentLineText = txt
          if (lineNum > 10) {
            let lineEl = this.$refs.lyricLine[lineNum - 10]
            this.$refs.lyric.scrollToElement(lineEl, 1000)
          } else {
            this.$refs.lyric.scrollTo(0, 0, 1000)
          }
        },
        getSongLyric(songId) {
          this.$http.get(`http://114.67.151.28:3000/lyric?id=${songId}`)
            .then(response => {
              this.currentSongLyric = new Lyric(response.data.lrc.lyric, this.handlerLyric)
              console.log(this.currentSongLyric)
            })
            .catch(error => {
              console.log(`获取歌词失败${error}`)
            })
        }
      },
      mounted() {
        this.$nextTick(() => {
        })
      },
      watch: {
        playMusic(newVal) {
          if (newVal) {
            this.$nextTick(() => {
              clearTimeout(this.timer)
              this.timer = setTimeout(() => {
              }, 1000)
            })
          } else {
            this._pause()
          }
        },
        currentSong(newVal) {
          this.$nextTick(() => {
            if (this.currentSongLyric) {
              this.currentSongLyric.stop()
              this.currentLineNum = 0
            }
            clearTimeout(this.timer)
            this.getSongLyric(this.currentSong.id)
            this.timer = setTimeout(() => {
              if (this.$refs.lyric) {
                this.$refs.lyric.refresh()
              }
              this._playing()
            }, 1000)
          })
        }
      }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
  .playControl
    width:100%;
    height:auto;
    overflow hidden;
    .fullControl
     width:100%;
     height:100%;
     z-index 999;
     background-size :100% 100%;
     background-attachment fixed;
     position:fixed;
     top:0px;
     left:0px;
     overflow hidden;
     .blur
      background:rgba(0,0,0,0.6);
      position:absolute;
      top:0;
      left:0px;
      width:100%;
      height:100%;
      -webkit-filter: blur(10px);
      filter: blur(10px);

      background-repeat no-repeat;
      background-attachment fixed;
      overflow hidden;
     .box
      width:100%;
      height:100%;
      position:absolute;
      left:0px;
      top:0px;
      display flex;
      flex-direction column;
      background:rgba(0,0,0,0.8);
      .header_full_control
       height:40px;
       width:100%;
       display flex;
       border-bottom:1px solid rgba(255,255,255,0.5);
       box-sizing :border-box;
       z-index 999;
       .left_icon
        width:40px;
        height:40px;
        .icon
         display block;
         width:22px;
         height:22px;
         margin:9px;
       .name
        flex:1;
        h3
         text-align center;
         line-height :40px;
         text-overflow: ellipsis;
         overflow hidden;
         white-space nowrap;

      .full_content_box
       flex:1;
       width:100%;
       overflow hidden;
       .full_img_box
        width:86vw;
        height:86vw;
        border-radius :86vw;
        margin:50px auto;
        animation imgRotate 8s linear;
        animation-fill-mode:backwards;
        animation-play-state:paused;
        animation-iteration-count:infinite;
        border:25px solid black;
        box-sizing border-box;
        img
          width:100%;
          height:100%;
          -webkit-border-radius: 86vw
          -moz-border-radius: 86vw
          border-radius: 86vw
       .full_lyic_box
        width:100%;
        height:95%;
        margin-top :20px;
        overflow hidden;
        text-align :center;
        position:relative;
        .lyric_scroll
         width:100%;
         height:100%;
         overflow hidden;
         .default
          line-height :20px;
          height:auto;
          z-index :10;
          color: #8c9586;
          &.active
            color:red;
      .full_control_box
       height:100px;
       width:100%;
       display flex;
       flex-direction column;
       z-index :999;
       .process_box
        height:40px;
        width:100%;
        display flex;
        flex-direction row;
        .left_time
         width:55px;
         height:40px;
         text-align :center;
         line-height :40px;
         font-size :12px;
        .prograss
          flex:1;
          padding-top :5px;
        .right_time
          width:55px;
          height:40px;
          text-align :center;
          line-height :40px;
          font-size :12px;
       .control_menu_box
        flex:1;
        width:100%;
        height:100%;
        display flex;
        flex-direction row;
        .full_control_item
         flex:1;
         line-height :50px;
         text-align center;
         .menu_list_item_icon
          margin:13px auto;
          width:25px;
          height:25px;
          color:white;
          &.play
           width:25px;
           height:25px;
          &.collection
           color:red;
       .full_control_bottom
        height:20px;
        width:100%;


    .minControl
     width:100%;
     height:50px;
     position:fixed;
     bottom:0px;
     left:0px;
     z-index 999;
     display flex;
     border-top 1px solid gray;
     box-sizing :border-box;
     background :white;
     .min_img
      width:50px;
      height:50px;
      animation:imgRotate 4s linear;
      animation-iteration-count:infinite;
      animation-fill-mode:backwards;
      animation-play-state:paused;
      img
       width:80%;
       height:80%;
       margin:10%;
       border-radius :50%;
       border:2px solid #715d59;
       box-sizing border-box;
     .text
      flex:1;
      .title
        width:180px;
        font-size:16px;
        color: black;
        padding-top 9px;
        text-overflow ellipsis;
        overflow hidden;
        white-space:nowrap;
       .sub
        width:180px;
        font-size :12px;
        color:darkgray;
        padding-top :7px;
        text-overflow ellipsis;
        overflow hidden;
        white-space:nowrap
     .play_stop_icon_box
      width:40px;
      height:50px;
      .item_icon
       width:100%;
       height:100%;
       .play_icon
        display block;
        width:25px;
        height:25px;
        margin:13px auto;
        color: #8e8684;
     .play_list_music
      width:40px;
      height:50px;
      .list
       width:100%;
       height:100%;
       .outdent
        width:25px;
        height:25px;
        margin:13px auto;
        margin-left:8px;
        color:#8e8684;
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
     opacity: 0
    }
  @keyframes imgRotate {
    0% {transform: rotate(0)}
    100% {transform : rotate(360deg)}
  }
</style>
