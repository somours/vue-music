<template>
	<div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="item in hotKey" @click="addQuery(item.k)">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest ref="suggest" :query="query"></suggest>
    </div>
    <router-view></router-view>
	</div>
</template>
<script>
  import SearchBox from 'base/search-box/search-box'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import Suggest from '../suggest/suggest'

  export default {
      data(){
          return {
              hotKey:[],
              query:''
          }
      },
      components: {
          SearchBox,
          Suggest
      },
      created(){
          this._getHotKey();
      },
      methods: {
          _getHotKey(){
            getHotKey().then((res)=>{
              if(res.code === ERR_OK){
                this.hotKey = res.data.hotkey.slice(0,10);
              }
            })
          },
          addQuery(query){
              this.$refs.searchBox.setQuery(query);
          },
          onQueryChange(query){
              this.query = query
          }
      }
  }
</script>
<style>
  .search .search-box-wrapper{
    margin: 20px;
  }
  .shortcut-wrapper{
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;
  }
  .shortcut-wrapper .shortcut{
    height: 100%;
    overflow: hidden;
  }
  .hot-key{
    margin: 0 20px 20px 20px;
  }
  .hot-key .title{
    margin-bottom: 20px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
  }
  .hot-key .item{
    display: inline-block;
    padding: 5px 10px;
    margin: 0 20px 10px 0;
    border-radius: 6px;
    background:  #333;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.3);
  }
  .search-result{
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }

</style>
