<template>
  <div class="player" v-show="playList.length>0">
    <div class="normal-player" v-if="fullScreen">
      <div class="top">
        <div class="back" @click="back">
          <span class="icon-back"></span>
        </div>
        <h2 class="song" v-html="currentSong.name"></h2>
        <h3 class="singer" v-html="currentSong.singer"></h3>
      </div>
      <div class="middle">
        <div class="middle-l" v-show="toggleShow">
          <div class="cd-box">
            <div class="cd" :class="handleRotate">
              <img :src="currentSong.image" alt="#">
            </div>
          </div>
        </div>
        <Scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines" >
          <div class="lyric-wrapper">
            <div v-if="currentLyric">
              <p ref="lyricLine"
                 class="text"
                 :class="{'current' : currentLineNum == index}"
                 v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
            </div>
          </div>
        </Scroll>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot" :class="{'active':currentShow==='cd'}" @click="gotocd" ></span>
          <span class="dot" :class="{'active':currentShow==='lyric'}" @click="gotoLyric" ></span>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l">{{format(currentTime)}}</span>
          <div class="progress-bar-wrapper">
            <process-bar :percent="percent" @changePercent="onProgressBarChange"></process-bar>
          </div>
          <span class="time time-r">{{format(currentSong.duration)}}</span>
        </div>
        <div class="operator">
          <div class="icon i-left">
            <i class="icon-sequence"></i>
          </div>
          <div class="icon i-left" @click.stop="prev">
            <i class="icon-prev"></i>
          </div>
          <div class="icon i-center" @click.stop="handlePlaying">
            <i :class="iconPlay"></i>
          </div>
          <div class="icon i-right" @click.stop="next">
            <i class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i class="icon-not-favorite"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="mini-player" v-show="!fullScreen" @click="open">
      <div class="icon" :class="handleRotate">
        <img width="40" height="40" :src="currentSong.image">
      </div>
      <div class="text">
        <h2 class="name" v-html="currentSong.name"></h2>
        <p class="desc" v-html="currentSong.singer"></p>
      </div>
      <div class="control">
        <!--<progress-circle>-->
          <i @click.stop="handlePlaying" :class="miniIcon"></i>
        <!--</progress-circle>-->
      </div>
      <div class="control">
        <i class="icon-playlist"></i>
      </div>
    </div>
    <audio :src="currentSong.url" ref="audio" @timeupdate="updatetime" @ended="end"></audio>
  </div>
</template>
<script>
  import {mapGetters,mapMutations} from 'vuex'
  import ProcessBar from 'base/process/process-bar'
  import Lyric from 'lyric-parser'
  import Scroll from 'base/scroll/scroll'

  export default {
      data(){
          return {
              currentTime:0,
              currentLyric:null,
              currentLineNum:0,
              playLyric:'',
              currentShow: 'cd',
              toggleShow:true
          }
      },
      computed: {
          iconPlay(){
              return this.playing ? 'icon-pause' : 'icon-play'
          },
          miniIcon(){
              return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
          },
          handleRotate(){
              return this.playing ? 'play' : 'play pause'
          },
          percent(){
              return this.currentTime / this.currentSong.duration
          },
          ...mapGetters([
              'fullScreen',
              'playList',
              'currentSong',
              'playing',
              'currentIndex'
          ])
      },
      methods: {
          gotocd(){
              this.toggleShow = true;
              this.currentShow = 'cd';
          },
          gotoLyric(){
              this.toggleShow = false;
              this.currentShow = 'lyric'
          },
          back(){
//              console.log(this.currentSong)
              this.setFullScreen(false)
          },
          open(){
              this.setFullScreen(true)
          },
          handlePlaying(){
              this.setPlaying(!this.playing)
//            this.$store.commit('setPlaying',)
              if(this.currentLyric){
                  this.currentLyric.togglePlay();
              }
          },
          end(){
              this.next();
          },
          next(){
              let currentIndex = this.currentIndex + 1;
              if(currentIndex == this.playList.length){
                  currentIndex = 0;
              }
//              this.$store.commit('setCurrentIndex',currentIndex)
              this.setCurrentIndex(currentIndex)
              this.setPlaying(true)
          },
          prev(){
              let currentIndex = this.currentIndex - 1;
              if(currentIndex == -1){
                  currentIndex = this.playList.length - 1;
              }
//            this.$store.commit('setCurrentIndex',currentIndex)
              this.setCurrentIndex(currentIndex)
              this.setPlaying(true)
          },//audio标签中有currentTime属性,记录歌曲播放的时间
          updatetime(e){
              this.currentTime = e.target.currentTime
          },//将歌曲总时间和播放时间格式化成我们想要的时间格式
          format(time){
              let times = Math.floor(time);
              let minute = Math.floor(times / 60);
              let second = ('0' + times % 60).slice(-2);//将时间保存为两位
              return `${minute}:${second}`
          },
          _getLyric(){
              this.currentSong.getLyric().then((lyric) =>{
//                  if(this.currentSong.lyric === lyric){
//                      return
//                  }
                  this.currentLyric = new Lyric(lyric,this.handleLyric)
                  console.log(this.currentLyric);
                  if(this.playing){
                      this.currentLyric.play()
                  }
              })
          },
          handleLyric({lineNum,txt}){
              this.currentLineNum = lineNum;
              if(lineNum > 5) {
                  let lineEl = this.$refs.lyricLine[lineNum -5];
                  this.$refs.lyricList.scrollToElement(lineEl,1000);
              }else{
                  this.$refs.lyricList.scrollTo(0,0,1000)
              }
              this.playingLyric = txt
          },
          onProgressBarChange(percent) {
            const currentTime = this.currentSong.duration * percent;
            this.$refs.audio.currentTime = currentTime;
            if(!this.playing){
                this.handlePlaying();
            }
          },
          ...mapMutations({
              setFullScreen:'SET_FULL_SCREEN',
              setPlaying:'SET_PLAYING_STATE',
              setCurrentIndex: 'SET_CURRENT_INDEX'
          })
      },
      watch:{
          currentSong(){
              this._getLyric()
              this.$nextTick(()=>{
                  this.$refs.audio.play()
              })
          },
          playing(newPlayingState){
              const audio = this.$refs.audio
              this.$nextTick(()=>{
                  newPlayingState ? audio.play() : audio.pause()
              })
          }
      },
      components: {
          ProcessBar,
          Scroll
      }
  }
</script>
<style scoped>
  .player .normal-player{
    position: fixed;
    left:0;
    right:0;
    top:0;
    bottom:0;
    background: #222;
    z-index:999;
  }
  .player .normal-player .top{
    position: relative;
    margin-bottom:25px;
  }
  .player .normal-player .top .back{
    position:absolute;
    left:6px;
    top:0;
  }
  .player .normal-player .top .back .icon-back{
    padding:9px;
    display:block;
    font-size:22px;
    color:#ffcd32;
    transform: rotate(-90deg);
  }
  .player .normal-player .top .song,
  .player .normal-player .top .singer{
    width:70%;
    margin:0 auto;
    text-align: center;
    line-height:40px;
    font-size:18px;
    color:#fff;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    /*height:20px;*/
  }
  .player .normal-player .top .singer{
    line-height:20px;
    font-size:14px;
  }
  .normal-player .middle{
    position: fixed;
    width: 100%;
    top: 80px;
    bottom: 170px;
    white-space: nowrap;
  }
  .normal-player .middle .middle-l{
    display: inline-block;
    vertical-align: top;
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 80%;
  }
  .middle .middle-l .cd-box{
    position: absolute;
    left: 10%;
    top: 0;
    width: 80%;
    height: 100%;
  }
  .middle .middle-l .cd-box .cd{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 10px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
  .middle .middle-l .cd-box .cd img{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .normal-player .bottom{
    position: absolute;
    bottom: 50px;
    width: 100%;
  }
  .middle-r{
    display: inline-block;
    vertical-align: top;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .middle-r .lyric-wrapper{
    width: 80%;
    margin: 0 auto;
    overflow: hidden;
    text-align: center;
  }
  .middle-r .lyric-wrapper .text{
    line-height: 32px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;

  }
  .middle-r .lyric-wrapper .current{
    color: #fff;
  }
  .normal-player .bottom .operator{
    display: flex;
    align-items: center;
  }
  .bottom .dot-wrapper{
    text-align: center;
    /*fot-size:0;*/
  }
  .bottom .dot-wrapper .dot{
    display: inline-block;
    vertical-align: middle;
    margin: 0 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
  }
  .bottom .dot-wrapper .active{
    background-color:orangered;
  }
  .bottom .progress-wrapper{
    display: flex;
    align-items: center;
    width: 80%;
    margin: 0px auto;
    padding: 10px 0;
  }
  .bottom .progress-wrapper .time{
    color: #fff;
    font-size: 12px;
    flex: 0 0 30px;
    line-height: 30px;
    width: 30px;
  }
  .time-l{
    text-align:left;
  }
  .time-r{
    text-align: right;
  }
  .progress-bar-wrapper{
    flex:1;
  }
  .bottom .operator .icon{
    flex: 1;
    color: #ffcd32;
    font-size: 30px;
  }
  /*.bottom .operator .icon i{*/
  /**/
  /*}*/
  .bottom .operator .i-left{
    text-align: right
  }
  .bottom .operator .i-center{
    padding: 0 20px;
    text-align: center;
    font-size: 40px;
  }
  .bottom .operator .i-right{
    text-align:left;
  }
  .bottom .operator .icon-favorite{
    color:#d93f30;
  }
  .mini-player{
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 20;
    width: 100%;
    height: 60px;
    background: #333;
  }
  .mini-player .icon{
    flex: 0 0 40px;
    width: 40px;
    padding: 0 10px 0 20px;
  }
  .mini-player .icon img{
    border-radius:50%;
  }
  .mini-player .text{
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
  }
  .mini-player .text .name{
    margin-bottom: 2px;
    font-size: 14px;
    color: #fff;
    oveflow:hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: no-wrap;
  }
  .mini-player .text .desc {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.3);
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .mini-player .control{
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    /*font-size:30px;*/
  }
  .icon-play-mini, .icon-pause-mini, .icon-playlist{
    font-size: 30px;
    color: rgba(255, 205, 49, 0.5);
  }
  /*.mini-player .icon-mini{*/
    /*font-size: 32px;*/
    /*position: absolute;;*/
    /*left: 0;*/
    /*top: 0;*/
  /*}*/
  .play{
    animation: rotate 20s linear infinite;
  }
  .pause{
    animation-play-state: paused;
  }
  @keyframes rotate{
    0% {transform: rotate(0)}
    100% {transform: rotate(360deg)}
  }

</style>
