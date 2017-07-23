<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
      props: {
          percent: {
              type: Number,
              default:0
          }
      },
      created(){
          this.touch = {};
      },
      methods: {
        progressTouchStart(e){
          this.touch.initial = true;
          this.touch.startX = e.touches[0].pageX;
          this.touch.left = this.$refs.progress.clientWidth;
        },
        progressTouchMove(e){
            if(!this.touch.initial){
                return
            }
            var diffX = e.touches[0].pageX - this.touch.startX;
            let currentWidth = this.$refs.progressBar.clientWidth -16;
            let offsetWidth = Math.min(currentWidth,Math.max(0,this.touch.left + diffX));
            this.$refs.progress.style.width = offsetWidth + "px";
            this.$refs.progressBtn.style['transform'] = `translate3d(${offsetWidth}px,0,0)`;
        },
        progressTouchEnd(){
          this.touch.initial = false;
          let barWidth = this.$refs.progressBar.clientWidth - 16;
          let percent = this.$refs.progress.clientWidth / barWidth;
          this.$emit("changePercent",percent);
        },
        progressClick(e){
            //此处获取进度条的绝对定位相对于整个页面的左边距,因为offsetX属性具有兼容性,而且此处使用有bug
            //所以用getBoundingClientRect()方法.方法使用详情百度^_^
            let rect = this.$refs.progressBar.getBoundingClientRect();
            let offsetWidth = e.pageX - rect.left;
            let barWidth = this.$refs.progressBar.clientWidth - 16;
            this.$refs.progress.style.width = offsetWidth + "px";
            this.$refs.progressBtn.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
            let percent = offsetWidth / barWidth;
            this.$emit("changePercent",percent);
        }
      },
      watch:{
          percent(newpercent){
              if(newpercent >= 0 && !this.touch.initial){
                  let barWidth = this.$refs.progressBar.clientWidth - 16;
                  let offsetWidth = newpercent * barWidth;
                  this.$refs.progress.style.width = offsetWidth + "px";
                  this.$refs.progressBtn.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
              }
          }
      }
  }
</script>
<style scoped>
  .progress-bar{
    height:30px;
  }
  .bar-inner{
    position: relative;
    height:4px;
    top:13px;
    background:rgba(0,0,0,0.3);
  }
  .progress{
    position: absolute;
    height:100%;
    background:#ffcd32;
  }
  .progress-btn-wrapper{
    position: absolute;
    left: -8px;
    top: -13px;
    width: 30px;
    height: 30px;
  }
  .progress-btn{
    position: relative;
    top: 7px;
    left: 7px;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    border: 3px solid #fff;
    border-radius: 50%;
    background: #ffcd32;
  }
</style>
