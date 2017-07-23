import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '../components/recommend/recommend'
import Singer from '../components/singer/singer'
import Rank from '../components/rank/rank'
import Search from '../components/search/search'
import SingerDetail from '../components/singerDetail/singerDetail'
import TopList from '../components/toplist/topList'

Vue.use(Router)

export default new Router({
  routes: [
    {
        path:'/',
        redirect:'./recommend'
    },
    {
    	path:'/recommend',
    	component: Recommend
    },
    {
    	path:'/singer',
    	component: Singer,
        children: [
            {
                path: ':id',
                component:SingerDetail
            }
        ]
    },
    {
    	path:'/rank',
    	component:Rank,
        children: [
        {
          path:':id',
          component: TopList
        }
      ]
    },
    {
    	path:'/search',
    	component: Search,
      children: [
        {
          path:':id',
          component:SingerDetail
        }
      ]
    }
  ]
})
