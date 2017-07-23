<template>
	<scroll class="listview" :data="items">
		<ul class="items">
			<li v-for="item in items" class="item" >
				<h2 class="item-title">{{item.title}}</h2>
				<ul class="singers">
					<li v-for="singers in item.item" class="singer" @click="handleClick(singers)">
						<img :src="singers.src" alt="" class="pic">
						<span class="name">{{singers.name}}</span>
					</li>
				</ul>
			</li>
		</ul>
		<div v-show="!items.length" class="loading-container">
	      <loading></loading>
	    </div>
	</scroll>
</template>
<script>
	import Scroll from 'base/scroll/scroll'
	import Loading from 'base/loading/loading'
	export default {
		props:{
			items:{
				type:Array,
				default:[]
			}
		},
		methods:{
			handleClick(singers){
				this.$emit("select",singers)
			}
		},
		components:{
			Scroll,
			Loading
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"
		.listview
			position:relative
			width:100%
			height:100%
			overflow:hidden
			background:$color-background
			.items
				padding-bottom:30px
				.item-title
					height:30px
					line-height:30px
					padding-left:20px
					font-size:$font-size-small
					background: $color-highlight-background
					color: $color-text-l
				.singer
					display:flex
					align-items:center
					padding:20px 0 0 30px
					.pic
						width:50px
						height:50px
						border-radius:50%
					.name
						font-size: $font-size-medium
						color: $color-text-l
						margin-left:20px
			.loading-container
				position:absolute
				width:100%
				top:50%
				translateY(-50%)
</style>