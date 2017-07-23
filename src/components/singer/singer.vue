<template>
	<div class="singer">
		<list-view :items="singers" @select="selectSinger"></list-view>
		<router-view></router-view>
	</div>
</template>
<script>
	import {getSingerList} from 'api/singer'
	import {ERR_OK} from 'api/config'
	import ListView from 'base/listview/listview'
	import {mapMutations} from 'vuex'

	export default {
		data(){
			return {
				singers:[]
			}
		},
		created(){
			this._getSingerList()
		},
		methods: {
			_getSingerList(){
				getSingerList().then((res)=>{
					if(res.code === ERR_OK) {
						this.singers = this._normalizeSinger(res.data.list)
						console.log(this.singers)
					}
				})
			},
			//对获取到的数组进行序列化
			_normalizeSinger(list){
				let items = {
					hot:{
						title:"热门",
						item: []
					}
				}
				list.forEach((item,index)=>{
					if(index < 10 ){
						items.hot.item.push({
							id: item.Fsinger_mid,
							name: item.Fsinger_name,
							src:`https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
						})
					}
					const key = item.Findex
					if(!items[key]) {
						items[key] = {
							title:key,
							item:[]
						}
					}
					items[key].item.push({
						id: item.Fsinger_mid,
						name: item.Fsinger_name,
						src: `https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
					})
				})
				//处理这个对象,使其成为一个有序列表
				let hot = []
				let ret = []
				for(let key in items){
					let val = items[key]
					if(val.title.match(/[a-zA-Z]/)) {
						ret.push(val)
					}else if (val.title === "热门"){
						hot.push(val)
					}
				}
				ret.sort((a,b)=>{
					return a.title.charCodeAt(0) - b.title.charCodeAt(0)
				})
				return hot.concat(ret)
			},
			selectSinger(singer){
				this.$router.push({
					path:`/singer/${singer.id}`
				})
				this.setSinger(singer)
			},
			...mapMutations({
				setSinger:'SET_SINGER'
			})
		},
		components:{
			ListView
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.singer
		position:fixed
		top:88px
		bottom: 0
		width: 100%
</style>