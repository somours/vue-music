<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>
<script>
  import MusicList from '../musiclist/musiclist'
  import {mapGetters} from 'vuex'
  import {getMusicList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'

  export default {
      data(){
          return {
              songs:[]
          }
      },
      computed: {
        title(){
            return this.topList.topTitle
        },
        bgImage(){
            if(this.songs.length>0){
              return this.songs[0].image
            }
            return ''
//            return this.topList.picUrl
        },
        ...mapGetters([
            'topList'
        ])
      },
      created(){
        this._getMusicList()
      },
      methods : {
        _getMusicList(){
          getMusicList(this.topList.id).then((res)=>{
            if(res.code === ERR_OK){
              this.songs = this._normalizeSong(res.songlist)
            }
          })
        },
        _normalizeSong(list){
          let ret = []
          list.forEach((item) => {
              let musicData = item.data
              if(musicData.songid && musicData.albumid){
                  ret.push(createSong(musicData))
              }
          })
          return ret
        }
      },
      components: {
          MusicList
      }
  }
</script>
<style scoped>
  .slide-enter-active,
  .slide-leave-active{
    transition: all 0.5s ease;
  }
  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0);
  }
</style>
