<template>
  <div class="search-box">
    <span class="icon-search"></span>
    <input type="text" class="box" :placeholder="placeholder" v-model="query" autofocus>
    <span class="icon-dismiss" v-show="query" @click="clear"></span>
  </div>
</template>
<script>
  export default {
      props: {
          placeholder:{
              type:String,
              default:"搜索歌曲,歌手"
          }
      },
      data(){
          return {
              query:''
          }
      },
      methods: {
          clear(){
              this.query = "";
          },
          setQuery(query){
              this.query = query;
          }
      },
      created(){
          this.$watch('query',(newQuery) =>{
              this.$emit('query',newQuery);
          })
      }
  }
</script>
<style>
  .search-box{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 40px;
    background: #333;
    border-radius: 6px;
  }
  .search-box .icon-search{
    font-size: 24px;
    color: #222;
  }
  .search-box .box{
    flex: 1;
    margin: 0 4px;
    line-height: 24px;
    background: #333;
    color: #fff;
    font-size: 14px;
    text-indent: 10px;
  }
  .search-box .box::placeholder{
    color:rgba(255, 255, 255, 0.3);
    text-indent: 10px;
    /*color:red;*/
  }
  .search-box .icon-dismiss{
    font-size:16px;
    color:#222;
  }
</style>
