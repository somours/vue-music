<template>
	<transition name="slide">
		<music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
	</transition>
</template>
<script >
	import {ERR_OK} from 'api/config'
	import {getSingerDetail} from 'api/singer'
	import {mapGetters} from 'vuex'
	import {createSong} from 'common/js/song'
	import MusicList from 'components/musiclist/musiclist'

	export default {
		data:function(){
			return {
				songs:[]
			}
		},
		computed: {
			...mapGetters([
				'singer'
			]),
			title() {
				return this.singer.name
			},
			bgImage() {
				return this.singer.src
			}
		},
		created(){
			this._getDetail()
		},
		methods: {
			_getDetail(){
				if(!this.singer.id){
					this.$router.push('./singer')
					return
				}
				getSingerDetail(this.singer.id).then((res)=>{
					if(res.code === ERR_OK){
						this.songs = this._normalizeSongs(res.data.list)
            console.log(this.songs)
					}
				})
			},
			_normalizeSongs(list){
				let ret = []
				list.forEach((item,index)=>{
					let {musicData} = item
					if (musicData.songid && musicData.albummid) {
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
<style scoped lang="stylus" rel="stylesheet/stylus">
	.slide-enter-active,.slide-leave-active
		transition: all 1s
	.slide-enter,.slide-leave-to
		transform: translate3d(100%,0,0)
</style>
