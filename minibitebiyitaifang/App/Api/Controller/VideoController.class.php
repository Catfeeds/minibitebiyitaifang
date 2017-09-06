<?php
namespace Api\Controller;
use Think\Controller;
class VideoController extends PublicController{

	/**
	 * [index 视频列表]
	 * @return [type] [description]
	 */
	public function index(){
		//搜索
		$page=I("request.page");
		$id=I("request.cat_id");//获得分类id 这里的id是pro表里的cid
		if(!$page){
			$page=1;
		}
		$limit=($page*20)-20;
		//构建搜索条件
		$condition = array();
		$condition['del'] = 0; 
		if(intval($id)){
 			//判断是不是一级分类，是则查询该分类下的所有二级分类id
 			$tid = M('category')->where('id='.intval($id))->field('id,tid')->find();
 			if (intval($tid['tid'])==1) {
 				$ids = M('category')->where('tid='.intval($tid['id']))->field('id')->select();
 				$arr = array();
 				foreach ($ids as $k => $v) {
 					$arr[] = $v['id'];
 				}
 				$arrstr = implode($arr, ',');
 				// $where.=" AND cid IN (".$arrstr.")";
 				$condition['cid']=array("in",$arrstr);
 			}else{
 				$condition['cid']=$id;
 			}
 		}
		
		$list = M("video")->where($condition)->order('sort desc,addtime desc')->limit($limit,20)->field('id,name,photo,renqi,visit,digest')->select();
		if(!$list){
			echo json_encode(array('status'=>0,'err'=>'没有更多的数据了.'));
            exit();
		}
		foreach ($list as $k => $v) {
			$list[$k]['photo']=__DATAURL__.$v['photo'];
		}
		echo json_encode(array('status'=>1,'list'=>$list));

	}
	/**
	 * [detail 视频详情]
	 * @return [type] [description]
	 */
	public function detail(){
		$id=intval($_REQUEST['id']);
        $detail=M("video")->where('id='.intval($id))->find();
        if (!$detail) {
            echo json_encode(array('status'=>0,'err'=>'没有找到相关信息.'));
            exit();
        }
        
        M("video")->where("id=".$id)->setInc("visit",1);
        M("video")->where("id=".$id)->setInc("renqi",1);

        $json=array();
        $json['status']=1;
       
        $array['id']=$detail['id'];
        $array['name']=urlencode($detail['name']);
        $array['addtime']=date('Y-m-d',$detail['addtime']);
        $array['sort']=$detail['sort'];
        $array['visit']=$detail['visit'];
        $array['digest']=$detail['digest'];
		if($detail['type']==1){
			$array['video']=__DATAURL__.$detail['video'];
		}else{
			$array['video']=$detail['video'];
		}		
        $array['renqi']=$detail['renqi'];
        $array['pro_id']=$detail['pro_id'];
        $content = str_replace(C("content.dir"), __DATAURL__, $detail['content']);
        $array['content']=html_entity_decode($content, ENT_QUOTES, "utf-8");//数据库打成了concent字段
        $json['err']=$array;
        //json加密输出
        //dump($json);
        echo urldecode(json_encode($json));
	}



}