<template>
  <scroll class="suggest" :data="result" @scrollToEnd="searchMore" :pullup="pullup"  :beforeScroll="beforeScroll" >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <!--<div v-show="!hasMore && !result.length" class="no-result-wrapper">-->
      <!--<no-result title="抱歉，暂无搜索结果"></no-result>-->
    <!--</div>-->
  </scroll>
</template>
<script>
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {ERR_OK} from 'api/config'
  import {search} from 'api/search'
  import {filterSinger,createSong} from 'common/js/song'
  import {mapMutations,mapActions} from 'vuex'
//  import {} from 'common/js/song'


  export default {
      data(){
          return {
              hasMore: true,
              result:[],
              page:1,
              pullup:true,
              beforeScroll:true
          }
      },
      props:{
        showSinger:{
            type:Boolean,
            default:true
        },
        query: {
            type: String,
            default: ""
        }
      },
      methods: {
          _search(){
              this.hasMore = true
              search(this.query,this.page,this.showSinger).then((res)=>{
                  if(res.code === ERR_OK){
                      console.log(res.data)
                      this.result = this.genresult(res.data);
                  }
              })
          },
          genresult(data){
              let ret = [];
              if(data.zhida && data.zhida.singerid){
                  ret.push({...data.zhida,...{type:'singer'}})
              }
              if(data.song){
                  ret = ret.concat(this.normalLizeSong(data.song.list))
              }
              return ret
          },
          //格式化歌曲的格式,否则后面再改变vuex里state的一些属性时,有一些数据信息会丢失掉
          normalLizeSong(list){
              let ret = []
              list.forEach((musicData)=>{
                  if(musicData.songid && musicData.albummid){
                      ret.push(createSong(musicData))
                  }
              })
            return ret
          },
          getDisplayName(item){
              if(item.type == 'singer'){
                  return item.singername
              }else{
                  return `${item.name}-${item.singer}`
              }
          },
          getIconCls(item){
              if(item.type == "singer"){
                  return "icon-mine"
              }else{
                  return "icon-music"
              }
          },
          searchMore(){
              if (!this.hasMore) {
                return
              }
              this.page++
              search(this.query, this.page, this.showSinger).then((res) => {
                if (res.code === ERR_OK) {
                  this.result = this.result.concat(this.genresult(res.data))
                  this.checkMore(res.data)
                }
              })
          },
          checkMore(data){
            const song = data.song
            if (!song.list.length || (song.curnum + song.curpage * 20) > song.totalnum) {
              this.hasMore = false
            }
          },
          selectItem(item){
              if(item.type == "singer"){
                  console.log('ahahahh')
                  const singer = {
                      id:item.singermid,
                      name:item.singername
                  }
                  this.$router.push({
                    path : `/search/${singer.id}`
                  })
                this.setSinger(singer)
              }else{
                  this.insertSong(item)
              }

          },
          ...mapMutations({
              setSinger: 'SET_SINGER'
          }),
          ...mapActions([
              'insertSong'
          ])
      },
      watch:{
          query(newQuery){
              this._search(newQuery)
          }
      },
      components: {
          Scroll,
          Loading
      }
  }
</script>
<style>
  .suggest {
    height: 100%;
    overflow: hidden;
  }
  .suggest .suggest-list{
    padding: 0 30px;
  }
  .suggest .suggest-list .suggest-item{
    display: flex;
    align-items: center;
    padding-bottom: 20px;
  }
  .suggest-item .icon{
    flex: 0 0 30px;
    width: 30px;
    font-size: 14px;
    color:rgba(255, 255, 255, 0.3);
  }
  .suggest-item .name{
    flex: 1;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }
  .suggest-item .name .text{
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .no-result-wrapper{
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
