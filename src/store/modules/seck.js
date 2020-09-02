import {
    reqseckList    
} from "../../util/requset";

const state={
    //角色列表
    list:[]
}
const mutations = {
    //修改list
    changeList(state,arr){
        state.list = arr
    }
}

const actions = {
    reqListAction(context){
        reqseckList().then(res=>{
            let arr = res.data.list?res.data.list:[]
            context.commit("changeList",arr)
        })
    }
}

const getters = {
    list(state){
        return state.list
    }
}

export default{
    state,
    mutations,
    actions,
    getters,
    namespaced:true
}