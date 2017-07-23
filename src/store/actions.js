import * as types from './mutation-types'

export const selectPlay = function({commit,state},{list,index}){
  commit(types.SET_PLAYING_STATE,true);
  commit(types.SET_FULL_SCREEN,true);
  commit(types.SET_PLAYLIST,list);
  commit(types.SET_SEQUENCE_LIST,list);
  commit(types.SET_CURRENT_INDEX,index);
}

export const insertSong = function({commit,state},song){
  let playList = state.playList.slice();//因为playList是数组,是引用类型,所以直接赋值会直接影响到state
  //里面的数据变化,在vue中不能直接修改state里面的数据,需要通过mutation去提交,所以此处用slice方法复制此数组.
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  //记录当前的歌曲;
  let currentSong = playList[currentIndex];
  //查找当前列表中是否有这首歌曲
  let fpIndex = findIndex(playList,song);
  //吧插入的歌曲放到当前歌曲后面,所以索引加1;
  currentIndex++;
  //插入这首歌到当前位置;
  //不管这首歌是不是在当前列表中,都插入到当前播放的后面
  playList.splice(currentIndex,0,song);
  //判断是否包含了这首歌
  //如果包含了这首歌,则将其原来的删掉.
  if(fpIndex > -1){
    if(currentIndex < fpIndex){
      playList.splice(fpIndex,1)
      currentIndex--
    }else{
      playList.splice(fpIndex+1,1)
    }
  }

  let currentSindex = findIndex(sequenceList,currentSong) + 1
  let fsIndex = findIndex(sequenceList,song)
  sequenceList.splice(currentIndex,0,song)
  if(fsIndex > -1){
    if(currentSindex < fsIndex){
      sequenceList.splice(fsIndex,1)
    }else{
      sequenceList.splice(fsIndex + 1,1)
    }
  }

  commit(types.SET_PLAYLIST,playList)
  commit(types.SET_SEQUENCE_LIST,sequenceList)
  commit(types.SET_CURRENT_INDEX,currentIndex)
  commit(types.SET_FULL_SCREEN,true)
  commit(types.SET_PLAYING_STATE,true)
}

function findIndex(list,song){
  return list.findIndex((item)=>{ //数组的遍历方法,返回值为true的索引.无则返回-1;
    return item.id === song.id;
  })
}
